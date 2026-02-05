
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Info, Gauge, ArrowRight, ListChecks, HelpCircle } from 'lucide-react';
import { ChatMessage, TicketClassification } from '../types';
import { getCopilotResponse, classifyTicket, CopilotResponse } from '../services/geminiService';

interface CopilotChatProps {
  onTicketSubmit: (classification: TicketClassification) => void;
}

const CopilotChat: React.FC<CopilotChatProps> = ({ onTicketSubmit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your IT Support Copilot. I've been loaded with the latest Standard Operating Procedures (SOPs). How can I help you today?",
      timestamp: new Date(),
      metadata: { sopId: 'System', confidence: 1.0 }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<TicketClassification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const result: CopilotResponse = await getCopilotResponse(chatHistory, textToSend);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        metadata: {
          sopId: result.sopId,
          confidence: result.confidence
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "An error occurred while reaching the AI engine. Please verify your connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async () => {
    setIsLoading(true);
    try {
      const historyString = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const result = await classifyTicket(historyString);
      setClassification(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTicket = () => {
    if (!classification) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onTicketSubmit(classification);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setClassification(null);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "The ticket has been successfully submitted to Tier-2 with a full log of troubleshooting steps and SLA tracking. You can track its status in 'My Tickets'.",
          timestamp: new Date(),
          metadata: { sopId: 'System', confidence: 1.0 }
        }]);
      }, 2000);
    }, 1500);
  };

  const getPriorityColor = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-50 border-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-50 border-yellow-100 text-yellow-600';
      default: return 'bg-green-50 border-green-100 text-green-600';
    }
  };

  const suggestions = [
    { label: "Wi-Fi Connectivity", icon: HelpCircle, text: "I'm having trouble connecting to the office Wi-Fi." },
    { label: "Printer Jam", icon: HelpCircle, text: "How do I fix a paper jam in the main office printer?" },
    { label: "Password Reset", icon: HelpCircle, text: "I need to reset my account password." },
    { label: "VPN Access", icon: HelpCircle, text: "Help me set up the company VPN client." }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                
                {msg.role === 'assistant' && msg.metadata && (
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      <ShieldCheck size={10} />
                      {msg.metadata.sopId}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Gauge size={10} />
                      {Math.round(msg.metadata.confidence * 100)}% Confidence
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && !classification && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">Processing...</span>
            </div>
          </div>
        )}

        {classification && (
          <div className="mt-8 bg-white border border-blue-100 rounded-3xl p-8 shadow-2xl shadow-blue-900/10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <CheckCircle2 size={24} />
                <span className="text-lg">Intelligent Escalation Report</span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">Draft Mode</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Category</label>
                <p className="text-slate-900 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">{classification.category}</p>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Priority & Urgency</label>
                <div className="flex gap-2">
                  <span className={`px-3 py-2 rounded-xl font-bold flex-1 text-center border ${getPriorityColor(classification.priority)}`}>
                    {classification.priority} Priority
                  </span>
                  <span className={`px-3 py-2 rounded-xl font-bold flex-1 text-center border ${getPriorityColor(classification.urgency)}`}>
                    {classification.urgency} Urgency
                  </span>
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Technical Summary</label>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{classification.summary}"</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                  <ListChecks size={12} />
                  Work Completed (Steps Taken)
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                  {classification.stepsTaken.length > 0 ? (
                    classification.stepsTaken.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</div>
                        <span>{step}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No troubleshooting steps recorded in this session.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button 
                onClick={handleSubmitTicket}
                disabled={isSubmitting || submitSuccess}
                className={`flex-1 py-4 px-6 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${
                  submitSuccess 
                    ? 'bg-green-600 shadow-green-600/30' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 disabled:opacity-50'
                }`}
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" size={20} />Submitting...</>
                ) : submitSuccess ? (
                  <><CheckCircle2 size={20} />Escalated to Tier-2</>
                ) : (
                  <>Confirm & Escalate Issue <ArrowRight size={18} /></>
                )}
              </button>
              <button 
                onClick={() => setClassification(null)}
                disabled={isSubmitting || submitSuccess}
                className="py-4 px-6 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Back to Chat
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shrink-0">
        {!classification && (
          <div className="space-y-4">
            {/* SOP Suggestions */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.text)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 whitespace-nowrap"
                >
                  <s.icon size={12} />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your issue here..."
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                <Send size={24} />
              </button>
              <button 
                onClick={handleEscalate}
                disabled={messages.length < 2 || isLoading}
                className="px-4 bg-orange-100 text-orange-600 rounded-2xl font-bold text-xs hover:bg-orange-200 transition-colors disabled:opacity-50"
              >
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopilotChat;
