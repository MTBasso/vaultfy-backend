import type { Vault } from '../../../src/entities/vault';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../../src/errors/Error';
import type { VaultRepository } from '../../../src/repositories/vault/interface';
import { localRepository } from '../inMemory';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async save(vault: Vault): Promise<Vault> {
    try {
      this.verifyNonConflictingName(vault.name);
      await localRepository.user.fetchById(vault.userId);
      this.vaults.push(vault);
      return vault;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<Vault> {
    const fetchedVault = this.vaults.find((vault: Vault) => vault.id === id);
    if (!fetchedVault) throw new NotFoundError('Vault not found');
    return fetchedVault;
  }

  async listByUserId(userId: string): Promise<Vault[]> {
    try {
      await localRepository.user.fetchById(userId);
      return this.vaults.filter((vault: Vault) => vault.userId === userId);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private verifyNonConflictingName(name: string) {
    if (this.vaults.some((vault: Vault) => vault.name === name))
      throw new ConflictError('This user already has a vault with this name');
  }
}
