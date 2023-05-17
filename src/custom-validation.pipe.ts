import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  transformException(exception: any) {
    if (exception instanceof BadRequestException) {
      const errors = exception.getResponse()['message'];
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
    }

    return exception;
  }
}
