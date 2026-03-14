import { useEffect, useRef, useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { Link } from 'react-router';
import { ArrowLeft, Paperclip, Send, Mic, Square, Trash2, ShieldCheck, ChevronDown, Copy } from 'lucide-react';
import { supabase } from '@/app/lib/supabaseClient';
import {
  createChat,
  ensureUser,
  fetchChatByTicket,
  fetchChatMessages,
  insertChatMessage,
  uploadChatBlob,
  uploadChatFile,
  type ChatMessage,
} from '@/app/lib/chatService';
import { trackLiveAction } from '@/app/lib/analyticsStore';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgsnOwbpMeE0JQrY76UgyB7dmoD6z3P8_WrA&s';
const FAQS = [
  {
    q: 'How soon are results ready?',
    a: 'Most reports are available within 24-48 hours depending on the test type.',
  },
  {
    q: 'Do I need an appointment?',
    a: 'Yes. Booking ensures priority handling and minimal wait time.',
  },
  {
    q: 'Can I get urgent reporting?',
    a: 'Urgent cases are prioritized. Please notify our team in the chat.',
  },
  {
    q: 'How do I share prior medical records?',
    a: 'Attach files in the chat or send them to our team after we connect.',
  },
];

export function Chat() {
  useMetaTags({
    title: 'Silhouette Medical Support',
    description: 'Real-time medical support with a human agent.',
    keywords: 'support chat, medical support, diagnostics',
    ogTitle: 'Silhouette Medical Support',
    ogDescription: 'Talk to our medical team in real-time.',
    canonical: `${window.location.origin}/support`,
  });

  const [view, setView] = useState<'dashboard' | 'chat'>('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [ticketCopied, setTicketCopied] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordError, setRecordError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportsRecording = typeof MediaRecorder !== 'undefined';

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    if (!activeChatId) return;
    const message = {
      sender: 'user',
      text: chatInput.trim(),
      attachment_url: null,
      attachment_name: null,
      attachment_type: null,
      audio_url: null,
    } as const;
    const inserted = await insertChatMessage(activeChatId, message);
    setMessages((prev) => [...prev, inserted]);
    setChatInput('');
  };

  const generateTicketId = () => {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TKT-${stamp}-${rand}`;
  };

  const copyTicketId = async () => {
    if (!ticketId) return;
    try {
      await navigator.clipboard.writeText(ticketId);
      setTicketCopied(true);
      setTimeout(() => setTicketCopied(false), 2000);
    } catch {
      setTicketCopied(false);
    }
  };

  const startChat = async () => {
    if (chatBusy) return;
    setChatBusy(true);
    setChatError('');
    try {
      const newTicket = generateTicketId();
      await ensureUser();
      const chat = await createChat(newTicket);
      setTicketId(newTicket);
      setActiveChatId(chat.id);
      trackLiveAction('live_chat');
      setTicketCopied(false);
      const systemMessage = await insertChatMessage(chat.id, {
        sender: 'system',
        text: 'Connecting you to a Silhouette representative... This conversation is confidential and protected.',
        attachment_url: null,
        attachment_name: null,
        attachment_type: null,
        audio_url: null,
      });
      const agentMessage = await insertChatMessage(chat.id, {
        sender: 'agent',
        text: 'Hello, you are speaking with a live medical support agent. How can I assist you today?',
        attachment_url: null,
        attachment_name: null,
        attachment_type: null,
        audio_url: null,
      });
      setMessages([systemMessage, agentMessage]);
      setView('chat');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('anonymous sign-ins are disabled')) {
        setChatError('Chat is unavailable: Anonymous sign-ins are disabled in Supabase Auth settings.');
      } else {
        setChatError('Unable to start chat. Please try again.');
      }
    } finally {
      setChatBusy(false);
    }
  };

  const resumeChat = async () => {
    if (!ticketId.trim()) return;
    if (chatBusy) return;
    setChatBusy(true);
    setChatError('');
    try {
      const trimmed = ticketId.trim();
      await ensureUser();
      const chat = await fetchChatByTicket(trimmed);
      setActiveChatId(chat.id);
      setTicketCopied(false);
      const history = await fetchChatMessages(chat.id);
      const welcomeBack: ChatMessage = {
        id: `local-welcome-${Date.now()}`,
        chat_id: chat.id,
        sender: 'agent',
        text: 'Welcome back. A live medical support agent is ready to continue your conversation.',
        attachment_url: null,
        attachment_name: null,
        attachment_type: null,
        audio_url: null,
        created_at: new Date().toISOString(),
      };
      setMessages([...history, welcomeBack]);
      setView('chat');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('anonymous sign-ins are disabled')) {
        setChatError('Chat is unavailable: Anonymous sign-ins are disabled in Supabase Auth settings.');
      } else {
        setChatError('Unable to resume chat. Please check your ticket ID and try again.');
      }
    } finally {
      setChatBusy(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!activeChatId) return;
    const publicUrl = await uploadChatFile(activeChatId, file);
    const message = {
      sender: 'user',
      text: '',
      attachment_url: publicUrl,
      attachment_name: file.name,
      attachment_type: file.type,
      audio_url: null,
    } as const;
    const inserted = await insertChatMessage(activeChatId, message);
    setMessages((prev) => [...prev, inserted]);
    e.target.value = '';
  };

  const startRecording = async () => {
    if (!supportsRecording) {
      setRecordError('Voice recording is not supported in this browser.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordError('Microphone access is not available.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
          ? 'audio/ogg'
          : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (audioChunksRef.current.length === 0 || !activeChatId) return;
        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const filename = `voice-${Date.now()}.webm`;
        const publicUrl = await uploadChatBlob(activeChatId, blob, filename);
        const message = {
          sender: 'user',
          text: '',
          attachment_url: null,
          attachment_name: null,
          attachment_type: null,
          audio_url: publicUrl,
        } as const;
        const inserted = await insertChatMessage(activeChatId, message);
        setMessages((prev) => [...prev, inserted]);
      };
      recorder.start();
      setRecordError('');
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setRecordError('Microphone permission denied.');
    }
  };

  const stopRecording = (save: boolean) => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordSeconds(0);
    if (!recorderRef.current) return;
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (save) {
      recorder.stop();
    } else {
      recorder.stream.getTracks().forEach((t) => t.stop());
      audioChunksRef.current = [];
    }
  };

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      if (recorderRef.current) {
        recorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (view !== 'chat' || !activeChatId) return;
    let subscription = supabase
      .channel(`chat-messages-${activeChatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${activeChatId}` },
        (payload) => {
          const message = payload.new as ChatMessage;
          setMessages((prev) => (prev.find((m) => m.id === message.id) ? prev : [...prev, message]));
        }
      )
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [view, activeChatId]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
        <div className="h-16 px-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-100">
            <img src={LOGO_URL} alt="Silhouette Diagnostics" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-gray-900">Silhouette Medical Support</div>
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Live Human Agent
            </div>
          </div>
        </div>
      </div>

      {view === 'dashboard' ? (
        <div className="flex-1 flex items-center justify-center bg-blue-50/40 px-4 py-10">
          <div className="w-full max-w-3xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Talk to our Medical Support Team</h2>
              <p className="text-sm text-gray-600">A real person is ready to assist you.</p>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mx-auto">
                <ShieldCheck className="w-4 h-4" /> Confidential & Secure
              </div>
              <p className="text-sm text-gray-600">
                All medical inquiries and personal data are protected by our strict confidentiality protocols. Your chat is private and encrypted.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startChat}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-60"
                  disabled={chatBusy}
                >
                  {chatBusy ? 'Connecting...' : 'Start Chatting with an Agent'}
                </button>
                {chatError && <div className="text-sm text-red-600">{chatError}</div>}
                <div className="w-full">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Enter Ticket ID</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder="e.g., TKT-ABC123..."
                      aria-label="Ticket ID"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      onClick={resumeChat}
                      className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Common Questions</h3>
              <div className="space-y-3">
                {FAQS.map((item) => (
                  <details key={item.q} className="group rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-800">
                      {item.q}
                      <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="text-sm text-gray-600 mt-2">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-16 z-40 bg-white border-b border-blue-50">
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-blue-700">
              <span className="font-semibold">Ticket ID:</span>
              <span className="font-mono">{ticketId || 'N/A'}</span>
              <button
                onClick={copyTicketId}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-50"
              >
                <Copy className="w-3 h-3" />
                {ticketCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          {/* Scrollable Messages */}
          <div className="flex-1 overflow-y-auto bg-blue-50/40 px-4 py-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'system' ? (
                  <div className="mx-auto text-xs text-blue-700 bg-white border border-blue-100 rounded-full px-4 py-2">
                    {msg.text}
                  </div>
                ) : (
                  <div className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.sender === 'agent' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-100 bg-white">
                        <img src={LOGO_URL} alt="Silhouette Diagnostics" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm ${
                          msg.sender === 'agent'
                            ? 'bg-white border border-blue-200 text-blue-700 rounded-bl-sm'
                            : 'bg-blue-600 text-white rounded-br-sm'
                        }`}
                      >
                        {msg.text}
                        {msg.attachment_url && (
                          <div className="mt-3 bg-white/10 rounded-lg p-2 text-xs">
                            {msg.attachment_type?.startsWith('image/') ? (
                              <img src={msg.attachment_url} alt={msg.attachment_name || 'Attachment'} className="w-32 h-24 object-cover rounded-md mb-2" />
                            ) : (
                              <a
                                href={msg.attachment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {msg.attachment_name || 'View attachment'}
                              </a>
                            )}
                          </div>
                        )}
                        {msg.audio_url && (
                          <div className="mt-3">
                            <audio controls className="w-56">
                              <source src={msg.audio_url} />
                            </audio>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sticky Input */}
          <div className="sticky bottom-0 z-50 bg-white border-t border-blue-100 shadow-[0_-4px_12px_rgba(30,64,175,0.08)]">
            <div className="px-4 py-3 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelected}
                aria-label="Attach file"
              />
              <button
                aria-label="Attach file"
                onClick={handleAttachClick}
                className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                aria-label="Message input"
                className="flex-1 px-4 py-2.5 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isRecording}
              />
              <button
                onClick={sendMessage}
                className="w-12 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
                aria-label="Send message"
                disabled={isRecording}
              >
                <Send className="w-4 h-4" />
              </button>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={!supportsRecording}
                  className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
                  aria-label="Start voice note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600">{recordSeconds}s</span>
                  <button
                    onClick={() => stopRecording(true)}
                    className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
                    aria-label="Stop recording"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => stopRecording(false)}
                    className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
                    aria-label="Cancel recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="px-4 pb-2 text-center">
              <div className="text-xs text-blue-600">Protected medical communication.</div>
              {recordError && <div className="text-xs text-red-500 mt-1">{recordError}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
