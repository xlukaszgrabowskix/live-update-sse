import { Body, Controller, Get, MessageEvent, Param, Patch, Put, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';
import { LiveStatusUpdateService } from './live-status-update.service';
import { LiveStatusUpdate } from './models';

@Controller()
export class AppController {
  constructor(
    private readonly liveStatusUpdateService: LiveStatusUpdateService) {}

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Get('index2')
  index2(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index2.html')).toString());
  }

  // @AuthGuard here
  @Patch('update-status/:accountId')
  updateStatus(
    @Param('accountId') accountId: string,  // extract from from JWT
    @Body() body: LiveStatusUpdate) {
    this.liveStatusUpdateService.emitStatusUpdateEvent(
      accountId,
      body
    );
  }

  // @AuthGuard here
  @Sse('live-status-update/:accountId/:sessionId')
  liveStatusUpdate(
    @Param('accountId') accountId: string, // extract from from JWT
    @Param('sessionId') sessionId: string,
  ): Observable<MessageEvent> {
    return this.liveStatusUpdateService.onStatusUpdateEvent(accountId, sessionId) as Observable<MessageEvent>;
  }
}
