export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'support';
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface ChatThread {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'open' | 'closed' | 'assigned';
  assignedToAdmin?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  currentThread: ChatThread | null;
  unreadCount: number;
}
