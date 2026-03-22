import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  FileText, 
  Clipboard, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Info,
  Upload,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { Category, Priority } from '../types';
import { cn } from '../utils';

interface ParsedContact {
  name: string;
  birthday: Date;
  category: Category;
}

export default function ImportBirthdays() {
  const navigate = useNavigate();
  const [importType, setImportType] = useState<'facebook' | 'csv' | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFacebookText = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const contacts: ParsedContact[] = [];
    
    // Improved heuristic: 
    // Look for lines that look like dates or names followed by dates
    // Facebook often has: "Name\nBirthday: Month Day" or "Name\nMonth Day"
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Try to find a date in the current or next line
      // Supports: "January 1", "Jan 1", "January 1, 1990", "1 Jan", "01/01/1990"
      const monthNames = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
      const dateRegex = new RegExp(`(${monthNames})\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?|(\\d{1,2})\\s+(${monthNames})(?:,?\\s+(\\d{4}))?|(\\d{1,2})[/-](\\d{1,2})[/-](\\d{2,4})`, 'i');
      
      const dateMatch = line.match(dateRegex);
      
      if (dateMatch) {
        let monthIndex = -1;
        let day = -1;
        let year = new Date().getFullYear();

        if (dateMatch[1]) { // Format: Month Day
          monthIndex = getMonthIndex(dateMatch[1]);
          day = parseInt(dateMatch[2]);
          if (dateMatch[3]) year = parseInt(dateMatch[3]);
        } else if (dateMatch[4]) { // Format: Day Month
          monthIndex = getMonthIndex(dateMatch[5]);
          day = parseInt(dateMatch[4]);
          if (dateMatch[6]) year = parseInt(dateMatch[6]);
        } else if (dateMatch[7]) { // Format: DD/MM/YYYY or MM/DD/YYYY (Assuming MM/DD/YYYY for US-centric FB)
          monthIndex = parseInt(dateMatch[7]) - 1;
          day = parseInt(dateMatch[8]);
          year = parseInt(dateMatch[9]);
          if (year < 100) year += 2000;
        }
        
        if (monthIndex >= 0 && monthIndex < 12 && day > 0 && day <= 31) {
          // Assume the name is in the previous line if it doesn't contain a date
          let name = "Unknown Buddy";
          if (i > 0 && !lines[i-1].match(dateRegex)) {
            name = lines[i-1];
          } else if (line.includes(':')) {
            // Maybe "Name: Month Day"
            name = line.split(':')[0].trim();
          } else if (line.length > dateMatch[0].length + 2) {
            // Maybe "Name Month Day"
            name = line.replace(dateMatch[0], '').trim();
          }
          
          contacts.push({
            name: name.replace(/['"]+/g, ''),
            birthday: new Date(year, monthIndex, day),
            category: 'Friend'
          });
        }
      }
    }
    
    if (contacts.length === 0) {
      setError("Couldn't find any birthdays in the pasted text. Make sure you copied the list correctly!");
    } else {
      setParsedContacts(contacts);
      setError(null);
    }
  };

  const getMonthIndex = (monthStr: string) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    let idx = months.indexOf(monthStr.toLowerCase());
    if (idx === -1) idx = shortMonths.indexOf(monthStr.toLowerCase());
    return idx;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const contacts: ParsedContact[] = [];

      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('name')) return; // Skip header

        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const date = new Date(parts[1]);
          
          if (!isNaN(date.getTime())) {
            contacts.push({
              name,
              birthday: date,
              category: (parts[2] as Category) || 'Friend'
            });
          }
        }
      });

      if (contacts.length === 0) {
        setError("Couldn't parse the CSV file. Make sure it has 'Name,Birthday' format.");
      } else {
        setParsedContacts(contacts);
        setError(null);
      }
    };
    reader.readAsText(file);
  };

  const saveContacts = async () => {
    setIsImporting(true);
    try {
      for (const contact of parsedContacts) {
        await db.people.add({
          name: contact.name,
          birthday: contact.birthday,
          category: contact.category,
          priority: 'Medium',
          tags: ['Imported'],
          notes: 'Imported from Facebook/CSV',
          createdAt: new Date()
        });
      }
      navigate('/contacts');
    } catch (err) {
      setError("Failed to save some contacts. They might already exist.");
    } finally {
      setIsImporting(false);
    }
  };

  const updateContact = (index: number, updates: Partial<ParsedContact>) => {
    setParsedContacts(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const removeContact = (index: number) => {
    setParsedContacts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm hover:text-rose-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold font-display text-slate-800">Import Birthdays</h2>
      </header>

      {!importType && (
        <div className="grid gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setImportType('facebook')}
            className="flex items-center gap-4 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-rose-200 transition-all text-left"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Clipboard size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Paste from Facebook</h3>
              <p className="text-sm text-slate-500">Copy your birthday list and paste it here</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setImportType('csv')}
            className="flex items-center gap-4 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-rose-200 transition-all text-left"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Upload CSV File</h3>
              <p className="text-sm text-slate-500">Import from a spreadsheet or contacts export</p>
            </div>
          </motion.button>
        </div>
      )}

      {importType === 'facebook' && parsedContacts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={20} />
              <div className="space-y-2">
                <h4 className="font-bold text-blue-900">How to import from Facebook:</h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal ml-4">
                  <li>Go to your Facebook <strong>Birthdays</strong> page.</li>
                  <li>Highlight and <strong>copy</strong> the list of friends and their birthdays.</li>
                  <li><strong>Paste</strong> the text into the box below.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste birthday list here..."
              className="w-full h-48 rounded-[2rem] bg-white border-2 border-slate-100 p-6 text-slate-700 focus:border-rose-400 focus:ring-0 transition-all resize-none"
            />
            <button
              onClick={() => parseFacebookText(pasteText)}
              disabled={!pasteText.trim()}
              className="w-full py-4 rounded-[1.5rem] bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 disabled:opacity-50 transition-all"
            >
              Parse Birthdays
            </button>
          </div>
        </motion.div>
      )}

      {importType === 'csv' && parsedContacts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-12 rounded-[3rem] border-4 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Upload size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">Select CSV File</h4>
              <p className="text-sm text-slate-500 mt-1">Format: Name, Birthday (YYYY-MM-DD)</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-all"
            >
              Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              className="hidden" 
            />
          </div>
        </motion.div>
      )}

      {parsedContacts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Review ({parsedContacts.length})</h3>
            <button 
              onClick={() => {
                setParsedContacts([]);
                setPasteText('');
              }}
              className="text-sm font-bold text-rose-600 hover:text-rose-700"
            >
              Start Over
            </button>
          </div>

          <div className="space-y-3">
            {parsedContacts.map((contact, index) => (
              <div key={index} className="flex flex-col p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      {contact.name.charAt(0)}
                    </div>
                    <input 
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(index, { name: e.target.value })}
                      className="flex-1 font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0"
                    />
                  </div>
                  <button 
                    onClick={() => removeContact(index)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-4 pl-13">
                  <input 
                    type="date"
                    value={contact.birthday.toISOString().split('T')[0]}
                    onChange={(e) => updateContact(index, { birthday: new Date(e.target.value) })}
                    className="text-xs font-bold text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-rose-400"
                  />
                  <select
                    value={contact.category}
                    onChange={(e) => updateContact(index, { category: e.target.value as Category })}
                    className="text-xs font-bold text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-rose-400"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={saveContacts}
            disabled={isImporting}
            className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isImporting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                Add All Buddies
              </>
            )}
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center gap-3"
        >
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
