export interface LiveStatusUpdate {
  accountId: string;
  sessionId: string,
  attendeeKey: string,
  status: string
}

export interface LiveStatusUpdateMessageEvent {
  type: string,
  data: LiveStatusUpdate,
}
