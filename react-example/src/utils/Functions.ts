export class Functions {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static checkEmailValidation(email: string): boolean {
    return Functions.emailRegex.test(email);
  }
}
