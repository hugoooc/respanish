/**
 * ReSpanish curriculum: 12-week structured learning path for a French speaker
 * reactivating B1-B2 Spanish. Units progress from present-tense foundations
 * through past tenses, future/conditional, and subjunctive/advanced grammar.
 */
import type { Unit } from "@/lib/types";

export const CURRICULUM: Unit[] = [
  // ═══════════════════════════════════════════════════════════════════
  //  WEEKS 1-4 : REACTIVATION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "u_01",
    title: "Fondations",
    theme: "Vie quotidienne & salutations",
    description:
      "Réactivation des bases : présent des verbes réguliers, ser et estar. Se présenter, saluer et décrire son environnement.",
    grammarFocus: "Présent régulier (-ar, -er, -ir), ser, estar",
    order: 1,
    lessons: [
      {
        id: "l_01_01",
        unitId: "u_01",
        title: "Saluer et se présenter",
        description:
          "Apprendre à se présenter, dire son nom, son origine et sa profession avec le verbe ser.",
        grammarFocus: "Ser (être – identité)",
        grammarIds: ["g_004"],
        vocabIds: [
          "v_009", "v_010", "v_011", "v_012", "v_013", "v_014",
          "v_066", "v_145", "v_160", "v_188",
        ],
        phraseIds: ["p_001", "p_002", "p_005", "p_007", "p_009", "p_010"],
        sentenceIds: ["s_011", "s_012", "s_013", "s_133", "s_138", "s_139", "s_165", "s_190"],
        scenarioTitle: "Premier jour à Madrid",
        scenarioDescription:
          "Tu arrives à Madrid pour un séjour linguistique. Présente-toi à ton hôte et fais connaissance avec les voisins.",
        order: 1,
      },
      {
        id: "l_01_02",
        unitId: "u_01",
        title: "Parler de soi (verbes en -ar)",
        description:
          "Conjuguer les verbes réguliers en -ar au présent pour décrire des actions du quotidien.",
        grammarFocus: "Présent régulier -ar",
        grammarIds: ["g_001"],
        vocabIds: [
          "v_085", "v_107", "v_001", "v_002", "v_003", "v_004",
          "v_005", "v_006", "v_168", "v_140",
        ],
        phraseIds: ["p_011", "p_012", "p_138", "p_139"],
        sentenceIds: ["s_001", "s_002", "s_003", "s_004", "s_005"],
        scenarioTitle: "Conversations entre amis",
        scenarioDescription:
          "Tu retrouves des amis espagnols dans un café. Parle de ton travail, de tes études et de tes habitudes.",
        order: 2,
      },
      {
        id: "l_01_03",
        unitId: "u_01",
        title: "Manger et vivre (verbes en -er/-ir)",
        description:
          "Conjuguer les verbes réguliers en -er et -ir au présent. Parler de nourriture, lecture et lieu de vie.",
        grammarFocus: "Présent régulier -er, -ir",
        grammarIds: ["g_002", "g_003"],
        vocabIds: [
          "v_097", "v_126", "v_108", "v_148", "v_149",
          "v_143", "v_047", "v_051", "v_139",
        ],
        phraseIds: ["p_003", "p_004", "p_140", "p_141"],
        sentenceIds: ["s_006", "s_007", "s_008", "s_009", "s_010", "s_136"],
        scenarioTitle: "Un repas en famille",
        scenarioDescription:
          "Tu dînes chez une famille espagnole. Décris ce que tu manges, où tu vis et ce que tu lis.",
        order: 3,
      },
      {
        id: "l_01_04",
        unitId: "u_01",
        title: "Être ici et maintenant (estar)",
        description:
          "Utiliser estar pour exprimer la localisation, les états temporaires et les émotions.",
        grammarFocus: "Estar (être – état/localisation)",
        grammarIds: ["g_005"],
        vocabIds: [
          "v_067", "v_054", "v_056", "v_053", "v_144",
          "v_150", "v_152", "v_165", "v_155", "v_161",
        ],
        phraseIds: ["p_006", "p_013", "p_014", "p_015", "p_016"],
        sentenceIds: ["s_014", "s_015", "s_016", "s_132", "s_140", "s_146", "s_149", "s_155"],
        scenarioTitle: "Explorer le quartier",
        scenarioDescription:
          "Tu te promènes dans ton nouveau quartier. Décris où sont les choses et comment tu te sens.",
        order: 4,
      },
    ],
  },

  {
    id: "u_02",
    title: "La vie quotidienne",
    theme: "Routines & maison",
    description:
      "Les verbes irréguliers clés du présent : ir, tener, hacer, poner, salir. Verbes pronominaux pour la routine quotidienne.",
    grammarFocus: "Irréguliers présent, verbes pronominaux",
    order: 2,
    lessons: [
      {
        id: "l_02_01",
        unitId: "u_02",
        title: "Aller et venir (ir)",
        description:
          "Le verbe ir au présent et la construction ir a + infinitif pour le futur proche.",
        grammarFocus: "Ir (aller), ir a + infinitif",
        grammarIds: ["g_006", "g_055"],
        vocabIds: [
          "v_071", "v_023", "v_196", "v_048", "v_055",
          "v_065", "v_190", "v_146",
        ],
        phraseIds: ["p_126", "p_128", "p_133"],
        sentenceIds: ["s_017", "s_018", "s_118", "s_119", "s_120", "s_176"],
        scenarioTitle: "Planifier sa journée",
        scenarioDescription:
          "Tu organises ta journée avec ton colocataire. Dis où tu vas et ce que tu vas faire.",
        order: 1,
      },
      {
        id: "l_02_02",
        unitId: "u_02",
        title: "Avoir et devoir (tener)",
        description:
          "Le verbe tener et l'expression tener que + infinitif pour exprimer l'obligation.",
        grammarFocus: "Tener (avoir), tener que + infinitif",
        grammarIds: ["g_007", "g_054"],
        vocabIds: [
          "v_068", "v_080", "v_157", "v_138", "v_147",
          "v_164", "v_162", "v_163",
        ],
        phraseIds: ["p_081", "p_082", "p_083"],
        sentenceIds: ["s_019", "s_020", "s_021", "s_115", "s_116", "s_163"],
        scenarioTitle: "Au bureau",
        scenarioDescription:
          "Tu parles de ta famille et de tes obligations au travail avec un collègue.",
        order: 2,
      },
      {
        id: "l_02_03",
        unitId: "u_02",
        title: "Faire et agir (hacer)",
        description:
          "Le verbe hacer au présent. Parler de ses activités et du temps qu'il fait.",
        grammarFocus: "Hacer (faire)",
        grammarIds: ["g_008"],
        vocabIds: [
          "v_070", "v_130", "v_102", "v_116", "v_052",
          "v_060", "v_189", "v_191",
        ],
        phraseIds: ["p_084", "p_086", "p_087", "p_088"],
        sentenceIds: ["s_022", "s_023", "s_135", "s_164"],
        scenarioTitle: "Le week-end",
        scenarioDescription:
          "Raconte ce que tu fais le week-end : sport, loisirs, projets. Parle aussi du temps qu'il fait.",
        order: 3,
      },
      {
        id: "l_02_04",
        unitId: "u_02",
        title: "La routine quotidienne",
        description:
          "Les verbes pronominaux pour décrire la routine : se lever, se doucher, s'habiller, se coucher.",
        grammarFocus: "Verbes pronominaux (routine)",
        grammarIds: ["g_047", "g_048"],
        vocabIds: [
          "v_285", "v_284", "v_324", "v_261", "v_262",
          "v_263", "v_264", "v_267", "v_266",
        ],
        phraseIds: ["p_103", "p_104", "p_105", "p_108"],
        sentenceIds: ["s_094", "s_095", "s_096", "s_097", "s_098", "s_166"],
        scenarioTitle: "Ma matinée type",
        scenarioDescription:
          "Décris ta routine du matin du réveil jusqu'au départ de la maison.",
        order: 4,
      },
      {
        id: "l_02_05",
        unitId: "u_02",
        title: "À la maison (poner, salir)",
        description:
          "Les verbes poner et salir au présent. Vocabulaire de la maison et des actions domestiques.",
        grammarFocus: "Poner (mettre), salir (sortir)",
        grammarIds: ["g_014", "g_015"],
        vocabIds: [
          "v_081", "v_093", "v_265", "v_268", "v_269",
          "v_270", "v_131", "v_322", "v_144",
        ],
        phraseIds: ["p_130", "p_134", "p_135", "p_136"],
        sentenceIds: ["s_161", "s_162", "s_197", "s_137", "s_148"],
        scenarioTitle: "Les tâches ménagères",
        scenarioDescription:
          "Tu partages les tâches de la maison avec ton colocataire. Dis ce que tu mets où et quand tu sors.",
        order: 5,
      },
    ],
  },

  {
    id: "u_03",
    title: "En ville",
    theme: "Transports & directions",
    description:
      "Se déplacer en ville : pouvoir, vouloir, connaître. Demander son chemin, prendre les transports et exprimer ses préférences.",
    grammarFocus: "Poder, querer, conocer, gustar",
    order: 3,
    lessons: [
      {
        id: "l_03_01",
        unitId: "u_03",
        title: "Pouvoir et demander",
        description:
          "Utiliser poder pour demander des permissions et exprimer des capacités.",
        grammarFocus: "Poder (pouvoir)",
        grammarIds: ["g_009"],
        vocabIds: [
          "v_072", "v_123", "v_103", "v_104", "v_089",
          "v_078", "v_088", "v_112",
        ],
        phraseIds: ["p_043", "p_044", "p_048", "p_149"],
        sentenceIds: ["s_024", "s_025", "s_151", "s_167", "s_172"],
        scenarioTitle: "Perdu dans le centre-ville",
        scenarioDescription:
          "Tu cherches la gare et demandes de l'aide aux passants. Utilise poder pour formuler tes demandes poliment.",
        order: 1,
      },
      {
        id: "l_03_02",
        unitId: "u_03",
        title: "Souhaits et envies",
        description:
          "Le verbe querer pour exprimer ses envies, inviter et proposer des activités.",
        grammarFocus: "Querer (vouloir/aimer)",
        grammarIds: ["g_010"],
        vocabIds: [
          "v_077", "v_329", "v_295", "v_296", "v_301",
          "v_303", "v_297", "v_169", "v_170",
        ],
        phraseIds: ["p_126", "p_127", "p_131", "p_132"],
        sentenceIds: ["s_026", "s_027", "s_153", "s_154"],
        scenarioTitle: "Sortie entre amis",
        scenarioDescription:
          "Tes amis proposent différentes activités pour le week-end. Exprime ce que tu veux faire et ce que tu préfères.",
        order: 2,
      },
      {
        id: "l_03_03",
        unitId: "u_03",
        title: "Connaître la ville",
        description:
          "Le verbe conocer pour parler des lieux et personnes que l'on connaît. Vocabulaire des directions.",
        grammarFocus: "Conocer (connaître)",
        grammarIds: ["g_016"],
        vocabIds: [
          "v_096", "v_311", "v_312", "v_032", "v_030",
          "v_031", "v_160", "v_146",
        ],
        phraseIds: ["p_045", "p_046", "p_047", "p_054"],
        sentenceIds: ["s_034", "s_160", "s_152", "s_153"],
        scenarioTitle: "Guide touristique improvisé",
        scenarioDescription:
          "Un touriste te demande des conseils. Parle des endroits que tu connais et donne des directions.",
        order: 3,
      },
      {
        id: "l_03_04",
        unitId: "u_03",
        title: "Ce qui me plaît (gustar)",
        description:
          "La structure me gusta / me gustan pour exprimer ses goûts et préférences.",
        grammarFocus: "Gustar (aimer/plaire)",
        grammarIds: ["g_052"],
        vocabIds: [
          "v_327", "v_302", "v_301", "v_300", "v_317",
          "v_280", "v_309", "v_310", "v_391",
        ],
        phraseIds: ["p_113", "p_116", "p_117", "p_118"],
        sentenceIds: ["s_106", "s_107", "s_108", "s_109", "s_147"],
        scenarioTitle: "Recommandations culturelles",
        scenarioDescription:
          "Tu parles de tes goûts en musique, cinéma et sport avec de nouveaux amis espagnols.",
        order: 4,
      },
    ],
  },

  {
    id: "u_04",
    title: "À table",
    theme: "Nourriture & restaurant",
    description:
      "Commander au restaurant, exprimer ses préférences alimentaires. Verbes saber, decir, venir et les pronoms COD.",
    grammarFocus: "Saber, decir, venir, pronoms COD, verbes type gustar",
    order: 4,
    lessons: [
      {
        id: "l_04_01",
        unitId: "u_04",
        title: "Savoir cuisiner",
        description:
          "Le verbe saber pour les connaissances et compétences. Vocabulaire des aliments de base.",
        grammarFocus: "Saber (savoir)",
        grammarIds: ["g_011"],
        vocabIds: [
          "v_076", "v_201", "v_202", "v_203", "v_204",
          "v_205", "v_206", "v_282", "v_315",
        ],
        phraseIds: ["p_017", "p_018", "p_019"],
        sentenceIds: ["s_028", "s_029", "s_183", "s_134"],
        scenarioTitle: "Au marché",
        scenarioDescription:
          "Tu fais les courses au marché avec un ami espagnol qui te fait découvrir les produits locaux.",
        order: 1,
      },
      {
        id: "l_04_02",
        unitId: "u_04",
        title: "Commander au restaurant",
        description:
          "Les verbes decir et venir au présent. Phrases utiles pour commander et communiquer au restaurant.",
        grammarFocus: "Decir (dire), venir (venir)",
        grammarIds: ["g_012", "g_013"],
        vocabIds: [
          "v_073", "v_091", "v_207", "v_208", "v_209",
          "v_210", "v_211", "v_212", "v_292", "v_293",
        ],
        phraseIds: ["p_020", "p_021", "p_022", "p_024", "p_027"],
        sentenceIds: ["s_030", "s_031", "s_032", "s_033", "s_179"],
        scenarioTitle: "Dîner au restaurant",
        scenarioDescription:
          "Tu dînes dans un restaurant typique. Commande ton plat, demande des recommandations au serveur.",
        order: 2,
      },
      {
        id: "l_04_03",
        unitId: "u_04",
        title: "Payer et remercier (pronoms COD)",
        description:
          "Les pronoms compléments d'objet direct : lo, la, los, las. Les utiliser pour éviter les répétitions.",
        grammarFocus: "Pronoms COD (le, la, les)",
        grammarIds: ["g_044"],
        vocabIds: [
          "v_288", "v_297", "v_360", "v_018", "v_019",
          "v_286", "v_287", "v_316", "v_366",
        ],
        phraseIds: ["p_025", "p_026", "p_028", "p_029", "p_030"],
        sentenceIds: ["s_086", "s_087", "s_088", "s_170"],
        scenarioTitle: "L'addition",
        scenarioDescription:
          "Le repas est fini. Demande l'addition, paie et remercie le serveur en utilisant les pronoms.",
        order: 3,
      },
      {
        id: "l_04_04",
        unitId: "u_04",
        title: "Ce qui me plaît et me déplaît",
        description:
          "Les verbes de type gustar : encantar, molestar, importar, doler, interesar.",
        grammarFocus: "Verbes type gustar (encantar, doler…)",
        grammarIds: ["g_053"],
        vocabIds: [
          "v_015", "v_016", "v_277", "v_278", "v_213",
          "v_218", "v_219", "v_389",
        ],
        phraseIds: ["p_023", "p_072", "p_073", "p_074"],
        sentenceIds: ["s_110", "s_111", "s_112", "s_113", "s_114", "s_185"],
        scenarioTitle: "Chez le médecin",
        scenarioDescription:
          "Tu ne te sens pas bien après un repas copieux. Explique au médecin ce qui te fait mal et ce qui te gêne.",
        order: 4,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  WEEKS 5-8 : CONSOLIDATION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "u_05",
    title: "Raconter le passé",
    theme: "Expériences de voyage",
    description:
      "Le prétérit (indefinido) : verbes réguliers et irréguliers clés. Raconter des événements passés et des expériences de voyage.",
    grammarFocus: "Prétérit régulier et irrégulier (ser/ir, tener, hacer, estar)",
    order: 5,
    lessons: [
      {
        id: "l_05_01",
        unitId: "u_05",
        title: "Ce qui s'est passé hier (prétérit -ar)",
        description:
          "Les terminaisons régulières du prétérit pour les verbes en -ar. Marqueurs temporels du passé.",
        grammarFocus: "Prétérit régulier -ar",
        grammarIds: ["g_017"],
        vocabIds: [
          "v_085", "v_107", "v_286", "v_191", "v_055",
          "v_034", "v_139", "v_224",
        ],
        phraseIds: ["p_143", "p_144", "p_145", "p_147"],
        sentenceIds: ["s_035", "s_036", "s_173"],
        scenarioTitle: "Raconter sa journée",
        scenarioDescription:
          "Tu racontes ta journée d'hier à un ami : ce que tu as fait, où tu es allé, avec qui tu as parlé.",
        order: 1,
      },
      {
        id: "l_05_02",
        unitId: "u_05",
        title: "Raconter un voyage (prétérit -er/-ir)",
        description:
          "Les terminaisons régulières du prétérit pour les verbes en -er et -ir.",
        grammarFocus: "Prétérit régulier -er/-ir",
        grammarIds: ["g_018"],
        vocabIds: [
          "v_097", "v_108", "v_315", "v_241", "v_242",
          "v_243", "v_244", "v_245", "v_248",
        ],
        phraseIds: ["p_055", "p_056", "p_063", "p_064"],
        sentenceIds: ["s_037", "s_038", "s_178"],
        scenarioTitle: "Souvenirs de Valence",
        scenarioDescription:
          "Tu racontes ton dernier voyage à Valence : ce que tu as mangé, vu et écrit.",
        order: 2,
      },
      {
        id: "l_05_03",
        unitId: "u_05",
        title: "Aller quelque part (prétérit ser/ir)",
        description:
          "Le prétérit de ser et ir (formes identiques : fui, fuiste…). Distinguer le sens par le contexte.",
        grammarFocus: "Prétérit ser/ir",
        grammarIds: ["g_019"],
        vocabIds: [
          "v_066", "v_071", "v_300", "v_301", "v_141",
          "v_146", "v_176", "v_337",
        ],
        phraseIds: ["p_121", "p_124", "p_127"],
        sentenceIds: ["s_039", "s_040", "s_174"],
        scenarioTitle: "Le week-end dernier",
        scenarioDescription:
          "Raconte ton week-end : où tu es allé, ce que c'était, avec qui.",
        order: 3,
      },
      {
        id: "l_05_04",
        unitId: "u_05",
        title: "Avoir et être (prétérit tener/estar)",
        description:
          "Les radicaux irréguliers tuv- et estuv- au prétérit. Raconter des situations passées.",
        grammarFocus: "Prétérit tener, estar",
        grammarIds: ["g_020", "g_022"],
        vocabIds: [
          "v_068", "v_067", "v_155", "v_294", "v_298",
          "v_236", "v_365", "v_306",
        ],
        phraseIds: ["p_069", "p_077", "p_143", "p_144"],
        sentenceIds: ["s_041", "s_043", "s_157", "s_158"],
        scenarioTitle: "Un voyage mouvementé",
        scenarioDescription:
          "Raconte un voyage où tu as eu des problèmes : voiture en panne, bagages perdus, hôtel complet.",
        order: 4,
      },
      {
        id: "l_05_05",
        unitId: "u_05",
        title: "Qu'as-tu fait ? (prétérit hacer)",
        description:
          "Le radical irrégulier hic-/hiz- au prétérit. Poser et répondre à des questions sur le passé.",
        grammarFocus: "Prétérit hacer",
        grammarIds: ["g_021"],
        vocabIds: [
          "v_070", "v_059", "v_138", "v_352", "v_353",
          "v_337", "v_338", "v_271",
        ],
        phraseIds: ["p_090", "p_091", "p_127"],
        sentenceIds: ["s_042", "s_159", "s_164"],
        scenarioTitle: "Retrouvailles",
        scenarioDescription:
          "Tu retrouves un ami que tu n'as pas vu depuis longtemps. Demande-lui ce qu'il a fait et raconte tes aventures.",
        order: 5,
      },
    ],
  },

  {
    id: "u_06",
    title: "Les souvenirs",
    theme: "Enfance & descriptions",
    description:
      "L'imparfait pour décrire le passé : habitudes, descriptions, états. Raconter son enfance et ses souvenirs.",
    grammarFocus: "Imparfait régulier et irrégulier (ser, ir)",
    order: 6,
    lessons: [
      {
        id: "l_06_01",
        unitId: "u_06",
        title: "Quand j'étais petit (imparfait -ar)",
        description:
          "Les terminaisons de l'imparfait en -ar : -aba, -abas… Parler des habitudes d'enfance.",
        grammarFocus: "Imparfait régulier -ar",
        grammarIds: ["g_026"],
        vocabIds: [
          "v_186", "v_313", "v_314", "v_317", "v_281",
          "v_280", "v_304", "v_265", "v_052",
        ],
        phraseIds: ["p_113", "p_115", "p_119", "p_121"],
        sentenceIds: ["s_047", "s_048", "s_191"],
        scenarioTitle: "Album photos",
        scenarioDescription:
          "Tu feuillettes un album photo avec un ami espagnol et racontes tes souvenirs d'enfance.",
        order: 1,
      },
      {
        id: "l_06_02",
        unitId: "u_06",
        title: "La vie d'avant (imparfait -er/-ir)",
        description:
          "Les terminaisons de l'imparfait en -er/-ir : -ía, -ías… Décrire des situations passées.",
        grammarFocus: "Imparfait régulier -er/-ir",
        grammarIds: ["g_027"],
        vocabIds: [
          "v_097", "v_126", "v_315", "v_303", "v_148",
          "v_143", "v_144", "v_186", "v_172",
        ],
        phraseIds: ["p_114", "p_116", "p_122", "p_125"],
        sentenceIds: ["s_049", "s_050", "s_175"],
        scenarioTitle: "Le village de mon grand-père",
        scenarioDescription:
          "Décris la vie dans le village où vivait ton grand-père : ce que les gens mangeaient, lisaient, faisaient.",
        order: 2,
      },
      {
        id: "l_06_03",
        unitId: "u_06",
        title: "Comment c'était (imparfait ser)",
        description:
          "Le verbe ser à l'imparfait (era, eras…). Décrire des personnes et des situations au passé.",
        grammarFocus: "Imparfait ser",
        grammarIds: ["g_028"],
        vocabIds: [
          "v_066", "v_233", "v_234", "v_238", "v_239",
          "v_387", "v_138", "v_140",
        ],
        phraseIds: ["p_119", "p_120", "p_123"],
        sentenceIds: ["s_051", "s_177", "s_184"],
        scenarioTitle: "Souvenirs d'école",
        scenarioDescription:
          "Décris comment étaient tes professeurs, tes camarades et ton école quand tu étais enfant.",
        order: 3,
      },
      {
        id: "l_06_04",
        unitId: "u_06",
        title: "Où j'allais (imparfait ir)",
        description:
          "Le verbe ir à l'imparfait (iba, ibas…). Parler des destinations habituelles au passé.",
        grammarFocus: "Imparfait ir",
        grammarIds: ["g_029"],
        vocabIds: [
          "v_071", "v_259", "v_337", "v_338", "v_345",
          "v_346", "v_271", "v_272", "v_277",
        ],
        phraseIds: ["p_106", "p_107", "p_108", "p_111"],
        sentenceIds: ["s_052", "s_189", "s_196"],
        scenarioTitle: "Les vacances d'été",
        scenarioDescription:
          "Raconte où tu allais en vacances quand tu étais enfant : la plage, la montagne, chez les grands-parents.",
        order: 4,
      },
    ],
  },

  {
    id: "u_07",
    title: "Histoires",
    theme: "Actualités & récits",
    description:
      "Articuler prétérit et imparfait dans un récit. Prétérit des irréguliers poder, querer, decir. Raconter des histoires complexes.",
    grammarFocus: "Prétérit vs imparfait, prétérit poder/querer/decir",
    order: 7,
    lessons: [
      {
        id: "l_07_01",
        unitId: "u_07",
        title: "Quand soudain… (prétérit vs imparfait)",
        description:
          "Quand utiliser le prétérit (action ponctuelle) vs l'imparfait (contexte, habitude) dans un récit.",
        grammarFocus: "Prétérit vs imparfait",
        grammarIds: ["g_030"],
        vocabIds: [
          "v_045", "v_049", "v_057", "v_062", "v_079",
          "v_111", "v_127", "v_272", "v_274",
        ],
        phraseIds: ["p_106", "p_109", "p_110", "p_112"],
        sentenceIds: ["s_053", "s_054", "s_159"],
        scenarioTitle: "Un orage soudain",
        scenarioDescription:
          "Raconte une journée où il faisait beau et soudain un orage a éclaté. Que faisais-tu ? Que s'est-il passé ?",
        order: 1,
      },
      {
        id: "l_07_02",
        unitId: "u_07",
        title: "Raconter une mésaventure (prétérit poder)",
        description:
          "Le prétérit de poder (pude, pudiste…) : exprimer ce qu'on a réussi ou pas à faire.",
        grammarFocus: "Prétérit poder",
        grammarIds: ["g_023"],
        vocabIds: [
          "v_072", "v_305", "v_306", "v_241", "v_242",
          "v_245", "v_246", "v_309",
        ],
        phraseIds: ["p_070", "p_071", "p_076", "p_077"],
        sentenceIds: ["s_044", "s_178", "s_180"],
        scenarioTitle: "Vol annulé",
        scenarioDescription:
          "Ton vol a été annulé. Raconte ce que tu as pu ou pas pu faire pour résoudre la situation.",
        order: 2,
      },
      {
        id: "l_07_03",
        unitId: "u_07",
        title: "Essayer et refuser (prétérit querer)",
        description:
          "Le prétérit de querer (quise, quisiste…) : exprimer une tentative ou un refus passé.",
        grammarFocus: "Prétérit querer",
        grammarIds: ["g_025"],
        vocabIds: [
          "v_077", "v_109", "v_119", "v_089", "v_116",
          "v_365", "v_308", "v_307",
        ],
        phraseIds: ["p_131", "p_143", "p_144", "p_145"],
        sentenceIds: ["s_046", "s_169", "s_186"],
        scenarioTitle: "La soirée ratée",
        scenarioDescription:
          "Tu voulais organiser une fête mais rien ne s'est passé comme prévu. Raconte ce que tu as essayé de faire.",
        order: 3,
      },
      {
        id: "l_07_04",
        unitId: "u_07",
        title: "Il m'a dit que… (prétérit decir)",
        description:
          "Le prétérit de decir (dije, dijiste…). Rapporter ce que quelqu'un a dit.",
        grammarFocus: "Prétérit decir",
        grammarIds: ["g_024"],
        vocabIds: [
          "v_073", "v_362", "v_084", "v_092", "v_112",
          "v_114", "v_298", "v_357",
        ],
        phraseIds: ["p_093", "p_094", "p_095", "p_096", "p_097"],
        sentenceIds: ["s_045", "s_152", "s_158"],
        scenarioTitle: "Nouvelles de la famille",
        scenarioDescription:
          "Ta mère t'a appelé. Rapporte à un ami ce qu'elle t'a dit : nouvelles de la famille, événements.",
        order: 4,
      },
    ],
  },

  {
    id: "u_08",
    title: "Projets d'avenir",
    theme: "Plans & hypothétique",
    description:
      "Le futur simple et le conditionnel. Parler de ses projets, faire des prédictions et formuler des demandes polies.",
    grammarFocus: "Futur régulier/irrégulier, conditionnel régulier/irrégulier",
    order: 8,
    lessons: [
      {
        id: "l_08_01",
        unitId: "u_08",
        title: "Ce que je ferai (futur régulier)",
        description:
          "Les terminaisons du futur simple ajoutées à l'infinitif. Parler de projets concrets.",
        grammarFocus: "Futur régulier",
        grammarIds: ["g_031"],
        vocabIds: [
          "v_190", "v_138", "v_139", "v_354", "v_355",
          "v_164", "v_252", "v_254", "v_319",
        ],
        phraseIds: ["p_084", "p_085", "p_086", "p_088"],
        sentenceIds: ["s_055", "s_056", "s_057"],
        scenarioTitle: "Plans pour l'année",
        scenarioDescription:
          "Discute de tes projets pour l'année avec un ami : travail, voyages, objectifs personnels.",
        order: 1,
      },
      {
        id: "l_08_02",
        unitId: "u_08",
        title: "Ce qui arrivera (futur irrégulier)",
        description:
          "Les radicaux irréguliers du futur : tendr-, podr-, sabr-, har-, dir-, saldr-, vendr-…",
        grammarFocus: "Futur irrégulier",
        grammarIds: ["g_032"],
        vocabIds: [
          "v_068", "v_072", "v_076", "v_070", "v_093",
          "v_091", "v_081", "v_073",
        ],
        phraseIds: ["p_087", "p_090", "p_092"],
        sentenceIds: ["s_058", "s_059", "s_060"],
        scenarioTitle: "Prédictions",
        scenarioDescription:
          "Fais des prédictions sur ton avenir et celui de tes amis : où vivront-ils, que feront-ils ?",
        order: 2,
      },
      {
        id: "l_08_03",
        unitId: "u_08",
        title: "J'aimerais bien… (conditionnel régulier)",
        description:
          "Les terminaisons du conditionnel et son usage : demandes polies, souhaits, conseils.",
        grammarFocus: "Conditionnel régulier",
        grammarIds: ["g_033"],
        vocabIds: [
          "v_327", "v_329", "v_123", "v_326", "v_371",
          "v_375", "v_382", "v_293", "v_242",
        ],
        phraseIds: ["p_059", "p_128", "p_132", "p_149"],
        sentenceIds: ["s_061", "s_062", "s_171", "s_188", "s_195"],
        scenarioTitle: "Voyage de rêve",
        scenarioDescription:
          "Décris ton voyage de rêve : où tu aimerais aller, ce que tu voudrais faire, quel hôtel tu choisirais.",
        order: 3,
      },
      {
        id: "l_08_04",
        unitId: "u_08",
        title: "Si j'avais… (conditionnel irrégulier)",
        description:
          "Les radicaux irréguliers du conditionnel (identiques au futur). Hypothèses et situations imaginaires.",
        grammarFocus: "Conditionnel irrégulier",
        grammarIds: ["g_034"],
        vocabIds: [
          "v_297", "v_143", "v_259", "v_241", "v_145",
          "v_424", "v_423", "v_402",
        ],
        phraseIds: ["p_068", "p_132", "p_133", "p_137"],
        sentenceIds: ["s_063", "s_064", "s_193"],
        scenarioTitle: "Si je gagnais au loto",
        scenarioDescription:
          "Imagine que tu gagnes au loto. Que ferais-tu ? Où irais-tu ? Qu'achèterais-tu ?",
        order: 4,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  WEEKS 9-12 : B2 EXPANSION
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "u_09",
    title: "Opinions",
    theme: "Débats & société",
    description:
      "Le subjonctif présent : formation et déclencheurs. Exprimer souhaits, doutes, émotions et opinions dans des débats.",
    grammarFocus: "Subjonctif présent (-ar, -er/-ir), déclencheurs (souhaits, émotions, doute)",
    order: 9,
    lessons: [
      {
        id: "l_09_01",
        unitId: "u_09",
        title: "Je veux que tu… (subjonctif -ar)",
        description:
          "Formation du subjonctif présent pour les verbes en -ar. Exprimer des souhaits et des nécessités.",
        grammarFocus: "Subjonctif présent -ar",
        grammarIds: ["g_035"],
        vocabIds: [
          "v_077", "v_103", "v_085", "v_318", "v_185",
          "v_461", "v_375", "v_462",
        ],
        phraseIds: ["p_113", "p_114", "p_125"],
        sentenceIds: ["s_065", "s_066", "s_181", "s_194", "s_200"],
        scenarioTitle: "Conseils à un ami",
        scenarioDescription:
          "Ton ami veut améliorer son espagnol. Dis-lui ce que tu veux qu'il fasse, ce qu'il est important qu'il étudie.",
        order: 1,
      },
      {
        id: "l_09_02",
        unitId: "u_09",
        title: "J'espère que… (subjonctif -er/-ir)",
        description:
          "Formation du subjonctif présent pour les verbes en -er/-ir. Exprimer des espoirs et des doutes.",
        grammarFocus: "Subjonctif présent -er/-ir",
        grammarIds: ["g_036"],
        vocabIds: [
          "v_315", "v_097", "v_319", "v_444", "v_432",
          "v_431", "v_440", "v_233",
        ],
        phraseIds: ["p_115", "p_116", "p_118", "p_119"],
        sentenceIds: ["s_067", "s_154", "s_187"],
        scenarioTitle: "Nouveau travail",
        scenarioDescription:
          "Ton ami commence un nouveau travail. Exprime tes espoirs et tes doutes sur cette expérience.",
        order: 2,
      },
      {
        id: "l_09_03",
        unitId: "u_09",
        title: "Souhaits et préférences",
        description:
          "Les déclencheurs du subjonctif : querer que, preferir que, desear que. Changement de sujet obligatoire.",
        grammarFocus: "Déclencheurs : souhaits et désirs",
        grammarIds: ["g_037"],
        vocabIds: [
          "v_329", "v_073", "v_438", "v_437", "v_439",
          "v_412", "v_413", "v_077",
        ],
        phraseIds: ["p_114", "p_122", "p_131"],
        sentenceIds: ["s_072", "s_192", "s_186"],
        scenarioTitle: "Réunion de famille",
        scenarioDescription:
          "La famille discute des vacances. Chacun préfère quelque chose de différent. Exprime souhaits et préférences.",
        order: 3,
      },
      {
        id: "l_09_04",
        unitId: "u_09",
        title: "Ce qui me rend heureux (émotions)",
        description:
          "Les expressions d'émotion qui déclenchent le subjonctif : me alegra que, siento que, me sorprende que.",
        grammarFocus: "Déclencheurs : émotions",
        grammarIds: ["g_038"],
        vocabIds: [
          "v_233", "v_234", "v_237", "v_238", "v_387",
          "v_388", "v_363", "v_364",
        ],
        phraseIds: ["p_119", "p_120", "p_121", "p_124"],
        sentenceIds: ["s_069", "s_182", "s_189"],
        scenarioTitle: "Bonnes et mauvaises nouvelles",
        scenarioDescription:
          "Un ami t'annonce des nouvelles. Réagis émotionnellement : je suis content que…, c'est dommage que…",
        order: 4,
      },
      {
        id: "l_09_05",
        unitId: "u_09",
        title: "Je doute que… (doute et négation)",
        description:
          "Les expressions de doute et de négation qui déclenchent le subjonctif : dudar que, no creer que, es posible que.",
        grammarFocus: "Déclencheurs : doute et négation",
        grammarIds: ["g_039"],
        vocabIds: [
          "v_084", "v_375", "v_376", "v_462", "v_451",
          "v_452", "v_454", "v_404",
        ],
        phraseIds: ["p_113", "p_114", "p_123", "p_125"],
        sentenceIds: ["s_068", "s_070", "s_071"],
        scenarioTitle: "Débat politique",
        scenarioDescription:
          "Tu participes à un débat. Exprime tes doutes et tes certitudes sur les solutions proposées.",
        order: 5,
      },
    ],
  },

  {
    id: "u_10",
    title: "Le monde du travail",
    theme: "Vie professionnelle",
    description:
      "Por vs para en détail. Comparatifs et superlatifs. Vocabulaire professionnel pour l'entretien d'embauche et la vie de bureau.",
    grammarFocus: "Por/para, comparatifs, superlatifs",
    order: 10,
    lessons: [
      {
        id: "l_10_01",
        unitId: "u_10",
        title: "Por et para au travail",
        description:
          "Les usages de por (cause, échange, durée, mouvement) et para (but, destinataire, destination, date limite).",
        grammarFocus: "Por et para",
        grammarIds: ["g_042", "g_043"],
        vocabIds: [
          "v_024", "v_026", "v_251", "v_252", "v_253",
          "v_254", "v_255", "v_256", "v_257", "v_258",
        ],
        phraseIds: ["p_081", "p_082", "p_085", "p_092"],
        sentenceIds: ["s_080", "s_081", "s_082", "s_083", "s_084", "s_085"],
        scenarioTitle: "Jour de travail",
        scenarioDescription:
          "Décris ta journée au bureau en utilisant por et para : pourquoi tu fais les choses, pour qui, pendant combien de temps.",
        order: 1,
      },
      {
        id: "l_10_02",
        unitId: "u_10",
        title: "Comparer des options",
        description:
          "Les comparatifs : más… que, menos… que, tan… como. Comparer des produits, des services, des situations.",
        grammarFocus: "Comparatifs réguliers",
        grammarIds: ["g_049"],
        vocabIds: [
          "v_307", "v_308", "v_309", "v_310", "v_172",
          "v_173", "v_382", "v_383", "v_380", "v_381",
        ],
        phraseIds: ["p_036", "p_040", "p_116", "p_125"],
        sentenceIds: ["s_099", "s_100", "s_101"],
        scenarioTitle: "Choisir un appartement",
        scenarioDescription:
          "Tu compares deux appartements : lequel est plus grand, moins cher, aussi bien situé ?",
        order: 2,
      },
      {
        id: "l_10_03",
        unitId: "u_10",
        title: "Le meilleur et le pire",
        description:
          "Les comparatifs irréguliers (mejor, peor, mayor, menor) et les superlatifs (el más…, -ísimo).",
        grammarFocus: "Comparatifs irréguliers, superlatifs",
        grammarIds: ["g_050", "g_051"],
        vocabIds: [
          "v_173", "v_178", "v_187", "v_185", "v_175",
          "v_176", "v_171", "v_172",
        ],
        phraseIds: ["p_027", "p_091", "p_117", "p_118"],
        sentenceIds: ["s_102", "s_103", "s_104", "s_105", "s_144"],
        scenarioTitle: "Palmarès des restaurants",
        scenarioDescription:
          "Donne ton avis sur les meilleurs et les pires restaurants de ta ville. Justifie tes choix.",
        order: 3,
      },
      {
        id: "l_10_04",
        unitId: "u_10",
        title: "L'entretien d'embauche",
        description:
          "Vocabulaire professionnel avancé. Parler de son expérience, ses capacités et ses objectifs.",
        grammarFocus: "Por/para (approfondissement)",
        grammarIds: ["g_042"],
        vocabIds: [
          "v_402", "v_468", "v_416", "v_410", "v_256",
          "v_255", "v_260", "v_119", "v_162", "v_164",
        ],
        phraseIds: ["p_084", "p_086", "p_089", "p_150"],
        sentenceIds: ["s_141", "s_187", "s_191"],
        scenarioTitle: "Simulation d'entretien",
        scenarioDescription:
          "Tu passes un entretien d'embauche en espagnol. Parle de ton parcours, tes compétences et tes motivations.",
        order: 4,
      },
    ],
  },

  {
    id: "u_11",
    title: "Culture",
    theme: "Arts, culture & récits de voyage",
    description:
      "Ser vs estar en profondeur, pronoms COI et double pronom, périphrases verbales. Explorer la culture hispanique.",
    grammarFocus: "Ser/estar avancé, pronoms COI, double pronom, tener que, ir a",
    order: 11,
    lessons: [
      {
        id: "l_11_01",
        unitId: "u_11",
        title: "Ser ou estar ? Les pièges",
        description:
          "Distinction avancée entre ser et estar. Les adjectifs qui changent de sens selon le verbe.",
        grammarFocus: "Ser vs estar (distinction avancée)",
        grammarIds: ["g_040", "g_041"],
        vocabIds: [
          "v_066", "v_067", "v_386", "v_390", "v_187",
          "v_236", "v_233", "v_389", "v_391",
        ],
        phraseIds: ["p_119", "p_120", "p_123", "p_124"],
        sentenceIds: ["s_073", "s_074", "s_075", "s_076", "s_077", "s_078", "s_079"],
        scenarioTitle: "Décrire des personnages",
        scenarioDescription:
          "Décris les personnages d'un film espagnol : leur apparence (ser) et leur état d'esprit (estar).",
        order: 1,
      },
      {
        id: "l_11_02",
        unitId: "u_11",
        title: "Donner et recevoir (pronoms COI)",
        description:
          "Les pronoms compléments d'objet indirect : me, te, le, nos, os, les. Verbes de don et de communication.",
        grammarFocus: "Pronoms COI",
        grammarIds: ["g_045"],
        vocabIds: [
          "v_075", "v_114", "v_073", "v_019", "v_020",
          "v_303", "v_362", "v_366",
        ],
        phraseIds: ["p_138", "p_139", "p_142", "p_146", "p_150"],
        sentenceIds: ["s_089", "s_090", "s_091"],
        scenarioTitle: "Cadeaux de Noël",
        scenarioDescription:
          "C'est Noël. Raconte ce que tu as offert à chacun et ce qu'on t'a donné en utilisant les pronoms COI.",
        order: 2,
      },
      {
        id: "l_11_03",
        unitId: "u_11",
        title: "Le lui, la leur (double pronom)",
        description:
          "Combiner COI et COD dans une même phrase. Le/les → se devant lo/la/los/las.",
        grammarFocus: "Double pronom complément",
        grammarIds: ["g_046"],
        vocabIds: [
          "v_015", "v_016", "v_017", "v_018", "v_019",
          "v_020", "v_075", "v_090",
        ],
        phraseIds: ["p_095", "p_097", "p_099", "p_100"],
        sentenceIds: ["s_092", "s_093", "s_143"],
        scenarioTitle: "Passer le message",
        scenarioDescription:
          "Tu fais l'intermédiaire entre deux amis. Transmets les messages et les objets en utilisant les doubles pronoms.",
        order: 3,
      },
      {
        id: "l_11_04",
        unitId: "u_11",
        title: "Obligations et projets (tener que, ir a)",
        description:
          "Les périphrases verbales tener que + infinitif et ir a + infinitif. Exprimer obligation et intention.",
        grammarFocus: "Tener que, ir a + infinitif",
        grammarIds: ["g_054", "g_055"],
        vocabIds: [
          "v_068", "v_071", "v_080", "v_318", "v_319",
          "v_282", "v_280", "v_117",
        ],
        phraseIds: ["p_087", "p_090", "p_126", "p_134"],
        sentenceIds: ["s_117", "s_168", "s_118", "s_120", "s_176"],
        scenarioTitle: "Organiser un voyage culturel",
        scenarioDescription:
          "Tu organises un voyage culturel en Andalousie. Dis ce que tu dois faire et ce que tu vas visiter.",
        order: 4,
      },
      {
        id: "l_11_05",
        unitId: "u_11",
        title: "Art et culture espagnole",
        description:
          "Vocabulaire de la culture, de l'histoire et des arts. Donner son avis sur des œuvres et événements culturels.",
        grammarFocus: "Révision ser/estar, gustar",
        grammarIds: ["g_040", "g_052"],
        vocabIds: [
          "v_423", "v_424", "v_302", "v_301", "v_303",
          "v_425", "v_426", "v_422",
        ],
        phraseIds: ["p_113", "p_116", "p_117", "p_125"],
        sentenceIds: ["s_075", "s_076", "s_142", "s_150"],
        scenarioTitle: "Visite du musée du Prado",
        scenarioDescription:
          "Tu visites le musée du Prado. Commente les œuvres : ce qui te plaît, ce que tu trouves beau ou ennuyeux.",
        order: 5,
      },
    ],
  },

  {
    id: "u_12",
    title: "Maîtrise B2",
    theme: "Expression complexe",
    description:
      "Révision et consolidation avec les périphrases verbales avancées : acabar de, estar + gérondif, hay que, deber, soler. Expression fluide et nuancée.",
    grammarFocus: "Acabar de, estar + gérondif, hay que, deber, soler",
    order: 12,
    lessons: [
      {
        id: "l_12_01",
        unitId: "u_12",
        title: "Ce qui vient de se passer (acabar de)",
        description:
          "Acabar de + infinitif pour exprimer le passé récent. Réagir à des nouvelles fraîches.",
        grammarFocus: "Acabar de + infinitif",
        grammarIds: ["g_056"],
        vocabIds: [
          "v_134", "v_078", "v_116", "v_253", "v_114",
          "v_128", "v_408", "v_409",
        ],
        phraseIds: ["p_118", "p_119", "p_124", "p_147"],
        sentenceIds: ["s_121", "s_122", "s_156"],
        scenarioTitle: "Flash info",
        scenarioDescription:
          "Tu viens d'apprendre plusieurs nouvelles. Annonce ce qui vient de se passer et réagis.",
        order: 1,
      },
      {
        id: "l_12_02",
        unitId: "u_12",
        title: "En train de… (estar + gérondif)",
        description:
          "La forme progressive estar + gérondif (-ando, -iendo) pour les actions en cours.",
        grammarFocus: "Estar + gérondif",
        grammarIds: ["g_057"],
        vocabIds: [
          "v_067", "v_318", "v_315", "v_107", "v_126",
          "v_100", "v_085", "v_282",
        ],
        phraseIds: ["p_093", "p_096", "p_099", "p_101"],
        sentenceIds: ["s_123", "s_124", "s_125", "s_198"],
        scenarioTitle: "Appel vidéo",
        scenarioDescription:
          "Tu appelles un ami en vidéo. Décris ce que chacun est en train de faire à ce moment.",
        order: 2,
      },
      {
        id: "l_12_03",
        unitId: "u_12",
        title: "Il faut… (hay que, deber)",
        description:
          "Les expressions impersonnelles d'obligation : hay que + infinitif et deber + infinitif.",
        grammarFocus: "Hay que, deber + infinitif",
        grammarIds: ["g_058", "g_059"],
        vocabIds: [
          "v_080", "v_461", "v_460", "v_459", "v_417",
          "v_418", "v_419", "v_420",
        ],
        phraseIds: ["p_114", "p_115", "p_146", "p_148"],
        sentenceIds: ["s_126", "s_127", "s_128", "s_129"],
        scenarioTitle: "Règles de vie commune",
        scenarioDescription:
          "Tu établis les règles de la colocation. Dis ce qu'il faut faire et ce qu'on doit respecter.",
        order: 3,
      },
      {
        id: "l_12_04",
        unitId: "u_12",
        title: "D'habitude… (soler)",
        description:
          "Soler + infinitif pour exprimer les habitudes au présent et à l'imparfait.",
        grammarFocus: "Soler + infinitif",
        grammarIds: ["g_060"],
        vocabIds: [
          "v_052", "v_060", "v_475", "v_476", "v_499",
          "v_500", "v_195", "v_351",
        ],
        phraseIds: ["p_103", "p_108", "p_127", "p_134"],
        sentenceIds: ["s_130", "s_131", "s_179"],
        scenarioTitle: "Comparer les cultures",
        scenarioDescription:
          "Compare les habitudes françaises et espagnoles : ce qu'on a l'habitude de faire en France vs en Espagne.",
        order: 4,
      },
      {
        id: "l_12_05",
        unitId: "u_12",
        title: "Bilan et expression libre",
        description:
          "Révision générale de toutes les structures. S'exprimer librement sur des sujets variés avec fluidité.",
        grammarFocus: "Révision générale",
        grammarIds: ["g_035", "g_033", "g_030"],
        vocabIds: [
          "v_401", "v_403", "v_404", "v_406", "v_407",
          "v_410", "v_411", "v_414", "v_429", "v_444",
        ],
        phraseIds: ["p_113", "p_114", "p_115", "p_125", "p_150"],
        sentenceIds: ["s_053", "s_065", "s_193", "s_200"],
        scenarioTitle: "Mon bilan B2",
        scenarioDescription:
          "Fais le bilan de ton apprentissage. Exprime tes opinions, tes souhaits et tes projets en espagnol avec toutes les structures apprises.",
        order: 5,
      },
    ],
  },
];
