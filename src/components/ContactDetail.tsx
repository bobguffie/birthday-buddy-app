import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  getDaysUntilBirthday, 
  calculateAge, 
  formatBirthday, 
  getCategoryColor, 
  getPriorityColor,
  generateGoogleUrl,
  getGiftSearchPhrase,
  getRandomGiftCategories,
  openExternalLink,
  handleAmazonClick,
  cn 
} from '../utils';
import { 
  ChevronLeft, 
  Edit2, 
  Gift, 
  ExternalLink, 
  Calendar, 
  Tag, 
  StickyNote, 
  DollarSign, 
  History,
  Search,
  Sparkles,
  Pin
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [randomCategories, setRandomCategories] = useState<string[]>(getRandomGiftCategories());
  
  const person = useLiveQuery(() => db.people.get(Number(id)), [id]);

  if (!person) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
      <p className="text-slate-500 font-display font-bold">Inflating balloons...</p>
    </div>
  );

  const daysUntil = getDaysUntilBirthday(person.birthday);
  const age = calculateAge(person.birthday) + (daysUntil === 0 ? 0 : 1);
  const searchPhrase = getGiftSearchPhrase(person);

  const handleSurpriseMe = () => {
    setRandomCategories(getRandomGiftCategories());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold font-display">Back</span>
        </button>
        <div className="flex items-center gap-2">
          {person.isPinned && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest border border-rose-100">
              <Pin size={12} className="fill-current" />
              Pinned
            </div>
          )}
          <Link 
            to={`/edit/${person.id}`}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 card-shadow border border-white/50 hover:border-rose-200 hover:text-rose-600 transition-all font-display"
          >
            <Edit2 size={16} />
            Edit
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 card-shadow border border-white/50">
        <div className={cn(
          "absolute top-0 right-0 h-40 w-40 -mr-10 -mt-10 rounded-full opacity-10",
          getCategoryColor(person.category)
        )} />
        
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className={cn(
              "flex h-28 w-28 items-center justify-center rounded-[2.5rem] text-white font-bold text-4xl shadow-2xl relative overflow-hidden",
              getCategoryColor(person.category)
            )}
          >
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
            ) : (
              person.name.charAt(0)
            )}
            {/* Balloon String */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200" />
          </motion.div>
          
          <div className="pt-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-3xl font-bold text-slate-800 font-display">{person.name}</h2>
              <span className={cn(
                "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm",
                getCategoryColor(person.category)
              )}>
                {person.category} • {person.priority} Priority
              </span>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-1">
                  <Calendar size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">{formatBirthday(person.birthday)}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Birthday</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-1">
                  <Gift size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">Turning {age}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className={cn(
            "flex items-center justify-between rounded-[2rem] p-6",
            daysUntil === 0 ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg" : "bg-slate-50 border border-slate-100"
          )}>
            <div>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                daysUntil === 0 ? "text-white/80" : "text-slate-400"
              )}>Next Celebration</p>
              <p className={cn(
                "text-xl font-bold font-display",
                daysUntil === 0 ? "text-white" : "text-slate-800"
              )}>
                {daysUntil === 0 ? "TODAY! 🎂🎉" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
              </p>
            </div>
            {daysUntil > 0 && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Countdown</p>
                <p className="text-xl font-bold text-slate-800 font-display">{daysUntil} Days</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Smart Suggestion - MOVED UP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Sparkles size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 font-display">Smart Suggestion ✨</h3>
          </div>
          <button 
            onClick={handleSurpriseMe}
            className="text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-full hover:bg-rose-100 transition-colors"
          >
            Refresh Ideas 🎲
          </button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => handleAmazonClick(searchPhrase, person.category)}
          className="w-full text-left flex items-center justify-between rounded-[2rem] bg-gradient-to-r from-amber-50 to-orange-50 p-6 border border-amber-100 group transition-all card-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
              <Search size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-display">Top Pick for {person.name}</p>
              <p className="font-bold text-slate-800 text-lg font-display">"{searchPhrase}"</p>
            </div>
          </div>
          <ExternalLink size={20} className="text-amber-400 group-hover:text-amber-600 transition-colors" />
        </motion.button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Notes */}
        <div className="rounded-[2.5rem] bg-white p-8 card-shadow border border-white/50">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
              <StickyNote size={20} />
            </div>
            <h3 className="font-bold font-display text-lg">Wishes & Notes</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {person.notes || "No special notes yet... maybe add some gift ideas? 🎁"}
          </p>
        </div>

        {/* Tags */}
        <div className="rounded-[2.5rem] bg-white p-8 card-shadow border border-white/50">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Tag size={20} />
            </div>
            <h3 className="font-bold font-display text-lg">Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {person.tags.length > 0 ? (
              person.tags.map(tag => (
                <span key={tag} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
                  #{tag}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic font-medium">No interests tagged yet.</p>
            )}
          </div>
        </div>

        {/* Suggestion Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {randomCategories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAmazonClick(`${cat} for ${person.name}`, person.category)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-slate-600 card-shadow hover:border-rose-200 hover:text-rose-600 transition-all"
            >
              <Gift size={14} />
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Gift History - MOVED BELOW SUGGESTIONS */}
        <div className="rounded-[2.5rem] bg-white p-8 card-shadow border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-slate-800">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                <History size={20} />
              </div>
              <h3 className="font-bold font-display text-lg">Gift History</h3>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <DollarSign size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Year</p>
                <p className="text-sm font-bold text-slate-800">{person.lastGift || "No record yet"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</p>
                <p className="text-sm font-bold text-slate-800">{person.budget ? `£${person.budget}` : "Unlimited"}</p>
              </div>
            </div>
            
            {person.giftHistory && person.giftHistory.length > 0 && (
              <div className="space-y-2">
                {person.giftHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2 text-xs">
                    <span className="text-slate-400 font-bold">{item.year}</span>
                    <span className="text-slate-600 font-medium">{item.gift}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Google Ideas - AT THE BOTTOM */}
        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={async () => await openExternalLink(generateGoogleUrl(searchPhrase), `Google: ${searchPhrase}`, person.category)}
          className="w-full text-left flex items-center justify-between rounded-[2rem] bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border border-blue-100 group transition-all card-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
              <Search size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 font-display">Google Ideas</p>
              <p className="font-bold text-slate-800 text-lg font-display">Inspiration for {person.name}</p>
            </div>
          </div>
          <ExternalLink size={20} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
        </motion.button>
      </div>
    </motion.div>
  );
}
