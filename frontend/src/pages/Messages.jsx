
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { getConversations, getConversationMessages, sendDirectMessage } from '../services/api';
import toast from 'react-hot-toast';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MessageCircle,
  ArrowLeft,
  Smile,
  CheckCheck,
  Users,
} from 'lucide-react';

const initialConversations = [
  {
    id: 1,
    name: 'Priya Sharma',
    initials: 'PS',
    color: 'bg-pink-100 text-pink-700',
    course: 'Computer Science',
    online: true,
    unread: 2,
    messages: [
      {
        id: 1,
        text: 'Hey! Are you preparing for the upcoming exams?',
        time: '09:30 AM',
        sender: 'them',
      },
      {
        id: 2,
        text: 'Yes! I have started revising Data Structures.',
        time: '09:32 AM',
        sender: 'me',
      },
      {
        id: 3,
        text: 'That is great! Would you like to study together?',
        time: '09:35 AM',
        sender: 'them',
      },
    ],
  },
  {
    id: 2,
    name: 'Rahul Verma',
    initials: 'RV',
    color: 'bg-blue-100 text-blue-700',
    course: 'Information Technology',
    online: true,
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'Did you check the new study group?',
        time: '10:15 AM',
        sender: 'them',
      },
      {
        id: 2,
        text: 'Not yet. I will check it today!',
        time: '10:18 AM',
        sender: 'me',
      },
    ],
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    initials: 'AR',
    color: 'bg-purple-100 text-purple-700',
    course: 'Electronics Engineering',
    online: false,
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'I shared my lecture notes on CampusLoop.',
        time: 'Yesterday',
        sender: 'them',
      },
      {
        id: 2,
        text: 'Thank you! Those notes will be really helpful.',
        time: 'Yesterday',
        sender: 'me',
      },
    ],
  },
  {
    id: 4,
    name: 'Karthik Kumar',
    initials: 'KK',
    color: 'bg-amber-100 text-amber-700',
    course: 'Mechanical Engineering',
    online: false,
    unread: 1,
    messages: [
      {
        id: 1,
        text: 'Are you attending the campus event tomorrow?',
        time: 'Yesterday',
        sender: 'them',
      },
    ],
  },
  {
    id: 5,
    name: 'Campus Study Group',
    initials: 'CS',
    color: 'bg-emerald-100 text-emerald-700',
    course: 'Group conversation',
    online: true,
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'Welcome everyone! Let us share our study resources here.',
        time: 'Yesterday',
        sender: 'them',
      },
    ],
  },
];

