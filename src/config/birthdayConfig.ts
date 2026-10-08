import happyBirthdayTrack from '../assets/audio/HAPPY_BIRTHDAY_TO_YOU_PIANO_INSTRUMENTAL_BEST_HAPPY_BITHDAY_MUSIC.mp3';
import egzodTrack from '../assets/audio/Egzod_Maestro_Chives_Royalty_ft_Neoni_Official_Lyric_Video256k.mp3';

/**
 * ==============================================================================
 * CONFIGURATION DE L'ANNIVERSAIRE - MODIFIEZ LES ÉLÉMENTS CI-DESSOUS
 * ==============================================================================
 * Ce fichier vous permet de personnaliser très facilement tous les textes,
 * le code secret, les photos, la musique et les statistiques de la personne fêtée !
 */

export interface BirthdayConfig {
  // --- 1. SÉCURITÉ & CODE D'ACCÈS ---
  // Le code secret pour déverrouiller la slide 2 (par défaut 3009 pour le 30 septembre)
  accessCode: string;
  // Indice affiché si l'amie hésite
  accessHint: string;

  // --- 2. INFORMATIONS SUR L'OPÉRATEUR / L'AMIE ---
  // Nom complet ou prénom
  friendName: string;
  // Indicatif d'appel / Pseudo Call of Duty (ex: GHOST, VIPER, VALKYRIE)
  callsign: string;
  // Titre / Rôle tactique
  roleTitle: string;
  // Date de naissance
  birthdayDate: string;
  // Année ou âge (optionnel ou indicatif)
  ageDisplay: string;
  // Photo du squad / portrait de l'amie (chemin de l'image ou URL web)
  squadPhotoUrl: string;

  // --- 3. STATISTIQUES MILITAIRES / COD AMICALES ---
  stats: {
    level: string;           // Ex: "NIVEAU 30"
    prestige: string;        // Ex: "PRESTIGE LÉGENDAIRE"
    loyaltyRate: string;     // Ex: "100%"
    friendshipKDRatio: string; // Ex: "ILLIMITÉ"
    favoriteWeapon: string;  // Ex: "Cœur de Guerrière"
    badgeTitle: string;      // Ex: "MVP DE L'ANNÉE"
  };

  // --- 4. LA LETTRE ANCIENNE (PARCHEMIN D'AMITIÉ) ---
  ancientLetter: {
    title: string;           // Titre de l'épître
    recipient: string;       // "À ma très chère amie,"
    paragraphs: string[];    // Paragraphes de la lettre
    signoff: string;         // Formule de fin
    signature: string;       // Signature de l'expéditeur
    dateLocation: string;    // Lieu et date solennels
  };

  // --- 5. BANDE-SON & COMMUNICATEUR AUDIO ---
  audioTracks: {
    id: string;
    title: string;
    artist: string;
    duration: string;
    src?: string;            // URL externe ou fichier importé (laissé vide = musique synthétisée intégrée)
  }[];

  // --- 6. MISSIONS ET CONTRATS D'ANNIVERSAIRE ---
  tacticalObjectives: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    xpReward: number;
  }[];

  // --- 7. JOURNAL DE BORD DES MISSIONS (MESSAGES ALÉATOIRES DU TERMINAL) ---
  missionLogMessages: {
    id: string;
    sender: string;       // Ex: "HQ_COMMANDEMENT", "SQUAD_BRAVO_6", "GHOST_ACTUAL"
    status: string;       // Ex: "MISSION ACCOMPLIE", "PRIORITÉ ABSOLUE"
    badge: string;        // Ex: "CONFIDENTIEL", "TOP SECRET"
    text: string;         // Le message de félicitation / punchline militaire d'anniversaire
  }[];
}

