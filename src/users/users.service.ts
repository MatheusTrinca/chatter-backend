import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      return await this.userRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  findOne(_id: string): Promise<User> {
    return this.userRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput): Promise<User> {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }

    return this.userRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
        },
      },
    );
  }

  remove(_id: string): Promise<User> {
    return this.userRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
