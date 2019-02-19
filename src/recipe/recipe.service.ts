import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  Logger,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeDTO, RecipeRO } from './recipe.dto';
import { UserEntity } from 'src/user/user.entity';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(recipe: RecipeEntity): RecipeRO {
    const responseObject: any = {
      ...recipe,
      author: recipe.author.toResponseObject(),
    };
    if (responseObject.upvotes) {
      responseObject.upvotes = recipe.upvotes.length;
    }
    if (responseObject.downvotes) {
      responseObject.downvotes = recipe.downvotes.length;
    }
    // if comments.author is populated
    if (responseObject.comments.filter(comment => comment.author).length > 0) {
      responseObject.comments = responseObject.comments.map(comment => {
        return { ...comment, author: comment.author.toResponseObject() };
      });
    }
    return responseObject;
  }

  private ensureOwnership(recipe: RecipeEntity, userId: string) {
    if (recipe.author.id !== userId) {
      throw new UnauthorizedException('Incorrect User');
    }
  }

  private async vote(recipe: RecipeEntity, user: UserEntity, vote: Votes) {
    // vote style similar to reddit?
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      // user has done same vote or opposite, nullify
      recipe[opposite].filter(voter => voter.id === user.id).length > 0 ||
      recipe[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      recipe[opposite] = recipe[opposite].filter(voter => voter.id !== user.id);
      recipe[vote] = recipe[vote].filter(voter => voter.id !== user.id);
      await this.recipeRepository.save(recipe);
    } else if (recipe[vote].filter(voter => voter.id === user.id).length < 1) {
      // if user hasn't voted
      recipe[vote].push(user);
      await this.recipeRepository.save(recipe);
    } else {
      throw new BadRequestException('Unable to cast vote');
    }

    return recipe;
  }

  async showAll(
    {
      page,
      newest,
    }: {
      page: number;
      newest: boolean;
    } = { page: 1, newest: false },
  ): Promise<RecipeRO[]> {
    // let { page, newest } = options;
    const recipes = await this.recipeRepository.find({
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'comments.author',
      ],
      take: 25,
      skip: 25 * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return recipes.map(recipe => this.toResponseObject(recipe));
  }

  async create(userId: string, data: RecipeDTO): Promise<RecipeRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const recipe = await this.recipeRepository.create({
      ...data,
      author: user,
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    await this.recipeRepository.save(recipe);
    return this.toResponseObject(recipe);
  }

  async read(id: string): Promise<RecipeRO> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'comments.author',
      ],
    });
    if (!recipe) {
      throw new NotFoundException();
    }

    return this.toResponseObject(recipe);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<RecipeDTO>,
  ): Promise<RecipeRO> {
    let recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!recipe) {
      throw new NotFoundException();
    }
    this.ensureOwnership(recipe, userId);

    try {
      await this.recipeRepository.update({ id }, data);
      recipe = await this.recipeRepository.findOne({
        where: { id },
        relations: [
          'author',
          'comments',
          'comments.author',
          'upvotes',
          'downvotes',
        ],
      });
      return this.toResponseObject(recipe);
    } catch (error) {
      Logger.error(`${error.name}: ${error.message}`, null, 'Database');
      throw new BadRequestException('Refused by Database');
    }
  }

  async destroy(id: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!recipe) {
      throw new NotFoundException();
    }
    this.ensureOwnership(recipe, userId);

    await this.recipeRepository.remove(recipe);
    recipe.id = id; // add old ID so we can return it
    return this.toResponseObject(recipe);
  }

  async upvote(id: string, userId: string) {
    let recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'comments.author',
      ],
    });
    let user = await this.userRepository.findOne({
      where: { id: userId },
    });
    recipe = await this.vote(recipe, user, Votes.UP);
    return this.toResponseObject(recipe);
  }

  async downvote(id: string, userId: string) {
    let recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'author',
        'upvotes',
        'downvotes',
        'comments',
        'comments.author',
      ],
    });
    let user = await this.userRepository.findOne({
      where: { id: userId },
    });
    recipe = await this.vote(recipe, user, Votes.DOWN);
    return this.toResponseObject(recipe);
  }

  async bookmark(id: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (
      user.bookmarks.filter(bookmark => bookmark.id === recipe.id).length < 1
    ) {
      user.bookmarks.push(recipe);
      await this.userRepository.save(user);
    } else {
      throw new BadRequestException('Recipe already bookmarked');
    }

    return user.toResponseObject();
  }

  async unbookmark(id: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (
      user.bookmarks.filter(bookmark => bookmark.id === recipe.id).length > 0
    ) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== recipe.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new BadRequestException('Recipe is not bookmarked');
      // throw new HttpException('Recipe is not bookmarked', HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject();
  }
}
