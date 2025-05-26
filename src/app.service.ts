import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly animationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject('ANIMATION_SERVICE') private readonly animationClient: ClientProxy
  ) {
    this.animationServiceUrl = process.env.ANIMATION_SERVICE_URL || 'http://animation-service:3001';
  }

  async requestAnimation(imageUrl: string) {
    try {
      const jobId = uuidv4();

      this.animationClient.emit('create_animation', { 
        jobId, 
        imageUrl 
      });
      
      return { 
        jobId, 
        status: 'pending' 
      };
    } catch (error) {
      console.error(error);
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