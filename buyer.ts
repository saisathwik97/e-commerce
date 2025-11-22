export interface BuyerProfile {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuyerRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface BuyerProposal {
  _id: string;
  requestId: string;
  sellerId: string;
  sellerName: string;
  price: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface BuyerProject {
  _id: string;
  title: string;
  description: string;
  sellerId: string;
  sellerName: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  budget: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
} 