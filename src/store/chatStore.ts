import { create } from 'zustand';
import type { ChatThread, ChatState } from '@/types/chat.types';

interface ChatStore extends ChatState {
  threads: ChatThread[];
  isLoading: boolean;
  error: string | null;
  toggleChat: () => void;
  toggleMinimize: () => void;
  openChat: () => void;
  closeChat: () => void;
  setCurrentThread: (thread: ChatThread | null) => void;
  sendMessage: (message: string) => Promise<void>;
  fetchThreads: () => Promise<void>;
  markAsRead: (threadId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set: any) => ({
  isOpen: false,
  isMinimized: false,
  currentThread: null,
  unreadCount: 0,
  threads: [],
  isLoading: false,
  error: null,

  toggleChat: () => {
    set((state: ChatStore) => ({
      isOpen: !state.isOpen,
      isMinimized: state.isOpen ? state.isMinimized : false,
    }));
  },

  openChat: () => {
    set({
      isOpen: true,
      isMinimized: false,
    });
  },

  closeChat: () => {
    set({
      isOpen: false,
    });
  },

  toggleMinimize: () => {
    set((state: ChatStore) => ({
      isMinimized: !state.isMinimized,
    }));
  },

  setCurrentThread: (thread: ChatThread | null) => {
    set({ currentThread: thread });
  },

  sendMessage: async (_message: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase real-time
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to send message', isLoading: false });
    }
  },

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Integrate with Supabase
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch messages', isLoading: false });
    }
  },

  markAsRead: async (threadId: string) => {
    try {
      // TODO: Integrate with Supabase
      set((state: ChatStore) => ({
        threads: state.threads.map((t: ChatThread) =>
          t.id === threadId ? { ...t, messages: t.messages.map((m) => ({ ...m, isRead: true })) } : t
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to mark as read' });
    }
  },

  clearError: () => set({ error: null }),
}));
