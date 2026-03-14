import { motion } from 'motion/react';
import { MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';

interface Chat {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
}

interface ChatInboxProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onViewChat: () => void;
  className?: string;
}

export function ChatInbox({ chats, selectedChatId, onSelectChat, onViewChat, className }: ChatInboxProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMsg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={className}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chat Inbox</h2>
              <p className="text-sm text-gray-500">{filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ backgroundColor: '#f0f4f8' }}
                onClick={() => {
                  onSelectChat(chat.id);
                  onViewChat();
                }}
                className={`w-full p-4 text-left transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{chat.name}</p>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shrink-0 font-medium">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{chat.lastMsg}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.time}</p>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {filteredChats.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">{filteredChats.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{filteredChats.filter((c) => c.unread > 0).length}</p>
                <p className="text-xs text-gray-600">Unread</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{filteredChats.reduce((sum, c) => sum + c.unread, 0)}</p>
                <p className="text-xs text-gray-600">Messages</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
