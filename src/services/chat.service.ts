import { supabase } from './supabase';
import type { ChatThread, ChatMessage } from '@/types/chat.types';
import type { ApiResponse } from '@/types/index';

export const chatService = {
  async createChatThread(userId: string, userName: string, userEmail: string): Promise<ApiResponse<ChatThread>> {
    try {
      const newThread: Partial<ChatThread> = {
        userId,
        userName,
        userEmail,
        status: 'open',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('chat_threads')
        .insert([newThread])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to create chat thread:', error);
      return { success: false, error: 'Failed to create chat thread' };
    }
  },

  async sendMessage(threadId: string, message: ChatMessage): Promise<ApiResponse<ChatMessage>> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{ ...message, threadId }])
        .select()
        .single();

      if (error) throw error;

      // Update thread's updatedAt timestamp
      await supabase
        .from('chat_threads')
        .update({ updatedAt: new Date().toISOString() })
        .eq('id', threadId);

      return { success: true, data };
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  },

  async getChatThreads(): Promise<ApiResponse<ChatThread[]>> {
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .select(
          `
          id,
          userId,
          userName,
          userEmail,
          status,
          assignedToAdmin,
          createdAt,
          updatedAt,
          chat_messages(*)
        `
        )
        .order('updatedAt', { ascending: false });

      if (error) throw error;
      return { success: true, data: (data || []) as unknown as ChatThread[] };
    } catch (error) {
      console.error('Failed to fetch chat threads:', error);
      return { success: false, error: 'Failed to fetch chat threads' };
    }
  },

  async getChatThread(threadId: string): Promise<ApiResponse<ChatThread>> {
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .select(
          `
          *,
          chat_messages(*)
        `
        )
        .eq('id', threadId)
        .single();

      if (error) throw error;
      return { success: true, data: data as unknown as ChatThread };
    } catch (error) {
      console.error('Failed to fetch chat thread:', error);
      return { success: false, error: 'Failed to fetch chat thread' };
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(threadId: string, callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`chat:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `threadId=eq.${threadId}`,
        },
        (payload: any) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return subscription;
  },

  async updateThreadStatus(threadId: string, status: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('chat_threads').update({ status }).eq('id', threadId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to update thread status:', error);
      return { success: false, error: 'Failed to update thread status' };
    }
  },
};
