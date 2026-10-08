import { useState } from 'react';
import { BirthdayConfig } from '../config/birthdayConfig';
import { Scroll, Maximize2, X, Feather, Check, Edit3, ShieldAlert, Heart } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSystem';
import confetti from 'canvas-confetti';

interface AncientLetterProps {
  config: BirthdayConfig;
  onUpdateConfig: (updated: Partial<BirthdayConfig>) => void;
  creatorMode?: boolean;
  onRead?: () => void;
}

export default function AncientLetter({
  config,
  onUpdateConfig,
  creatorMode = false,
  onRead,
}: AncientLetterProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [letterDraft, setLetterDraft] = useState(config.ancientLetter);

  const parchmentBg = "/src/assets/images/vintage_parchment_paper_1791466310950.jpg";

  // Casser le sceau de cire pour révéler la surprise
  const handleBreakSealAndOpen = () => {
    tacticalAudio.playWaxSealBreak();
    setIsSealBroken(true);
    setIsOpenModal(true);

    // Salve de confettis dorés lors de l'ouverture du parchemin
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D97706', '#F59E0B', '#B45309', '#78350F'],
    });

    if (onRead) onRead();
  };

  const handleClose = () => {
    tacticalAudio.playKeypadBeep(1100);
    setIsOpenModal(false);
    setIsEditing(false);
  };

  const handleSaveLetter = () => {
    tacticalAudio.playKeypadBeep(1800);
    onUpdateConfig({ ancientLetter: letterDraft });
    setIsEditing(false);
  };

  return (
    <>
      {/* VIGNETTE APERÇU : PARCHEMIN MYSTÈRE ET SCEAU DE CIRE INTACT */}
      <div className="relative p-5 bg-gradient-to-b from-stone-950 via-zinc-950 to-black border-2 border-amber-900/50 hover:border-amber-700/80 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300">
        {/* En-tête style manuscrit ancien */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-amber-300 font-ancient">
              Archive Ancestrale // Surprise Scellée
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-500/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40">
            {isSealBroken ? 'SCEAU ROMPU' : 'SCEAU INTACT'}
          </span>
        </div>

        {/* Corps miniature : Le parchemin fermé et mystérieux */}
        <div
          onClick={handleBreakSealAndOpen}
          className="relative p-5 rounded-xl cursor-pointer overflow-hidden border border-amber-900/50 bg-stone-900/95 shadow-lg group-hover:border-amber-500/80 transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center text-center group"
          style={{
            backgroundImage: `linear-gradient(rgba(18, 14, 10, 0.90), rgba(18, 14, 10, 0.94)), url(${parchmentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Le Sceau de cire royal au centre du parchemin */}
          {/* Seal preview: dynamic content and slightly updated styling */}
          <div className="relative mb-3 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full bg-black/40 border-2 border-amber-600/70 ring-2 ring-amber-600/30 shadow-[inset_0_0_18px_rgba(245,158,11,0.06),0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
              isSealBroken ? 'opacity-80 rotate-12' : 'animate-pulse'
            }`}>
              <Heart className="w-8 h-8 text-amber-400" strokeWidth={2} aria-hidden />
            </div>
            <div className="w-8 h-1 bg-amber-500/40 rounded-full mt-2" />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-amber-500 font-mono mb-1">
              [MESSAGE CONFIDENTIEL INTERDIT AVANT OUVERTURE]
            </div>
            <h4 className="text-sm font-bold text-amber-200 font-ancient tracking-wide">
              {config.ancientLetter.title}
            </h4>
            <p className="text-xs text-stone-300 font-serif italic mt-1 max-w-[240px]">
              « Cliquez sur le sceau pour briser la cire et découvrir la lettre secrète. »
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-900/40 w-full flex items-center justify-center text-[10px] font-mono text-amber-400">
            ★ CLIQUEZ POUR BRISER LE SCEAU ET LIRE ★
          </div>
        </div>

        {/* Bouton d'ouverture */}
        <button
          onClick={handleBreakSealAndOpen}
          className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 hover:from-amber-900 hover:to-amber-900 text-amber-200 border border-amber-800/80 rounded-lg text-xs font-ancient tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Feather className="w-3.5 h-3.5 text-amber-400" />
          <span>{isSealBroken ? 'Relire l\'Épître Déverrouillée' : 'Briser le Sceau & Découvrir la Lettre'}</span>
        </button>
      </div>

      {/* MODAL PLEIN ÉCRAN POUR LIRE LA LETTRE ANCIENNE */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-10 border-2 border-amber-800/80 shadow-[0_0_60px_rgba(245,158,11,0.25)]"
            style={{
              backgroundImage: `linear-gradient(rgba(18, 14, 10, 0.94), rgba(18, 14, 10, 0.96)), url(${parchmentBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Boutons d'action haut droit (édition réservée au créateur) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {creatorMode && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-700/60 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Modifier le texte (Mode Créateur)"
                >
                  {isEditing ? <Check className="w-4 h-4 text-green-400" /> : <Edit3 className="w-4 h-4" />}
                  <span className="text-[11px] font-mono">{isEditing ? 'Prêt' : 'Éditer'}</span>
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-stone-300 border border-stone-700 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sceau de cire officiel d'amitié */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-18 h-18 rounded-full bg-black/40 border-2 border-amber-600/90 ring-2 ring-amber-600/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.06),0_14px_40px_rgba(0,0,0,0.65)] flex items-center justify-center">
                  <Heart className="w-10 h-10 text-amber-400" strokeWidth={2} aria-hidden />
                </div>
                <span className="text-[11px] font-ancient text-amber-300/95 tracking-widest mt-2 uppercase">
                  {`Sceau de l'Alliance Fraternelle · ${config.friendName} · ${config.birthdayDate}`}
                </span>
            </div>

            {/* MODE ÉDITION (visible UNIQUEMENT si creatorMode est activé) */}
            {isEditing && creatorMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-ancient text-amber-400 mb-1">Titre de la lettre :</label>
                  <input
                    type="text"
                    value={letterDraft.title}
                    onChange={(e) => setLetterDraft({ ...letterDraft, title: e.target.value })}
                    className="w-full p-2 bg-stone-900/90 text-amber-100 border border-amber-700 rounded text-sm font-ancient"
                  />
                </div>
                <div>
                  <label className="block text-xs font-ancient text-amber-400 mb-1">Destinataire :</label>
                  <input
                    type="text"
                    value={letterDraft.recipient}
                    onChange={(e) => setLetterDraft({ ...letterDraft, recipient: e.target.value })}
                    className="w-full p-2 bg-stone-900/90 text-amber-100 border border-amber-700 rounded text-sm font-ancient"
                  />
                </div>
                <div>
                  <label className="block text-xs font-ancient text-amber-400 mb-1">Paragraphes (séparer par des sauts de ligne) :</label>
                  <textarea
                    rows={8}
                    value={letterDraft.paragraphs.join('\n\n')}
                    onChange={(e) => setLetterDraft({ ...letterDraft, paragraphs: e.target.value.split('\n\n') })}
                    className="w-full p-3 bg-stone-900/90 text-amber-100 border border-amber-700 rounded text-sm font-serif leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-ancient text-amber-400 mb-1">Signature :</label>
                  <input
                    type="text"
                    value={letterDraft.signature}
                    onChange={(e) => setLetterDraft({ ...letterDraft, signature: e.target.value })}
                    className="w-full p-2 bg-stone-900/90 text-amber-100 border border-amber-700 rounded text-sm font-ancient"
                  />
                </div>
                <button
                  onClick={handleSaveLetter}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-ancient font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Valider et sceller la lettre
                </button>
              </div>
            ) : (
              /* AFFICHAGE DU TEXTE DU PARCHEMIN ENTIÈREMENT DÉVOILÉ */
              <div className="space-y-6 text-stone-200">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-ancient tracking-wider uppercase mb-2">
                    {config.ancientLetter.title}
                  </h2>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
                </div>

                <div className="text-sm sm:text-base font-serif italic text-amber-400/90">
                  {config.ancientLetter.recipient}
                </div>

                <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed text-stone-200">
                  {config.ancientLetter.paragraphs.map((para, i) => (
                    <p key={i} className="first-letter:text-2xl first-letter:font-ancient first-letter:text-amber-400 first-letter:mr-0.5">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-amber-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-400/80 font-ancient gap-2">
                  <div className="italic text-stone-400 text-center sm:text-left">
                    {config.ancientLetter.dateLocation}
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-stone-300 italic">{config.ancientLetter.signoff}</div>
                    <div className="font-bold text-amber-300 text-sm mt-1">{config.ancientLetter.signature}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
