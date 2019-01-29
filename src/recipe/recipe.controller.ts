import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeDTO } from './recipe.dto';

@Controller('recipe')
export class RecipeController {
    constructor(
        private recipeService: RecipeService,
    ){}


    @Get()
    showAllRecipes(){
        return this.recipeService.showAll();
    }

    @Post()
    createRecipe(@Body() data: RecipeDTO){
        return this.recipeService.create(data);
    }

    @Get(':id')
    ReadRecipe(
        @Param('id') id: string
    ){
        return this.recipeService.read(id);
    }

    @Put(':id')
    updateRecipe(
        @Param('id') id: string,
        @Body() data: Partial<RecipeDTO>
    ){
        return this.recipeService.update(id, data);
    }

    @Delete(':id')
    destroyRecipe(
        @Param('id') id: string
    ){
        return this.recipeService.destroy(id);
    }

}
