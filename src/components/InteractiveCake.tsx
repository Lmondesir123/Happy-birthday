import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { tacticalAudio } from '../utils/audioSystem';
import { Sparkles, Flame, RotateCw, Wind } from 'lucide-react';

interface InteractiveCakeProps {
  onInteract?: () => void;
}

export default function InteractiveCake({ onInteract }: InteractiveCakeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wishMade, setWishMade] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Animation de rotation continue quand la souris survole
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (isHovered) {
        setRotationAngle((prev) => (prev + delta * 55) % 360);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHovered]);

  // Clic pour souffler ou rallumer les bougies
  const handleToggleCandles = () => {
    tacticalAudio.playCandleSound(candlesLit);
    const newLitState = !candlesLit;
    setCandlesLit(newLitState);

    if (!newLitState) {
      setWishMade(true);
      // Explosion de confettis festifs or, ambre, noir et argent
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#D97706', '#1E293B', '#E2E8F0', '#000000'],
      });
      if (onInteract) onInteract();
    }
  };

  const handleManualSpin = () => {
    setRotationAngle((prev) => prev + 90);
    tacticalAudio.playKeypadBeep(1400);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950/80 via-black to-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden group">
      {/* Halo lumineux d'ambiance tactique */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* En-tête du compartiment */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-xs animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 font-tactical">
            Cible Prioritaire // Gâteau de Célébration
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSpin}
            title="Faire tourner le gâteau"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 rounded transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pivoter</span>
          </button>
        </div>
      </div>

      {/* ZONE D'INTERACTION 3D DU GÂTEAU */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000 py-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggleCandles}
      >
        {/* Conteneur 3D avec rotation calculée */}
        <div
          className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-100 ease-linear preserve-3d"
          style={{
            transform: `rotateX(14deg) rotateY(${rotationAngle}deg)`,
          }}
        >
          {/* SOCLE MÉTALLIQUE PERSONNALISÉ */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 rounded-full border border-zinc-700/80 shadow-[0_12px_24px_rgba(0,0,0,0.9)] flex items-center justify-center">
            <div className="w-40 h-7 rounded-full border border-lime-500/30 bg-zinc-950/60 flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-lime-400 font-tactical font-bold">
                ★ DARK SHAD // 25 ★
              </span>
            </div>
          </div>

          {/* ÉTAGE INFÉRIEUR CAMOUFLAGE */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-24 rounded-3xl border-2 border-lime-900 shadow-xl overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: '#263329',
              backgroundImage:
                'radial-gradient(ellipse at 18% 24%, #63734a 0 10%, transparent 11%), radial-gradient(ellipse at 65% 36%, #111a16 0 14%, transparent 15%), radial-gradient(ellipse at 82% 78%, #48563a 0 13%, transparent 14%), radial-gradient(ellipse at 35% 82%, #111a16 0 12%, transparent 13%)',
            }}
          >
            <div className="h-3 w-full bg-gradient-to-r from-lime-900 via-lime-600 to-lime-900 border-b border-lime-700/70" />
            <div className="flex items-center justify-center px-2 py-1">
              <div className="flex items-center gap-1 text-[11px] font-black tracking-widest text-zinc-100 font-tactical bg-zinc-950/90 px-3 py-1 rounded border border-lime-700/80">
                <span className="text-lime-400">DARK</span> SHAD
              </div>
            </div>
            <div className="h-2 w-full bg-zinc-950/80 border-t border-lime-900" />
          </div>

          {/* ÉTAGE SUPÉRIEUR NOIR ET KAKI */}
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-20 rounded-2xl border-2 border-lime-900 shadow-lg overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: '#161d18',
              backgroundImage:
                'radial-gradient(ellipse at 22% 30%, #48563a 0 12%, transparent 13%), radial-gradient(ellipse at 78% 72%, #303d2d 0 15%, transparent 16%)',
            }}
          >
            <div className="h-3 w-full bg-gradient-to-r from-lime-900 via-lime-500 to-lime-900" />
            <div className="flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-lime-300 font-tactical font-bold">
                25 ANS
              </span>
            </div>
            <div className="h-1.5 w-full bg-lime-700/60" />
          </div>

          {/* BOUGIES EN FORME DE 25 */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-end gap-3 z-20">
            {['2', '5'].map((candleNumber) => (
              <div key={candleNumber} className="relative flex flex-col items-center">
                {/* Flamme animée */}
                {candlesLit ? (
                  <div className="relative -mb-1 animate-bounce">
                    <div className="w-3.5 h-6 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full blur-[0.6px] shadow-[0_0_12px_#f59e0b,0_0_24px_#ef4444]" />
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white rounded-full opacity-90" />
                  </div>
                ) : (
                  /* Fumée après extinction */
                  <div className="h-5 flex items-center justify-center">
                    <div className="w-1.5 h-4 bg-zinc-400/60 rounded-full blur-[1px] animate-pulse" />
                  </div>
                )}
                <div className="w-7 h-9 bg-gradient-to-b from-lime-300 via-lime-500 to-lime-700 rounded-t-md shadow-md border border-lime-200/50 flex items-center justify-center">
                  <span className="text-lg font-black leading-none text-zinc-950 font-tactical">
                    {candleNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateur de survol */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-[11px] font-mono tracking-wider text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800">
            {isHovered ? '★ ROTATION ACTIVE ★' : 'SURVOLEZ POUR TOURNER'}
          </span>
        </div>
      </div>

      {/* BOUTON D'ACTION ET INDICATIONS */}
      <div className="mt-2 flex flex-col items-center gap-2 z-10 w-full">
        <button
          onClick={handleToggleCandles}
          className={`w-full py-2.5 px-4 rounded-lg font-tactical font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
            candlesLit
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black border-amber-400 hover:brightness-110 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900 text-amber-400 border-zinc-700 hover:bg-zinc-800'
          }`}
        >
          {candlesLit ? (
            <>
              <Wind className="w-4 h-4" />
              <span>Souffler les bougies d'anniversaire</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Rallumer les bougies pour recommencer</span>
            </>
          )}
        </button>

        {wishMade && !candlesLit && (
          <div className="flex flex-col items-center gap-1 p-2.5 bg-amber-500/15 border border-amber-500/50 rounded-xl text-center animate-fade-in w-full">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-tactical font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>★ VŒU MILITAIRE DU 30 SEPTEMBRE ENREGISTRÉ ★</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-mono">
              « Décret d'état-major : 365 jours de bonheur, de santé et d'invincibilité garantis ! »
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
