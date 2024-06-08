import type { User } from '../../entities/user';
import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateUserUseCase {
  async execute(user: User): Promise<User> {
    try {
      return await prismaRepository.user.save(user);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
