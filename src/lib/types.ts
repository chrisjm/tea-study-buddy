export interface TeaSession {
  id: string;
  threadId: string;
  createdAt: string;
  teaType: string;
  teaStyle: string;
  brewingTemp?: number;
  steepTime?: number;
  notes?: string;
}
