import { useState } from 'react';
import { tacticalAudio } from '../utils/audioSystem';
import { Volume2, VolumeX, Sparkles, Key, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TacticalNavbarProps {
  currentSlide: 'keypad' | 'hub';
  onSelectSlide: (slide: 'keypad' | 'hub') => void;
  friendName: string;
}

export default function TacticalNavbar({
  currentSlide,
  onSelectSlide,
}: TacticalNavbarProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleSound = () => {
    if (isAudioMuted) {
      tacticalAudio.playKeypadBeep(1500);
      setIsAudioMuted(false);
    } else {
      tacticalAudio.stopBackgroundMusic();
      setIsAudioMuted(true);
    }
  };

  const handleConfetti = () => {
    tacticalAudio.playAccessGranted();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.1 },
      colors: ['#F59E0B', '#D97706', '#E2E8F0', '#000000'],
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text element */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-xs bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span className="text-sm font-extrabold tracking-wider text-white uppercase font-tactical whitespace-nowrap">
            BRAVO·3009 <span className="text-amber-400">HQ</span>
          </span>
        </div>

        {/* Zone 2: Navigation links / tabs */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs font-medium font-tactical">
          <button
            onClick={() => onSelectSlide('keypad')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentSlide === 'keypad'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Code d'accès</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isAudioMuted ? 'Activer le son' : 'Couper le son'}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-zinc-300 transition-colors cursor-pointer"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleConfetti}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-tactical font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Célébrer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
