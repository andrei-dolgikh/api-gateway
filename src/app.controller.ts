import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

class AnimationDto {
  imageUrl: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('animate')
  async animateImage(@Body() animationDto: AnimationDto) {
    if (!animationDto.imageUrl) {
      throw new HttpException('Image URL is required', HttpStatus.BAD_REQUEST);
    }
    return this.appService.requestAnimation(animationDto.imageUrl);
  }

  @Get('status/:jobId')
  async getStatus(@Param('jobId') jobId: string) {
    return this.appService.checkStatus(jobId);
  }
}