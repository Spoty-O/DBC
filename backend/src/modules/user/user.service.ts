import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Repository } from 'typeorm';
import { ErrorService } from '../error/error.service';
import { IUser } from 'src/shared/interfaces';

@Injectable()
export class UserService {
  constructor(
    private readonly errorService: ErrorService,
    @InjectRepository(User) private readonly userRepository: Repository<IUser>,
  ) {}

  async create(body: CreateUserDto) {
    const { email } = body;
    const isExistsUser = await this.userRepository.existsBy({ email });
    if (isExistsUser) {
      throw await this.errorService.conflict();
    }
    const user = this.userRepository.create(body);
    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw await this.errorService.notFound();
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw await this.errorService.notFound();
    }
    return user;
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw await this.errorService.notFound();
    }
    const updatedUser = await this.userRepository.update({ id }, body);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw await this.errorService.notFound();
    }
    await this.userRepository.remove(user);
    return `User with id #${id} deleted.`;
  }
}
