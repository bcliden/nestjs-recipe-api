import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';

import { CommentEntity } from './comment.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity): any {
    return {
      ...comment,
      author: comment.author && comment.author.toResponseObject(),
    };
  }

  async showByRecipe(recipeId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { recipe: { id: recipeId } },
      relations: ['author', 'recipe'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'recipe'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'recipe'],
    });
    if (!comment) {
      throw new NotFoundException();
    }
    return this.toResponseObject(comment);
  }

  async create(recipeId: string, userId: string, data: CommentDTO) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['comments'],
    });
    if (!user || !recipe) {
      throw new BadRequestException('User or Recipe not found');
    }

    const comment = this.commentRepository.create({
      ...data,
      author: user,
      recipe: recipe,
    });
    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.id !== userId) {
      throw new UnauthorizedException("User doesn't own comment.");
    }
    await this.commentRepository.remove(comment);

    // re-add old id so it can be returned
    comment.id = id;

    return this.toResponseObject(comment);
  }
}
