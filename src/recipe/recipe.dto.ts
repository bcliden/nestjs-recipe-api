import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';

export class RecipeDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class RecipeRO {
    id?: string;
    updated: Date;
    created: Date;
    title: string;
    description: string;
    author: UserRO;
}