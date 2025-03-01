export interface OpenHouse {
  id: string;
  agent_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  price: number;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'past';
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  open_house_id: string;
  name: string;
  email: string;
  phone: string;
  check_in_time: string;
  status: 'hot' | 'warm' | 'cold';
  notes: string;
  follow_up_date: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options: string[] | null;
  category: 'buyer' | 'seller' | 'investor' | 'renter' | 'custom';
  created_at: string;
}

export interface Answer {
  id: string;
  visitor_id: string;
  question_id: string;
  answer: string;
  created_at: string;
}

export interface Notification {
  id: string;
  agent_id: string;
  title: string;
  body: string;
  type: 'visitor_checkin' | 'lead_update' | 'open_house_reminder' | 'system';
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}