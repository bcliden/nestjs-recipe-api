import { Injectable, BadRequestException, NotFoundException, HttpStatus, HttpException, UnprocessableEntityException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeDTO } from './recipe.dto';
import { ValidUUID } from '../shared/helpers';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private recipeRepository: Repository<RecipeEntity>,
    ){}

    async showAll(){
        return await this.recipeRepository.find();
    }

    async create(data: RecipeDTO){
        const recipe = await this.recipeRepository.create(data);
        await this.recipeRepository.save(recipe);
        return recipe;
    }

    async read(id: string){
        const recipe =  await this.recipeRepository.findOne({where: {id}});
        if (!recipe) {
            throw new NotFoundException;
        }

        return recipe;
    }

    async update(id: string, data: Partial<RecipeDTO>){
        const recipe = await this.recipeRepository.findOne({ where: { id }});
        if (!recipe) {
            throw new NotFoundException;
        }

        try {
            await this.recipeRepository.update({id}, data);
            return await this.recipeRepository.findOne({ id });
        } catch(error) {
            Logger.error(`${error.name}: ${error.message}`, null, "Database")
            throw new BadRequestException('Refused by Database');
        }
    }

    async destroy(id: string){
        const recipe = await this.recipeRepository.findOne({ where: { id }});
        if (!recipe) {
            throw new NotFoundException;
        }

        await this.recipeRepository.delete({id});
        // return recipe
        return HttpStatus.OK;
    }
}
