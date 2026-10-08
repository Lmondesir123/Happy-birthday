import React, { useState, useEffect, useRef } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { tacticalAudio } from '../utils/audioSystem';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Upload, Radio } from 'lucide-react';

interface MusicPlayerSectionProps {
  config: BirthdayConfig;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function MusicPlayerSection({ config, onPlayStateChange }: MusicPlayerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(() => tacticalAudio.isPlaying());
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1);
  const [customTrackName, setCustomTrackName] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentTrack = config.audioTracks[currentTrackIndex] || config.audioTracks[0];

  const playTrack = (track: { src?: string; title?: string; id?: string } | undefined, callback?: (playing: boolean) => void) => {
    const source = track?.src;

    if (source) {
      tacticalAudio.playCustomAudio(source, () => {
        setIsPlaying(false);
        if (callback) callback(false);
      });
      setIsPlaying(true);
      if (callback) callback(true);
      return;
    }

    tacticalAudio.startBackgroundMusic((playing) => {
      setIsPlaying(playing);
      if (callback) callback(playing);
    });
  };

  // Basculer Lecture / Pause
  const handleTogglePlay = () => {
    const nextState = !isPlaying;

    if (nextState) {
      playTrack(currentTrack, (playing) => {
        if (onPlayStateChange) onPlayStateChange(playing);
      });
      return;
    }

    tacticalAudio.stopBackgroundMusic((playing) => {
      setIsPlaying(playing);
      if (onPlayStateChange) onPlayStateChange(playing);
    });
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
  };

  // Piste suivante
  const handleNextTrack = () => {
    tacticalAudio.playKeypadBeep(1400);
    const nextIndex = (currentTrackIndex + 1) % config.audioTracks.length;
    const nextTrack = config.audioTracks[nextIndex];
    setCurrentTrackIndex(nextIndex);
    setCustomTrackName(null);

    if (!isPlaying) {
      return;
    }

    tacticalAudio.stopBackgroundMusic();
    setTimeout(() => {
      playTrack(nextTrack, (playing) => {
        if (onPlayStateChange) onPlayStateChange(playing);
      });
    }, 100);
  };

  // Charger un fichier audio MP3 / WAV depuis l'ordinateur de l'utilisateur
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      tacticalAudio.playKeypadBeep(1700);
      setCustomTrackName(file.name);
      tacticalAudio.playCustomAudio(file, () => {
        setIsPlaying(false);
        if (onPlayStateChange) onPlayStateChange(false);
      });
      setIsPlaying(true);
      if (onPlayStateChange) onPlayStateChange(true);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = tacticalAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  // Visualiseur audio animé sur Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = tacticalAudio.getAnalyser();
    const dataArray = new Uint8Array(32);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      }

      const barWidth = (canvas.width / 24) - 2;
      for (let i = 0; i < 24; i++) {
        let value = 4;
        if (isPlaying && analyser) {
          value = Math.max(4, (dataArray[i % 32] / 255) * canvas.height);
        } else if (isPlaying) {
          // Fallback simulation visuelle
          value = 6 + Math.sin(Date.now() / 150 + i) * 12 + Math.random() * 8;
        }

        const x = i * (barWidth + 2);
        const y = canvas.height - value;

        // Gradient ambre tactique COD
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, '#78350f');

        ctx.fillStyle = isPlaying ? grad : '#27272a';
        ctx.fillRect(x, y, barWidth, value);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="relative p-5 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
      {/* En-tête Fréquence Radio COD */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-200 font-tactical">
            Canal Audio // Fréquence Célébration
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
          <span>{isPlaying ? 'EN DIFFUSION' : 'EN ATTENTE'}</span>
        </div>
      </div>

      {/* Titre de la piste et détails */}
      <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Music className={`w-5 h-5 ${isPlaying ? 'text-amber-400 animate-spin' : 'text-zinc-500'}`} />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white font-tactical truncate">
              {customTrackName || currentTrack?.title || 'Tactical Birthday Anthem'}
            </h4>
            <p className="text-[10px] text-zinc-400 font-mono truncate">
              {customTrackName ? 'Piste personnalisée importée' : currentTrack?.artist}
            </p>
          </div>
        </div>

        {/* Égaliseur visuel canvas */}
        <div className="mt-3 w-full h-12 bg-black/80 rounded-md p-1 border border-zinc-800/80 flex items-center justify-center">
          <canvas ref={canvasRef} width={260} height={40} className="w-full h-full" />
        </div>
      </div>

      {/* COMMANDES DE LECTURE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Bouton Play / Pause Principal */}
          <button
            onClick={handleTogglePlay}
            className={`flex-1 py-2.5 px-4 rounded-xl font-tactical font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>Mettre en Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Lancer la Musique</span>
              </>
            )}
          </button>

          {/* Piste Suivante */}
          <button
            onClick={handleNextTrack}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            title="Piste suivante"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleMuteToggle}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            title={isMuted ? 'Réactiver le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Uploader une musique personnelle */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-amber-400 cursor-pointer font-mono transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Mettre ta propre musique (MP3)</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span>{isMuted ? 'MUET' : 'HQ Audio'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