function Messages() {
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showConversations, setShowConversations] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { getToken().then(getConversations).then((result) => setConversations((result.conversations || []).map((item) => ({ ...item, online: false, color: 'bg-indigo-100 text-indigo-700', messages: [] })))).catch((error) => toast.error(error.response?.data?.message || 'Unable to load conversations.')); }, [getToken]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  async function openConversation(id) {
    setSelectedId(id);
    setShowConversations(false);
    try { const token = await getToken(); const result = await getConversationMessages(id, token); setConversations((items) => items.map((item) => item.id === id ? { ...item, messages: result.messages || [], unread: 0 } : item)); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to load messages.'); }
  }

  async function sendMessage(event) {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || !selectedConversation) {
      return;
    }

    try { const token = await getToken(); const result = await sendDirectMessage(selectedId, trimmedMessage, token); setConversations((items) => items.map((item) => item.id === selectedId ? { ...item, messages: [...item.messages, result.message], lastMessage: trimmedMessage } : item)); setMessageText(''); inputRef.current?.focus(); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to send message.'); }
  }

  function startConversation() {
    const recipientId = window.prompt('Enter the student Clerk user ID to message');
    if (!recipientId?.trim()) return;
    const id = recipientId.trim();
    const existing = conversations.find((item) => item.id === id);
    if (existing) { openConversation(id); return; }
    const name = 'Campus Member';
    setConversations((items) => [{ id, name, initials: 'CM', color: 'bg-indigo-100 text-indigo-700', course: 'Campus Member', online: false, unread: 0, messages: [] }, ...items]);
    setSelectedId(id); setShowConversations(false); setSearchTerm('');
  }

  return (
    <div className="flex h-[calc(100vh-110px)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Page heading */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Messages
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Connect with your campus community.
          </p>
        </div>

        <button
          type="button"
          onClick={startConversation}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-4"
        >
          <MessageCircle size={17} />
          <span className="hidden sm:inline">New conversation</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Chat layout */}
      <div className="flex min-h-0 flex-1">
        {/* Conversation list */}
        <aside
          className={`w-full shrink-0 border-r border-slate-100 md:w-[300px] lg:w-[340px] ${
            showConversations ? 'flex' : 'hidden md:flex'
          } flex-col`}
        >
          {/* Search */}
          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Conversation heading */}
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              All conversations
            </h2>

            <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
              {conversations.length}
            </span>
          </div>

          {/* Conversation items */}
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {filteredConversations.map((conversation) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];

              const isSelected = conversation.id === selectedId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    isSelected
                      ? 'bg-indigo-50 ring-1 ring-indigo-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${conversation.color}`}
                    >
                      {conversation.initials}
                    </div>

                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {conversation.name}
                      </p>

                      <span className="shrink-0 text-[10px] text-slate-400">
                        {lastMessage?.time || ''}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {lastMessage?.sender === 'me' ? 'You: ' : ''}
                      {lastMessage?.text || 'Start a conversation'}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-slate-400">
                        {conversation.course}
                      </span>

                      {conversation.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="px-4 py-10 text-center">
                <Search
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No conversations found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try searching for another name.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Active chat */}
        <section
          className={`min-w-0 flex-1 flex-col ${
            showConversations ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConversations(true)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="relative shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${selectedConversation.color}`}
                    >
                      {selectedConversation.initials}
                    </div>

                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-900">
                      {selectedConversation.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {selectedConversation.online
                        ? 'Online now'
                        : selectedConversation.course}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Voice call"
                    title="Voice call (demo)"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() =>
                      window.alert('Voice calling will be available in a future version.')
                    }
                  >
                    <Phone size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Video call"
                    title="Video call (demo)"
                    className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 sm:block"
                    onClick={() =>
                      window.alert('Video calling will be available in a future version.')
                    }
                  >
                    <Video size={19} />
                  </button>

                  <button
                    type="button"
                    aria-label="More options"
                    title="More options"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                    onClick={() =>
                      window.alert('More chat options will be available in a future version.')
                    }
                  >
                    <MoreVertical size={19} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-6">
                <div className="flex justify-center">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-400 shadow-sm">
                    Your campus conversation
                  </span>
                </div>

                {selectedConversation.messages.map((message, index) => {
                  const isMine = message.sender === 'me';

                  const previousMessage =
                    selectedConversation.messages[index - 1];

                  const showSender =
                    !isMine &&
                    (!previousMessage ||
                      previousMessage.sender !== message.sender);

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        isMine ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isMine && (
                        <div className="h-7 w-7 shrink-0">
                          {showSender && (
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ${selectedConversation.color}`}
                            >
                              {selectedConversation.initials}
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] ${
                          isMine ? 'items-end' : 'items-start'
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isMine
                              ? 'rounded-br-md bg-indigo-600 text-white'
                              : 'rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm'
                          }`}
                        >
                          {message.text}
                        </div>

                        <div
                          className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-slate-400 ${
                            isMine ? 'justify-end' : ''
                          }`}
                        >
                          <span>{message.time}</span>

                          {isMine && (
                            <CheckCheck
                              size={13}
                              className="text-indigo-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {selectedConversation.messages.length === 0 && (
                  <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                      <MessageCircle size={26} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-800">
                      Start the conversation
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Send your first message below.
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form
                onSubmit={sendMessage}
                className="border-t border-slate-100 bg-white p-3 sm:p-4"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50">
                  <button
                    type="button"
                    aria-label="Attachments"
                    title="Attachments (coming soon)"
                    className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-indigo-600 sm:block"
                    onClick={() =>
                      window.alert('File attachments will be available in a future version.')
                    }
                  >
                    <Paperclip size={19} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="Type your message..."
                    aria-label="Type your message"
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    aria-label="Emoji"
                    title="Emoji picker (coming soon)"
                    className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-indigo-600 sm:block"
                    onClick={() =>
                      setMessageText((previous) => previous + ' 😊')
                    }
                  >
                    <Smile size={19} />
                  </button>

                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={18} />
                  </button>
                </div>

                <p className="mt-2 text-center text-[10px] text-slate-400">
                  CampusLoop messaging · Frontend demo
                </p>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <Users size={30} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-800">
                Your campus connections
              </h2>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Select a conversation or start a new one to connect with your campus community.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Messages;
