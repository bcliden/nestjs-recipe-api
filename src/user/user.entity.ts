import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { RecipeEntity } from 'src/recipe/recipe.entity';


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'text',
        unique: true
    })
    username: string;

    @Column('text')
    password: string;

    @OneToMany(type => RecipeEntity, recipe => recipe.author)
    recipes: RecipeEntity;

    // hashes password before record goes into db
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // dont send password hash back in response
    // default to not sending JWT back
    toResponseObject (options: { showJwt: boolean } = { showJwt: false}): UserRO {
        const { id, created, username, token } = this;
        const responseObject: any = { id, created, username };
        if (options.showJwt) {
            responseObject.token = token;
        }
        if (this.recipes) {
            responseObject.ideas = this.recipes
        }
        return responseObject;
    }

    async comparePassword (attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token () {
        const { id, username } = this;
        return jwt.sign({
            id,
            username
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }

}