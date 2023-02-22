import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValid(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private isValid(status: any): boolean {
    return this.allowedStatus.indexOf(status) !== -1;
  }
}
