"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, User, MessageCircle, ArrowLeft, Star, User2Icon, Twitter, Linkedin, Sparkles, Zap, Brain, Code2, Cpu, Terminal, Database, Network, Github, Copy, Check } from "lucide-react"
import { personaDefinitions, getRandomTemplate, type Persona } from "./persona-definitions"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  persona?: Persona
  timestamp: Date
  type?: "switch" | "normal"
  isStreaming?: boolean
}

interface PersonaMessages {
  hitesh: Message[]
  piyush: Message[]
}

// Code Block Component
function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="relative my-4 rounded-lg overflow-hidden neon-border">
      <div className="flex items-center justify-between bg-black/80 px-4 py-2 border-b border-cyan-400/30">
        <span className="text-cyan-300 text-sm font-mono">{language}</span>
        <Button
          onClick={copyToClipboard}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-cyan-300 hover:text-white hover:bg-cyan-400/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-black/60 p-4 overflow-x-auto">
        <code className="text-cyan-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  )
}

// Function to detect and format code blocks in text
function formatMessageContent(content: string) {
  // Split content by code blocks (```code```)
  const parts = content.split(/(```[\s\S]*?```)/)
  
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract code and language
      const codeContent = part.slice(3, -3)
      const lines = codeContent.split('\n')
      const language = lines[0].trim() || 'javascript'
      const code = lines.slice(1).join('\n')
      
      return (
        <CodeBlock 
          key={index} 
          code={code} 
          language={language}
        />
      )
    }
    
    // Check if this part contains code patterns (fallback detection)
    const codePatterns = [
      /(let|const|var)\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /console\.log\s*\(/,
      /if\s*\(/,
      /for\s*\(/,
      /while\s*\(/,
      /return\s+/,
      /import\s+/,
      /export\s+/,
      /class\s+\w+/,
      /<[A-Z][a-zA-Z]*\s*/,
      /\.\w+\(/,
      /=>\s*{/,
      /=>\s*\w+/
    ]
    
    const hasCodePattern = codePatterns.some(pattern => pattern.test(part))
    const hasMultipleLines = part.includes('\n')
    const hasSemicolons = part.includes(';')
    const hasBrackets = part.includes('{') || part.includes('}')
    const hasParentheses = part.includes('(') && part.includes(')')
    
    // If it looks like code but isn't formatted, format it
    if (hasCodePattern && (hasMultipleLines || hasSemicolons || hasBrackets || hasParentheses)) {
      return (
        <CodeBlock 
          key={index} 
          code={part.trim()} 
          language="javascript"
        />
      )
    }
    
    // Regular text
    return (
      <p key={index} className="text-sm leading-relaxed">
        {part}
      </p>
    )
  })
}

export function ChatInterface() {
  const [personaMessages, setPersonaMessages] = useState<PersonaMessages>({
    hitesh: [
      {
        id: "hitesh-1",
        content: getRandomTemplate("hitesh", "greeting"),
        sender: "bot",
        persona: "hitesh",
        timestamp: new Date(),
        type: "normal",
      },
    ],
    piyush: [
      {
        id: "piyush-1",
        content: getRandomTemplate("piyush", "greeting"),
        sender: "bot",
        persona: "piyush",
        timestamp: new Date(),
        type: "normal",
      },
    ],
  })
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Auto-scroll whenever messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPersona, personaMessages, isLoading]);

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona)
  }

  const handleBackToSelection = () => {
    setSelectedPersona(null)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedPersona) return;

    const userMessage: Message = {
      id: `${selectedPersona}-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setPersonaMessages((prev) => ({
      ...prev,
      [selectedPersona]: [...prev[selectedPersona], userMessage],
    }));

    const messageContent = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Create streaming message
    const streamingMessageId = `${selectedPersona}-${Date.now() + 1}`;
    const streamingMessage: Message = {
      id: streamingMessageId,
      content: "▋", // Show a cursor to indicate streaming
      sender: "bot",
      persona: selectedPersona,
      timestamp: new Date(),
      type: "normal",
      isStreaming: true,
    };

    setPersonaMessages((prev) => ({
      ...prev,
      [selectedPersona]: [...prev[selectedPersona], streamingMessage],
    }));

    try {
      const conversationHistory = personaMessages[selectedPersona]
        .filter((msg) => msg.type !== "switch")
        .map((msg) => ({
          content: msg.content,
          sender: msg.sender,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          persona: selectedPersona,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;

          // Update the streaming message immediately for faster response
          setPersonaMessages((prev) => ({
            ...prev,
            [selectedPersona]: prev[selectedPersona].map((msg) =>
              msg.id === streamingMessageId
                ? { ...msg, content: accumulatedContent }
                : msg
            ),
          }));
        }
      }

      // Finalize the message
      setPersonaMessages((prev) => ({
        ...prev,
        [selectedPersona]: prev[selectedPersona].map((msg) =>
          msg.id === streamingMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ),
      }));

    } catch (error) {
      console.error("Error getting AI response:", error);

      const fallbackResponse: Message = {
        id: `${selectedPersona}-${Date.now() + 1}`,
        content: getRandomTemplate(selectedPersona, "explanation"),
        sender: "bot",
        persona: selectedPersona,
        timestamp: new Date(),
        type: "normal",
      };

      setPersonaMessages((prev) => ({
        ...prev,
        [selectedPersona]: [...prev[selectedPersona].filter(msg => msg.id !== streamingMessageId), fallbackResponse],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPersona) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cyberpunk Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-tr from-cyan-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl neon-border">
                <Cpu className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 neon-text animate-neon-flicker tracking-tight">
              NEURAL HUB
            </h1>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto leading-relaxed font-mono">
              {'>'} INITIALIZING AI MENTOR PROTOCOLS...<br/>
              {'>'} SELECT YOUR NEURAL INTERFACE<br/>
              {'>'} BEGIN COGNITIVE ENHANCEMENT
            </p>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="cyberpunk-card rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold neon-text mb-2">2 AI CORES</h3>
              <p className="text-cyan-300 text-sm font-mono">ONLINE</p>
            </div>
            <div className="cyberpunk-card rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold neon-text mb-2">100+ MODULES</h3>
              <p className="text-purple-300 text-sm font-mono">LOADED</p>
            </div>
            <div className="cyberpunk-card rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Network className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold neon-text mb-2">REAL-TIME</h3>
              <p className="text-green-300 text-sm font-mono">SYNC</p>
            </div>
            <div className="cyberpunk-card rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold neon-text mb-2">QUANTUM</h3>
              <p className="text-yellow-300 text-sm font-mono">READY</p>
            </div>
          </div>

          {/* AI Persona Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {(Object.keys(personaDefinitions) as Persona[]).map((persona) => {
              const definition = personaDefinitions[persona]
              const messageCount = personaMessages[persona].length
              const isHitesh = persona === "hitesh"

              return (
                <div
                  key={persona}
                  onClick={() => handlePersonaSelect(persona)}
                  className="cyberpunk-card rounded-xl p-8 cursor-pointer group hover:scale-[1.02] transition-all duration-500"
                >
                  {/* Holographic Overlay */}
                  <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`relative rounded-xl overflow-hidden neon-border ${isHitesh 
                        ? "bg-gradient-to-r from-cyan-400 to-purple-400" 
                        : "bg-gradient-to-r from-green-400 to-emerald-400"}`}>
                        <div className="w-24 h-24">
                          <img src={definition.avatar} alt="" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold neon-text mb-2 font-mono">{definition.fullName}</h3>
                        <p className="text-cyan-300 text-sm font-mono">{definition.teachingStyle}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400 text-xs font-mono">SYSTEM ONLINE</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-cyan-200 mb-6 leading-relaxed font-mono text-sm">{definition.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {definition.expertise.slice(0, 4).map((skill, index) => (
                        <Badge
                          key={index}
                          className={`px-3 py-1 text-xs font-mono border ${isHitesh 
                            ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/50" 
                            : "bg-green-500/20 text-green-200 border-green-400/50"}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center pt-6 border-t border-cyan-400/30">
                      <div className="flex items-center gap-2 text-sm text-cyan-300 font-mono">
                        <MessageCircle className="w-4 h-4" />
                        <span>{messageCount} DATA PACKETS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/harsh-singh-5a875128a/"
              target="_blank"
              rel="noopener noreferrer"
              className="cyberpunk-card p-4 rounded-full hover:scale-110 transition-all duration-200"
            >
              <Linkedin className="w-6 h-6 text-[#0A66C2]" />
            </a>
            <a
              href="https://x.com/harshsingh0026?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="cyberpunk-card p-4 rounded-full hover:scale-110 transition-all duration-200"
            >
              <Twitter className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://github.com/harshsinghh26"
              target="_blank"
              rel="noopener noreferrer"
              className="cyberpunk-card p-4 rounded-full hover:scale-110 transition-all duration-200"
            >
              <Github className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  const currentMessages = personaMessages[selectedPersona]
  const currentDefinition = personaDefinitions[selectedPersona]
  const isHitesh = selectedPersona === "hitesh"

  return (
    <div className="h-screen p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Cyberpunk Header */}
        <div className="cyberpunk-card rounded-xl mb-6 overflow-hidden flex-shrink-0">
          <div className={`h-1 ${isHitesh 
            ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" 
            : "bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400"}`} />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="text-cyan-300 hover:text-white hover:bg-cyan-400/20 rounded-xl font-mono"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO HUB
                </Button>
                <div className={`relative rounded-xl overflow-hidden neon-border ${isHitesh 
                  ? "bg-gradient-to-r from-cyan-400 to-purple-400" 
                  : "bg-gradient-to-r from-green-400 to-emerald-400"}`}>
                  <div className="w-16 h-16">
                    <img src={currentDefinition.avatar} alt="" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold neon-text font-mono">{currentDefinition.fullName}</h2>
                  <p className="text-sm text-cyan-300 font-mono">{currentDefinition.teachingStyle}</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-200 border border-green-400/50 font-mono font-semibold px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                NEURAL ACTIVE
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="cyberpunk-card rounded-xl overflow-hidden flex flex-col flex-1">
          {/* Messages Area */}
          <div className="overflow-y-auto p-6 chat-scroll flex-1">
            <div className="space-y-6">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 items-start ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <div className="w-12 h-12 rounded-full neon-border flex-shrink-0">
                      <img src={currentDefinition.avatar} className="rounded-full" alt="" />
                    </div>
                  )}
                  <div className={`max-w-lg ${message.sender === "user" ? "order-first" : ""}`}>
                    <div
                      className={`px-6 py-4 rounded-xl shadow-lg font-mono ${message.sender === "user"
                        ? `${isHitesh 
                          ? "bg-gradient-to-r from-cyan-600 to-purple-600" 
                          : "bg-gradient-to-r from-green-600 to-emerald-600"} text-white neon-border`
                        : "bg-black/50 backdrop-blur text-cyan-200 border border-cyan-400/30"
                        }`}
                    >
                      <div className="space-y-2">
                        {formatMessageContent(message.content)}
                        {message.isStreaming && (
                          <div className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-cyan-400 mt-2 px-2 font-mono">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} | DATA PACKET
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="w-12 h-12 flex-shrink-0 neon-border">
                      <AvatarFallback className="bg-black/50 text-cyan-300 font-mono">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}


              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-cyan-400/30 p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`> TRANSMIT TO ${currentDefinition.name.toUpperCase()}...`}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="h-14 px-6 rounded-xl bg-black/50 text-cyan-200 placeholder:text-cyan-400/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/30 backdrop-blur text-base font-mono"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`h-14 w-14 rounded-xl font-semibold shadow-lg transition-all duration-300 neon-border ${isHitesh
                  ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                  } text-white`}
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
