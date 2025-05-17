export interface Poll {
  id: string;
  question: string;
  category?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
  show_results_before_voting: boolean;
  target_audience?: string;
  attached_news_id?: string;
  total_votes: number;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
}
