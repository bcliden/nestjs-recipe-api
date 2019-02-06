import { Resolver, Query, ResolveProperty, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  users() {
    return this.userService.showAll();
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
