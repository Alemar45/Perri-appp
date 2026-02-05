export interface PetProfile {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  imageUrl: string;
  foodType: string;
  foodDosage: string;
}

export interface HealthStat {
  id: string;
  title: string;
  status: string;
  icon: string;
  type: 'health' | 'hygiene' | 'deworming';
  color?: string;
}

export interface Post {
  id: string;
  author: string;
  time: string;
  category: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'regular' | 'lost' | 'found' | 'event';
  isLiked?: boolean;
}

export interface VetClinic {
  id: string;
  name: string;
  distance: string;
  address: string;
  phone: string;
  rating: number;
  status: string;
  closingTime: string;
  services: string[];
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
