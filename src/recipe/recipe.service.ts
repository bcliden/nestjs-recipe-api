import { Injectable, BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeDTO } from './recipe.dto';
import { ValidUUID } from '../shared/helpers';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private RecipeRepository: Repository<RecipeEntity>,
    ){}

    async showAll(){
        return await this.RecipeRepository.find();
    }

    async create(data: RecipeDTO){
        const recipe = await this.RecipeRepository.create(data);
        await this.RecipeRepository.save(recipe);
        return recipe;
    }

    async read(id: string){
        // check correct uuid before db call
        if ( !ValidUUID(id) ) {
            throw new BadRequestException;
        }

        const recipe =  await this.RecipeRepository.findOne({where: {id}});
        if (!recipe) {
            throw new NotFoundException;
        }

        return recipe;
    }

    async update(id: string, data: Partial<RecipeDTO>){
        // check correct uuid before db call
        if ( !ValidUUID(id) ) {
            throw new BadRequestException;
        }

        const recipe = await this.RecipeRepository.findOne({ where: { id }});
        if (!recipe) {
            throw new NotFoundException;
        }

        await this.RecipeRepository.update({id}, data);
        return await this.RecipeRepository.findOne({ id });
    }

    async destroy(id: string){
        // check correct uuid before db call
        if ( !ValidUUID(id) ) {
            throw new BadRequestException;
        }

        const recipe = await this.RecipeRepository.findOne({ where: { id }});
        if (!recipe) {
            throw new NotFoundException;
        }

        await this.RecipeRepository.delete({id});
        // return recipe
        return HttpStatus.OK;
    }
}
