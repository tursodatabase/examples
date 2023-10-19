export interface Organization {
  id: string;
  name: string;
  website: string;
  username: string;
  email: string;
  password: string;
  logo: string | null;
  dbUrl: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface Agent {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface Ticket {
  id: string;
  customerEmail: string;
  customerName: string;
  query: string;
  isClosed: number;
  serviceRating?: number;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface Conversation {
  id: string;
  ticketId: string;
  agentId: string;
  createdAt?: number | null;
  updatedAt?: number | null;
}

export interface Message {
  id: string;
  message: string;
  sender: string;
  conversationId: string;
  createdAt: number | null;
  updatedAt: number | null;
}
