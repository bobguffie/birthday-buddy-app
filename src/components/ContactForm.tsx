import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db';
import { Category, Priority, GiftHistoryItem } from '../types';
import { ChevronLeft, Save, Trash2, X, Camera, Pin, Plus, History } from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

const CATEGORIES: Category[] = ['Family', 'Friend', 'Work', 'Other'];
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export default function ContactForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [category, setCategory] = useState<Category>('Friend');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [lastGift, setLastGift] = useState('');
  const [budget, setBudget] = useState<number | undefined>();
  const [photo, setPhoto] = useState<string | undefined>();
  const [isPinned, setIsPinned] = useState(false);
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItem[]>([]);
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear() - 1);
  const [historyGift, setHistoryGift] = useState('');

  useEffect(() => {
    if (isEdit) {
      db.people.get(Number(id)).then(person => {
        if (person) {
          setName(person.name);
          setBirthday(person.birthday.toISOString().split('T')[0]);
          setCategory(person.category);
          setPriority(person.priority);
          setNotes(person.notes);
          setTags(person.tags);
          setLastGift(person.lastGift || '');
          setBudget(person.budget);
          setPhoto(person.photo);
          setIsPinned(person.isPinned || false);
          setGiftHistory(person.giftHistory || []);
        }
      });
    }
  }, [id, isEdit]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addHistoryItem = () => {
    if (historyGift.trim()) {
      setGiftHistory([...giftHistory, { year: historyYear, gift: historyGift.trim() }]);
      setHistoryGift('');
      setHistoryYear(historyYear - 1);
    }
  };

  const removeHistoryItem = (index: number) => {
    setGiftHistory(giftHistory.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const personData = {
      name,
      birthday: new Date(birthday),
      category,
      priority,
      notes,
      tags,
      lastGift,
      budget,
      photo,
      isPinned,
      giftHistory,
      createdAt: new Date()
    };

    if (isEdit) {
      await db.people.update(Number(id), personData);
    } else {
      await db.people.add(personData);
    }

    navigate(isEdit ? `/person/${id}` : '/');
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await db.people.delete(Number(id));
      navigate('/');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Person' : 'Add New Person'}</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        {/* Photo Upload */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group">
            <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Camera size={40} className="text-slate-300" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 h-10 w-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-rose-700 transition-colors">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Photo</p>
        </div>

        {/* Pin & Name */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
            <button 
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                isPinned ? "bg-rose-600 text-white shadow-md" : "bg-slate-100 text-slate-400"
              )}
            >
              <Pin size={12} className={cn(isPinned && "fill-current")} />
              {isPinned ? 'Pinned' : 'Pin to Top'}
            </button>
          </div>
          <input 
            required
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Birthday</label>
          <input 
            required
            type="date" 
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Priority</label>
            <select 
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all appearance-none"
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Gift History */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Gift History</label>
          <div className="space-y-2">
            {giftHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">{item.year}</span>
                  <span className="text-sm font-medium text-slate-700">{item.gift}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeHistoryItem(idx)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input 
                type="number" 
                value={historyYear}
                onChange={e => setHistoryYear(Number(e.target.value))}
                className="w-20 rounded-xl bg-slate-50 border-none px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-rose-500"
              />
              <input 
                type="text" 
                value={historyGift}
                onChange={e => setHistoryGift(e.target.value)}
                placeholder="What did you buy?"
                className="flex-1 rounded-xl bg-slate-50 border-none px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-rose-500"
              />
              <button 
                type="button"
                onClick={addHistoryItem}
                className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Notes & Interests</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Hobbies, sizes, gift ideas..."
            rows={3}
            className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-800">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag (e.g. Tech, Gaming)"
              className="flex-1 rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all"
            />
            <button 
              type="button" 
              onClick={addTag}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Gift History & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Last Gift</label>
            <input 
              type="text" 
              value={lastGift}
              onChange={e => setLastGift(e.target.value)}
              placeholder="What you gave last"
              className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Budget (£)</label>
            <input 
              type="number" 
              value={budget || ''}
              onChange={e => setBudget(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Target spend"
              className="w-full rounded-2xl bg-slate-50 border-none px-4 py-3 text-slate-800 focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          {isEdit && (
            <button 
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-6 py-4 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button 
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-white font-bold shadow-lg shadow-rose-200 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={20} />
            {isEdit ? 'Update Person' : 'Save Person'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
