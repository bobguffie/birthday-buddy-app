import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Info, Activity, ShoppingBag } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold font-display text-slate-800">Privacy Policy</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 text-rose-500 mb-2">
            <Shield size={24} />
            <h2 className="text-2xl font-bold font-display">Your Privacy Matters</h2>
          </div>
          
          <p className="text-slate-600 leading-relaxed">
            Birthday Buddy is designed with your privacy in mind. We believe your personal relationships should remain personal.
          </p>

          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Info size={18} className="text-blue-500" />
                <h3>Local Data Storage</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                All names, birthdays, photos, and notes you add to the app are stored <strong>locally on your device</strong>. We do not upload your contacts' personal information to any server.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Activity size={18} className="text-emerald-500" />
                <h3>Anonymous Analytics</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                To improve our gift suggestions, we collect anonymous data when you click on a gift link. This includes:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-500 pl-2 space-y-1">
                <li>The keyword searched (e.g., "Tech Gifts")</li>
                <li>The category of the person (e.g., "Family")</li>
                <li>Timestamp of the click</li>
                <li>App version and platform</li>
              </ul>
              <p className="text-xs text-slate-400 italic">
                * We never store the name of the person or any identifiable details in our analytics.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShoppingBag size={18} className="text-amber-500" />
                <h3>Advertising & Affiliates</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Birthday Buddy is supported by advertisements and affiliate links. 
              </p>
              <ul className="list-disc list-inside text-sm text-slate-500 pl-2 space-y-1">
                <li><strong>AdMob:</strong> We use Google AdMob to display ads. AdMob may collect device identifiers to serve relevant ads.</li>
                <li><strong>Amazon Affiliates:</strong> As an Amazon Associate, we earn from qualifying purchases made through gift links.</li>
              </ul>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Last Updated: March 2026 • Version 1.3.0
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
