import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  format,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Gift, PartyPopper } from 'lucide-react';
import { cn, getCategoryColor } from '../utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const people = useLiveQuery(() => db.people.toArray());

  if (!people) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getBirthdaysForDay = (day: Date) => {
    return people.filter(p => 
      p.birthday.getMonth() === day.getMonth() && 
      p.birthday.getDate() === day.getDate()
    );
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectedBirthdays = selectedDay ? getBirthdaysForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Party Calendar 📅</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 card-shadow border border-white/50 hover:text-rose-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-[120px] text-center font-bold text-slate-800 font-display">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button 
            onClick={nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 card-shadow border border-white/50 hover:text-rose-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-[2.5rem] bg-white/80 backdrop-blur-md p-6 card-shadow border border-white/50">
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 py-2 font-display">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const birthdays = getBirthdaysForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const today = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-2xl transition-all duration-300",
                  !isCurrentMonth && "opacity-20",
                  isSelected ? "bg-rose-600 text-white shadow-lg shadow-rose-200 scale-110 z-10" : "hover:bg-rose-50",
                  today && !isSelected && "bg-rose-100 text-rose-600"
                )}
              >
                <span className={cn(
                  "text-sm font-bold font-display",
                  isSelected ? "text-white" : today ? "text-rose-600" : "text-slate-700"
                )}>
                  {format(day, 'd')}
                </span>
                
                {birthdays.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex">
                    <motion.div 
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                      className={cn(
                        "h-4 w-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center",
                        isSelected ? "bg-white" : getCategoryColor(birthdays[0].category)
                      )}
                    >
                      <div className={cn(
                        "h-1 w-0.5 bg-white/50 absolute top-full left-1/2 -translate-x-1/2",
                        isSelected && "bg-rose-300"
                      )} />
                    </motion.div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDay.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 font-display text-lg">
                {isToday(selectedDay) ? "Today's Parties 🎂" : `Parties on ${format(selectedDay, 'MMMM do')} 🎈`}
              </h3>
              {selectedBirthdays.length > 0 && (
                <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
                  {selectedBirthdays.length} {selectedBirthdays.length === 1 ? 'Buddy' : 'Buddies'}
                </span>
              )}
            </div>

            {selectedBirthdays.length === 0 ? (
              <div className="rounded-[2rem] bg-white/40 backdrop-blur-sm p-8 text-center border-2 border-dashed border-white">
                <p className="text-sm text-slate-400 font-bold font-display italic">Quiet day... no birthdays found! 😴</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedBirthdays.map(person => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link 
                      to={`/person/${person.id}`}
                      className="flex items-center justify-between rounded-[2rem] bg-white p-5 card-shadow border border-white/50 hover:border-rose-200 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-md",
                          getCategoryColor(person.category)
                        )}>
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-lg font-display">{person.name}</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{person.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                          <Gift size={20} />
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
