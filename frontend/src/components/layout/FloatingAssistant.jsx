import { useEffect, useRef, useState } from 'react'
import {
  X,
  Send,
  Sparkles,
  LoaderCircle,
  Copy,
  Check,
  Trash2,
} from 'lucide-react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { sendChatMessage } from '../../services/api'

// Robot video component
function RobotVideo({ className = '' }) {
  return (
    <video
      src="/videos/robot.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
    />
  )
}

// Code block with copy button
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)

  const code = String(children).replace(/\n$/, '')

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Could not copy code:', error)
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-700">
      <div className="flex items-center justify-between bg-slate-800 px-3 py-2">
        <span className="text-xs text-slate-300">
          {language || 'Code'}
        </span>

        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '14px',
          fontSize: '12px',
          background: '#0f172a',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

// Markdown response component
function MessageContent({ text }) {
  return (
    <div className="text-sm leading-6 break-words [&_a]:text-indigo-600 [&_a]:underline [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-300 [&_blockquote]:pl-3 [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_strong]:font-bold [&_ul]:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '')

            if (match) {
              return (
                <CodeBlock language={match[1]}>
                  {children}
                </CodeBlock>
              )
            }

            return (
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-indigo-700">
                {children}
              </code>
            )
          },

          pre({ children }) {
            return <>{children}</>
          },

          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  {children}
                </table>
              </div>
            )
          },

          th({ children }) {
            return (
              <th className="border border-slate-200 bg-slate-100 px-2 py-2 text-left font-semibold">
                {children}
              </th>
            )
          },

          td({ children }) {
            return (
              <td className="border border-slate-200 px-2 py-2">
                {children}
              </td>
            )
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hey! 👋 I'm **Loop AI**, your CampusLoop assistant. Ask me about campus resources, academic materials, events, programming, studies, or anything else!",
    },
  ])

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Send message to Groq backend
  const sendMessage = async (text = message) => {
    const trimmedMessage = text.trim()

    if (!trimmedMessage || isLoading) return

    const history = messages
      .slice(1)
      .map((item) => ({
        role: item.role === 'user' ? 'user' : 'model',
        text: item.text,
      }))

    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        text: trimmedMessage,
      },
    ])

    setMessage('')
    setIsLoading(true)

    try {
      const data = await sendChatMessage(trimmedMessage, history)

      setMessages((previous) => [
        ...previous,
        {
          role: 'bot',
          text:
            data.reply ||
            'I could not generate a response. Please try again.',
        },
      ])
    } catch (error) {
      console.error('Chatbot error:', error)

      setMessages((previous) => [
        ...previous,
        {
          role: 'bot',
          text:
            error.response?.data?.message ||
            'Sorry! I am having trouble connecting right now. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Copy AI response
  const copyResponse = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)

      setCopiedMessage(index)

      setTimeout(() => {
        setCopiedMessage(null)
      }, 2000)
    } catch (error) {
      console.error('Could not copy response:', error)
    }
  }

  // Clear conversation
  const clearChat = () => {
    if (isLoading) return

    setMessages([
      {
        role: 'bot',
        text: "Hey! 👋 I'm **Loop AI**. What would you like to explore today?",
      },
    ])

    setCopiedMessage(null)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">

      {/* Floating Robot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open CampusLoop Assistant"
          className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-600 shadow-2xl shadow-blue-400/40 transition duration-300 hover:scale-110"
        >
          <span className="absolute -inset-2 animate-pulse rounded-full border-2 border-cyan-400/60" />

          <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-950">
            <RobotVideo className="h-full w-full scale-125 object-cover" />
          </div>

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="flex h-[min(600px,calc(100dvh-40px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4 text-white">

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/60 bg-slate-950">
                <RobotVideo className="h-full w-full scale-125 object-cover" />
              </div>

              <div>
                <h3 className="font-semibold">Loop AI</h3>

                <p className="text-xs text-indigo-100">
                  Your AI campus companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">

              <button
                type="button"
                onClick={clearChat}
                disabled={isLoading}
                aria-label="Clear chat"
                title="Clear chat"
                className="rounded-lg p-2 transition hover:bg-white/20 disabled:opacity-40"
              >
                <Trash2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <X size={20} />
              </button>

            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                {item.role === 'bot' && (
                  <div className="mr-2 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-indigo-200 bg-slate-950">
                    <RobotVideo className="h-full w-full scale-125 object-cover" />
                  </div>
                )}

                <div className="max-w-[85%]">

                  <div
                    className={`rounded-2xl px-3 py-2.5 ${
                      item.role === 'user'
                        ? 'rounded-br-sm bg-indigo-600 text-white'
                        : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm'
                    }`}
                  >
                    {item.role === 'user' ? (
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {item.text}
                      </p>
                    ) : (
                      <MessageContent text={item.text} />
                    )}
                  </div>

                  {item.role === 'bot' && (
                    <button
                      type="button"
                      onClick={() => copyResponse(item.text, index)}
                      className="mt-1 flex items-center gap-1 px-1 text-xs text-slate-400 transition hover:text-indigo-600"
                    >
                      {copiedMessage === index ? (
                        <>
                          <Check size={12} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy response
                        </>
                      )}
                    </button>
                  )}

                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2">

                <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-950">
                  <RobotVideo className="h-full w-full scale-125 object-cover" />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  <LoaderCircle size={15} className="animate-spin" />
                  Loop AI is thinking...
                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Quick Prompts */}
          <div className="border-t border-slate-100 bg-white px-3 pt-3">

            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">

              <button
                type="button"
                onClick={() => sendMessage('Show me campus resources')}
                disabled={isLoading}
                className="flex shrink-0 items-center gap-1 rounded-full border border-indigo-100 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
              >
                <Sparkles size={12} />
                Resources
              </button>

              <button
                type="button"
                onClick={() => sendMessage('Show me academic materials')}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-indigo-100 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
              >
                Academic materials
              </button>

              <button
                type="button"
                onClick={() => sendMessage('Show me campus events')}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-indigo-100 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
              >
                Events
              </button>

            </div>

            {/* Input */}
            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
              className="flex items-center gap-2 pb-3"
            >
              <input
                ref={inputRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask Loop AI anything..."
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}