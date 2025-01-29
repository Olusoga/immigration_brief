import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('main')
@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Initialize' })
  @ApiResponse({
    status: 200,
    description: 'Run hello world.'
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
