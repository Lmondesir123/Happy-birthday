import { useState, useEffect, useRef } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { tacticalAudio } from '../utils/audioSystem';
import { Terminal, Radio, RefreshCw, CheckCircle, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionLogbookTerminalProps {
  config: BirthdayConfig;
}

interface LogEntry {
  id: string;
  sender: string;
  status: string;
  badge: string;
  text: string;
  timestamp: string;
}

export default function MissionLogbookTerminal({ config }: MissionLogbookTerminalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentLog, setCurrentLog] = useState<LogEntry | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const typingTimeoutRef = useRef<number | null>(null);

  // Initialisation avec le premier message lors du chargement
  useEffect(() => {
    if (config.missionLogMessages && config.missionLogMessages.length > 0 && logs.length === 0) {
      const initial = config.missionLogMessages[0];
      const entry: LogEntry = {
        ...initial,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setLogs([entry]);
      typeOutMessage(entry);
    }
  }, [config.missionLogMessages]);

  // Clignotement du curseur terminal
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Effet machine à écrire pour chaque nouveau message
  const typeOutMessage = (entry: LogEntry) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(true);
    setCurrentLog(entry);
    setDisplayedText('');

    let charIdx = 0;
    const fullText = entry.text;

    const typeNextChar = () => {
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx + 1));
        // Son de clic désactivé
        // if (charIdx % 3 === 0) {
        //   tacticalAudio.playTerminalClick();
        // }
        charIdx++;
        typingTimeoutRef.current = window.setTimeout(typeNextChar, 18 + Math.random() * 12);
      } else {
        setIsTyping(false);
        // Fanfare terminée désactivée
        // tacticalAudio.playAccessGranted();
      }
    };

    typeNextChar();
  };

  // Intercepter une nouvelle transmission aléatoire
  const handleInterceptNewTransmission = () => {
    if (isTyping) return;

    tacticalAudio.playKeypadBeep(1800);
    const messages = config.missionLogMessages;
    if (!messages || messages.length === 0) return;

    // Sélection aléatoire d'un message différent si possible
    const available = messages.filter((m) => !currentLog || m.id !== currentLog.id);
    const chosen = (available.length > 0 ? available : messages)[
      Math.floor(Math.random() * (available.length > 0 ? available.length : messages.length))
    ];

    const newEntry: LogEntry = {
      ...chosen,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    // Ajout en haut de l'historique
    setLogs((prev) => [newEntry, ...prev.slice(0, 8)]);
    typeOutMessage(newEntry);

    // Salve festive de confettis dorés
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22C55E', '#F59E0B', '#E2E8F0'],
    });
  };

  return (
    <div className="relative p-5 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-2 border-emerald-900/60 hover:border-emerald-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Halo de phosphore vert subtil façon écran tactique militaire */}
      <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Lignes de scan spécifiques terminal */}
      <div className="scanline-overlay absolute inset-0 pointer-events-none opacity-40" />

      {/* En-tête du terminal */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-emerald-300 font-tactical">
            Journal de Bord des Missions // Console 30-09
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>FLUX SÉCURISÉ</span>
          </span>
        </div>
      </div>

      {/* ZONE D'AFFICHAGE DU MESSAGE ACTUEL EN COURS DE FRAPPE */}
      <div className="relative mb-4 p-4 bg-black/90 border border-emerald-950 rounded-xl font-mono text-xs shadow-inner min-h-[140px] flex flex-col justify-between">
        {currentLog && (
          <div>
            {/* Métadonnées de la transmission */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2 mb-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-bold text-zinc-200">{currentLog.sender}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-bold">
                  ★ {currentLog.status}
                </span>
                <span className="text-[10px] text-zinc-500">{currentLog.timestamp}</span>
              </div>
            </div>

            {/* Texte affiché progressivement */}
            <div className="text-emerald-300/95 leading-relaxed text-xs sm:text-sm font-mono mt-2 pr-1">
              {displayedText}
              {cursorVisible && <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-0.5" />}
            </div>
          </div>
        )}

        {/* Pied du message */}
        <div className="pt-2 mt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
          <span>CLASSIFICATION : {currentLog?.badge || 'CONFIDENTIEL'}</span>
          <span>{isTyping ? 'DÉCRYPTAGE DU FLUX...' : 'TRANSMISSION TERMINÉE'}</span>
        </div>
      </div>

      {/* BOUTON PRINCIPAL D'ACTION POUR GÉNÉRER UN NOUVEAU MESSAGE ALÉATOIRE */}
      <div className="space-y-3 z-10 relative">
        <button
          onClick={handleInterceptNewTransmission}
          disabled={isTyping}
          className={`w-full py-3 px-4 rounded-xl font-tactical font-black text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
            isTyping
              ? 'bg-zinc-900 text-zinc-500 border-zinc-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 active:scale-98 text-black border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.35)]'
          }`}
        >
          {isTyping ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Interception en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Intercepter un Nouveau Message d'Anniversaire</span>
            </>
          )}
        </button>

        {/* HISTORIQUE DÉFILANT DES MESSAGES INTERCEPTÉS PRÉCÉDEMMENT */}
        {logs.length > 1 && (
          <div className="pt-3 border-t border-zinc-800/80">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Transmissions Déjà Reçues ({logs.length}) :</span>
              <span className="text-emerald-400 font-bold">HISTORIQUE SÉCURISÉ</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-mono">
              {logs.slice(1).map((log, idx) => (
                <div
                  key={idx}
                  onClick={() => typeOutMessage(log)}
                  className="p-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/90 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-zinc-300 font-bold truncate group-hover:text-emerald-300">
                      {log.sender}
                    </span>
                    <span className="text-zinc-500 text-[10px] hidden sm:inline truncate">
                      — « {log.text.slice(0, 35)}... »
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
