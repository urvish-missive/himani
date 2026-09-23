import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { askChatbot, type ChatMessage } from '../lib/chatProviders';
import { useToast } from './ui/Feedback';
import { useChatbot } from '../context/ChatbotContext';

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm here to help with questions about Himani's consulting, coaching, corporate training, or speaking work. What would you like to explore?",
};

const QUICK_PROMPTS = [
  '🎯 What is GEO & AI Search?',
  '🚀 How does 1:1 Executive Coaching work?',
  '📊 Audit my B2B SaaS organic growth',
];

function StreamedMessage({
  content,
  isLatestAssistant,
  onComplete,
}: {
  content: string;
  isLatestAssistant: boolean;
  onComplete?: () => void;
}) {
  const [displayedLength, setDisplayedLength] = useState(isLatestAssistant ? 0 : content.length);

  useEffect(() => {
    if (!isLatestAssistant) {
      setDisplayedLength(content.length);
      return;
    }

    setDisplayedLength(0);
    const charsPerStep = Math.max(2, Math.floor(content.length / 45));
    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + charsPerStep;
        if (next >= content.length) {
          clearInterval(interval);
          onComplete?.();
          return content.length;
        }
        return next;
      });
    }, 18);

    return () => clearInterval(interval);
  }, [content, isLatestAssistant]);

  const visibleText = isLatestAssistant ? content.slice(0, displayedLength) : content;
  const isTyping = isLatestAssistant && displayedLength < content.length;

  return (
    <span className="whitespace-pre-line">
      {visibleText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-purple rounded-xs animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function Chatbot() {
  const toast = useToast();
  const { isOpen: open, setIsOpen: setOpen, isHireBarVisible } = useChatbot();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll on new message or loading change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort?.();
      }
    };
  }, []);

function getIndianFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Specifically match Indian English female voice names (Neerja, Heera, Veena, Kavya, Lekha, Swara)
  const indianFemaleNames = ['neerja', 'heera', 'veena', 'kavya', 'lekha', 'swara', 'priya', 'anjali'];
  const matchedIndianFemale = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const isIndian = lang.includes('en-in') || lang.includes('hi-in') || name.includes('india');
    return isIndian && (indianFemaleNames.some((n) => name.includes(n)) || name.includes('female'));
  });
  if (matchedIndianFemale) return matchedIndianFemale;

  // 2. Any voice specifically configured for English (India)
  const indianVoice = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang === 'en-in' || lang.startsWith('en-in') || v.name.toLowerCase().includes('india');
  });
  if (indianVoice) return indianVoice;

  // 3. Natural English female voice fallback
  const femaleFallbacks = ['zira', 'samantha', 'victoria', 'karen', 'moira', 'female'];
  const englishFemale = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    return lang.startsWith('en') && femaleFallbacks.some((f) => name.includes(f));
  });
  if (englishFemale) return englishFemale;

  return voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) || voices[0] || null;
}

  // Pre-load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Text-to-speech speaker function (Female Indian Voice)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech output
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voice = getIndianFemaleVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Natural, warm conversational pitch for female voice
    utterance.pitch = 1.12;
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice speech recognition (en-IN)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.info('Voice input works in Chrome, Edge and Safari. You can still type your question.', {
        title: "This browser can't listen",
      });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Stop speaking if currently speaking
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          sendMessage(transcript);
        }
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    // Stop previous voice synthesis if user submits new message
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const nextMessages = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await askChatbot(nextMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      speakText(reply);
    } catch (err) {
      const fallbackReply =
        "Sorry, I couldn't connect just now. Please reach out directly using the \"Work With Me\" button instead.";
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackReply,
        },
      ]);
      speakText(fallbackReply);
      console.error('Chatbot error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([GREETING]);
    setInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 16 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-purple to-orange text-white shadow-lg shadow-purple/30 items-center justify-center cursor-pointer group ${
          isHireBarVisible ? 'hidden md:flex' : 'flex'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
            className="flex"
          >
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.span>
        </AnimatePresence>

        {/* Pulse ring indicator */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange" />
          </span>
        )}
      </motion.button>

      {/* Main Chatbox Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed z-[60] bottom-20 sm:bottom-22 right-4 left-4 sm:left-auto sm:right-6 sm:w-[395px] h-[min(510px,calc(100dvh-7rem))] max-h-[calc(100dvh-7rem)] rounded-3xl border border-purple/15 bg-white shadow-2xl shadow-purple/20 flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-purple to-orange text-white shrink-0 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                  {isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate leading-tight">Himani's AI Assistant</p>
                    {isSpeaking && (
                      <span className="flex items-center gap-0.5 h-3 ml-1 text-white/90">
                        <span className="w-0.5 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms] h-2" />
                        <span className="w-0.5 bg-white rounded-full animate-[bounce_0.8s_infinite_200ms] h-3" />
                        <span className="w-0.5 bg-white rounded-full animate-[bounce_0.8s_infinite_300ms] h-1.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 truncate">Organic Growth & GEO Specialist</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Voice Output Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                    setSoundEnabled((v) => !v);
                  }}
                  title={soundEnabled ? 'Mute AI Voice Replies' : 'Enable AI Voice Replies'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-white/30 text-white' : 'hover:bg-white/15 text-white/80'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset Chat */}
                <button
                  type="button"
                  onClick={resetChat}
                  title="Restart Conversation"
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close Chat"
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-bg">
              {messages.map((msg, i) => {
                const isLatestAssistant =
                  msg.role === 'assistant' && i === messages.length - 1 && !loading;

                return (
                  <div key={i} className="space-y-2.5">
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-purple to-orange text-white rounded-br-xs'
                            : 'bg-white border border-purple/10 text-primary rounded-bl-xs'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <StreamedMessage
                            content={msg.content}
                            isLatestAssistant={isLatestAssistant}
                            onComplete={() => {
                              scrollRef.current?.scrollTo({
                                top: scrollRef.current.scrollHeight,
                                behavior: 'smooth',
                              });
                            }}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>

                    {/* Agent asks suggested questions directly inside the chat */}
                    {msg.role === 'assistant' && i === 0 && messages.length === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.25 }}
                        className="space-y-2 pt-1 pb-1"
                      >
                        <p className="text-[11px] font-semibold text-secondary flex items-center gap-1.5 uppercase tracking-wider pl-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple" /> Tap a question to ask:
                        </p>
                        <div className="flex flex-col gap-2">
                          {QUICK_PROMPTS.map((prompt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              disabled={loading}
                              onClick={() => sendMessage(prompt)}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-purple/5 border border-purple/15 hover:border-purple/35 text-primary text-xs font-medium transition-all hover:translate-x-1 cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-between group"
                            >
                              <span className="leading-snug pr-2 text-primary/90 group-hover:text-primary">
                                {prompt}
                              </span>
                              <span className="text-purple/50 group-hover:text-purple text-xs font-semibold shrink-0 transition-colors">
                                Ask →
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl rounded-bl-xs bg-white border border-purple/10 text-secondary flex items-center gap-2 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-purple" />
                    <span>Analyzing & generating answer…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Listening Banner if Speech-to-Text active */}
            {isListening && (
              <div className="px-4 py-2 bg-gradient-to-r from-purple/10 to-orange/10 border-t border-purple/15 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-medium text-purple">Listening to your question... Speak now</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-xs text-red-500 font-semibold hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-purple/10 bg-white shrink-0">
              <div className="flex items-center gap-2">
                {/* Voice Input (Speech-to-Text) Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? 'Stop listening' : 'Speak your question'}
                  className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-bounce shadow-md shadow-red-500/30'
                      : 'bg-purple/10 hover:bg-purple/15 text-purple'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isListening ? 'Listening...' : 'Type or ask a question…'}
                  className="flex-1 min-w-0 h-11 px-4 rounded-full border border-purple/15 bg-bg text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:border-purple/40 transition-colors"
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-purple to-orange text-white flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-purple/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
