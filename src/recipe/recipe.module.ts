import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  controllers: [RecipeController],
  providers: [RecipeService]
})
export class RecipeModule {}
