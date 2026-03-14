import { supabase } from '@/app/lib/supabaseClient';

export type ChatThread = {
  id: string;
  ticket_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  sender: 'user' | 'agent' | 'system';
  text: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  audio_url: string | null;
  created_at: string;
};

export const ensureUser = async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) return data.user;
  const { data: anonData, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return anonData.user;
};

export const createChat = async (ticketId: string) => {
  const user = await ensureUser();
  const { data, error } = await supabase
    .from('chats')
    .insert({ ticket_id: ticketId, user_id: user.id })
    .select('*')
    .single();
  if (error) throw error;
  return data as ChatThread;
};

export const fetchChatByTicket = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();
  if (error) throw error;
  return data as ChatThread;
};

export const fetchChatMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as ChatMessage[];
};

export const insertChatMessage = async (chatId: string, payload: Omit<ChatMessage, 'id' | 'created_at' | 'chat_id'>) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      sender: payload.sender,
      text: payload.text,
      attachment_url: payload.attachment_url,
      attachment_name: payload.attachment_name,
      attachment_type: payload.attachment_type,
      audio_url: payload.audio_url,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as ChatMessage;
};

export const uploadChatFile = async (chatId: string, file: File, folder = 'chat-attachments') => {
  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `${folder}/${chatId}/${fileName}`;
  const { error } = await supabase.storage.from('silhouette').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('silhouette').getPublicUrl(filePath);
  return data.publicUrl;
};

export const uploadChatBlob = async (chatId: string, blob: Blob, filename: string, folder = 'chat-attachments') => {
  const filePath = `${folder}/${chatId}/${filename}`;
  const { error } = await supabase.storage.from('silhouette').upload(filePath, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType: blob.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('silhouette').getPublicUrl(filePath);
  return data.publicUrl;
};
