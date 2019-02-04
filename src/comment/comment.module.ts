import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, UserEntity, CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
