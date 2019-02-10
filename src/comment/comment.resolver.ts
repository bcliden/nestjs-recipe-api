import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/shared/auth.guard';
import { CommentDTO } from './comment.dto';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  async comment(@Args('id') id: string) {
    return await this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createComment(
    @Args('recipe') recipeId: string,
    @Args('comment') comment: string,
    @Context('user') user: any,
  ) {
    const data: CommentDTO = { comment };
    const { id: userId } = user;
    return await this.commentService.create(recipeId, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteComment(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.commentService.destroy(id, userId);
  }
}
