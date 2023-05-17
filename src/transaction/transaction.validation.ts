import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TransactionAmountValidationPipe implements PipeTransform {
  transform(value: number) {
    // Perform password validation logic
    const minLength = 8;

    if (value <= 0) {
      throw new BadRequestException('amount cannot be less than or equal to 0');
    }


    return value;
  }
}