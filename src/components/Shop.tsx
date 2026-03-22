import { motion } from 'motion/react';
import { ShoppingBag, ExternalLink, Gift, Sparkles, Search, Calendar } from 'lucide-react';
import { openExternalLink, handleAmazonClick, getGiftSearchPhrase, getDaysUntilBirthday, formatBirthday } from '../utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export default function Shop() {
  const people = useLiveQuery(() => db.people.toArray());

  // Sort people by days until birthday
  const upcomingBirthdays = people?.sort((a, b) => {
    return getDaysUntilBirthday(a.birthday) - getDaysUntilBirthday(b.birthday);
  }) || [];

  return (
    <div className="space-y-6">
      <header className="text-center py-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 mb-4"
        >
          <ShoppingBag size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold font-display text-slate-800">Gift Shop</h2>
        <p className="text-slate-500 mt-2">Personalised suggestions for your favorite people</p>
      </header>

      <div className="grid gap-6">
        {upcomingBirthdays.length > 0 ? (
          upcomingBirthdays.map((person, index) => {
            const searchPhrase = getGiftSearchPhrase(person);
            const daysUntil = getDaysUntilBirthday(person.birthday);
            
            return (
              <motion.div
                key={person.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 overflow-hidden">
                      {person.photo ? (
                        <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-bold">{person.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{person.name}'s Birthday</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar size={12} />
                        <span>{formatBirthday(person.birthday)}</span>
                        <span className="text-rose-500 font-bold">
                          {daysUntil === 0 ? "Today!" : `In ${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="text-amber-400" size={20} />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Smart Suggestion</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAmazonClick(searchPhrase, person.category)}
                    className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <Search size={16} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">"{searchPhrase}"</span>
                    </div>
                    <ExternalLink size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </motion.button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAmazonClick(`birthday gift for ${person.name}`, person.category)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Gift size={14} />
                    General Ideas
                  </button>
                  <button 
                    onClick={() => handleAmazonClick(`${person.category} gifts`, person.category)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <ShoppingBag size={14} />
                    {person.category} Gifts
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 px-6 rounded-[2.5rem] bg-slate-50 border border-dashed border-slate-200">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Gift size={32} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">No Birthdays Yet</h3>
            <p className="text-sm text-slate-500 mb-6">Add someone to see personalised gift suggestions here!</p>
            <button 
              onClick={() => window.location.href = '/add'}
              className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
            >
              Add First Person
            </button>
          </div>
        )}
      </div>

      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 text-white mt-8">
        <h4 className="font-bold mb-2">Affiliate Disclosure</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Some of the links above are affiliate links, meaning at no additional cost to you, we may earn a commission if you click through and make a purchase.
        </p>
      </div>
    </div>
  );
}
