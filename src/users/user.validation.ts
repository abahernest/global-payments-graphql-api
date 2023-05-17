import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: string) {
    // Perform password validation logic
    const minLength = 8;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/

    if (value.length < minLength) {
      throw new BadRequestException(`Password must be at least ${minLength} characters long`);
    }

    if (!regex.test(value)) {
      throw new BadRequestException('password must contain at least 1 lowercase, 1 uppercase, 1 special character, and 1 number');
    }

    return value;
  }
}

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: string) {

    // Perform email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      throw new BadRequestException('Invalid email format');
    }

    return value;
  }
}