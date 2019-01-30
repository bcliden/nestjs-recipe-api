import { Controller, Get, Post, Put, Delete, Body, Param, Logger, UsePipes } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeDTO } from './recipe.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('recipe')
export class RecipeController {
    private logger = new Logger('RecipeController');
    constructor(
        private recipeService: RecipeService,
    ){}


    @Get()
    showAllRecipes(){
        return this.recipeService.showAll();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createRecipe(
        @Body() data: RecipeDTO
        ){
        this.logger.log(`create: ${JSON.stringify(data)}`);
        return this.recipeService.create(data);
    }

    @Get(':id')
    @UsePipes(ValidationPipe)
    ReadRecipe(
        @Param('id') id: string
    ){
        return this.recipeService.read(id);
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    updateRecipe(
        @Param('id') id: string,
        @Body() data: Partial<RecipeDTO>
    ){
        this.logger.log(`update: ${JSON.stringify(data)}`);
        return this.recipeService.update(id, data);
    }

    @Delete(':id')
    @UsePipes(ValidationPipe)
    destroyRecipe(
        @Param('id') id: string
    ){
        return this.recipeService.destroy(id);
    }

}
