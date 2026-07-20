'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Como a Matriz de Eisenhower apoia a tomada de decisão gerencial?',
  'Tenho várias demandas acumuladas. Como classificá-las nos quadrantes?',
  'Qual a diferença entre urgente e importante no contexto organizacional?',
  'Como usar o Q2 para aumentar a eficiência estratégica da minha equipe?',
];

const EisenhowerMatrix = () => (
  <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm text-xs mb-4">
    <div className="bg-red-50 border-b border-r border-gray-200 p-3">
      <p className="font-bold text-red-600 mb-0.5">Q1 · Urgente + Importante</p>
      <p className="text-red-500 font-medium">Execute — Faça agora</p>
      <p className="text-red-400 mt-1">Crises, prazos críticos, decisões imediatas</p>
    </div>
    <div className="bg-blue-50 border-b border-gray-200 p-3">
      <p className="font-bold text-blue-600 mb-0.5">Q2 · Não urgente + Importante</p>
      <p className="text-blue-500 font-medium">Planeje — Agende</p>
      <p className="text-blue-400 mt-1">Estratégia, inovação, desenvolvimento de equipe</p>
    </div>
    <div className="bg-yellow-50 border-r border-gray-200 p-3">
      <p className="font-bold text-yellow-600 mb-0.5">Q3 · Urgente + Não importante</p>
      <p className="text-yellow-500 font-medium">Delegue</p>
      <p className="text-yellow-400 mt-1">Reuniões rotineiras, e-mails, relatórios padrão</p>
    </div>
    <div className="bg-gray-50 p-3">
      <p className="font-bold text-gray-500 mb-0.5">Q4 · Não urgente + Não importante</p>
      <p className="text-gray-400 font-medium">Elimine</p>
      <p className="text-gray-400 mt-1">Burocracia sem valor, retrabalho evitável</p>
    </div>
  </div>
);

const Page = () => {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const isStreaming = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSuggestion = (text: string) => {
    if (isStreaming) return;
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-base leading-tight">SAG — Sistema de Apoio à Gestão</h1>
          <p className="text-xs text-gray-400">Priorização com a Matriz de Eisenhower</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
            isStreaming ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
            {isStreaming ? 'Processando...' : 'Disponível'}
          </span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

        {/* Welcome screen */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg mb-1">Bem-vindo ao SAG</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Sou seu assistente especializado em <strong>Sistema de Apoio à Gestão</strong>. Utilizo a <strong>Matriz de Eisenhower</strong> para ajudá-lo a priorizar demandas, delegar com inteligência e focar no que gera mais valor estratégico para a sua organização.
                  </p>
                </div>
              </div>
            </div>

            <EisenhowerMatrix />

            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">Perguntas frequentes</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="w-full text-sm text-left px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 transition-all shadow-sm"
                >
                  {s} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 max-w-2xl mx-auto ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
              message.role === 'user'
                ? 'bg-slate-700 text-white'
                : 'bg-gradient-to-br from-slate-600 to-slate-900 text-white'
            }`}>
              {message.role === 'user' ? 'VC' : 'SAG'}
            </div>

            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
              message.role === 'user'
                ? 'bg-slate-700 text-white rounded-tr-sm'
                : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
            }`}>
              {message.parts.map((part, index) =>
                part.type === 'text' ? <span key={index}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {status === 'submitted' && (
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              SAG
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            Erro ao processar a solicitação. Verifique sua API key e tente novamente.
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="Descreva suas demandas ou faça uma pergunta sobre gestão... (Enter para enviar)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:opacity-50 bg-gray-50 overflow-y-auto"
            style={{ minHeight: '42px' }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">Shift+Enter para nova linha</p>
      </footer>
    </div>
  );
};

export default Page;
