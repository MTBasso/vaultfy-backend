import type { Vault } from '../../entities/vault';

export interface VaultRepository {
  vaults?: Vault[];
  save(vault: Vault): Promise<Vault>;
  listByUserId(userId: string): Promise<Vault[]>;
  fetchById(id: string): Promise<Vault>;
}
