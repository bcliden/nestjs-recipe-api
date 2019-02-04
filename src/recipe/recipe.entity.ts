import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
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

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    downvotes: UserEntity[];
}