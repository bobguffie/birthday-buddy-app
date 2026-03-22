import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  PlusCircle, 
  Settings,
  Gift,
  Search,
  ShoppingBag,
  Download,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { cn, openExternalLink } from './utils';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactDetail from './components/ContactDetail';
import BalloonBackground from './components/BalloonBackground';
import ImportBirthdays from './components/ImportBirthdays';
import Shop from './components/Shop';
import NotificationToast from './components/NotificationToast';
import { db } from './db';
import { getDaysUntilBirthday } from './utils';
import { Person } from './types';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { initializeAdMob, AdBanner, showInterstitial } from './components/AdMob';
import PrivacyPolicy from './components/PrivacyPolicy';

const SearchContext = createContext<{ searchQuery: string, setSearchQuery: (q: string) => void }>({
  searchQuery: '',
  setSearchQuery: () => {}
});

export const useSearch = () => useContext(SearchContext);

function NavItem({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const handleClick = () => {
    if (Math.random() > 0.7) {
      showInterstitial();
    }
  };
  
  return (
    <Link 
      to={to} 
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300",
        isActive ? "text-rose-600 scale-110" : "text-slate-500 hover:text-rose-400"
      )}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-wider font-display">{label}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationPerson, setNotificationPerson] = useState<Person | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    initializeAdMob();
  }, []);

  useEffect(() => {
    // Check for birthdays today
    const checkBirthdays = async () => {
      const people = await db.people.toArray();
      const todayBirthday = people.find(p => getDaysUntilBirthday(p.birthday) === 0);
      
      if (todayBirthday) {
        setNotificationPerson(todayBirthday);
        
        // Native notification if on mobile
        if (Capacitor.isNativePlatform()) {
          const hasPermission = await LocalNotifications.checkPermissions();
          if (hasPermission.display !== 'granted') {
            await LocalNotifications.requestPermissions();
          }
          
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Birthday Alert! 🎂",
                body: `It's ${todayBirthday.name}'s birthday today! Don't forget to send a gift.`,
                id: 1,
                schedule: { at: new Date(Date.now() + 1000) },
                sound: undefined,
                attachments: undefined,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        }
      }
    };
    checkBirthdays();
  }, []);

  // Monthly backup reminder
  useEffect(() => {
    const lastBackup = localStorage.getItem('last_backup_date');
    if (!lastBackup) {
      localStorage.setItem('last_backup_date', new Date().toISOString());
      return;
    }

    const lastDate = new Date(lastBackup);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 30) {
      // Show a reminder in settings or as a toast
      console.log("Monthly backup reminder: It's been 30 days since your last backup.");
    }
  }, []);

  const handleExport = async () => {
    const people = await db.people.toArray();
    const dataStr = JSON.stringify(people, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const exportFileDefaultName = `birthday-buddy-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
    localStorage.setItem('last_backup_date', new Date().toISOString());
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) throw new Error("Invalid backup format");
        
        // Basic validation
        if (json.length > 0 && (!json[0].name || !json[0].birthday)) {
          throw new Error("Invalid data structure");
        }

        await db.people.clear();
        await db.people.bulkAdd(json.map(({id, ...rest}: any) => rest));
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => {
          setImportSuccess(false);
          window.location.reload(); // Reload to refresh data
        }, 2000);
      } catch (err) {
        setImportError("Failed to import: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    };
    reader.readAsText(file);
  };

  if (isPrivacyOpen) {
    return <PrivacyPolicy onBack={() => setIsPrivacyOpen(false)} />;
  }

  return (
    <div className={cn(
      "min-h-screen pb-24 font-sans text-slate-900 transition-colors duration-500",
      isHome ? "bg-celebration" : "bg-slate-50"
    )}>
      <BalloonBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/20 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-lg shadow-rose-200"
            >
              <Gift size={22} />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-display">Birthday Buddy</h1>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn("transition-colors", isSearchOpen ? "text-rose-600" : "text-slate-500 hover:text-rose-500")}
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-500 hover:text-rose-500 transition-colors"
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white/60 backdrop-blur-md border-b border-white/20"
            >
              <div className="mx-auto max-w-2xl p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search birthdays..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {notificationPerson && (
          <NotificationToast 
            person={notificationPerson} 
            onClose={() => setNotificationPerson(null)} 
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-slate-800">Settings</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-full p-2 hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Link 
                    to="/import" 
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 transition-colors group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Download size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Import Birthdays</p>
                      <p className="text-xs text-slate-500">Facebook or CSV import</p>
                    </div>
                  </Link>

                  <button 
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsPrivacyOpen(true);
                    }}
                    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Shield size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Privacy Policy</p>
                      <p className="text-xs text-slate-500">Data & Ads information</p>
                    </div>
                  </button>

                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Backup Data</p>
                      <p className="text-xs text-slate-500">Export as JSON file</p>
                    </div>
                  </button>

                  <label className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group cursor-pointer">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Download size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Restore Backup</p>
                      <p className="text-xs text-slate-500">Import from JSON file</p>
                    </div>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>

                {importError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
                    <AlertCircle size={14} />
                    {importError}
                  </div>
                )}

                {importSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    Data restored successfully!
                  </div>
                )}
                
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 text-slate-500">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Shield size={14} className="text-rose-500" />
                      Privacy Notice
                    </h4>
                    <p className="text-[10px] leading-relaxed font-medium">
                      This app collects anonymous usage data (such as gift link clicks) to improve suggestions. No personal data is shared.
                    </p>
                    <button 
                      onClick={() => {
                        setIsSettingsOpen(false);
                        setIsPrivacyOpen(true);
                      }}
                      className="mt-2 text-[10px] font-bold text-rose-600 underline"
                    >
                      Read Full Privacy Policy
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">App Info</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Version</span>
                      <span className="font-bold text-slate-800">1.3.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl p-4 relative z-10">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl justify-around py-2">
          <NavItem to="/" icon={LayoutDashboard} label="Home" />
          <NavItem to="/calendar" icon={CalendarIcon} label="Calendar" />
          <NavItem to="/add" icon={PlusCircle} label="Add" />
          <NavItem to="/contacts" icon={Users} label="People" />
          <NavItem to="/shop" icon={ShoppingBag} label="Shop" />
        </div>
      </nav>
      <AdBanner />
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/add" element={<ContactForm />} />
            <Route path="/edit/:id" element={<ContactForm />} />
            <Route path="/person/:id" element={<ContactDetail />} />
            <Route path="/import" element={<ImportBirthdays />} />
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SearchContext.Provider>
  );
}
