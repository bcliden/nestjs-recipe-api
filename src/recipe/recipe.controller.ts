import { Controller, Get, Post, Put, Delete, Body, Param, Logger, UsePipes, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeDTO } from './recipe.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/recipes')
export class RecipeController {
    private logger = new Logger('RecipeController');
    constructor(
        private recipeService: RecipeService,
    ){}

    private logData(options: any) {
        // try to log in order: { id, userId, data }
        options.id && this.logger.log('RECIPE ' + JSON.stringify(options.id));
        options.userId && this.logger.log('USER ' + JSON.stringify(options.userId));
        options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    }

    @Get()
    showAllRecipes(){
        return this.recipeService.showAll();
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    createRecipe(
        @User('id') userId: string,
        @Body() data: RecipeDTO
    ){
        this.logData({userId, data});
        return this.recipeService.create(userId, data);
    }

    @Get(':id')
    @UsePipes(ValidationPipe)
    ReadRecipe(
        @Param('id') id: string
    ){
        return this.recipeService.read(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    updateRecipe(
        @Param('id') id: string,
        @User('id') userId: string,
        @Body() data: Partial<RecipeDTO>
    ){
        this.logData({ id, userId, data});
        return this.recipeService.update(id, userId, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    destroyRecipe(
        @Param('id') id: string,
        @User('id') userId: string
    ){
        this.logData({ id, userId });
        return this.recipeService.destroy(id, userId);
    }

    @Post(':id/upvote')
    @UseGuards(AuthGuard)
    upvoteRecipe (
        @Param('id') id: string,
        @User('id') userId: string
    ) {
        this.logData({ id, userId });
        return this.recipeService.upvote(id, userId);
    }

    @Post(':id/downvote')
    @UseGuards(AuthGuard)
    downvoteRecipe (
        @Param('id') id: string,
        @User('id') userId: string
    ) {
        this.logData({ id, userId });
        return this.recipeService.downvote(id, userId);
    }

    @Post(':id/bookmark')
    @UseGuards(AuthGuard)
    bookmarkRecipe (
        @Param('id') id: string,
        @User('id') userId: string
    ) {
        this.logData({ id, userId });
        return this.recipeService.bookmark(id, userId);
    }

    @Delete(':id/bookmark')
    @UseGuards(AuthGuard)
    unbookmarkRecipe (
        @Param('id') id: string,
        @User('id') userId: string
    ) {
        this.logData({ id, userId });
        return this.recipeService.unbookmark(id, userId);
    }
}
