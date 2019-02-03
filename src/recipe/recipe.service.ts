import { Injectable, BadRequestException, NotFoundException, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from './recipe.entity';
import { RecipeDTO, RecipeRO } from './recipe.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private recipeRepository: Repository<RecipeEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ){}

    private toResponseObject(recipe): RecipeRO{
        return {...recipe, author: recipe.author.toResponseObject() };
    }

    private ensureOwnership (recipe: RecipeEntity, userId: string) {
        console.log(recipe.author.id, userId);
        if (recipe.author.id !== userId ) {
            throw new UnauthorizedException('Incorrect User');
        }
    }


    async showAll(): Promise<RecipeRO[]>{
        const ideas = await this.recipeRepository.find({relations: ['author']});
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async create(userId: string, data: RecipeDTO): Promise<RecipeRO> {
        const user = await this.userRepository.findOne({ where: { id: userId}});
        const recipe = await this.recipeRepository.create({...data, author: user});
        await this.recipeRepository.save(recipe);
        return this.toResponseObject(recipe);
    }

    async read(id: string): Promise<RecipeRO> {
        const recipe =  await this.recipeRepository.findOne({
            where: {id}, 
            relations: ['author']
        });
        if (!recipe) {
            throw new NotFoundException;
        }

        return this.toResponseObject(recipe);
    }

    async update(
        id: string, 
        userId: string, 
        data: Partial<RecipeDTO>
    ): Promise<RecipeRO> {
        const recipe = await this.recipeRepository.findOne({ 
            where: { id },
            relations: ['author']
        });
        if (!recipe) {
            throw new NotFoundException;
        }
        this.ensureOwnership(recipe, userId);

        try {
            // merge old record and new data
            const updatedRecipe = await this.recipeRepository.merge(recipe, data);
            // upsert new record
            await this.recipeRepository.save(updatedRecipe);
            // return merged record
            return this.toResponseObject(updatedRecipe);
        } catch(error) {
            Logger.error(`${error.name}: ${error.message}`, null, "Database")
            throw new BadRequestException('Refused by Database');
        }
    }

    async destroy(id: string, userId: string) {
        const recipe = await this.recipeRepository.findOne({ 
            where: { id },
            relations: ['author']
        });
        if (!recipe) {
            throw new NotFoundException;
        }
        this.ensureOwnership(recipe, userId);

        await this.recipeRepository.delete({id});
        // return recipe
        return HttpStatus.OK;
    }
}
