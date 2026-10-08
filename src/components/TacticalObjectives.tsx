import { useState } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { tacticalAudio } from '../utils/audioSystem';
import { CheckCircle2, Circle, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TacticalObjectivesProps {
  config: BirthdayConfig;
  onAllCompleted?: () => void;
}

export default function TacticalObjectives({ config }: TacticalObjectivesProps) {
  const [objectives, setObjectives] = useState(config.tacticalObjectives);

  const toggleObjective = (id: string) => {
    tacticalAudio.playKeypadBeep(1500);
    setObjectives((prev) => {
      const updated = prev.map((obj) =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      );

      const allDone = updated.every((o) => o.completed);
      if (allDone) {
        tacticalAudio.playAccessGranted();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
      return updated;
    });
  };

  const totalXP = objectives.reduce((acc, curr) => acc + (curr.completed ? curr.xpReward : 0), 0);
  const maxXP = objectives.reduce((acc, curr) => acc + curr.xpReward, 0);
  const percentXP = Math.round((totalXP / maxXP) * 100);

  return (
    <div className="p-5 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
      {/* En-tête Contrats */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-200 font-tactical">
            Missions & Contrats d'Anniversaire
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-tactical text-amber-400 font-bold">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>{totalXP} XP</span>
        </div>
      </div>

      {/* Barre de progression XP Call of Duty */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
          <span>PROGRESSION DU PASS ANNIVERSAIRE</span>
          <span className="text-amber-400 font-bold">{percentXP}% TERMINÉ</span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-500 rounded-full"
            style={{ width: `${percentXP}%` }}
          />
        </div>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-2.5">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            onClick={() => toggleObjective(obj.id)}
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-start gap-2.5 cursor-pointer ${
              obj.completed
                ? 'bg-amber-950/20 border-amber-500/40 text-zinc-200'
                : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="mt-0.5">
              {obj.completed ? (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold font-tactical ${obj.completed ? 'text-white' : 'text-zinc-300'}`}>
                  {obj.title}
                </span>
                <span className="text-[10px] font-mono text-amber-500 shrink-0">
                  +{obj.xpReward} XP
                </span>
              </div>
              <p className="text-[11px] text-zinc-400/90 leading-tight mt-0.5 font-sans">
                {obj.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
