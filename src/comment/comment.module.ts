import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comment.entity';
import { CommentResolver } from './comment.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity, UserEntity, CommentEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
