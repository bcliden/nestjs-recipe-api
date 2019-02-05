import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(page: number = 1): Promise<UserRO[]> {
    const users = await this.userRepository.find({
      relations: ['recipes', 'bookmarks'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return users.map(user => user.toResponseObject());
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new BadRequestException('Bad username or password');
    }
    return user.toResponseObject({ showJwt: true });
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject({ showJwt: true });
  }
}
