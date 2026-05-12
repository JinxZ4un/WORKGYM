/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  ChevronRight, 
  Utensils, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Clock, 
  Flame,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { EXERCISES, ROUTINE, NUTRITION_ITEMS } from './constants';
import { Exercise } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routine' | 'exercises' | 'nutrition'>('dashboard');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [today, setToday] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  const currentDayRoutine = ROUTINE.find(r => r.day === today) || ROUTINE[0];

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-24 lg:pl-64 flex flex-col font-sans selection:bg-[#2DD4BF] selection:text-black bg-[#050505]">
      {/* Sidebar - Navigation */}
      <nav className="fixed bottom-0 left-0 w-full md:w-24 lg:w-64 md:h-screen bg-[#050505] border-t md:border-t-0 md:border-r border-white/10 z-50 flex md:flex-col justify-around md:justify-start p-2 md:p-6 gap-2">
        <div className="hidden md:flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#2DD4BF] rounded-full flex items-center justify-center shadow-lg shadow-[#2DD4BF]/20">
            <span className="text-black font-bold text-xl tracking-tighter italic">S</span>
          </div>
          <span className="hidden lg:block text-2xl font-serif italic tracking-tight">STRIVE <span className="accent-teal text-xs not-italic font-sans uppercase tracking-[0.3em] font-light">Dev</span></span>
        </div>

        <NavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<TrendingUp size={20} />} 
          label="Dashboard" 
        />
        <NavItem 
          active={activeTab === 'routine'} 
          onClick={() => setActiveTab('routine')} 
          icon={<Calendar size={20} />} 
          label="Schedule" 
        />
        <NavItem 
          active={activeTab === 'exercises'} 
          onClick={() => setActiveTab('exercises')} 
          icon={<Dumbbell size={20} />} 
          label="Library" 
        />
        <NavItem 
          active={activeTab === 'nutrition'} 
          onClick={() => setActiveTab('nutrition')} 
          icon={<Utensils size={20} />} 
          label="Fuel" 
        />

        <div className="hidden lg:block mt-auto p-4 border border-[#2DD4BF]/20 rounded-2xl bg-[#2DD4BF]/5">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={16} className="accent-teal" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] accent-teal">Daily Insight</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed font-medium">
            Optimal muscle protein synthesis happens when you consume 1.6–2.2g of protein per kg of bodyweight daily.
          </p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mb-3">
              Performance Framework / {today}
            </h2>
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight">
              {activeTab === 'dashboard' && "The Dashboard"}
              {activeTab === 'routine' && "Your Routine"}
              {activeTab === 'exercises' && "The Library"}
              {activeTab === 'nutrition' && "Fuel Intake"}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase text-white/40 tracking-tighter">Current Status</p>
              <p className="text-sm font-mono tracking-wider accent-teal font-bold uppercase">Ready <span className="text-white/20">•</span> Active</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            <div className="glass px-5 py-3 rounded-2xl border-white/5 font-mono text-xs">
              <span className="accent-teal">{new Date().toDateString().toUpperCase()}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard today={today} routine={currentDayRoutine} />
            )}

            {activeTab === 'routine' && (
              <RoutineSection routine={ROUTINE} />
            )}

            {activeTab === 'exercises' && (
              <ExerciseSection 
                onSelect={setSelectedExercise} 
                exercises={Object.values(EXERCISES)} 
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionSection items={NUTRITION_ITEMS} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              layoutId={`exercise-${selectedExercise.id}`}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="h-56 bg-zinc-900/50 flex items-center justify-center relative border-b border-white/5 overflow-hidden">
                {selectedExercise.image ? (
                  <img 
                    src={selectedExercise.image} 
                    alt={selectedExercise.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Dumbbell size={80} className="text-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/5 to-transparent"></div>
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-8 right-8 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
                >
                  &times;
                </button>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono accent-teal">
                    Target: {selectedExercise.target}
                  </span>
                </div>
                <h3 className="text-4xl font-serif italic mb-6 tracking-tight">{selectedExercise.name}</h3>
                <p className="text-white/50 mb-8 leading-relaxed italic max-w-lg">
                  "{selectedExercise.description}"
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="border border-white/5 bg-white/[0.02] p-6 rounded-3xl">
                    <span className="text-[10px] text-white/30 font-bold mb-2 uppercase tracking-widest block">Standard Volume</span>
                    <span className="text-2xl font-serif italic text-[#2DD4BF] tracking-tight">{selectedExercise.sets} Sets</span>
                  </div>
                  <div className="border border-white/5 bg-white/[0.02] p-6 rounded-3xl">
                    <span className="text-[10px] text-white/30 font-bold mb-2 uppercase tracking-widest block">Hypertrophy Reps</span>
                    <span className="text-2xl font-serif italic text-[#2DD4BF] tracking-tight">{selectedExercise.reps}</span>
                  </div>
                </div>

                <h4 className="text-xs uppercase tracking-[0.3em] font-bold accent-teal mb-6">Technical Execution</h4>
                <ul className="space-y-6">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i} className="flex gap-6 items-start">
                      <span className="text-lg font-serif italic accent-teal opacity-50 shrink-0">
                        0{i + 1}
                      </span>
                      <p className="text-sm font-medium text-white/60 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="hidden md:flex fixed bottom-0 left-24 lg:left-64 right-0 h-16 border-t border-white/5 px-12 items-center justify-between text-[9px] uppercase tracking-[0.4em] text-white/20 bg-[#050505]/80 backdrop-blur-xl z-40">
        <span>STRIVE PERFORMANCE SYSTEM / ASIA PACIFIC</span>
        <div className="flex gap-8">
          <span className="accent-teal font-bold italic tracking-widest">PHASE: HYPERTROPHY 1.0</span>
          <span>SYSTEM MMXXVI</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      id={`nav-${label.toLowerCase().replace(' ', '-')}`}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 md:gap-2 px-2 py-4 rounded-2xl transition-all duration-500 w-full group
        ${active ? 'text-[#2DD4BF]' : 'text-white/30 hover:text-white/60'}
      `}
    >
      <span className={`transition-all duration-500 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>
      <span className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="hidden md:block w-1 h-6 bg-[#2DD4BF] absolute right-0 rounded-l-full shadow-[0_0_15px_#2DD4BF55]"
        />
      )}
    </button>
  );
}

function Dashboard({ today, routine }: { today: string, routine: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Today's Focus Card */}
      <div className="md:col-span-8 flex flex-col gap-8">
        <div className="relative overflow-hidden group rounded-[3rem] bg-zinc-900 border border-white/5 p-10 md:p-16 min-h-[400px] flex flex-col justify-end">
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200" 
            alt="Minimalist Gym" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-teal text-xs font-mono font-bold tracking-[0.3em] uppercase">
                Active Protocol / {today.toUpperCase()}
              </span>
            </div>
            <h3 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tighter leading-none">
              {routine.title}
            </h3>
            <p className="text-white/40 max-w-lg text-lg font-medium leading-relaxed mb-10 italic">
              "Focusing on metabolic stress and mechanical tension. Maintain 60-second rest intervals for optimal response."
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-3 bg-[#2DD4BF] text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors group/btn">
                Initiate Session <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-accent-teal text-black p-10 rounded-[3rem] flex flex-col justify-between min-h-[280px]">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-60">Dietary Instruction</h4>
              <p className="text-3xl font-serif italic leading-tight mb-6">
                Muscle Protein Synthesis: <br/>{routine.nutritionalFocus}
              </p>
            </div>
            <div className="pt-6 border-t border-black/10 flex items-center justify-between text-[10px] font-black tracking-widest uppercase">
              <span>Status: Required</span>
              <Utensils size={16} />
            </div>
          </div>

          <div className="border border-white/10 p-10 rounded-[3rem] flex flex-col justify-between min-h-[280px] text-center">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">Hydration Level</p>
              <span className="text-6xl font-serif italic tracking-tighter">88%</span>
            </div>
            <div className="space-y-6">
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full w-[88%] bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></div>
              </div>
              <button className="w-full py-4 border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                Log Fluid Intake +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Foods Sidebar */}
      <div className="md:col-span-4 flex flex-col gap-8">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-2 flex items-center justify-between">
          <span>Staple Sources</span>
          <span>MMXXVI</span>
        </h4>
        <div className="flex flex-col gap-4">
          {NUTRITION_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white/[0.06] transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-[#2DD4BF]/40 transition-colors shrink-0 overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="font-serif text-2xl italic text-white/20 group-hover:text-[#2DD4BF]">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-serif italic tracking-tight">{item.name}</p>
                <p className="text-[9px] text-[#2DD4BF] uppercase font-bold tracking-[0.2em] mt-1">{item.category}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity accent-teal">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoutineSection({ routine }: { routine: any[] }) {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  return (
    <div className="space-y-6 pb-20">
      {routine.map((day, idx) => (
        <div 
          key={idx} 
          className={`relative overflow-hidden border border-white/10 rounded-[3rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-500 group 
            ${day.day === currentDay ? 'bg-white/[0.04] border-[#2DD4BF]/30' : 'bg-[#050505] hover:bg-white/[0.02]'}`}
        >
          {day.day === currentDay && (
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2DD4BF]"></div>
          )}
          
          <div className="flex items-center gap-10">
            <div className="text-center min-w-[70px]">
              <p className="text-[9px] font-bold uppercase text-white/30 tracking-[0.4em] mb-2">{day.day.substring(0, 3)}</p>
              <p className="text-3xl font-serif italic group-hover:text-[#2DD4BF] transition-colors tracking-tighter">0{idx + 1}</p>
            </div>
            <div className="hidden lg:block w-[1px] h-12 bg-white/10"></div>
            <div>
              <h4 className="text-3xl font-serif italic tracking-tight mb-2 flex items-center gap-4">
                {day.title}
                {day.day === currentDay && <span className="text-[10px] font-sans not-italic uppercase tracking-[0.3em] font-bold accent-teal bg-[#2DD4BF]/10 px-3 py-1 rounded-full">Today</span>}
              </h4>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                {day.exercises.length > 0 ? `Hypertrophy Block / ${day.exercises.length} Exercises` : 'System Architecture / Recovery'}
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap select-none">
            {day.exercises.map((id: string) => (
              <span key={id} className="px-5 py-3 border border-white/5 bg-zinc-900 rounded-2xl text-[10px] font-bold text-white/50 uppercase tracking-widest">
                {id.replace('-', ' ')}
              </span>
            ))}
            {day.exercises.length === 0 && (
              <span className="px-5 py-3 border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 rounded-2xl text-[10px] font-bold text-[#2DD4BF] uppercase tracking-widest italic">
                Active Restoration
              </span>
            )}
          </div>
          
          <button className="hidden lg:flex w-16 h-16 rounded-full border border-white/10 items-center justify-center group-hover:bg-[#2DD4BF] group-hover:border-[#2DD4BF] group-hover:text-black transition-all duration-500">
            <ChevronRight size={24} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ExerciseSection({ exercises, onSelect }: { exercises: Exercise[], onSelect: (e: Exercise) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {exercises.map((exercise) => (
        <motion.div
          key={exercise.id}
          layoutId={`exercise-${exercise.id}`}
          onClick={() => onSelect(exercise)}
          className="group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[3rem] cursor-pointer hover:border-[#2DD4BF]/40 transition-all p-3"
        >
          <div className="h-64 bg-zinc-900 rounded-[2.5rem] overflow-hidden relative">
            {exercise.image && (
              <img 
                src={exercise.image} 
                alt={exercise.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent flex items-end p-8">
              <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-bold uppercase text-white tracking-[0.3em] border border-white/10">
                {exercise.target.split(',')[0]}
              </span>
            </div>
            {!exercise.image && (
              <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:scale-125">
                <Dumbbell size={100} />
              </div>
            )}
          </div>
          <div className="p-8">
            <h4 className="text-2xl font-serif italic mb-3 tracking-tight group-hover:text-[#2DD4BF] transition-colors">{exercise.name}</h4>
            <div className="flex items-center justify-between text-white/30">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{exercise.sets} Sets Target</span>
              </div>
              <ArrowRight size={18} className="translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all accent-teal" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function NutritionSection({ items }: { items: any[] }) {
  return (
    <div className="space-y-16 pb-20">
      <div className="relative h-[450px] rounded-[4rem] overflow-hidden flex items-center px-8 md:px-20 border border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Artistic food"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-[10px] font-bold text-[#2DD4BF] uppercase tracking-[0.5em] mb-6 font-mono">Nutritional Philosophy</h2>
          <h3 className="text-6xl md:text-8xl font-serif italic leading-[0.9] mb-8 tracking-tighter">Fueling the <br/>Machine.</h3>
          <p className="text-white/40 text-xl font-medium leading-relaxed italic border-l-2 border-[#2DD4BF]/30 pl-8">
            "Hypertrophy is synthesized in the kitchen. Every micronutrient serves a mechanical purpose in the restoration of skeletal muscle tissue."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] flex flex-col gap-10 group hover:bg-white/[0.04] transition-all duration-500">
             <div className="w-full h-48 border border-white/10 rounded-[2rem] overflow-hidden bg-zinc-900 group-hover:border-[#2DD4BF]/40 group-hover:shadow-[0_0_20px_#2DD4BF11] transition-all shrink-0">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils size={28} className="text-white/20 group-hover:text-[#2DD4BF] transition-colors" />
                  </div>
                )}
             </div>
             <div>
               <h4 className="text-3xl font-serif italic mb-4 tracking-tight group-hover:text-[#2DD4BF] transition-colors">{item.name}</h4>
               <p className="text-white/40 text-base leading-relaxed mb-10 font-medium italic">
                 "{item.benefit}"
               </p>
               <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 group-hover:text-[#2DD4BF]/60 transition-colors">
                 Source Type: {item.category}
               </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
