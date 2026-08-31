"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
} from "lucide-react";
import { formatPrice, formatDailyRate } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestedVehicleIds?: string[];
  intent?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Quels sont les véhicules disponibles à l'Aéroport d'Alger ?",
  "Quels sont les tarifs par jour et montants de caution ?",
  "Avez-vous des berlines ou SUV en boîte automatique ?",
  "Quels sont les documents obligatoires pour louer ?",
];

export function AiAssistantDrawer() {
  const {
    isAiAssistantOpen,
    closeAiAssistant,
    aiInitialPrompt,
    vehicles,
    tenantConfig,
    setSelectedVehicle,
    openRentalBookingModal,
    trackEvent,
  } = useInventory();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg_init",
      role: "assistant",
      text: `Bonjour et bienvenue chez ${tenantConfig.company.name} à Boufarik. Je suis votre Concierge IA officiel. Comment puis-je vous aider dans le choix de votre véhicule, vos dates de location ou votre prise en charge à l'Aéroport d'Alger ?`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    trackEvent("ai_assistant_query", undefined, query.slice(0, 30));

    try {
      const historyContext = messages.slice(-4).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          inventory: vehicles,
          history: historyContext,
          tenantId: tenantConfig.company.id,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        text: data.reply || `Je suis à votre disposition pour vous renseigner sur la flotte disponible chez ${tenantConfig.company.name}.`,
        suggestedVehicleIds: data.suggestedVehicleIds || [],
        intent: data.intent,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: "assistant",
          text: `Notre équipe commerciale à Boufarik reste joignable au ${tenantConfig.company.phone} ou sur WhatsApp pour toute réservation immédiate.`,
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, vehicles, tenantConfig, trackEvent]);

  const hasTriggeredPromptRef = useRef<string | null>(null);

  // If opened with initial prompt
  useEffect(() => {
    if (isAiAssistantOpen && aiInitialPrompt && hasTriggeredPromptRef.current !== aiInitialPrompt) {
      hasTriggeredPromptRef.current = aiInitialPrompt;
      const timer = setTimeout(() => {
        handleSendMessage(aiInitialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAiAssistantOpen, aiInitialPrompt, handleSendMessage]);

  // Auto-scroll
  useEffect(() => {
    if (isAiAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAiAssistantOpen]);

  if (!isAiAssistantOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeAiAssistant}
    >
      <div
        className="w-full max-w-md h-full bg-[#181818] border-l border-[#303030] shadow-none flex flex-col text-[#E8E8E8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#303030] bg-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#222222] border border-[#303030] flex items-center justify-center text-[#C62828]">
              <Sparkles className="w-4 h-4 text-[#C62828]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#FFFFFF]">
                Concierge Virtuel IA
              </h3>
              <p className="text-[11px] text-[#8A8A8A]">
                {tenantConfig.company.name} — Assistance 24/7
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAiAssistant}
            className="w-8 h-8 rounded-[6px] bg-[#222222] hover:bg-[#303030] text-[#8A8A8A] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#181818]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#303030] flex items-center justify-center text-[#C62828] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-[8px] p-3 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#C62828] text-[#FFFFFF] font-medium ml-auto"
                    : "bg-[#111111] border border-[#303030] text-[#E8E8E8]"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Suggested Vehicle Cards */}
                {msg.suggestedVehicleIds && msg.suggestedVehicleIds.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#303030] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828] block">
                      Véhicules Recommandés
                    </span>
                    {msg.suggestedVehicleIds.map((vId) => {
                      const veh = vehicles.find((v) => v.id === vId);
                      if (!veh) return null;
                      return (
                        <div
                          key={vId}
                          className="bg-[#181818] border border-[#303030] hover:border-[#C62828] p-2.5 rounded-[6px] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          onClick={() => {
                            closeAiAssistant();
                            setSelectedVehicle(veh);
                          }}
                        >
                          <div className="overflow-hidden">
                            <span className="text-[12px] font-bold text-[#FFFFFF] block truncate">
                              {veh.brand} {veh.model}
                            </span>
                            <span className="text-[11px] text-[#C62828] font-semibold">
                              {veh.dailyRate ? formatDailyRate(veh.dailyRate) : formatPrice(veh.price)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAiAssistant();
                              openRentalBookingModal(veh);
                            }}
                            className="px-2.5 py-1 bg-[#C62828] text-[#FFFFFF] text-[11px] font-bold rounded-[4px] shrink-0"
                          >
                            Réserver
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-[#E0E0E0] text-right" : "text-[#8A8A8A]"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#303030] flex items-center justify-center text-[#FFFFFF] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-[#8A8A8A] text-[12px]">
              <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#303030] flex items-center justify-center text-[#C62828] shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#111111] border border-[#303030] rounded-[8px] p-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-[#303030] bg-[#111111] flex gap-1.5 overflow-x-auto">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-[#181818] hover:bg-[#222222] border border-[#303030] text-[#B0B0B0] hover:text-[#FFFFFF] text-[11px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-[#303030] bg-[#111111] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question (français ou arabe)..."
            className="flex-1 bg-[#181818] border border-[#303030] rounded-[6px] px-3 py-2 text-[13px] text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#C62828]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 bg-[#C62828] hover:bg-[#A91F1F] disabled:opacity-40 text-[#FFFFFF] rounded-[6px] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function FloatingAiTrigger() {
  const { openAiAssistant, isAiAssistantOpen } = useInventory();

  if (isAiAssistantOpen) return null;

  return (
    <button
      onClick={() => openAiAssistant()}
      className="fixed bottom-6 right-6 z-40 h-12 px-4 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-bold text-[13px] rounded-full shadow-none flex items-center gap-2 transition-colors cursor-pointer border border-[#303030]"
      id="floating-ai-trigger"
      title="Discuter avec notre Concierge IA"
    >
      <Sparkles className="w-4 h-4 text-[#FFFFFF]" />
      <span className="hidden sm:inline">Concierge IA</span>
    </button>
  );
}
