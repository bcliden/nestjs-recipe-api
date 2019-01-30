import { IsString } from 'class-validator';

export class RecipeDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;
}