import { BuyerProfile, BuyerRequest, BuyerProposal, BuyerProject } from '../types/buyer';

const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    address?: string;
  };
  token: string;
}

interface ActiveProject {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export async function registerBuyer(data: {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/buyer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering buyer:', error);
    throw error;
  }
}

export async function loginBuyer(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/buyer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in buyer:', error);
    throw error;
  }
}

export async function getBuyerProfile(buyerId: string): Promise<BuyerProfile | null> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/buyer/profile/${buyerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Profile not found');
      }
      throw new Error('Failed to fetch profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    return null;
  }
}

export async function getBuyerRequests(buyerId: string): Promise<BuyerRequest[]> {
  try {
    const response = await fetch(`${API_URL}/buyer/requests/${buyerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch requests');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching buyer requests:', error);
    return [];
  }
}

export async function getBuyerProposals(buyerId: string): Promise<BuyerProposal[]> {
  try {
    const response = await fetch(`${API_URL}/buyer/proposals/${buyerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch proposals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching buyer proposals:', error);
    return [];
  }
}

export async function getBuyerProjects(buyerId: string): Promise<BuyerProject[]> {
  try {
    const response = await fetch(`${API_URL}/buyer/projects/${buyerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching buyer projects:', error);
    return [];
  }
}

export async function createActiveProject(data: {
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
}): Promise<ActiveProject> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/buyer/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getActiveProjects(): Promise<ActiveProject[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/buyer/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    return projects.map((project: any) => ({
      id: project._id.toString(),
      title: project.title,
      category: project.category,
      description: project.description,
      budget: project.budget,
      deadline: new Date(project.deadline),
      status: project.status,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    }));
  } catch (error) {
    console.error('Error fetching active projects:', error);
    return [];
  }
}

// Temporary data for testing
export const tempBuyerProfile: BuyerProfile = {
  _id: 'temp1',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Tech Solutions Inc.',
  phone: '+1234567890',
  address: '123 Business St, City, Country',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const tempBuyerRequests: BuyerRequest[] = [
  {
    _id: 'req1',
    title: 'Website Development',
    description: 'Need a modern e-commerce website',
    category: 'Web Development',
    budget: 5000,
    deadline: new Date('2024-06-30'),
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'req2',
    title: 'Mobile App Development',
    description: 'iOS and Android app for our service',
    category: 'Mobile Development',
    budget: 10000,
    deadline: new Date('2024-07-15'),
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const tempBuyerProposals: BuyerProposal[] = [
  {
    _id: 'prop1',
    requestId: 'req1',
    sellerId: 'seller1',
    sellerName: 'WebDev Solutions',
    price: 4500,
    description: 'We can deliver a modern e-commerce website within 2 months',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const tempBuyerProjects: BuyerProject[] = [
  {
    _id: 'proj1',
    title: 'Mobile App Development',
    description: 'iOS and Android app development project',
    sellerId: 'seller2',
    sellerName: 'MobileTech Inc.',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-07-15'),
    status: 'active',
    budget: 10000,
    progress: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 