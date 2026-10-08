import React, { useState, useEffect } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { tacticalAudio } from '../utils/audioSystem';
import { ShieldAlert, Unlock, Delete, HelpCircle, CheckCircle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AccessKeypadSlideProps {
  config: BirthdayConfig;
  onAccessGranted: () => void;
}

export default function AccessKeypadSlide({ config, onAccessGranted }: AccessKeypadSlideProps) {
  const [inputCode, setInputCode] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('SAISISSEZ LE CODE DE SÉCURITÉ');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Bloquer le keypad pendant la musique
  const [audioStarted, setAudioStarted] = useState(false); // Vérifier si l'utilisateur a cliqué Play
  const [isSystemActive, setIsSystemActive] = useState(false); // Le système ne s'active qu'après un choix Play/Passe

  // Gestion des appuis touches clavier physique
  useEffect(() => {
    if (!isSystemActive || isAudioPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      if (/^[0-9]$/.test(e.key)) {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleValidate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputCode, isSuccess, isAudioPlaying, isSystemActive]);

  // Jouer les 2 sons simultanément quand l'utilisateur clique Play
  useEffect(() => {
    if (!audioStarted) return;

    const audio1 = new Audio('/src/assets/audio/Happy birthday.m4a');
    const audio2 = new Audio('/src/assets/audio/HAPPY_BIRTHDAY_TO_YOU_PIANO_INSTRUMENTAL_BEST_HAPPY_BITHDAY_MUSIC.mp3');

    audio1.volume = 0.85; // Son 1 (M4a) plus fort
    audio2.volume = 0.35; // Son 2 (chanson) moins fort, par-dessus

    setIsAudioPlaying(true);
    setStatusMessage('SON D\'OUVERTURE EN COURS...');

    // Démarrer les deux en même temps
    const playAudio = () => {
      audio1.play().catch(() => {
        console.log('Audio 1 failed');
      });
      audio2.play().catch(() => console.log('Audio 2 failed'));
    };

    playAudio();

    // Quand audio 1 finit, arrêter audio 2 et débloquer le keypad avec confetti
    const handleAudio1End = () => {
      audio2.pause();
      audio2.currentTime = 0;
      setIsAudioPlaying(false);
      setStatusMessage('SYSTÈME ACTIF // SAISISSEZ LE CODE');
      
      // Confetti à la fin du son
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#F59E0B', '#FBBF24', '#000000', '#FFFFFF'],
      });
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 80,
        origin: { x: 0.2, y: 0.5 },
        colors: ['#F59E0B', '#FBBF24'],
      });
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 80,
        origin: { x: 0.8, y: 0.5 },
        colors: ['#F59E0B', '#FBBF24'],
      });
    };

    audio1.addEventListener('ended', handleAudio1End);

    // Timeout de secours: débloquer après 50 secondes (durée du son M4a = 47s)
    const timeoutId = setTimeout(() => {
      console.log('Timeout - déblocage du keypad');
      audio1.pause();
      audio2.pause();
      setIsAudioPlaying(false);
      setStatusMessage('SYSTÈME ACTIF // SAISISSEZ LE CODE');
    }, 50000);

    return () => {
      clearTimeout(timeoutId);
      audio1.pause();
      audio2.pause();
      audio1.removeEventListener('ended', handleAudio1End);
    };
  }, [audioStarted]);

  // Ajouter un chiffre
  const handleDigitPress = (digit: string) => {
    if (!isSystemActive) {
      setStatusMessage('CHOIX REQUIS // PLAY OU PASSE');
      return;
    }
    // Bloquer pendant le son
    if (isAudioPlaying) return;
    
    if (inputCode.length < 6) {
      tacticalAudio.playKeypadBeep(1200 + inputCode.length * 100);
      const newCode = inputCode + digit;
      setInputCode(newCode);

      // Si le code correspond automatiquement dès la frappe
      if (newCode === config.accessCode) {
        triggerSuccess();
      }
    }
  };

  // Effacer le dernier chiffre
  const handleDelete = () => {
    if (!isSystemActive) {
      setStatusMessage('CHOIX REQUIS // PLAY OU PASSE');
      return;
    }
    // Bloquer pendant le son
    if (isAudioPlaying) return;
    
    tacticalAudio.playKeypadBeep(900);
    setInputCode((prev) => prev.slice(0, -1));
  };

  // Valider manuellement
  const handleValidate = () => {
    if (!isSystemActive) {
      setStatusMessage('CHOIX REQUIS // PLAY OU PASSE');
      return;
    }
    // Bloquer pendant le son
    if (isAudioPlaying) return;
    
    if (inputCode === config.accessCode) {
      triggerSuccess();
    } else {
      tacticalAudio.playErrorBuzz();
      setErrorShake(true);
      setStatusMessage('CODE INVALIDE // ACCÈS REFUSÉ');
      setTimeout(() => {
        setErrorShake(false);
        setInputCode('');
        setStatusMessage('RÉESSAYEZ // INDICE DISPONIBLE');
      }, 900);
    }
  };

  // Déclencher le succès et passage à la Slide 2
  const triggerSuccess = () => {
    setIsSuccess(true);
    setStatusMessage('ACCÈS ACCORDÉ // DÉVERROUILLAGE...');
    const secondPartTrack = config.audioTracks.find((track) => track.id === 'track-2');
    if (secondPartTrack?.src) {
      tacticalAudio.playCustomAudio(secondPartTrack.src);
    }
    // Son de fanfare désactivé
    // tacticalAudio.playAccessGranted();
    
    // Déclenchement de confettis dorés et noirs
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#FBBF24', '#000000', '#FFFFFF'],
    });

    setTimeout(() => {
      onAccessGranted();
    }, 1200);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center p-4 sm:p-6 bg-tactical-grid">
      {/* Texture de scanlines */}
      <div className="scanline-overlay absolute inset-0 pointer-events-none" />

      {/* Lignes et repères HUD Call of Duty */}
      <div className="absolute top-6 left-6 text-zinc-600 font-mono text-xs hidden md:block">
        [SYS.SEC] SEC-LEVEL: 05 <br />
        [TARGET] OPERATEUR_3009 <br />
        STATUS: EN ATTENTE
      </div>

      <div className="absolute top-6 right-6 text-amber-500/70 font-mono text-xs text-right hidden md:block">
        RADAR ACTIF // 30 SEPTEMBRE <br />
        LAT: 48.8566 · LON: 2.3522
      </div>

      {/* CONTENEUR DU TERMINAL DE SÉCURITÉ */}
      <div
        className={`relative w-full max-w-md p-6 sm:p-8 bg-gradient-to-b from-zinc-950/95 via-black to-zinc-950/95 border-2 ${
          isSuccess
            ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]'
            : errorShake
            ? 'border-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse'
            : 'border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.8)]'
        } rounded-3xl backdrop-blur-xl transition-all duration-300`}
      >
        {/* Épingles d'angle tactique */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-amber-500/80 rounded-xs" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500/80 rounded-xs" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-amber-500/80 rounded-xs" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-500/80 rounded-xs" />

        {/* En-tête du terminal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700/80 rounded-full mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-400 tracking-widest font-tactical uppercase">
              Quartier Général Militaire // Sécurité
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-tactical tracking-wider uppercase">
            Protocole <span className="text-amber-400">30·09</span>
          </h1>

          <p className="text-xs text-zinc-400 font-mono mt-1">
            Entrez le code d'accès pour déverrouiller la mission d'anniversaire
          </p>
        </div>

        {/* Boutons Play et Skip */}
        {!isSystemActive && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setAudioStarted(true);
                setIsSystemActive(true);
              }}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black font-extrabold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] uppercase text-sm"
            >
              ▶ Play
            </button>
            <button
              onClick={() => {
                setIsSystemActive(true);
                setStatusMessage('SYSTÈME ACTIF // SAISISSEZ LE CODE');
              }}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-100 font-extrabold rounded-xl transition-all border border-zinc-700 uppercase text-sm"
            >
              ⏭ Passe
            </button>
          </div>
        )}

        {/* ÉCRAN D'AFFICHAGE DU CODE */}
        <div className="mb-6 p-4 bg-black border-2 border-zinc-800 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <div className="text-[10px] font-mono tracking-widest text-zinc-500 mb-1">
            {statusMessage}
          </div>

          {/* Affichage des chiffres saisis ou masqués */}
          <div className="flex items-center justify-center gap-3 h-12">
            {[0, 1, 2, 3].map((idx) => {
              const char = inputCode[idx];
              return (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold font-tactical transition-all duration-200 ${
                    char
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-700'
                  }`}
                >
                  {char || '•'}
                </div>
              );
            })}
          </div>
        </div>

        {/* CLAVIER NUMÉRIQUE TACTIQUE (KEYPAD COD) */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitPress(digit)}
              disabled={!isSystemActive || isAudioPlaying}
              className={`h-13 bg-zinc-900/90 hover:bg-zinc-800 active:bg-amber-500 active:text-black border border-zinc-700/80 hover:border-amber-400/80 rounded-xl text-lg font-bold text-zinc-100 font-tactical transition-all duration-150 flex items-center justify-center cursor-pointer shadow-md ${
                !isSystemActive || isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {digit}
            </button>
          ))}

          {/* Effacer */}
          <button
            onClick={handleDelete}
            disabled={!isSystemActive || isAudioPlaying}
            title="Effacer un chiffre"
            className={`h-13 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500/60 rounded-xl text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center cursor-pointer ${
              !isSystemActive || isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Delete className="w-5 h-5" />
          </button>

          {/* 0 */}
          <button
            onClick={() => handleDigitPress('0')}
            disabled={!isSystemActive || isAudioPlaying}
            className={`h-13 bg-zinc-900/90 hover:bg-zinc-800 active:bg-amber-500 active:text-black border border-zinc-700/80 hover:border-amber-400/80 rounded-xl text-lg font-bold text-zinc-100 font-tactical transition-all duration-150 flex items-center justify-center cursor-pointer shadow-md ${
              !isSystemActive || isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            0
          </button>

          {/* Valider */}
          <button
            onClick={handleValidate}
            disabled={!isSystemActive || isAudioPlaying}
            title="Valider le code"
            className={`h-13 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black font-extrabold rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)] ${
              !isSystemActive || isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Unlock className="w-5 h-5" />
          </button>
        </div>

        {/* ZONE D'INDICE & AIDE */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors font-mono cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{showHint ? 'Masquer indice' : 'Besoin d\'un indice ?'}</span>
          </button>

          {/* Bouton de secours rapide pour tester facilement */}
          <button
            onClick={() => {
              if (!isSystemActive) {
                setIsSystemActive(true);
                setStatusMessage('SYSTÈME ACTIF // SAISISSEZ LE CODE');
              }
              setInputCode(config.accessCode);
              tacticalAudio.playKeypadBeep(2000);
            }}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline"
          >
            Remplir ({config.accessCode})
          </button>
        </div>

        {/* Message d'indice si affiché */}
        {showHint && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono animate-fade-in flex items-start gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{config.accessHint}</span>
          </div>
        )}
      </div>

      {/* Mention discrète bas de page */}
      <div className="mt-8 text-center text-xs text-zinc-500 font-mono">
        MISSION ANNIVERSAIRE DU 30 SEPTEMBRE · ACCÈS HABILITÉ
      </div>
    </div>
  );
}
