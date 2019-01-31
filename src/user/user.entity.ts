import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponseObject } from './user.dto';


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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // dont send password hash back in response
    // default to not sending JWT back
    toResponseObject (options: { showJwt: boolean } = { showJwt: true}): UserResponseObject {
        const { id, created, username, token } = this;
        const responseObject: any = { id, created, username };
        if (options.showJwt) {
            responseObject.token = token;
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