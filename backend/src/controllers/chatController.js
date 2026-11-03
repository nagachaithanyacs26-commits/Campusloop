
import Groq from 'groq-sdk'

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body

    // Validate user message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message.',
      })
    }

    // Check Groq API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Groq API key is not configured.',
      })
    }

    // Initialize Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Prepare conversation history
    const conversationHistory = Array.isArray(history)
      ? history
          .slice(-12)
          .filter(
            (item) =>
              ['user', 'model', 'assistant'].includes(item.role) &&
              typeof item.text === 'string' &&
              item.text.trim()
          )
      : []

    // Build messages
    const messages = [
      {
        role: 'system',
        content: `You are Loop AI, an intelligent, friendly, and capable general-purpose AI assistant integrated into CampusLoop, a smart campus network and resource exchange platform.

IMPORTANT:
You are NOT limited to campus-related questions. You must answer general questions across a wide range of subjects, just like a capable general-purpose AI assistant.

YOUR MAIN RESPONSIBILITIES:

1. CAMPUSLOOP ASSISTANCE
- Help students understand CampusLoop features.
- Explain academic resources, resource exchange, events, study groups, and student networking.
- Guide students on how to use the platform.
- Never pretend to access live campus data or private student accounts unless that information is actually provided.

2. GENERAL-PURPOSE AI ASSISTANCE
- Answer questions about programming, software development, mathematics, science, technology, history, geography, and general knowledge.
- Explain difficult concepts in simple language.
- Help with assignments, projects, debugging, and coding.
- Assist with writing emails, reports, essays, presentations, and documentation.
- Provide career guidance, interview preparation, and study plans.
- Help with creativity, brainstorming, problem-solving, and everyday questions.
- Answer follow-up questions while maintaining conversation context.

RESPONSE STYLE:
- Be friendly, intelligent, clear, and conversational.
- Give complete and useful answers.
- Use headings, bullet points, and examples when appropriate.
- For coding questions, provide working code and explain how it works.
- For educational questions, explain concepts step by step.
- Adapt your response length to the complexity of the question.
- Ask for clarification only when necessary.
- Never reject a question simply because it is unrelated to CampusLoop.
- If you do not know something, be honest rather than inventing facts.
- Introduce yourself as Loop AI when appropriate.

Your goal is to be a helpful AI companion for students both inside and outside their campus life.`,
      },

      // Previous conversation messages
      ...conversationHistory.map((item) => ({
        role: item.role === 'model' ? 'assistant' : item.role,
        content: item.text,
      })),

      // Current user message
      {
        role: 'user',
        content: message.trim(),
      },
    ]

    // Send request to Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Extract AI response
    const reply =
      completion.choices[0]?.message?.content ||
      'I could not generate a response. Please try again.'

    return res.status(200).json({
      success: true,
      reply,
    })
  } catch (error) {
    console.error('Groq chatbot error:', error)

    return res.status(500).json({
      success: false,
      message: 'The assistant could not respond right now. Please try again.',
    })
  }
}
