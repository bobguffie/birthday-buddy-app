import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Category, Priority } from '../types';
import { 
  getDaysUntilBirthday, 
  calculateAge, 
  formatBirthday, 
  getCategoryColor, 
  cn 
} from '../utils';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, UserPlus, SlidersHorizontal, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearch } from '../App';

const CATEGORIES: (Category | 'All')[] = ['All', 'Family', 'Friend', 'Work', 'Other'];
const MONTHS = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ContactList() {
  const { searchQuery } = useSearch();
  const [search, setSearch] = useState(searchQuery);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Sync internal search with hook
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const people = useLiveQuery(() => db.people.toArray());

  if (!people) return null;

  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesMonth = monthFilter === 'All' || 
                        MONTHS[p.birthday.getMonth() + 1] === monthFilter;
    
    return matchesSearch && matchesCategory && matchesMonth;
  }).sort((a, b) => {
    // Pinned people first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by days until birthday
    return getDaysUntilBirthday(a.birthday) - getDaysUntilBirthday(b.birthday);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Birthday Buddies 🎈</h2>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search buddies..."
              className="w-full rounded-[1.5rem] bg-white border-none pl-11 pr-4 py-4 text-slate-800 card-shadow focus:ring-2 focus:ring-rose-500 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-[1.5rem] transition-all card-shadow",
              showFilters ? "bg-rose-600 text-white" : "bg-white text-slate-500 hover:text-slate-800"
            )}
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-[2rem] card-shadow border border-white/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 font-display">Category</label>
                  <select 
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-50 border-none px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-rose-500 appearance-none font-bold"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 font-display">Month</label>
                  <select 
                    value={monthFilter}
                    onChange={e => setMonthFilter(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border-none px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-rose-500 appearance-none font-bold"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredPeople.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-white/50 p-6 text-slate-300 shadow-inner">
              <Search size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 font-display">No buddies found!</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Try searching for something else 🎈</p>
          </div>
        ) : (
          filteredPeople.map((person, index) => {
            const daysUntil = getDaysUntilBirthday(person.birthday);
            const age = calculateAge(person.birthday) + (daysUntil === 0 ? 0 : 1);
            
            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Link 
                  to={`/person/${person.id}`}
                  className="group flex items-center justify-between rounded-[2rem] bg-white p-5 card-shadow border border-white/50 transition-all hover:border-rose-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl text-white font-bold text-xl shadow-lg relative overflow-hidden",
                      getCategoryColor(person.category)
                    )}>
                      {person.photo ? (
                        <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                      ) : (
                        person.name.charAt(0)
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-lg font-display group-hover:text-rose-600 transition-colors">{person.name}</h3>
                        {person.isPinned && <Pin size={12} className="text-rose-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider",
                          getCategoryColor(person.category)
                        )}>
                          {person.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{formatBirthday(person.birthday)} • {age} yrs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "rounded-2xl px-4 py-2 text-xs font-bold font-display shadow-sm",
                      daysUntil === 0 
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white" 
                        : daysUntil <= 7 
                          ? "bg-amber-100 text-amber-600" 
                          : "bg-slate-100 text-slate-500"
                    )}>
                      {daysUntil === 0 ? "TODAY" : `${daysUntil}d`}
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
