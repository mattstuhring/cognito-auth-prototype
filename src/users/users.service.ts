import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, email } = createUserDto;

    try {
      const user = this.userRepository.create({
        username,
        email,
      });

      await this.userRepository.save(user);
    } catch (error) {
      // Postgres duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
