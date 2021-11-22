import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    // Must contain 1 number (0-9), 1 uppercase and 1 lowercase letters.
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])([^\s]){8,100}$/.test(text);
  }
}
