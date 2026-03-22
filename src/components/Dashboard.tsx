import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  getDaysUntilBirthday, 
  calculateAge, 
  formatBirthday, 
  getCategoryColor, 
  getCategoryGradient,
  cn 
} from '../utils';
import { Link } from 'react-router-dom';
import { Gift, ChevronRight, Calendar as CalendarIcon, Users, PartyPopper, Sparkles, Pin } from 'lucide-react';
import { motion } from 'motion/react';
import { useSearch } from '../App';

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const people = useLiveQuery(() => db.people.toArray());

  if (!people) return null;

  const filteredPeople = searchQuery 
    ? people.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : people;

  const upcomingBirthdays = [...filteredPeople]
    .sort((a, b) => {
      // Pinned people first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by days until birthday
      return getDaysUntilBirthday(a.birthday) - getDaysUntilBirthday(b.birthday);
    })
    .slice(0, 5);

  const birthdaysThisMonth = people.filter(p => {
    const today = new Date();
    return p.birthday.getMonth() === today.getMonth();
  }).length;

  const todayBirthdays = people.filter(p => getDaysUntilBirthday(p.birthday) === 0);

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 p-8 text-white shadow-2xl shadow-rose-200"
      >
        <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
          <PartyPopper size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-300 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-widest font-display opacity-90">Good Morning!</span>
          </div>
          <h2 className="text-3xl font-bold font-display leading-tight">
            {todayBirthdays.length > 0 
              ? `It's time to celebrate! 🎂` 
              : `Ready for the next birthday? 🎈`}
          </h2>
          {todayBirthdays.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {todayBirthdays.map(p => (
                <div key={p.id} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                  🎉 {p.name}'s Birthday!
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-[2rem] bg-white p-6 card-shadow border border-white/50"
        >
          <div className="flex items-center gap-3 text-rose-500 mb-2">
            <Users size={24} />
            <span className="text-xs font-bold uppercase tracking-widest font-display">Buddies</span>
          </div>
          <div className="text-4xl font-bold text-slate-800 font-display">{people.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total tracked</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-[2rem] bg-white p-6 card-shadow border border-white/50"
        >
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <CalendarIcon size={24} />
            <span className="text-xs font-bold uppercase tracking-widest font-display">This Month</span>
          </div>
          <div className="text-4xl font-bold text-slate-800 font-display">{birthdaysThisMonth}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Birthdays in {new Date().toLocaleString('default', { month: 'long' })}</div>
        </motion.div>
      </div>

      {/* Upcoming Section */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-800 font-display">Upcoming Birthdays 🎁</h2>
          <Link to="/contacts" className="text-sm font-bold text-rose-600 hover:text-rose-700 font-display">See All</Link>
        </div>

        {people.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white/60 backdrop-blur-sm p-12 text-center border-4 border-dashed border-white shadow-inner">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-4 rounded-full bg-rose-100 p-6 text-rose-500"
            >
              <Gift size={48} />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-800 font-display">Your list is empty!</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs font-medium">Add your first birthday buddy to start the celebration.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBirthdays.map((person, index) => {
              const daysUntil = getDaysUntilBirthday(person.birthday);
              const age = calculateAge(person.birthday) + (daysUntil === 0 ? 0 : 1);
              
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                        {/* Small Balloon String */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 text-lg font-display group-hover:text-rose-600 transition-colors">{person.name}</h3>
                          {person.isPinned && <Pin size={12} className="text-rose-500 fill-current" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider",
                            getCategoryColor(person.category)
                          )}>
                            {person.category}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            {formatBirthday(person.birthday)} • {age} yrs
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "rounded-2xl px-4 py-2 text-xs font-bold font-display shadow-sm",
                        daysUntil === 0 
                          ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white animate-pulse" 
                          : daysUntil <= 7 
                            ? "bg-amber-100 text-amber-600" 
                            : "bg-slate-100 text-slate-500"
                      )}>
                        {daysUntil === 0 ? "TODAY! 🎂" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function PlusCircle({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
