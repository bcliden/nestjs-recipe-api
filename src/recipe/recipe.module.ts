import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, UserEntity])],
  controllers: [RecipeController],
  providers: [RecipeService]
})
export class RecipeModule {}
