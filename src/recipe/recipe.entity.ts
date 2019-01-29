import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('recipe')
export class RecipeEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @CreateDateColumn() 
    created: Date;

    @Column('text') 
    title: string;

    @Column('text') 
    description: string;
}