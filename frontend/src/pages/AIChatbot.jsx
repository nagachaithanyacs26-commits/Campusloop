
import { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../services/api';
import toast from 'react-hot-toast';
import {
  Bot,
  Send,
  Sparkles,
  UserRound,
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Users,
  Package,
  Clock,
  MessageCircle,
  ArrowDown,
  Lightbulb,
} from 'lucide-react';

const STORAGE_KEY = 'campusloop-ai-chat-history';

const QUICK_PROMPTS = [
  {
    label: 'Study tips',
    text: 'Give me some study tips',
    icon: BookOpen,
    color: 'bg-violet-100 text-violet-600',
  },
  {
    label: 'Campus events',
    text: 'How can I find campus events?',
    icon: CalendarDays,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    label: 'Study groups',
    text: 'How do I find a study group?',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: 'Find resources',
    text: 'How can I find study resources?',
    icon: Package,
    color: 'bg-sky-100 text-sky-600',
  },
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey there! 👋 I'm Loop AI, your CampusLoop assistant. I can help you explore campus resources, discover study groups, learn about events, and improve your study routine. What would you like help with today?",
  timestamp: new Date().toISOString(),
};

function loadMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Could not load chat history:', error);
  }

  return [WELCOME_MESSAGE];
}

function getBotResponse(input) {
  const message = input.toLowerCase().trim();

  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(message)) {
    return "Hey! 👋 Welcome to CampusLoop! I'm Loop AI. I can help you with study resources, campus events, study groups, and study tips. What would you like to explore?";
  }

  if (/\b(who are you|what are you|your name|about you)\b/.test(message)) {
    return "I'm Loop AI, the virtual assistant for CampusLoop! 🤖 I can guide you around the platform and share general tips for campus life. I'm currently running in demo mode, so my answers come from built-in knowledge rather than a live AI service.";
  }

  if (/\b(study tips|study better|study plan|exam|exams|concentrat|focus|revision|revise)\b/.test(message)) {
    return "📚 Here are five practical study tips:\n\n1. **Try Pomodoro:** Study for 25 minutes, then take a 5-minute break.\n2. **Practice active recall:** Close your notes and explain what you remember.\n3. **Use spaced repetition:** Review important topics over several days.\n4. **Set a daily goal:** Choose 2–3 specific tasks before you start.\n5. **Study with classmates:** Discuss difficult concepts and quiz each other.\n\n✨ Pro tip: Start with the topic you find most difficult while your energy is high!";
  }

  if (/\b(resource|resources|notes|textbook|books|borrow|lend|equipment|calculator)\b/.test(message)) {
    return "📦 Looking for study resources? Here's how to get started:\n\n1. Open **Resource Exchange** from the CampusLoop sidebar.\n2. Browse available books, notes, calculators, and other learning materials.\n3. Use the search and category filters if they're available.\n4. Check the listing details before contacting the owner.\n5. If you have something to share, create a resource listing if that feature is enabled.\n\nNote: I'm giving you platform guidance. I don't have access to live listings or availability.";
  }

  if (/\b(event|events|workshop|workshops|seminar|seminars|hackathon|fest|festival)\b/.test(message)) {
    return "🎉 Campus events are a great way to learn and meet people!\n\nTry these steps:\n\n1. Open the **Events** page in CampusLoop.\n2. Browse the available event cards.\n3. Look for workshops, technical talks, cultural activities, and hackathons.\n4. Check each event's date, location, and registration details.\n\nI can't see your live event listings yet, so please check the Events page for actual schedules.";
  }

  if (/\b(study group|study groups|group study|find teammates|teammates|team members|project partner)\b/.test(message)) {
    return "👥 Let's help you find your people!\n\n1. Open **Study Groups** from the sidebar.\n2. Look for groups related to your subject or interests.\n3. Check the group's goals, schedule, and requirements.\n4. Join a suitable group if the feature is available.\n5. If you can't find a match, consider creating a group for your subject.\n\n💡 Tip: Groups work best when everyone agrees on a shared goal and meeting schedule.";
  }

  if (/\b(profile|edit profile|my account|personal information)\b/.test(message)) {
    return "🙋 You can manage your campus identity from your Profile page!\n\n1. Click your profile icon in the top-right corner.\n2. Choose **View Profile**.\n3. Use the edit option to update your information.\n4. Add relevant skills, interests, and a short introduction.\n\nA complete profile makes it easier for classmates to understand your interests and find potential collaborators.";
  }

  if (/\b(message|messages|chat with|contact|connect with|network)\b/.test(message)) {
    return "💬 CampusLoop's messaging and networking features are designed to help students connect.\n\nYou can explore the **Messages** page to see the chat interface and use campus networking features that are available in your current version.\n\nKeep in mind that demo interfaces may not deliver real messages until backend functionality is connected.";
  }

  if (/\b(time management|time management tips|schedule|timetable|productivity|procrastinat)\b/.test(message)) {
    return "⏰ Let's make your day more manageable!\n\n• Write down your top three priorities.\n• Break large assignments into smaller tasks.\n• Schedule focused study sessions and short breaks.\n• Keep some extra time for unexpected work.\n• Review your progress at the end of the day.\n\nTry this simple plan: 30 minutes of planning, two focused study sessions, one review session, and time for rest. Adjust it to fit your classes.";
  }

  if (/\b(hello|thanks|thank you|thank u|thx)\b/.test(message)) {
    return "You're welcome! 💜 I'm happy to help. You can ask me about study tips, resources, campus events, study groups, or using CampusLoop.";
  }

  if (/\b(help|what can you do|features|options|suggestions)\b/.test(message)) {
    return "Of course! ✨ Here's what I can help with:\n\n📚 **Study tips** — revision, focus, and exam preparation.\n📦 **Resources** — guidance on finding and sharing learning materials.\n🎉 **Events** — how to explore campus activities.\n👥 **Study groups** — ideas for finding collaborators.\n🙋 **Profiles** — help navigating your student profile.\n⏰ **Productivity** — planning your time and tasks.\n\nChoose a quick prompt below or type your own question!";
  }

  if (/\b(thank|thanks|thank you|thx)\b/.test(message)) {
    return "You're very welcome! 💜 Let me know if you'd like help with anything else around CampusLoop.";
  }

  if (/\b(bye|goodbye|see you)\b/.test(message)) {
    return "See you around CampusLoop! 👋 Good luck with your studies, and remember to take breaks. I'm here whenever you want to chat.";
  }

  return "That's an interesting question! 💜 I'm currently running in frontend demo mode, so I can answer a limited set of campus-related questions.\n\nTry asking me something like:\n\n• How can I find study resources?\n• Give me some study tips.\n• How do I find a study group?\n• How can I find campus events?\n• Help me manage my time.\n\nA real AI API can be connected later to support more open-ended questions.";
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AIChatbot() {
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Could not save chat history:', error);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function sendMessage(text = input) {
    const content = text.trim();

    if (!content || isTyping) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.filter((message) => message.role !== 'system').slice(-12).map((message) => ({ role: message.role, text: message.content }));
      const result = await sendChatMessage(content, history);
      setMessages((previous) => [...previous, { id: `${Date.now()}-assistant`, role: 'assistant', content: result.reply || 'I could not generate a response. Please try again.', timestamp: new Date().toISOString() }]);
    } catch (error) {
      const message = error.response?.data?.message || 'Loop AI could not respond. Check your backend AI configuration.';
      toast.error(message);
      setMessages((previous) => [...previous, { id: `${Date.now()}-assistant-error`, role: 'assistant', content: message, timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function startNewChat() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessages([
      {
        ...WELCOME_MESSAGE,
        id: `${Date.now()}-welcome`,
        timestamp: new Date().toISOString(),
      },
    ]);

    setInput('');
    setIsTyping(false);
    inputRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto flex h-[calc(100vh-120px)] min-h-[580px] max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
              <Bot size={27} />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  Loop AI
                </h1>

                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                  Campus assistant
                </span>
              </div>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online · Ready to help
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            title="Start a new conversation"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>

        {/* Assistant status */}
        <div className="flex items-start gap-2 border-b border-indigo-100 bg-indigo-50/70 px-4 py-2.5 sm:px-6">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-indigo-600" />
          <p className="text-xs leading-5 text-indigo-800">
            <span className="font-bold">Loop AI:</span> Ask questions about
            campus life, studying, or anything else.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white px-3 py-5 sm:px-6 sm:py-7">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 sm:gap-3 ${
                    isUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isUser
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      <UserRound size={19} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>

                  <div
                    className={`flex max-w-[85%] flex-col sm:max-w-[78%] ${
                      isUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`mb-1.5 flex items-center gap-2 text-xs ${
                        isUser ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="font-bold text-slate-700">
                        {isUser ? 'You' : 'Loop AI'}
                      </span>

                      <span className="text-slate-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3.5 text-sm leading-7 shadow-sm ${
                        isUser
                          ? 'rounded-tr-md bg-indigo-600 text-white'
                          : 'rounded-tl-md border border-slate-100 bg-white text-slate-700'
                      }`}
                    >
                      {message.content.split('\n').map((line, index) => (
                        <p
                          key={`${message.id}-${index}`}
                          className={line === '' ? 'h-2' : ''}
                        >
                          {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong
                                key={`${partIndex}-${part}`}
                                className="font-bold"
                              >
                                {part.slice(2, -2)}
                              </strong>
                            ) : (
                              <span key={`${partIndex}-${part}`}>
                                {part}
                              </span>
                            ),
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                  <Bot size={20} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-slate-700">
                    Loop AI
                  </p>

                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-100 bg-white px-4 py-4 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick prompts */}
        <div className="border-t border-slate-100 bg-white px-3 pb-3 pt-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb size={15} className="text-amber-500" />
              <p className="text-xs font-bold text-slate-500">
                TRY ASKING
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {QUICK_PROMPTS.map((prompt) => {
                const Icon = prompt.icon;

                return (
                  <button
                    key={prompt.label}
                    type="button"
                    disabled={isTyping}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${prompt.color}`}
                    >
                      <Icon size={14} />
                    </span>
                    {prompt.label}
                  </button>
                );
              })}
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSubmit}
              className="mt-2 flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                placeholder="Ask Loop AI anything about campus..."
                aria-label="Type your message"
                rows={1}
                maxLength={2000}
                className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 transition hover:scale-[1.03] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <p className="text-[10px] text-slate-400">
                Enter to send · Shift + Enter for a new line
              </p>

              <button
                type="button"
                onClick={startNewChat}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 transition hover:text-rose-500"
              >
                <Trash2 size={12} />
                Clear chat
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
              Loop AI can make mistakes. Check important campus information
              on the relevant page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
