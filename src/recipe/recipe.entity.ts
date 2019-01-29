import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('recipe')
export class RecipeEntity {
    @PrimaryGeneratedColumn('uuid') id: String;

    @CreateDateColumn() created: Date;

    @Column('text') title: String;

    @Column('text') description: String;
}