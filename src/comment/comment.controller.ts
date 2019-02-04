import {
  Controller,
  Get,
  Param,
  UseGuards,
  UsePipes,
  Body,
  Post,
  Delete,
  Logger,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { CommentDTO } from './comment.dto';
import { User } from 'src/user/user.decorator';

@Controller('api/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  private logger = new Logger('CommentsController');
  private logData(options: any) {
    // try to log in order: { id, userId, data }
    options.recipeId &&
      this.logger.log('RECIPE ' + JSON.stringify(options.recipeId));
    options.userId && this.logger.log('USER ' + JSON.stringify(options.userId));
    options.commentId &&
      this.logger.log('COMMENT ' + JSON.stringify(options.commentId));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
  }

  @Get('user/:id')
  @UsePipes(ValidationPipe)
  showCommentsByUser(@Param('id') userId: string) {
    this.logData({ userId });
    return this.commentService.showByUser(userId);
  }

  @Get('recipe/:id')
  @UsePipes(ValidationPipe)
  showCommentsByRecipe(@Param('id') recipeId: string) {
    this.logData({ recipeId });
    return this.commentService.showByRecipe(recipeId);
  }

  @Post('recipe/:id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  createComments(
    @Param('id') recipeId: string,
    @User('id') userId: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(recipeId, userId, data);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  showComment(@Param('id') commentId: string) {
    return this.commentService.show(commentId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  destroyComment(@Param('id') commentId: string, @User('id') userId: string) {
    return this.commentService.destroy(commentId, userId);
  }
}
