export interface AuthRepository {
  recoverPassword(email: string): Promise<boolean>;
  resetPassword(password: string): Promise<boolean>;
}
