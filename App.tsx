import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CopilotChat from "./components/CopilotChat";
import KnowledgeBase from "./components/KnowledgeBase";
import { AppView, Ticket, TicketClassification } from "./types";
import {
  Ticket as TicketIcon,
  Clock,
  ShieldAlert,
  ExternalLink,
  ListChecks,
  Timer,
} from "lucide-react";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  /* ===============================
     SLA LOGIC
  =============================== */

  const calculateSLA = (priority: string): string => {
    switch (priority) {
      case "High":
        return "2 Hours";
      case "Medium":
        return "8 Hours";
      default:
        return "24 Hours";
    }
  };

  /* ===============================
     TICKET HANDLING
  =============================== */

  const handleTicketSubmit = (classification: TicketClassification) => {
    const newTicket: Ticket = {
      ...classification,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending Tier-2",
      createdAt: new Date(),
      slaTarget: calculateSLA(classification.priority),
      slaStatus: "Healthy",
    };

    setTickets((prev) => [newTicket, ...prev]);
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-50 text-red-600";
      case "Medium":
        return "bg-yellow-50 text-yellow-600";
      default:
        return "bg-green-50 text-green-600";
    }
  };

  /* ===============================
     VIEW RENDERING
  =============================== */

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard onViewChange={setActiveView} />;

      case AppView.COPILOT:
        return <CopilotChat onTicketSubmit={handleTicketSubmit} />;

      case AppView.KNOWLEDGE_BASE:
        return <KnowledgeBase />;

      case AppView.TICKET_HISTORY:
        return (
          <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 pb-12">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Escalated Tickets
              </h1>
              <p className="text-slate-500 text-sm">
                Review escalated IT support cases and SLAs.
              </p>
            </div>

            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-3xl border shadow-sm p-8 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                          <TicketIcon size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {ticket.id}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {ticket.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                          <Clock size={12} />
                          {ticket.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Timer size={16} className="text-blue-600" />
                        <div>
                          <p className="text-[10px] uppercase text-blue-400">
                            SLA Target
                          </p>
                          <p className="font-bold text-blue-900">
                            {ticket.slaTarget}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
                        On Track
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 flex-1">
                      <p className="italic text-slate-700 mb-4">
                        "{ticket.summary}"
                      </p>

                      {ticket.stepsTaken && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <ListChecks size={12} />
                            Steps Taken
                          </p>
                          <ul className="mt-2 space-y-1">
                            {ticket.stepsTaken.map((step, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-slate-600"
                              >
                                • {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-700">
                        {ticket.status}
                      </span>
                      <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                        Details <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed">
                <ShieldAlert size={48} className="mx-auto text-slate-300 mb-6" />
                <h3 className="text-xl font-bold">No Tickets</h3>
                <p className="text-slate-500 mb-8">
                  No escalated tickets yet.
                </p>
                <button
                  onClick={() => setActiveView(AppView.COPILOT)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold"
                >
                  Open Copilot
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
