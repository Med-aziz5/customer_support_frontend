export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  assigned_to?: number;
  user_id: number;
}
