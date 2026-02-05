
export type Priority = 'Low' | 'Medium' | 'High';
export type Urgency = 'Low' | 'Medium' | 'High';

export interface TicketClassification {
  category: string;
  priority: Priority;
  urgency: Urgency;
  recommendedTeam: string;
  summary: string;
  stepsTaken: string[];
}

export interface Ticket extends TicketClassification {
  id: string;
  status: 'Pending Tier-2' | 'In Progress' | 'Resolved';
  createdAt: Date;
  slaTarget: string;
  slaStatus: 'Healthy' | 'Warning' | 'Breached';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface SOP {
  id: string;
  title: string;
  category: string;
  purpose?: string;
  steps: string[];
  escalation?: string;
  lastUpdated: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  COPILOT = 'copilot',
  KNOWLEDGE_BASE = 'kb',
  TICKET_HISTORY = 'tickets'
}
