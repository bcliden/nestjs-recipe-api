import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity('recipe')
export class RecipeEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @CreateDateColumn() 
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column('text') 
    title: string;

    @Column('text') 
    description: string;

    @ManyToOne(type => UserEntity, author => author.recipes)
    author: UserEntity
}