import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Header,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserEntity } from './user.entity';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/api/users')
  showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Get('/api/users/:id')
  showOneUser(@Param('id') id: string) {
    return this.userService.read(id);
  }

  @Get('auth/whoami')
  @UseGuards(AuthGuard)
  showMe(@User('username') username: string) {
    return this.userService.read(username);
  }

  @Post('auth/login')
  @UsePipes(ValidationPipe)
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('auth/register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
