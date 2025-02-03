export interface TeaSession {
  id: number;
  threadId: string;
  createdAt: string;
  teaType: string;
  teaStyle: string;
  brewingTemp?: number;
  steepTime?: number;
  notes?: string;
}
