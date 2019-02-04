import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';

import { CommentEntity } from './comments.entity';
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

  async showByRecipe(recipeId: string) {
    const comments = await this.commentRepository.find({
      where: { recipe: { id: recipeId } },
      relations: ['author', 'recipe'],
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string) {
    const comments = await this.commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'recipe'],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'recipe'],
    });
    return this.toResponseObject(comment);
  }

  async create(recipeId: string, userId: string, data: CommentDTO) {
    const user = await this.userRepository.findOne({ where: { userId } });
    const recipe = await this.recipeRepository.findOne({ where: { recipeId } });
    // if (!user || !recipe) {
    //   throw new BadRequestException('User or Recipe not found');
    // }

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
      relations: ['author', 'recipe'],
    });

    if (comment.author.id !== userId) {
      throw new UnauthorizedException("User doesn't own comment.");
    }

    await this.commentRepository.remove(comment);
    return HttpStatus.OK;
  }
}
