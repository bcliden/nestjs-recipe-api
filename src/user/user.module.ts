import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { CommentEntity } from 'src/comment/comment.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity, UserEntity, CommentEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, CommentService, UserResolver],
})
export class UserModule {}
