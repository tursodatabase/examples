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

export function makeOrganization(organization: any): Organization {
  return {
    id: organization.id,
    name: organization.name,
    website: organization.website,
    username: organization.username,
    email: organization.email,
    password: organization.password,
    logo: organization.logo,
    dbUrl: organization.db_url,
    createdAt: organization.createdAt,
    updatedAt: organization.updated_at,
  } as unknown as Organization;
}

export interface Agent {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: number | null;
  updatedAt: number | null;
}

export function makeAgent(agent: any): Agent {
  return {
    id: agent.id,
    fullName: agent.full_name,
    email: agent.email,
    password: agent.password,
    createdAt: agent.created_at,
    updatedAt: agent.updated_at,
  } as unknown as Agent;
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

export function makeTicket(ticket: any): Ticket {
  return {
    id: ticket.id,
    customerEmail: ticket.customer_email,
    customerName: ticket.customer_name,
    query: ticket.query,
    isClosed: ticket.is_closed,
    serviceRating: ticket.service_rating,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
  } as unknown as Ticket;
}

export interface Conversation {
  id: string;
  ticketId: string;
  agentId: string;
  createdAt?: number | null;
  updatedAt?: number | null;
}

export function makeConversation(conversation: any): Conversation {
  return {
    id: conversation._id,
    ticketId: conversation.ticket_id,
    agentId: conversation.agent_id,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  } as unknown as Conversation;
}

export interface Message {
  id: string;
  message: string;
  sender: string;
  conversationId: string;
  createdAt: number | null;
  updatedAt: number | null;
}

export function makeMessage(message: any): Message {
  return {
    id: message.id,
    message: message.message,
    sender: message.sender,
    conversationId: message.conversation_id,
    createdAt: message.created_at,
    updatedAt: message.updated_at,
  } as unknown as Message;
}
