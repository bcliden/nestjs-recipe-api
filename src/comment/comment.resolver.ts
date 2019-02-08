import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/shared/auth.guard';
import { CommentDTO } from './comment.dto';

@Resolver()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comments() {
    return this.commentService.showByRecipe(
      '6c7cd026-0b6d-44f0-9de7-09b2d28618fb',
    );
  }

  @Query()
  comment(@Args('id') id: string) {
    return this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  createComment(
    @Args('recipe') recipeId: string,
    @Args('comment') comment: string,
    @Context('user') user: any,
  ) {
    const data: CommentDTO = { comment };
    const { id: userId } = user;
    return this.commentService.create(recipeId, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteComment(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    const result = this.commentService.destroy(id, userId);
    return result;
  }
}
