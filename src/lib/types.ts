export interface TeaSession {
  id: string;
  threadId: string;
  created_at: string;
  teaType: string;
  teaStyle: string;
  brewingTemp?: number;
  steepTime?: number;
  notes?: string;
}