// ------------------------------------------------------------------------------
// VALEURS PAR DÉFAUT PERSONNALISABLES CI-DESSOUS :
// ------------------------------------------------------------------------------
export const defaultBirthdayConfig: BirthdayConfig = {
  // [MODIFIABLE] Code à 4 chiffres pour accéder à la célébration (3009 = 30 Septembre)
  accessCode: "3009",
  accessHint: "Indice : Date du jour de ta naissance (Format JJMM = 3009)",

  // [MODIFIABLE] Identité de l'amie
  friendName: "Schad papa poule 😊",
  callsign: "DARK_SCHAD",
  roleTitle: "COMMANDANT D'ÉLITE // SQUAD LEADER",
  birthdayDate: "30 SEPTEMBRE",
  ageDisplay: "ÉDITION ANNIVERSAIRE",

  // [MODIFIABLE] Photo de profil du Squad Call of Duty
  // Vous pouvez remplacer ce chemin par votre propre image (ex: '/photo-amie.jpg' ou une URL https://...)
  squadPhotoUrl: "/src/assets/images/image.png",

  // [MODIFIABLE] Statistiques de combat amicales
  stats: {
    level: "NIVEAU 25",
    prestige: "PRESTIGE ÉLITE",
    loyaltyRate: "100%",
    friendshipKDRatio: "INFINI (0 DÉFAITE)",
    favoriteWeapon: "Sourire Dévastateur & Bienveillance",
    badgeTitle: "OPÉRATEUR MVP DE L'ANNÉE",
  },

  // [MODIFIABLE] La lettre ancienne rédigée sur parchemin
  ancientLetter: {
  title: "À L’OCCASION DE L'ANNIVERSAIRE DE MON CHER AMI CEDRIC BELDOR",
  recipient: "À mon ami SChad,",
  paragraphs: [
    "Je prends le temps aujourd’hui, meme avec un léger retard, pour honorer le jour de ton anniv . Car ce jour reste spécial et mérite d’être célébré.",
    "En peu de temps, une belle amitié s’est construite entre nous. Ta présence compte déjà beaucoup et je suis heureuse de ce lien sincère.",
    "Que cette nouvelle année de ta vie soit un chapitre rempli de réussites, de paix intérieure et de moments lumineux. Que tu avances avec confiance et sérénité.",
    "Même si le quotidien peut parfois être imprévisible, sache que mon amitié reste solide. Ensemble, nous avons commencé à écrire une histoire qui compte."
  ],
  signoff: "Avec toute ma sincérité et mon amitié,",
  signature: "Jennifer",
  dateLocation: "06/10/2026"
},


  // [MODIFIABLE] Pistes audio (le lecteur intègre également un synthétiseur orchestral interactif)
  audioTracks: [
    {
      id: "track-1",
      title: "Happy Birthday (MP3)",
      artist: "Happy Birthday Classic",
      duration: "02:00",
      src: happyBirthdayTrack
    },
    {
      id: "track-2",
      title: "EGZOD",
      artist: "Maestro Chives & Neoni",
      duration: "03:30",
      src: egzodTrack
    },
    {
      id: "track-3",
      title: "Night Raid Ambience & Birthday Chimes",
      artist: "Warzone Audio Lab",
      duration: "02:30"
    }
  ],

  // [MODIFIABLE] Contrats de mission d'anniversaire
  tacticalObjectives: [
    {
      id: "obj-1",
      title: "Déverrouillage Terminal 3009",
      description: "Pirater les protocoles de défense et accéder au quartier général.",
      completed: true,
      xpReward: 2500,
    },
    {
      id: "obj-2",
      title: "Inspection du Gâteau Tactique",
      description: "Survoler et faire pivoter le gâteau 3D, puis allumer/souffler les bougies.",
      completed: false,
      xpReward: 5000,
    },
    {
      id: "obj-3",
      title: "Déchiffrer la Lettre Ancienne",
      description: "Ouvrir le parchemin ancestral et recevoir les vœux officiels.",
      completed: false,
      xpReward: 4000,
    },
    {
      id: "obj-4",
      title: "Activer la Fréquence Audio",
      description: "Lancer la musique d'ambiance de célébration.",
      completed: false,
      xpReward: 3000,
    },
    {
      id: "obj-5",
      title: "Célébrer la Victoire",
      description: "Fêter une nouvelle année de victoires avec tout le squad.",
      completed: false,
      xpReward: 10000,
    }
  ],

  // [MODIFIABLE] Messages aléatoires du Journal de Bord des Missions (Console Terminal)
  missionLogMessages: [
    {
      id: "log-1",
      sender: "GÉNÉRAL EN CHEF // BASE ALPHA",
      status: "MISSION ACCOMPLIE",
      badge: "DÉCRET OFFICIEL",
      text: "Félicitations Soldat ! Après analyse du terrain, ton passage au niveau supérieur ce 30 septembre a été validé avec mention Très Honorable. Tout le bataillon te salue !"
    },
    {
      id: "log-2",
      sender: "COMMANDEMENT TACTIQUE // SATELLITE KH-11",
      status: "VICTOIRE MAJEURE",
      badge: "CONFIDENTIEL",
      text: "Alerte rouge : Anniversaire détecté dans le secteur civil. Toutes les unités d'élite ont reçu l'ordre de cesser le feu pour porter un toast à la meilleure amie du monde !"
    },
    {
      id: "log-3",
      sender: "GHOST_ACTUAL // RADIO SECRÈTE",
      status: "MISSION ACCOMPLIE",
      badge: "HOMMAGE SQUAD",
      text: "« Bravo Six, on a les yeux sur la cible. C'est son anniversaire aujourd'hui. Taux de gentillesse estimé à 1000%. Aucun ennemi ne peut rivaliser. Joyeux anniversaire, championne ! »"
    },
    {
      id: "log-4",
      sender: "CENTRE D'APPROVISIONNEMENT EN GÂTEAUX",
      status: "LIVRAISON RÉUSSIE",
      badge: "RAVITAILLEMENT",
      text: "Colis stratégique largué : 1 an de bonheur supplémentaire, des munitions infinies de rires et un blindage impénétrable contre les coups durs. Bon anniversaire !"
    },
    {
      id: "log-5",
      sender: "RECONNAISSANCE AÉRIENNE // DRONE UAV",
      status: "ZONE SÉCURISÉE",
      badge: "RADAR SURVEILLANCE",
      text: "Rapport de surveillance : Aucune personne plus loyale trouvée sur un rayon de 40 000 km. Tu es l'atout numéro un de notre squad. Reste invaincue !"
    },
    {
      id: "log-6",
      sender: "SERVICE DES VŒUX PRIORITAIRES",
      status: "DÉCRYPTAGE TERMINÉ",
      badge: "TOP SECRET",
      text: "Message intercepté : Que ce 30 septembre marque le début de ta plus glorieuse campagne. Santé d'acier, victoires quotidiennes et joie inaltérable !"
    }
  ]
};
