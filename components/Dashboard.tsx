
import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  Monitor,
  Wifi,
  Mail,
  Loader2,
  ShieldCheck,
  Check,
  Info,
  X
} from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagComplete, setDiagComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'Active Sessions', value: '12', icon: Users, color: 'bg-blue-100 text-blue-600', change: '+20%' },
    { label: 'Avg Resolution', value: '4m 32s', icon: Clock, color: 'bg-purple-100 text-purple-600', change: '-12%' },
    { label: 'Solved Today', value: '142', icon: CheckCircle, color: 'bg-green-100 text-green-600', change: '+8%' },
    { label: 'Pending Human', value: '7', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600', change: '-2%' },
  ];

  const recentIncidents = [
    { id: 'INC-2024-001', user: 'Sarah Jenkins', issue: 'VPN Connection Failure', status: 'Pending Tier-2', time: '12 mins ago' },
    { id: 'INC-2024-002', user: 'Michael Chen', issue: 'Slow Laptop Performance', status: 'Resolved by AI', time: '1 hour ago' },
    { id: 'INC-2024-003', user: 'Amanda Ross', issue: 'Outlook Sync Error', status: 'In Progress', time: '2 hours ago' },
  ];

  const runDiagnostics = () => {
    setIsDiagnosing(true);
    setDiagComplete(false);
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagComplete(true);
      setTimeout(() => setDiagComplete(false), 5000);
    }, 3000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Info size={24} />
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Escalation Matrix Update</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              The Escalation Matrix is currently being synchronized for Q2. 
              Please refer to the pinned Slack directory for temporary Tier-3 contacts while we finalize the automated routing.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Welcome Back, Agent</h1>
        <p className="text-slate-500 text-sm">Here's an overview of today's IT support operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
            <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Troubleshooting Workflows */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Workflows</h2>
              <button 
                onClick={() => onViewChange(AppView.COPILOT)}
                className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
              >
                Launch Copilot <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Network Connectivity', icon: Wifi, desc: 'Wi-Fi & Ethernet stability', usage: 78 },
                { name: 'System Optimization', icon: Monitor, desc: 'PC performance analysis', usage: 45 },
                { name: 'Email & Messaging', icon: Mail, desc: 'Outlook sync troubleshooting', usage: 32 },
              ].map((flow, i) => (
                <button 
                  key={i} 
                  onClick={() => onViewChange(AppView.COPILOT)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                    <flow.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{flow.name}</h4>
                    <p className="text-[11px] text-slate-500">{flow.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{flow.usage}%</p>
                    <p className="text-[10px] text-slate-400">Success</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Incident Timeline */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Recent Interactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-4 pr-4 whitespace-nowrap">ID</th>
                    <th className="pb-4 pr-4 whitespace-nowrap">Employee</th>
                    <th className="pb-4 pr-4 whitespace-nowrap">Issue</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id} className="text-xs">
                      <td className="py-4 font-mono text-slate-500 pr-4">{incident.id}</td>
                      <td className="py-4 font-medium pr-4">{incident.user}</td>
                      <td className="py-4 text-slate-600 pr-4">{incident.issue}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap ${
                          incident.status.includes('Resolved') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* System Health */}
          <div className="bg-slate-900 text-white p-6 lg:p-8 rounded-3xl shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Health Monitor</h2>
              <ShieldCheck className="text-blue-500" size={20} />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-slate-400 uppercase tracking-widest">Knowledge Sync</span>
                  <span className="font-mono text-blue-400">Online</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[94%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-slate-400 uppercase tracking-widest">Model Latency</span>
                  <span className="font-mono text-purple-400">2.1s</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[89%]"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={runDiagnostics}
              disabled={isDiagnosing}
              className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                diagComplete 
                  ? 'bg-green-600 text-white shadow-green-600/30'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
              }`}
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Auditing...
                </>
              ) : diagComplete ? (
                <>
                  <Check size={18} />
                  Diagnostic Clear
                </>
              ) : (
                'Run Diagnostics'
              )}
            </button>
          </div>

          {/* Quick Help */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <div className="space-y-3">
              <button 
                onClick={() => onViewChange(AppView.KNOWLEDGE_BASE)}
                className="w-full block p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-left group"
              >
                <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">IT Knowledge Base</p>
                <p className="text-[10px] text-slate-500">Official procedure library</p>
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full block p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-left group"
              >
                <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">Escalation Matrix</p>
                <p className="text-[10px] text-slate-500">Tier contact directory</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
