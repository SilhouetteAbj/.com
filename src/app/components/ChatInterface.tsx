import { ArrowLeft, Paperclip, Send, Mic, Square, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/app/lib/chatService';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgsnOwbpMeE0JQrY76UgyB7dmoD6z3P8_WrA&s';

interface ChatInterfaceProps {
  selectedChat: { ticketId: string; name: string; chatId: string } | null;
  messages: ChatMessage[];
  onSendText: (text: string) => Promise<void> | void;
  onSendFile: (file: File) => Promise<void> | void;
  onSendAudio: (blob: Blob) => Promise<void> | void;
  onBack: () => void;
}

export function ChatInterface({
  selectedChat,
  messages,
  onSendText,
  onSendFile,
  onSendAudio,
  onBack,
}: ChatInterfaceProps) {
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordError, setRecordError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportsRecording = typeof MediaRecorder !== 'undefined';
  const disabled = !selectedChat;

  const handleSend = async () => {
    if (!chatInput.trim() || disabled) return;
    await onSendText(chatInput.trim());
    setChatInput('');
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;
    await onSendFile(file);
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
        if (audioChunksRef.current.length === 0 || disabled) return;
        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        await onSendAudio(blob);
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full rounded-2xl">
        <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Back to inbox"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-100">
              <img src={LOGO_URL} alt="Silhouette Diagnostics" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{selectedChat?.name || 'Support Chat'}</p>
              <p className="text-xs text-gray-500">Ticket: {selectedChat?.ticketId || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-blue-50/40">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No messages yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'user' ? 'justify-start' : 'justify-center'}`}>
                {msg.sender === 'system' ? (
                  <div className="text-xs text-blue-700 bg-white border border-blue-100 rounded-full px-4 py-2">
                    {msg.text}
                  </div>
                ) : (
                  <div className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
                    {msg.sender === 'agent' ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-100 bg-white">
                        <img src={LOGO_URL} alt="Silhouette Diagnostics" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                        U
                      </div>
                    )}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm ${
                          msg.sender === 'agent'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-blue-200 text-blue-700 rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                        {msg.attachment_url && (
                          <div className="mt-3 bg-white/10 rounded-lg p-2 text-xs">
                            {msg.attachment_type?.startsWith('image/') ? (
                              <img src={msg.attachment_url} alt={msg.attachment_name || 'Attachment'} className="w-full max-w-xs sm:max-w-sm h-auto rounded-md mb-2" />
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
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-0 border-t border-blue-100 bg-white shadow-[0_-4px_12px_rgba(30,64,175,0.08)]">
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
              disabled={disabled}
              className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              disabled={isRecording || disabled}
            />
            <button
              onClick={handleSend}
              className="w-12 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
              aria-label="Send message"
              disabled={isRecording || disabled}
            >
              <Send className="w-4 h-4" />
            </button>
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!supportsRecording || disabled}
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
      </div>
    </div>
  );
}
