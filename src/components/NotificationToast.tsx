import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, PartyPopper, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Person } from '../types';
import { cn } from '../utils';

interface NotificationToastProps {
  person: Person;
  onClose: () => void;
}

export default function NotificationToast({ person, onClose }: NotificationToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 left-4 right-4 z-[100] mx-auto max-w-md"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 p-6 text-white shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
          <PartyPopper size={100} />
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <Gift size={32} />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 font-display">Birthday Today! 🎂</p>
            <h3 className="text-xl font-bold font-display leading-tight">{person.name} is celebrating! 🎈</h3>
            
            <div className="mt-4 flex gap-2">
              <Link 
                to={`/person/${person.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-lg hover:bg-rose-50 transition-colors"
              >
                <ShoppingBag size={14} />
                Quick Gift
              </Link>
              <button 
                onClick={onClose}
                className="rounded-xl bg-white/20 backdrop-blur-md px-4 py-2.5 text-white hover:bg-white/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
