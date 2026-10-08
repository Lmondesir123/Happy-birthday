import React, { useState } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import InteractiveCake from './InteractiveCake';
import TacticalOperatorSquad from './TacticalOperatorSquad';
import AncientLetter from './AncientLetter';
import MusicPlayerSection from './MusicPlayerSection';
import TacticalObjectives from './TacticalObjectives';
import MissionLogbookTerminal from './MissionLogbookTerminal';
import confetti from 'canvas-confetti';
import { tacticalAudio } from '../utils/audioSystem';
import { Sparkles, Award, Volume2, ShieldCheck, HeartHandshake, Zap, ChevronLeft, Lock, Unlock, Settings } from 'lucide-react';

interface BirthdayHubSlideProps {
  config: BirthdayConfig;
  onUpdateConfig: (updated: Partial<BirthdayConfig>) => void;
  onBackToKeypad: () => void;
}

export default function BirthdayHubSlide({
  config,
  onUpdateConfig,
  onBackToKeypad,
}: BirthdayHubSlideProps) {
  // Mode créateur : désactivé par défaut pour que l'amie ne voie aucun bouton d'édition
  const [creatorMode, setCreatorMode] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState(false);

  // Déclencher une salve de confettis festifs style Call of Duty
  const triggerConfettiBomb = () => {
    tacticalAudio.playAccessGranted();

    confetti({
      particleCount: 120,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#F59E0B', '#D97706', '#000000', '#F3F4F6', '#EF4444'],
    });
    confetti({
      particleCount: 120,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#F59E0B', '#D97706', '#000000', '#F3F4F6', '#EF4444'],
    });
  };

  // Déverrouillage du mode créateur réservé à l'auteur
  const handleToggleCreatorMode = () => {
    if (creatorMode) {
      setCreatorMode(false);
      tacticalAudio.playKeypadBeep(900);
    } else {
      setShowAdminModal(true);
      tacticalAudio.playKeypadBeep(1400);
    }
  };

  const handleVerifyAdmin = () => {
    // Le mot de passe créateur correspond au code secret (ex: 3009) ou 'admin'
    if (adminPasswordInput === config.accessCode || adminPasswordInput.toLowerCase() === 'admin') {
      tacticalAudio.playAccessGranted();
      setCreatorMode(true);
      setShowAdminModal(false);
      setAdminPasswordInput('');
      setAdminError(false);
    } else {
      tacticalAudio.playErrorBuzz();
      setAdminError(true);
    }
  };

  return (
    <div className="relative min-h-screen pb-16 bg-black text-slate-100 bg-tactical-grid">
      {/* Scanlines discrètes */}
      <div className="scanline-overlay fixed inset-0 pointer-events-none z-10" />

      {/* BANNIÈRE SUPÉRIEURE : EN-TÊTE FESTIF CALL OF DUTY */}
      <section className="relative px-4 sm:px-8 pt-8 pb-6 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Message de statut centré */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 w-full md:w-auto justify-center md:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-300">OPÉRATION : 30 SEPTEMBRE ACTIVE</span>
          </div>

          {/* TITRE PRINCIPAL : JOYEUX ANNIVERSAIRE TYPOGRAPHIE NOIRE & DOREE */}
          <div className="text-center flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/40 rounded-full mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400 tracking-widest font-tactical uppercase">
                ★ ORDRE DU MÉRITE MILITAIRE // ÉDITION SPÉCIALE ★
              </span>
            </div>

            {/* Typographie noire contrastée avec ombrage et bordure dorée */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-tactical uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              JOYEUX <span className="text-amber-400 text-stroke-dark">ANNIVERSAIRE</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-zinc-300 font-medium">
              Célébration officielle pour{' '}
              <strong className="text-amber-400 font-tactical tracking-wide">
                {config.friendName}
              </strong>{' '}
              · 30 Septembre
            </p>
          </div>

          {/* Déclencheur de fête & confettis */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerConfettiBomb}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black font-tactical font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tirer les Confettis</span>
            </button>
          </div>
        </div>

        {/* Citation / slogan d'amitié */}
        <div className="mt-4 text-center">
          <div className="inline-block text-xs font-mono text-zinc-400 border-t border-zinc-800/80 pt-2 px-6">
            « Dans la poussière des combats ou le calme des victoires, une vraie amitié ne faillit jamais. »
          </div>
        </div>
      </section>

      {/* DASHBOARD MULTI-COMPARTIMENTS SUR UNE SEULE SLIDE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* GRILLE PRINCIPALE À 3 COLONNES AVEC LE GÂTEAU AU CENTRE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLONNE GAUCHE (4 colonnes sur desktop) : SQUAD OPÉRATEUR & LETTRE ANCIENNE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Compartiment 1 : Fiche Opérateur & Photo Squad de l'amie */}
            <TacticalOperatorSquad
              config={config}
              onUpdateConfig={onUpdateConfig}
              creatorMode={creatorMode}
            />

            {/* Compartiment 2 : La Lettre Ancienne sur parchemin */}
            <AncientLetter
              config={config}
              onUpdateConfig={onUpdateConfig}
              creatorMode={creatorMode}
              onRead={() => {
                // marquer l'objectif complété
              }}
            />
          </div>

          {/* COLONNE CENTRALE (4 colonnes sur desktop) : GÂTEAU 3D INTERACTIF & RECONNAISSANCE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Compartiment 3 (CENTRE) : LE GÂTEAU 3D QUI TOURNE AU SURVOL DE LA SOURIS */}
            <InteractiveCake
              onInteract={() => {
                tacticalAudio.playAccessGranted();
              }}
            />

            {/* Compartiment Complémentaire : Écusson d'Honneur & Vœux du Squad */}
            <div className="p-5 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-800 rounded-2xl shadow-xl text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-amber-500/40 flex items-center justify-center mb-3">
                <HeartHandshake className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white font-tactical uppercase tracking-wider">
                Fraternité d'Armes & Amitié
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                Chaque année passée à tes côtés est une victoire stratégique. Merci d'être ce pilier infaillible, toujours prête à soutenir ton équipe !
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-around text-xs font-mono text-zinc-400">
                <div>
                  <span className="block text-amber-400 font-bold font-tactical text-sm">30/09</span>
                  <span>Jour Sacré</span>
                </div>
                <div className="h-6 w-px bg-zinc-800" />
                <div>
                  <span className="block text-green-400 font-bold font-tactical text-sm">100%</span>
                  <span>Solidarité</span>
                </div>
                <div className="h-6 w-px bg-zinc-800" />
                <div>
                  <span className="block text-purple-400 font-bold font-tactical text-sm">MAX</span>
                  <span>Fidélité</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE (4 colonnes sur desktop) : LECTEUR MUSIQUE & OBJECTIFS COD */}
          <div className="lg:col-span-4 space-y-6">
            {/* Compartiment 4 : Le Lecteur de Musique / Fréquence Audio */}
            <MusicPlayerSection
              config={config}
              onPlayStateChange={(playing) => {
                if (playing) {
                  // feedback
                }
              }}
            />

            {/* Compartiment 5 : Missions et Contrats d'Anniversaire (XP) */}
            <TacticalObjectives
              config={config}
              onAllCompleted={() => {
                triggerConfettiBomb();
              }}
            />
          </div>

        </div>

        {/* NOUVELLE SECTION PLEINE LARGEUR SUR SLIDE 2 : JOURNAL DE BORD DES MISSIONS (TERMINAL CONSOLE) */}
        <section className="mt-8">
          <MissionLogbookTerminal config={config} />
        </section>

        {/* SECTION COMMANDE RAPIDE & SOUNDBOARD TACTIQUE */}
        <section className="mt-8 p-6 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-zinc-200 font-tactical tracking-wider uppercase">
                  Boîte à Sons & Effets Tactiques
                </h4>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Cliquez pour déclencher des effets sonores militaires de célébration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => tacticalAudio.playKeypadBeep(1800)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Bip Radio</span>
              </button>

              <button
                onClick={() => tacticalAudio.playAccessGranted()}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-green-400" />
                <span>Fanfare Victoire</span>
              </button>

              <button
                onClick={() => tacticalAudio.playCandleSound(false)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Flamme Bougie</span>
              </button>

              <button
                onClick={triggerConfettiBomb}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Salves d'Honneur</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER DISCRET AVEC BOUTON D'ACCÈS CRÉATEUR VERROUILLÉ */}
      <footer className="mt-12 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
        <div>
          MISSION ACCOMPLIE · ÉDITION SPÉCIALE 30 SEPTEMBRE · CALL OF DUTY BIRTHDAY HUB
        </div>

        {/* Bouton secret réservé à la créatrice */}
        <div>
          <button
            onClick={handleToggleCreatorMode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-500 hover:text-amber-400 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 rounded transition-colors cursor-pointer"
            title="Réservé à l'autrice pour modifier les contenus"
          >
            {creatorMode ? (
              <>
                <Unlock className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-bold">Mode Créatrice Actif</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>Espace Créatrice</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* MODAL DE SÉCURITÉ POUR ACTIVER LE MODE CRÉATEUR */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm p-6 bg-zinc-950 border border-amber-500/50 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-amber-400 font-tactical font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>Accès Réservé à la Créatrice</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              Pour éviter que votre amie ne voie les boutons d'édition, confirmez avec votre code secret ({config.accessCode}) :
            </p>
            <input
              type="password"
              placeholder="Code créatrice..."
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyAdmin()}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-sm mb-3 focus:border-amber-400 outline-none"
            />
            {adminError && (
              <p className="text-[11px] text-red-400 font-mono mb-3">Code incorrect. Réessayez.</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdminModal(false)}
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-mono cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleVerifyAdmin}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold font-tactical text-xs rounded-lg cursor-pointer"
              >
                Déverrouiller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
