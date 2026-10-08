/**
 * ==============================================================================
 * APPLICATION PRINCIPALE : MISSION ANNIVERSAIRE DU 30 SEPTEMBRE (STYLE CALL OF DUTY)
 * ==============================================================================
 * 
 * Cette application est découpée en deux parties (slides) :
 * 1. SLIDE 1 (Code d'accès) :
 *    Un terminal sécurisé où la personne doit entrer un code secret (par défaut "3009")
 *    pour déverrouiller l'accès au quartier général d'anniversaire.
 * 
 * 2. SLIDE 2 (Hub festif & tactique) :
 *    - Message géant "JOYEUX ANNIVERSAIRE" avec esthétique Call of Duty (noir, or, HUD tactique).
 *    - Gâteau fictif 3D au centre qui pivote automatiquement au survol de la souris
 *      avec bougies interactives et explosion de confettis.
 *    - Compartiment "Dossier Opérateur" avec photo du squad, filtre Vision Nocturne (NVG) et stats.
 *    - Compartiment "Lettre Ancienne" scellée sur parchemin avec typographie vintage.
 *    - Compartiment "Fréquence Radio" avec lecteur de musique, visualiseur audio et import MP3.
 *    - Compartiment "Contrats & Missions" style Warzone avec système de points XP.
 * 
 * NOTE DE PERSONNALISATION :
 * Pour modifier le nom de l'amie, la date, le code secret, la photo ou la lettre,
 * modifiez simplement les valeurs dans le fichier : /src/config/birthdayConfig.ts
 */

import { useState } from 'react';
import { defaultBirthdayConfig, BirthdayConfig } from './config/birthdayConfig';
import AccessKeypadSlide from './components/AccessKeypadSlide';
import BirthdayHubSlide from './components/BirthdayHubSlide';
import TacticalNavbar from './components/TacticalNavbar';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // État de la configuration personnalisable
  const [config, setConfig] = useState<BirthdayConfig>(defaultBirthdayConfig);

  // État de la navigation entre les deux slides ('keypad' = Slide 1, 'hub' = Slide 2)
  const [currentSlide, setCurrentSlide] = useState<'keypad' | 'hub'>('keypad');

  // Mise à jour dynamique de la configuration (par exemple si l'utilisateur change la photo ou le nom)
  const handleUpdateConfig = (updated: Partial<BirthdayConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Barre de navigation supérieure respectant le contrat du Top Bar */}
      <TacticalNavbar
        currentSlide={currentSlide}
        onSelectSlide={(slide) => setCurrentSlide(slide)}
        friendName={config.friendName}
      />

      {/* TRANSITIONS FLUIDES ENTRE LA SLIDE 1 ET LA SLIDE 2 */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 'keypad' ? (
            /* SLIDE 1 : CLAVIER ET CODE D'ACCÈS */
            <motion.div
              key="keypad-slide"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              <AccessKeypadSlide
                config={config}
                onAccessGranted={() => setCurrentSlide('hub')}
              />
            </motion.div>
          ) : (
            /* SLIDE 2 : LE HUB FESTIF TACTIQUE DU 30 SEPTEMBRE */
            <motion.div
              key="hub-slide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              <BirthdayHubSlide
                config={config}
                onUpdateConfig={handleUpdateConfig}
                onBackToKeypad={() => setCurrentSlide('keypad')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
