import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly animationServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.animationServiceUrl = process.env.ANIMATION_SERVICE_URL || 'http://animation-service:3001';
  }

  async requestAnimation(imageUrl: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.animationServiceUrl}/process`, { imageUrl })
      );
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to process animation request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async checkStatus(jobId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.animationServiceUrl}/status/${jobId}`)
      );
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to check animation status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}