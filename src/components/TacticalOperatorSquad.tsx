import React, { useState } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { Shield, Eye, Camera, Edit3, Check, Award, Crosshair, Lock, Unlock, Sparkles } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';
import confetti from 'canvas-confetti';

interface TacticalOperatorSquadProps {
  config: BirthdayConfig;
  onUpdateConfig: (updated: Partial<BirthdayConfig>) => void;
  creatorMode?: boolean;
}

export default function TacticalOperatorSquad({
  config,
  onUpdateConfig,
  creatorMode = false,
}: TacticalOperatorSquadProps) {
  const [visionMode, setVisionMode] = useState<'normal' | 'nvg' | 'thermal'>('normal');
  const [isDeclassified, setIsDeclassified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(config.friendName);
  const [editCallsign, setEditCallsign] = useState(config.callsign);
  const [editRole, setEditRole] = useState(config.roleTitle);

  // Déclassifier le dossier (Interaction surprise)
  const handleDeclassify = () => {
    tacticalAudio.playAccessGranted();
    setIsDeclassified(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22C55E', '#F59E0B', '#FFFFFF'],
    });
  };

  // Changement d'optique
  const toggleVision = (mode: 'normal' | 'nvg' | 'thermal') => {
    tacticalAudio.playKeypadBeep(1600);
    setVisionMode(mode);
  };

  // Enregistrer (Mode créateur uniquement)
  const handleSaveInfo = () => {
    tacticalAudio.playKeypadBeep(2000);
    onUpdateConfig({
      friendName: editName,
      callsign: editCallsign,
      roleTitle: editRole,
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      tacticalAudio.playKeypadBeep(1800);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateConfig({ squadPhotoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterStyle = () => {
    switch (visionMode) {
      case 'nvg':
        return 'brightness(1.15) contrast(1.4) hue-rotate(85deg) saturate(2.5) drop-shadow(0 0 10px #22c55e)';
      case 'thermal':
        return 'contrast(2.2) invert(0.9) hue-rotate(180deg) saturate(1.8)';
      default:
        return 'none';
    }
  };

  return (
    <div className="relative p-5 bg-gradient-to-b from-zinc-950/90 via-black to-zinc-950 border border-zinc-800/90 rounded-2xl shadow-xl overflow-hidden group">
      {/* Repères HUD */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-600 select-none">
        + DOSSIER_3009 // CLASSIFIED
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-500/80 font-bold">
        {isDeclassified ? 'ACCÈS AUTORISÉ' : 'ACCÈS VERROUILLÉ'}
      </div>

      {/* Titre du module */}
      <div className="flex items-center justify-between mt-3 mb-4 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-200 font-tactical">
            Dossier Opérateur // Profil Militaire
          </h3>
        </div>

        {/* Bouton d'édition affiché UNIQUEMENT au créateur */}
        {creatorMode && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700"
            title="Modifier le nom et indicatif (Mode Créateur)"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Valider' : 'Éditer (Admin)'}</span>
          </button>
        )}
      </div>

      {/* FORMULAIRE D'ÉDITION DU CRÉATEUR */}
      {isEditing && creatorMode && (
        <div className="mb-4 p-3 bg-zinc-900/95 border border-amber-500/50 rounded-lg space-y-2 text-xs">
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono">Nom / Prénom :</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded px-2 py-1 text-white text-xs font-tactical"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono">Indicatif COD :</label>
            <input
              type="text"
              value={editCallsign}
              onChange={(e) => setEditCallsign(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded px-2 py-1 text-amber-400 text-xs font-tactical"
            />
          </div>
          <button
            onClick={handleSaveInfo}
            className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-tactical font-bold text-xs rounded transition-colors cursor-pointer"
          >
            Sauvegarder les modifications
          </button>
        </div>
      )}

      {/* ZONE PHOTO DU SQUAD AVEC SURPRISE DE DÉCLASSIFICATION */}
      <div className="relative rounded-xl overflow-hidden border-2 border-zinc-800 bg-zinc-950 aspect-square max-w-[280px] mx-auto shadow-inner">
        <img
          src={config.squadPhotoUrl}
          alt={`Squad de ${config.friendName}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            !isDeclassified ? 'blur-md brightness-50 scale-105' : 'blur-none brightness-100 scale-100'
          }`}
          style={{ filter: isDeclassified ? getFilterStyle() : 'blur(8px) brightness(0.4)' }}
          referrerPolicy="no-referrer"
        />

        {/* OVERLAY DE CLASSIFICATION / BOUTON SURPRISE SI PAS ENCORE DÉVERROUILLÉ */}
        {!isDeclassified ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-900/90 border border-amber-500/60 flex items-center justify-center mb-3 animate-bounce">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 font-tactical uppercase tracking-wider mb-1">
              Dossier Top Secret 30-09
            </span>
            <p className="text-[10px] text-zinc-300 font-mono mb-3">
              Portrait classifié de l'opératrice et de son escouade
            </p>
            <button
              onClick={handleDeclassify}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-tactical font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1.5 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Déclassifier le Profil</span>
            </button>
          </div>
        ) : (
          <>
            {/* Réticule de visée Call of Duty */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <Crosshair className="w-16 h-16 text-amber-400/25 stroke-[1]" />
            </div>

            {/* Marqueurs d'angles */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

            {/* Badge anniversaire fixé sur la photo */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs border border-amber-500/50 rounded text-[10px] font-bold text-amber-400 font-tactical">
              ★ SQUAD LEADER 30/09
            </div>

            {/* Bouton pour changer la photo uniquement en Mode Créateur */}
            {creatorMode && (
              <label className="absolute bottom-2 right-2 p-1.5 bg-black/80 hover:bg-black border border-zinc-700 text-zinc-200 rounded-md cursor-pointer transition-colors shadow-lg z-10 flex items-center gap-1 text-[10px]">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">Remplacer</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </>
        )}
      </div>

      {/* SÉLECTEUR D'OPTIQUE TACTIQUE (uniquement si déclassifié) */}
      {isDeclassified && (
        <div className="flex items-center justify-center gap-1.5 mt-3 animate-fade-in">
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <Eye className="w-3 h-3" /> Optique :
          </span>
          <button
            onClick={() => toggleVision('normal')}
            className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors cursor-pointer ${
              visionMode === 'normal'
                ? 'bg-zinc-700 text-white font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => toggleVision('nvg')}
            className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors cursor-pointer ${
              visionMode === 'nvg'
                ? 'bg-green-700 text-green-100 font-bold shadow-[0_0_8px_#22c55e]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            NVG Vert
          </button>
          <button
            onClick={() => toggleVision('thermal')}
            className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors cursor-pointer ${
              visionMode === 'thermal'
                ? 'bg-orange-700 text-orange-100 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Thermique
          </button>
        </div>
      )}

      {/* INFORMATIONS ET STATS TACTIQUES DE L'AMIE */}
      <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
        <div className="flex items-baseline justify-between">
          <h4 className="text-base font-extrabold text-white tracking-wider font-tactical">
            {config.friendName}
          </h4>
          <span className="text-xs font-bold text-amber-400 font-tactical px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
            [{config.callsign}]
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 tracking-wide font-mono">
          {config.roleTitle}
        </p>

        {/* Grille des statistiques de combat */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono">Grade Spécial</span>
            <span className="font-bold text-zinc-200 font-tactical">{config.stats.level}</span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono">Taux de Loyauté</span>
            <span className="font-bold text-green-400 font-tactical">{config.stats.loyaltyRate}</span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono">Ratio Amitié / K:D</span>
            <span className="font-bold text-amber-400 font-tactical">{config.stats.friendshipKDRatio}</span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono">Distinction</span>
            <span className="font-bold text-purple-300 font-tactical flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              {config.stats.badgeTitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
