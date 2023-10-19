import { Injectable } from '@nestjs/common';
import { Subject, map } from 'rxjs';
import { LiveStatusUpdateMessageEvent } from './models';

@Injectable()
export class LiveStatusUpdateService {
  private eventSubject = new Subject();

  emitStatusUpdateEvent(accountId: string, data: any) {
    const messageEvent: LiveStatusUpdateMessageEvent = {
      type: `status-update-${accountId}-${data.sessionId}`,
      data: { ...data, accountId }
    }
    this.eventSubject.next(messageEvent);
  }

  onStatusUpdateEvent(accountId: string, sessionId: string) {
    return this.eventSubject.asObservable().pipe(
      map((event: LiveStatusUpdateMessageEvent) => {
        // emit event only appropriate accountId and sessionId
        if (accountId === event.data.accountId && sessionId === event.data.sessionId) {
          // Transform the event to match the structure of MessageEvent
          return {
            type: event.type,
            data: event.data,
          };
        }
        
        return {};
      }),
    );
  }
}
