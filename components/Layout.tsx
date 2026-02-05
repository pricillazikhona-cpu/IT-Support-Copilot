
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Ticket, 
  Settings, 
  LogOut,
  ShieldCheck,
  Cpu,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.COPILOT, label: 'IT Copilot', icon: MessageSquare },
    { id: AppView.KNOWLEDGE_BASE, label: 'Knowledge Base', icon: BookOpen },
    { id: AppView.TICKET_HISTORY, label: 'My Tickets', icon: Ticket },
  ];

  const handleNav = (view: AppView) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const getActiveLabel = () => {
    const item = menuItems.find(i => i.id === activeView);
    return item ? item.label : 'SupportFlow';
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Cpu size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-white">SupportFlow</h1>
          <p className="text-xs text-slate-400">IT Copilot v1.0</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
          <ShieldCheck size={20} />
          <div className="text-xs">
            <p className="text-white font-medium">Zikhona Pricilla</p>
            <p>Senior IT Analyst</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSignOut(true)}
          className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
                <Settings size={24} />
              </div>
              <button onClick={() => setShowSettings(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">System Settings</h3>
            <p className="text-slate-500 text-sm mb-6">Configuration options for the AI Copilot and ITSM integration.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Admin Panel</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locked</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Model Temperature</span>
                  <span className="text-xs font-mono text-blue-600">0.4</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-blue-600"></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Out?</h3>
              <p className="text-slate-500 text-sm mb-8">Your current active session will be cleared. Any unsaved escalation drafts will be lost.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowSignOut(false)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Confirm Sign Out
                </button>
                <button 
                  onClick={() => setShowSignOut(false)}
                  className="w-full bg-white text-slate-500 py-3 rounded-2xl font-bold hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden lg:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-72 h-full bg-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold capitalize hidden sm:block">
              {getActiveLabel()}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Live</span>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative group">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-slate-900 mb-2">Notifications</p>
                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-blue-600 mt-0.5" />
                  <p className="text-[11px] text-blue-800 leading-tight">All systems operational. Knowledge base sync successful.</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
