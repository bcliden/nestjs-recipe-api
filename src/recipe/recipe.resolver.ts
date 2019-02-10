import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { CommentService } from 'src/comment/comment.service';
import { UserEntity } from '@app/user/user.entity';
import { RecipeDTO } from './recipe.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/shared/auth.guard';

@Resolver('Recipe')
export class RecipeResolver {
  constructor(
    private recipeService: RecipeService,
    private commentService: CommentService,
  ) {}

  @Query()
  async recipes(@Args('page') page: number, @Args('newest') newest: boolean) {
    return await this.recipeService.showAll({ page, newest });
  }

  @Query()
  async recipe(@Args('id') id: string) {
    return await this.recipeService.read(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createRecipe(
    @Context('user') user: UserEntity,
    @Args('title') title: string,
    @Args('description') description: string,
  ) {
    const { id: userId } = user;
    const recipe: RecipeDTO = { title, description };
    return await this.recipeService.create(userId, recipe);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async updateRecipe(
    @Args('id') id: string,
    @Context('user') user: UserEntity,
    @Args() { title, description }: RecipeDTO,
  ) {
    const { id: userId } = user;

    // create data object with title & desc params only if present
    let data: any = {};
    title && (data.title = title);
    description && (data.description = description);

    return await this.recipeService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteRecipe(
    @Args('id') id: string,
    @Context('user') user: UserEntity,
  ) {
    const { id: userId } = user;
    return await this.recipeService.destroy(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async upvote(@Args('id') id: string, @Context('user') user: UserEntity) {
    const { id: userId } = user;
    return await this.recipeService.upvote(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async downvote(@Args('id') id: string, @Context('user') user: UserEntity) {
    const { id: userId } = user;
    return await this.recipeService.downvote(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async bookmark(@Args('id') id: string, @Context('user') user: UserEntity) {
    const { id: userId } = user;
    return await this.recipeService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async unbookmark(@Args('id') id: string, @Context('user') user: UserEntity) {
    const { id: userId } = user;
    return await this.recipeService.unbookmark(id, userId);
  }

  @ResolveProperty()
  async comments(@Parent() recipe) {
    const { id } = recipe;
    return await this.commentService.showByRecipe(id);
  }
}
