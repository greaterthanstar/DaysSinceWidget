/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Settings2, 
  Palette, 
  Type, 
  ArrowUpRight, 
  ArrowDownRight,
  Sun,
  Moon,
  Smartphone,
  Check,
  RotateCcw
} from 'lucide-react';

type Mode = 'countdown' | 'countup';

interface WidgetSettings {
  targetDate: string;
  mode: Mode;
  fontFamily: string;
  fontColor: string;
  isDark: boolean;
  fontSize: number;
}

const FONTS = [
  { name: 'Modern Sans', id: 'font-sans' },
  { name: 'Tech Grotesk', id: 'font-space' },
  { name: 'Classic Serif', id: 'font-serif' },
  { name: 'Monospaced', id: 'font-mono' },
  { name: 'Display Soft', id: 'font-display' },
];

const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Obsidian', value: '#1A1A1A' },
  { name: 'Ocean', value: '#3B82F6' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Sunset', value: '#F59E0B' },
  { name: 'Crimson', value: '#EF4444' },
  { name: 'Lavender', value: '#8B5CF6' },
];

const DEFAULT_SETTINGS: WidgetSettings = {
  targetDate: new Date().toISOString().split('T')[0],
  mode: 'countdown',
  fontFamily: 'font-sans',
  fontColor: '#FFFFFF',
  isDark: true,
  fontSize: 64,
};

export default function App() {
  const [settings, setSettings] = useState<WidgetSettings>(() => {
    const saved = localStorage.getItem('widget-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<'date' | 'style' | 'mode'>('date');

  useEffect(() => {
    localStorage.setItem('widget-settings', JSON.stringify(settings));
  }, [settings]);

  // Calculate days difference
  const daysDifference = useMemo(() => {
    const target = new Date(settings.targetDate);
    const now = new Date();
    // Reset hours to compare dates only
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (settings.mode === 'countup') {
      return Math.max(0, -diffDays);
    }
    return Math.max(0, diffDays);
  }, [settings.targetDate, settings.mode]);

  const updateSetting = (key: keyof WidgetSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${settings.isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <main className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 h-screen flex flex-col md:flex-row gap-8 overflow-hidden">
        
        {/* Sidebar / Settings */}
        <div className="w-full md:w-[400px] flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-none">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Widget Creator</h1>
              <p className="text-zinc-500 text-sm">Days Since Counter Widget</p>
            </div>
            <div className="flex gap-2">
              <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-900/30">
                <Smartphone size={10} /> ANDROID CODE READY
              </div>
              <button 
                onClick={() => updateSetting('isDark', !settings.isDark)}
                className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:scale-105 transition-transform"
              >
                {settings.isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl">
            {(['date', 'style', 'mode'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-zinc-700 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-6 py-4"
            >
              {activeTab === 'date' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Calendar size={14} /> Target Date
                  </label>
                  <input
                    type="date"
                    value={settings.targetDate}
                    onChange={(e) => updateSetting('targetDate', e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                  />
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Choose the date you want to count towards or count from.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'style' && (
                <div className="space-y-8">
                  <section>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                      <Type size={14} /> Typography
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {FONTS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => updateSetting('fontFamily', font.id)}
                          className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${font.id} ${
                            settings.fontFamily === font.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <span>{font.name}</span>
                          {settings.fontFamily === font.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                      <Palette size={14} /> Digit Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSetting('fontColor', color.value)}
                          className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                            settings.fontColor === color.value ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {settings.fontColor === color.value && (
                            <Check size={16} className={color.value === '#FFFFFF' ? 'text-black' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                      <Settings2 size={14} /> Digit Size
                    </label>
                    <input 
                      type="range" 
                      min="32" 
                      max="120" 
                      value={settings.fontSize} 
                      onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                      <span>SMALL</span>
                      <span>LARGE</span>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'mode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Smartphone size={14} /> Function Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSetting('mode', 'countdown')}
                      className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                        settings.mode === 'countdown'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <ArrowDownRight size={24} />
                      <span className="font-bold">Countdown</span>
                      <span className="text-[10px] opacity-70">DAYS UNTIL</span>
                    </button>
                    <button
                      onClick={() => updateSetting('mode', 'countup')}
                      className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                        settings.mode === 'countup'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <ArrowUpRight size={24} />
                      <span className="font-bold">Count Up</span>
                      <span className="text-[10px] opacity-70">DAYS SINCE</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <button 
              onClick={() => {
                const toast = document.getElementById('toast');
                if (toast) {
                  toast.style.opacity = '1';
                  setTimeout(() => toast.style.opacity = '0', 2000);
                }
              }}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Save Settings
            </button>
            <button 
              onClick={resetSettings}
              className="p-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Preview Area (Simulated Smartphone) */}
        <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-[40px] border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/50 blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-sm aspect-[9/19] bg-black rounded-[48px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden shadow-black/50">
            {/* Phone Screen */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center relative p-6">
              {/* Overlay for glass look */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
              
              {/* Status Bar */}
              <div className="relative z-10 flex justify-between items-center px-4 mb-12">
                <span className="text-white text-xs font-bold">9:41</span>
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-2 rounded-full bg-white opacity-40" />
                  <div className="w-4 h-2 rounded-full bg-white opacity-40" />
                  <div className="w-6 h-3 border border-white/50 rounded-sm relative">
                    <div className="absolute top-[2px] left-[2px] w-3 h-1.5 bg-white rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Home Screen Icons (Faded) */}
              <div className="grid grid-cols-4 gap-6 mb-12 opacity-30">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-white/20 rounded-2xl" />
                ))}
              </div>

              {/* THE WIDGET */}
              <motion.div 
                layout
                className="relative z-20 w-full p-4 flex flex-col items-center group cursor-default"
              >
                {/* Transparent Resizable Background Simulation */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 border border-transparent group-hover:border-white/10 rounded-3xl transition-all" />
                
                <div className={`flex items-start gap-3 ${settings.fontFamily}`}>
                  {/* Digits */}
                  <motion.span 
                    key={daysDifference}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="leading-none font-bold tabular-nums"
                    style={{ color: settings.fontColor, fontSize: `${settings.fontSize}px` }}
                  >
                    {daysDifference}
                  </motion.span>
                  
                  {/* Text Part */}
                  <div className="flex flex-col mt-2 whitespace-nowrap">
                    <span 
                      className="font-bold opacity-80" 
                      style={{ color: settings.fontColor, fontSize: `${settings.fontSize * 0.3}px` }}
                    >
                      DAYS
                    </span>
                    <span 
                      className="font-medium opacity-60 uppercase" 
                      style={{ color: settings.fontColor, fontSize: `${settings.fontSize * 0.25}px` }}
                    >
                      {settings.mode === 'countdown' ? 'UNTIL' : 'SINCE'}
                    </span>
                  </div>
                </div>

                {/* Resize Handles (Visual indicators for "Resizable" requirement) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/40 rounded-br-lg" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/40 rounded-bl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/40 rounded-tr-lg" />
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/40 rounded-tl-lg" />
                </div>
              </motion.div>

              {/* More Icons */}
              <div className="grid grid-cols-4 gap-6 mt-12 opacity-30">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-white/20 rounded-2xl" />
                ))}
              </div>
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
             <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">Android 14 Simulation</p>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <div 
        id="toast"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full text-sm font-bold shadow-2xl opacity-0 transition-opacity pointer-events-none z-50 flex items-center gap-2"
      >
        <Check size={16} /> Widget settings saved!
      </div>
    </div>
  );
}
