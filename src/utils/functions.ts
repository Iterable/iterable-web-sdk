export class functions {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static checkEmailValidation(email: string): boolean {
    return functions.emailRegex.test(email);
  }
}
