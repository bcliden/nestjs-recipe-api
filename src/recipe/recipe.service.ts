import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeDTO } from './recipe.dto';

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
        return await this.RecipeRepository.findOne({where: {id}});
    }

    async update(id: string, data: Partial<RecipeDTO>){
        await this.RecipeRepository.update({id}, data);
        return await this.RecipeRepository.findOne({ id });
    }

    async destroy(id: string){
        await this.RecipeRepository.delete({ id });
        return { deleted: true };
    }
}
