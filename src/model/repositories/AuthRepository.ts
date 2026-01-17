export interface AuthRepository {
  recoverPassword(email: string): Promise<boolean>;
}