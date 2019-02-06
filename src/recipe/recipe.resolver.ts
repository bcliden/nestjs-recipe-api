import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { CommentService } from 'src/comment/comment.service';

@Resolver()
export class RecipeResolver {
  constructor(
    private recipeService: RecipeService,
    private commentService: CommentService,
  ) {}

  @Query('recipes')
  recipes(@Args('page') page: number, @Args('newest') newest: boolean) {
    return this.recipeService.showAll({ page, newest });
  }

  @ResolveProperty()
  comments(@Parent() recipe) {
    const { id } = recipe;
    return this.commentService.showByRecipe(id);
  }
}
