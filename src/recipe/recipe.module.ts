import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';
import { UserEntity } from 'src/user/user.entity';
import { RecipeResolver } from './recipe.resolver';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity, UserEntity, CommentEntity]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService, CommentService, RecipeResolver],
})
export class RecipeModule {}
