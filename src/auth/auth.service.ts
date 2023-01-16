import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  private jwtService: JwtService;

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    jwtService: JwtService,
  ) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
