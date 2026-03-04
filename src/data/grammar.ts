import type { GrammarEntry } from "@/lib/types";

export const GRAMMAR: GrammarEntry[] = [
  // ─── PRESENT TENSE: REGULAR VERBS ────────────────────────────────
  {
    id: "g_001",
    title: "Présent : Verbes réguliers en -ar (hablar)",
    explanation:
      "Les verbes réguliers en -ar perdent la terminaison -ar et ajoutent : -o, -as, -a, -amos, -áis, -an.",
    conjugation_table: {
      presente: {
        yo: "hablo",
        tú: "hablas",
        "él/ella": "habla",
        nosotros: "hablamos",
        vosotros: "habláis",
        ellos: "hablan",
      },
    },
    examples: [
      { es: "Yo hablo español todos los días.", fr: "Je parle espagnol tous les jours." },
      { es: "Ellos hablan con sus amigos.", fr: "Ils parlent avec leurs amis." },
    ],
    difficulty: 1,
  },
  {
    id: "g_002",
    title: "Présent : Verbes réguliers en -er (comer)",
    explanation:
      "Les verbes réguliers en -er perdent la terminaison -er et ajoutent : -o, -es, -e, -emos, -éis, -en.",
    conjugation_table: {
      presente: {
        yo: "como",
        tú: "comes",
        "él/ella": "come",
        nosotros: "comemos",
        vosotros: "coméis",
        ellos: "comen",
      },
    },
    examples: [
      { es: "Nosotros comemos a las dos.", fr: "Nous mangeons à deux heures." },
      { es: "¿Tú comes carne?", fr: "Tu manges de la viande ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_003",
    title: "Présent : Verbes réguliers en -ir (vivir)",
    explanation:
      "Les verbes réguliers en -ir perdent la terminaison -ir et ajoutent : -o, -es, -e, -imos, -ís, -en.",
    conjugation_table: {
      presente: {
        yo: "vivo",
        tú: "vives",
        "él/ella": "vive",
        nosotros: "vivimos",
        vosotros: "vivís",
        ellos: "viven",
      },
    },
    examples: [
      { es: "Yo vivo en Madrid.", fr: "Je vis à Madrid." },
      { es: "Ellos viven cerca del centro.", fr: "Ils vivent près du centre-ville." },
    ],
    difficulty: 1,
  },
  // ─── PRESENT TENSE: KEY IRREGULARS ───────────────────────────────
  {
    id: "g_004",
    title: "Présent : Ser (être – identité/caractéristiques)",
    explanation:
      "Ser s'utilise pour l'identité, l'origine, la profession, les caractéristiques, l'heure et les dates. Très irrégulier.",
    conjugation_table: {
      presente: {
        yo: "soy",
        tú: "eres",
        "él/ella": "es",
        nosotros: "somos",
        vosotros: "sois",
        ellos: "son",
      },
    },
    examples: [
      { es: "Yo soy estudiante.", fr: "Je suis étudiant." },
      { es: "Ellos son de México.", fr: "Ils sont du Mexique." },
    ],
    difficulty: 1,
  },
  {
    id: "g_005",
    title: "Présent : Estar (être – état/localisation)",
    explanation:
      "Estar s'utilise pour la localisation, les états temporaires, les émotions et les conditions.",
    conjugation_table: {
      presente: {
        yo: "estoy",
        tú: "estás",
        "él/ella": "está",
        nosotros: "estamos",
        vosotros: "estáis",
        ellos: "están",
      },
    },
    examples: [
      { es: "Estoy cansado hoy.", fr: "Je suis fatigué aujourd'hui." },
      { es: "El restaurante está en la esquina.", fr: "Le restaurant est au coin de la rue." },
    ],
    difficulty: 1,
  },
  {
    id: "g_006",
    title: "Présent : Ir (aller)",
    explanation:
      "Ir est complètement irrégulier au présent. Souvent utilisé avec 'a' + infinitif pour le futur proche.",
    conjugation_table: {
      presente: {
        yo: "voy",
        tú: "vas",
        "él/ella": "va",
        nosotros: "vamos",
        vosotros: "vais",
        ellos: "van",
      },
    },
    examples: [
      { es: "Voy al supermercado.", fr: "Je vais au supermarché." },
      { es: "¿Adónde van ustedes?", fr: "Où allez-vous ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_007",
    title: "Présent : Tener (avoir)",
    explanation:
      "Tener est un verbe en -go (tengo) avec changement de radical e→ie. Également utilisé dans de nombreuses expressions idiomatiques.",
    conjugation_table: {
      presente: {
        yo: "tengo",
        tú: "tienes",
        "él/ella": "tiene",
        nosotros: "tenemos",
        vosotros: "tenéis",
        ellos: "tienen",
      },
    },
    examples: [
      { es: "Tengo dos hermanos.", fr: "J'ai deux frères." },
      { es: "Ella tiene mucha hambre.", fr: "Elle a très faim." },
    ],
    difficulty: 1,
  },
  {
    id: "g_008",
    title: "Présent : Hacer (faire)",
    explanation:
      "Hacer est un verbe en -go (hago) à la première personne. Régulier aux autres formes du présent.",
    conjugation_table: {
      presente: {
        yo: "hago",
        tú: "haces",
        "él/ella": "hace",
        nosotros: "hacemos",
        vosotros: "hacéis",
        ellos: "hacen",
      },
    },
    examples: [
      { es: "¿Qué haces los fines de semana?", fr: "Que fais-tu le week-end ?" },
      { es: "Hago ejercicio por la mañana.", fr: "Je fais de l'exercice le matin." },
    ],
    difficulty: 1,
  },
  {
    id: "g_009",
    title: "Présent : Poder (pouvoir)",
    explanation:
      "Poder est un verbe à changement de radical o→ue. Utilisé avec l'infinitif pour exprimer la capacité ou la permission.",
    conjugation_table: {
      presente: {
        yo: "puedo",
        tú: "puedes",
        "él/ella": "puede",
        nosotros: "podemos",
        vosotros: "podéis",
        ellos: "pueden",
      },
    },
    examples: [
      { es: "¿Puedes ayudarme?", fr: "Peux-tu m'aider ?" },
      { es: "No podemos ir mañana.", fr: "Nous ne pouvons pas y aller demain." },
    ],
    difficulty: 1,
  },
  {
    id: "g_010",
    title: "Présent : Querer (vouloir/aimer)",
    explanation:
      "Querer est un verbe à changement de radical e→ie. Signifie 'vouloir' ou 'aimer' selon le contexte.",
    conjugation_table: {
      presente: {
        yo: "quiero",
        tú: "quieres",
        "él/ella": "quiere",
        nosotros: "queremos",
        vosotros: "queréis",
        ellos: "quieren",
      },
    },
    examples: [
      { es: "Quiero un café, por favor.", fr: "Je veux un café, s'il vous plaît." },
      { es: "Te quiero mucho.", fr: "Je t'aime beaucoup." },
    ],
    difficulty: 1,
  },
  {
    id: "g_011",
    title: "Présent : Saber (savoir)",
    explanation:
      "Saber est un verbe en -go (sé) à la première personne. Utilisé pour les connaissances factuelles ou les compétences (saber + infinitif).",
    conjugation_table: {
      presente: {
        yo: "sé",
        tú: "sabes",
        "él/ella": "sabe",
        nosotros: "sabemos",
        vosotros: "sabéis",
        ellos: "saben",
      },
    },
    examples: [
      { es: "Yo sé nadar.", fr: "Je sais nager." },
      { es: "¿Sabes dónde está la estación?", fr: "Tu sais où est la gare ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_012",
    title: "Présent : Decir (dire)",
    explanation:
      "Decir est un verbe en -go (digo) avec changement de radical e→i. Très irrégulier.",
    conjugation_table: {
      presente: {
        yo: "digo",
        tú: "dices",
        "él/ella": "dice",
        nosotros: "decimos",
        vosotros: "decís",
        ellos: "dicen",
      },
    },
    examples: [
      { es: "¿Qué dices?", fr: "Qu'est-ce que tu dis ?" },
      { es: "Siempre digo la verdad.", fr: "Je dis toujours la vérité." },
    ],
    difficulty: 1,
  },
  {
    id: "g_013",
    title: "Présent : Venir (venir)",
    explanation:
      "Venir est un verbe en -go (vengo) avec changement de radical e→ie.",
    conjugation_table: {
      presente: {
        yo: "vengo",
        tú: "vienes",
        "él/ella": "viene",
        nosotros: "venimos",
        vosotros: "venís",
        ellos: "vienen",
      },
    },
    examples: [
      { es: "Vengo de la oficina.", fr: "Je viens du bureau." },
      { es: "¿Vienes a la fiesta?", fr: "Tu viens à la fête ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_014",
    title: "Présent : Poner (mettre/poser)",
    explanation:
      "Poner est un verbe en -go (pongo) à la première personne. Régulier aux autres formes du présent.",
    conjugation_table: {
      presente: {
        yo: "pongo",
        tú: "pones",
        "él/ella": "pone",
        nosotros: "ponemos",
        vosotros: "ponéis",
        ellos: "ponen",
      },
    },
    examples: [
      { es: "Pongo la mesa antes de cenar.", fr: "Je mets la table avant le dîner." },
      { es: "¿Dónde pones las llaves?", fr: "Où mets-tu les clés ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_015",
    title: "Présent : Salir (sortir/partir)",
    explanation:
      "Salir est un verbe en -go (salgo) à la première personne.",
    conjugation_table: {
      presente: {
        yo: "salgo",
        tú: "sales",
        "él/ella": "sale",
        nosotros: "salimos",
        vosotros: "salís",
        ellos: "salen",
      },
    },
    examples: [
      { es: "Salgo de casa a las ocho.", fr: "Je sors de la maison à huit heures." },
      { es: "¿Sales esta noche?", fr: "Tu sors ce soir ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_016",
    title: "Présent : Conocer (connaître)",
    explanation:
      "Conocer a un changement zc à la première personne (conozco). Utilisé pour la connaissance de personnes et de lieux.",
    conjugation_table: {
      presente: {
        yo: "conozco",
        tú: "conoces",
        "él/ella": "conoce",
        nosotros: "conocemos",
        vosotros: "conocéis",
        ellos: "conocen",
      },
    },
    examples: [
      { es: "Conozco bien esta ciudad.", fr: "Je connais bien cette ville." },
      { es: "¿Conoces a mi hermana?", fr: "Tu connais ma sœur ?" },
    ],
    difficulty: 1,
  },
  // ─── PRETERITE TENSE ─────────────────────────────────────────────
  {
    id: "g_017",
    title: "Prétérit : Verbes réguliers en -ar",
    explanation:
      "Le prétérit exprime des actions passées accomplies. Terminaisons régulières en -ar : -é, -aste, -ó, -amos, -asteis, -aron.",
    conjugation_table: {
      pretérito: {
        yo: "hablé",
        tú: "hablaste",
        "él/ella": "habló",
        nosotros: "hablamos",
        vosotros: "hablasteis",
        ellos: "hablaron",
      },
    },
    examples: [
      { es: "Ayer hablé con mi madre.", fr: "Hier j'ai parlé avec ma mère." },
      { es: "Ellos hablaron durante horas.", fr: "Ils ont parlé pendant des heures." },
    ],
    difficulty: 1,
  },
  {
    id: "g_018",
    title: "Prétérit : Verbes réguliers en -er/-ir",
    explanation:
      "Terminaisons régulières du prétérit en -er/-ir : -í, -iste, -ió, -imos, -isteis, -ieron.",
    conjugation_table: {
      pretérito: {
        yo: "comí",
        tú: "comiste",
        "él/ella": "comió",
        nosotros: "comimos",
        vosotros: "comisteis",
        ellos: "comieron",
      },
    },
    examples: [
      { es: "Comí paella en Valencia.", fr: "J'ai mangé de la paella à Valence." },
      { es: "Vivimos allí tres años.", fr: "Nous avons vécu là-bas pendant trois ans." },
    ],
    difficulty: 1,
  },
  {
    id: "g_019",
    title: "Prétérit : Ser / Ir (formes identiques)",
    explanation:
      "Ser et ir partagent les mêmes formes au prétérit. Le contexte détermine le sens.",
    conjugation_table: {
      pretérito: {
        yo: "fui",
        tú: "fuiste",
        "él/ella": "fue",
        nosotros: "fuimos",
        vosotros: "fuisteis",
        ellos: "fueron",
      },
    },
    examples: [
      { es: "Fui al cine anoche.", fr: "Je suis allé au cinéma hier soir." },
      { es: "Fue un día maravilloso.", fr: "C'était une journée merveilleuse." },
    ],
    difficulty: 2,
  },
  {
    id: "g_020",
    title: "Prétérit : Tener (irrégulier)",
    explanation:
      "Tener utilise un radical irrégulier (tuv-) au prétérit avec des terminaisons spéciales.",
    conjugation_table: {
      pretérito: {
        yo: "tuve",
        tú: "tuviste",
        "él/ella": "tuvo",
        nosotros: "tuvimos",
        vosotros: "tuvisteis",
        ellos: "tuvieron",
      },
    },
    examples: [
      { es: "Tuve un problema con el coche.", fr: "J'ai eu un problème avec la voiture." },
      { es: "Tuvimos suerte.", fr: "Nous avons eu de la chance." },
    ],
    difficulty: 2,
  },
  {
    id: "g_021",
    title: "Prétérit : Hacer (irrégulier)",
    explanation:
      "Hacer utilise un radical irrégulier (hic-/hiz-) au prétérit.",
    conjugation_table: {
      pretérito: {
        yo: "hice",
        tú: "hiciste",
        "él/ella": "hizo",
        nosotros: "hicimos",
        vosotros: "hicisteis",
        ellos: "hicieron",
      },
    },
    examples: [
      { es: "¿Qué hiciste ayer?", fr: "Qu'as-tu fait hier ?" },
      { es: "Hizo mucho frío.", fr: "Il a fait très froid." },
    ],
    difficulty: 2,
  },
  {
    id: "g_022",
    title: "Prétérit : Estar (irrégulier)",
    explanation:
      "Estar utilise un radical irrégulier (estuv-) au prétérit.",
    conjugation_table: {
      pretérito: {
        yo: "estuve",
        tú: "estuviste",
        "él/ella": "estuvo",
        nosotros: "estuvimos",
        vosotros: "estuvisteis",
        ellos: "estuvieron",
      },
    },
    examples: [
      { es: "Estuve en Barcelona la semana pasada.", fr: "J'étais à Barcelone la semaine dernière." },
      { es: "Estuvimos muy contentos.", fr: "Nous étions très contents." },
    ],
    difficulty: 2,
  },
  {
    id: "g_023",
    title: "Prétérit : Poder (irrégulier)",
    explanation:
      "Poder utilise un radical irrégulier (pud-) au prétérit. Signifie souvent 'réussir à' ou 'ne pas réussir à'.",
    conjugation_table: {
      pretérito: {
        yo: "pude",
        tú: "pudiste",
        "él/ella": "pudo",
        nosotros: "pudimos",
        vosotros: "pudisteis",
        ellos: "pudieron",
      },
    },
    examples: [
      { es: "No pude dormir anoche.", fr: "Je n'ai pas pu dormir hier soir." },
      { es: "Pudimos terminar a tiempo.", fr: "Nous avons réussi à finir à temps." },
    ],
    difficulty: 2,
  },
  {
    id: "g_024",
    title: "Prétérit : Decir (irrégulier)",
    explanation:
      "Decir utilise un radical irrégulier (dij-) au prétérit. La troisième personne du pluriel est dijeron (sans i).",
    conjugation_table: {
      pretérito: {
        yo: "dije",
        tú: "dijiste",
        "él/ella": "dijo",
        nosotros: "dijimos",
        vosotros: "dijisteis",
        ellos: "dijeron",
      },
    },
    examples: [
      { es: "Me dijo la verdad.", fr: "Il m'a dit la vérité." },
      { es: "¿Qué dijiste?", fr: "Qu'as-tu dit ?" },
    ],
    difficulty: 2,
  },
  {
    id: "g_025",
    title: "Prétérit : Querer (irrégulier)",
    explanation:
      "Querer utilise un radical irrégulier (quis-) au prétérit. Peut signifier 'essayer de' (affirmatif) ou 'refuser de' (négatif).",
    conjugation_table: {
      pretérito: {
        yo: "quise",
        tú: "quisiste",
        "él/ella": "quiso",
        nosotros: "quisimos",
        vosotros: "quisisteis",
        ellos: "quisieron",
      },
    },
    examples: [
      { es: "Quise llamarte pero no pude.", fr: "J'ai essayé de t'appeler mais je n'ai pas pu." },
      { es: "No quiso venir.", fr: "Il/Elle a refusé de venir." },
    ],
    difficulty: 2,
  },
  // ─── IMPERFECT TENSE ─────────────────────────────────────────────
  {
    id: "g_026",
    title: "Imparfait : Verbes réguliers en -ar",
    explanation:
      "L'imparfait décrit des actions passées habituelles ou continues. Terminaisons régulières en -ar : -aba, -abas, -aba, -ábamos, -abais, -aban.",
    conjugation_table: {
      imperfecto: {
        yo: "hablaba",
        tú: "hablabas",
        "él/ella": "hablaba",
        nosotros: "hablábamos",
        vosotros: "hablabais",
        ellos: "hablaban",
      },
    },
    examples: [
      { es: "De niño, hablaba mucho.", fr: "Enfant, je parlais beaucoup." },
      { es: "Siempre caminaban juntos.", fr: "Ils marchaient toujours ensemble." },
    ],
    difficulty: 2,
  },
  {
    id: "g_027",
    title: "Imparfait : Verbes réguliers en -er/-ir",
    explanation:
      "Terminaisons régulières de l'imparfait en -er/-ir : -ía, -ías, -ía, -íamos, -íais, -ían.",
    conjugation_table: {
      imperfecto: {
        yo: "comía",
        tú: "comías",
        "él/ella": "comía",
        nosotros: "comíamos",
        vosotros: "comíais",
        ellos: "comían",
      },
    },
    examples: [
      { es: "Cuando era joven, comía de todo.", fr: "Quand j'étais jeune, je mangeais de tout." },
      { es: "Vivían en un pueblo pequeño.", fr: "Ils vivaient dans un petit village." },
    ],
    difficulty: 2,
  },
  {
    id: "g_028",
    title: "Imparfait : Ser (irrégulier)",
    explanation:
      "Ser est l'un des trois seuls verbes irréguliers à l'imparfait (ser, ir, ver).",
    conjugation_table: {
      imperfecto: {
        yo: "era",
        tú: "eras",
        "él/ella": "era",
        nosotros: "éramos",
        vosotros: "erais",
        ellos: "eran",
      },
    },
    examples: [
      { es: "Era muy tímido de pequeño.", fr: "J'étais très timide quand j'étais petit." },
      { es: "Eran las diez de la noche.", fr: "Il était dix heures du soir." },
    ],
    difficulty: 2,
  },
  {
    id: "g_029",
    title: "Imparfait : Ir (irrégulier)",
    explanation:
      "Ir est irrégulier à l'imparfait : iba, ibas, iba, íbamos, ibais, iban.",
    conjugation_table: {
      imperfecto: {
        yo: "iba",
        tú: "ibas",
        "él/ella": "iba",
        nosotros: "íbamos",
        vosotros: "ibais",
        ellos: "iban",
      },
    },
    examples: [
      { es: "Iba al parque todos los domingos.", fr: "J'allais au parc tous les dimanches." },
      { es: "Íbamos de vacaciones cada verano.", fr: "Nous partions en vacances chaque été." },
    ],
    difficulty: 2,
  },
  {
    id: "g_030",
    title: "Prétérit vs. Imparfait",
    explanation:
      "Le prétérit s'utilise pour les événements ponctuels et accomplis. L'imparfait s'utilise pour les actions continues, habituelles ou de fond. Ils apparaissent souvent ensemble dans la narration.",
    examples: [
      { es: "Llovía cuando salí de casa.", fr: "Il pleuvait quand je suis sorti de la maison." },
      { es: "Mientras comíamos, sonó el teléfono.", fr: "Pendant que nous mangions, le téléphone a sonné." },
      { es: "De niño jugaba al fútbol, pero un día me rompí la pierna.", fr: "Enfant, je jouais au football, mais un jour je me suis cassé la jambe." },
    ],
    difficulty: 2,
  },
  // ─── FUTURE TENSE ────────────────────────────────────────────────
  {
    id: "g_031",
    title: "Futur : Verbes réguliers",
    explanation:
      "Le futur ajoute les terminaisons à l'infinitif complet : -é, -ás, -á, -emos, -éis, -án. Fonctionne de la même manière pour -ar, -er, -ir.",
    conjugation_table: {
      futuro: {
        yo: "hablaré",
        tú: "hablarás",
        "él/ella": "hablará",
        nosotros: "hablaremos",
        vosotros: "hablaréis",
        ellos: "hablarán",
      },
    },
    examples: [
      { es: "Mañana hablaré con el jefe.", fr: "Demain je parlerai avec le patron." },
      { es: "Comeremos en ese restaurante.", fr: "Nous mangerons dans ce restaurant." },
    ],
    difficulty: 2,
  },
  {
    id: "g_032",
    title: "Futur : Radicaux irréguliers",
    explanation:
      "Certains verbes ont des radicaux irréguliers au futur : tener→tendr-, poder→podr-, saber→sabr-, hacer→har-, decir→dir-, salir→saldr-, venir→vendr-, poner→pondr-, querer→querr-, haber→habr-. Les terminaisons restent les mêmes.",
    conjugation_table: {
      futuro: {
        yo: "tendré",
        tú: "tendrás",
        "él/ella": "tendrá",
        nosotros: "tendremos",
        vosotros: "tendréis",
        ellos: "tendrán",
      },
    },
    examples: [
      { es: "Tendré más tiempo la semana que viene.", fr: "J'aurai plus de temps la semaine prochaine." },
      { es: "Podrás hacerlo sin problemas.", fr: "Tu pourras le faire sans problème." },
      { es: "Saldremos temprano.", fr: "Nous partirons tôt." },
    ],
    difficulty: 2,
  },
  // ─── CONDITIONAL ─────────────────────────────────────────────────
  {
    id: "g_033",
    title: "Conditionnel : Verbes réguliers",
    explanation:
      "Le conditionnel ajoute les terminaisons à l'infinitif complet : -ía, -ías, -ía, -íamos, -íais, -ían. Exprime le conditionnel ou des demandes polies.",
    conjugation_table: {
      condicional: {
        yo: "hablaría",
        tú: "hablarías",
        "él/ella": "hablaría",
        nosotros: "hablaríamos",
        vosotros: "hablaríais",
        ellos: "hablarían",
      },
    },
    examples: [
      { es: "Me gustaría un café.", fr: "Je voudrais un café." },
      { es: "¿Podrías ayudarme?", fr: "Pourrais-tu m'aider ?" },
    ],
    difficulty: 2,
  },
  {
    id: "g_034",
    title: "Conditionnel : Radicaux irréguliers",
    explanation:
      "Le conditionnel utilise les mêmes radicaux irréguliers que le futur : tener→tendr-, poder→podr-, hacer→har-, etc.",
    conjugation_table: {
      condicional: {
        yo: "tendría",
        tú: "tendrías",
        "él/ella": "tendría",
        nosotros: "tendríamos",
        vosotros: "tendríais",
        ellos: "tendrían",
      },
    },
    examples: [
      { es: "Yo haría las cosas de otra manera.", fr: "Je ferais les choses autrement." },
      { es: "Vendríamos, pero estamos ocupados.", fr: "Nous viendrions, mais nous sommes occupés." },
    ],
    difficulty: 2,
  },
  // ─── SUBJUNCTIVE ─────────────────────────────────────────────────
  {
    id: "g_035",
    title: "Subjonctif présent : Verbes réguliers en -ar",
    explanation:
      "Le subjonctif exprime les souhaits, les doutes, les émotions et les hypothèses. Les verbes réguliers en -ar prennent les terminaisons en -e : -e, -es, -e, -emos, -éis, -en.",
    conjugation_table: {
      "subjuntivo presente": {
        yo: "hable",
        tú: "hables",
        "él/ella": "hable",
        nosotros: "hablemos",
        vosotros: "habléis",
        ellos: "hablen",
      },
    },
    examples: [
      { es: "Quiero que hables más despacio.", fr: "Je veux que tu parles plus lentement." },
      { es: "Es importante que estudies.", fr: "Il est important que tu étudies." },
    ],
    difficulty: 3,
  },
  {
    id: "g_036",
    title: "Subjonctif présent : Verbes réguliers en -er/-ir",
    explanation:
      "Les verbes réguliers en -er/-ir prennent les terminaisons en -a au subjonctif : -a, -as, -a, -amos, -áis, -an.",
    conjugation_table: {
      "subjuntivo presente": {
        yo: "coma",
        tú: "comas",
        "él/ella": "coma",
        nosotros: "comamos",
        vosotros: "comáis",
        ellos: "coman",
      },
    },
    examples: [
      { es: "Espero que comas bien.", fr: "J'espère que tu manges bien." },
      { es: "Dudo que vivan aquí.", fr: "Je doute qu'ils vivent ici." },
    ],
    difficulty: 3,
  },
  {
    id: "g_037",
    title: "Déclencheurs du subjonctif : Souhaits et désirs",
    explanation:
      "Le subjonctif est déclenché après les verbes de volonté/souhait lorsqu'il y a un changement de sujet : querer que, desear que, esperar que, preferir que.",
    examples: [
      { es: "Quiero que vengas a mi fiesta.", fr: "Je veux que tu viennes à ma fête." },
      { es: "Esperamos que todo salga bien.", fr: "Nous espérons que tout se passe bien." },
      { es: "Prefiero que no digas nada.", fr: "Je préfère que tu ne dises rien." },
    ],
    difficulty: 3,
  },
  {
    id: "g_038",
    title: "Déclencheurs du subjonctif : Émotions",
    explanation:
      "Les expressions d'émotion déclenchent le subjonctif : me alegra que, siento que, me sorprende que, tengo miedo de que.",
    examples: [
      { es: "Me alegra que estés aquí.", fr: "Je suis content que tu sois ici." },
      { es: "Siento que no puedas venir.", fr: "Je suis désolé que tu ne puisses pas venir." },
    ],
    difficulty: 3,
  },
  {
    id: "g_039",
    title: "Déclencheurs du subjonctif : Doute et négation",
    explanation:
      "Les expressions de doute ou de négation déclenchent le subjonctif : dudar que, no creer que, no es cierto que, es posible que.",
    examples: [
      { es: "Dudo que llueva mañana.", fr: "Je doute qu'il pleuve demain." },
      { es: "No creo que sea verdad.", fr: "Je ne crois pas que ce soit vrai." },
      { es: "Es posible que lleguen tarde.", fr: "Il est possible qu'ils arrivent en retard." },
    ],
    difficulty: 3,
  },
  // ─── SER VS ESTAR ────────────────────────────────────────────────
  {
    id: "g_040",
    title: "Ser vs. Estar : Distinction fondamentale",
    explanation:
      "Ser s'utilise pour les qualités permanentes/inhérentes (identité, origine, profession, matériau, heure). Estar s'utilise pour les états/conditions temporaires (localisation, émotions, santé, ressentis météo).",
    examples: [
      { es: "María es alta. (inherent)", fr: "María est grande. (inhérent)" },
      { es: "María está enferma. (temporary)", fr: "María est malade. (temporaire)" },
      { es: "La fiesta es en mi casa. (event location)", fr: "La fête est chez moi. (lieu d'événement)" },
      { es: "Mi casa está en el centro. (physical location)", fr: "Ma maison est dans le centre-ville. (lieu physique)" },
    ],
    difficulty: 1,
  },
  {
    id: "g_041",
    title: "Ser vs. Estar : Adjectifs qui changent de sens",
    explanation:
      "Certains adjectifs changent de sens avec ser ou estar : ser listo = être intelligent, estar listo = être prêt ; ser aburrido = être ennuyeux, estar aburrido = s'ennuyer ; ser malo = être méchant, estar malo = être malade.",
    examples: [
      { es: "Es muy listo. / Está listo.", fr: "Il est très intelligent. / Il est prêt." },
      { es: "La película es aburrida. / Estoy aburrido.", fr: "Le film est ennuyeux. / Je m'ennuie." },
      { es: "Es malo. / Está malo.", fr: "Il est méchant. / Il est malade." },
    ],
    difficulty: 2,
  },
  // ─── POR VS PARA ─────────────────────────────────────────────────
  {
    id: "g_042",
    title: "Por : Utilisations principales",
    explanation:
      "Por s'utilise pour : la cause/raison (à cause de), l'échange, la durée, le mouvement à travers, le moyen de communication/transport, et par.",
    examples: [
      { es: "Gracias por tu ayuda.", fr: "Merci pour ton aide." },
      { es: "Pagué diez euros por el libro.", fr: "J'ai payé dix euros pour le livre." },
      { es: "Caminamos por el parque.", fr: "Nous avons marché à travers le parc." },
      { es: "Hablé con él por teléfono.", fr: "J'ai parlé avec lui par téléphone." },
    ],
    difficulty: 2,
  },
  {
    id: "g_043",
    title: "Para : Utilisations principales",
    explanation:
      "Para s'utilise pour : le but/objectif (afin de), le destinataire (pour quelqu'un), la destination, la date limite et l'opinion.",
    examples: [
      { es: "Estudio para aprender.", fr: "J'étudie pour apprendre." },
      { es: "Este regalo es para ti.", fr: "Ce cadeau est pour toi." },
      { es: "Salimos para Madrid mañana.", fr: "Nous partons pour Madrid demain." },
      { es: "Para mí, es muy importante.", fr: "Pour moi, c'est très important." },
    ],
    difficulty: 2,
  },
  // ─── OBJECT PRONOUNS ─────────────────────────────────────────────
  {
    id: "g_044",
    title: "Pronoms compléments d'objet direct",
    explanation:
      "Les pronoms COD remplacent le nom recevant l'action : me, te, lo/la, nos, os, los/las. Ils se placent avant le verbe conjugué ou s'attachent aux infinitifs/gérondifs.",
    examples: [
      { es: "¿El libro? Lo tengo aquí.", fr: "Le livre ? Je l'ai ici." },
      { es: "No la conozco.", fr: "Je ne la connais pas." },
      { es: "Voy a comprarlos. / Los voy a comprar.", fr: "Je vais les acheter." },
    ],
    difficulty: 2,
  },
  {
    id: "g_045",
    title: "Pronoms compléments d'objet indirect",
    explanation:
      "Les pronoms COI indiquent à/pour qui : me, te, le, nos, os, les. Souvent utilisés avec les verbes de don, de parole et d'envoi.",
    examples: [
      { es: "Le dije la verdad.", fr: "Je lui ai dit la vérité." },
      { es: "Nos envió un mensaje.", fr: "Il/Elle nous a envoyé un message." },
      { es: "Te voy a dar un regalo.", fr: "Je vais te donner un cadeau." },
    ],
    difficulty: 2,
  },
  {
    id: "g_046",
    title: "Double pronom complément",
    explanation:
      "Quand les pronoms COI et COD sont utilisés ensemble, le COI vient en premier. Le/les devient 'se' devant lo/la/los/las.",
    examples: [
      { es: "Se lo di. (I gave it to him/her)", fr: "Je le lui ai donné." },
      { es: "¿Me lo puedes pasar?", fr: "Tu peux me le passer ?" },
      { es: "Te las envío mañana.", fr: "Je te les envoie demain." },
    ],
    difficulty: 3,
  },
  // ─── REFLEXIVE VERBS ─────────────────────────────────────────────
  {
    id: "g_047",
    title: "Verbes pronominaux : Introduction",
    explanation:
      "Les verbes pronominaux indiquent que le sujet effectue l'action sur lui-même. Pronoms réfléchis : me, te, se, nos, os, se. Verbes pronominaux courants : levantarse, ducharse, vestirse, acostarse, llamarse.",
    conjugation_table: {
      presente: {
        yo: "me levanto",
        tú: "te levantas",
        "él/ella": "se levanta",
        nosotros: "nos levantamos",
        vosotros: "os levantáis",
        ellos: "se levantan",
      },
    },
    examples: [
      { es: "Me levanto a las siete.", fr: "Je me lève à sept heures." },
      { es: "Se ducha por la mañana.", fr: "Il/Elle se douche le matin." },
    ],
    difficulty: 1,
  },
  {
    id: "g_048",
    title: "Verbes pronominaux : Routine quotidienne",
    explanation:
      "De nombreux verbes de la routine quotidienne sont pronominaux : despertarse (se réveiller), lavarse (se laver), peinarse (se peigner), afeitarse (se raser), acostarse (se coucher), dormirse (s'endormir).",
    examples: [
      { es: "Me despierto temprano.", fr: "Je me réveille tôt." },
      { es: "Se acuestan a las once.", fr: "Ils se couchent à onze heures." },
      { es: "Nos vestimos rápido.", fr: "Nous nous habillons vite." },
    ],
    difficulty: 1,
  },
  // ─── COMPARATIVES AND SUPERLATIVES ────────────────────────────────
  {
    id: "g_049",
    title: "Comparatifs : más/menos ... que",
    explanation:
      "Pour comparer, utiliser 'más + adjectif + que' (plus que) ou 'menos + adjectif + que' (moins que). Pour les comparaisons d'égalité : 'tan + adjectif + como'.",
    examples: [
      { es: "Madrid es más grande que Barcelona.", fr: "Madrid est plus grand que Barcelone." },
      { es: "Este libro es menos interesante que el otro.", fr: "Ce livre est moins intéressant que l'autre." },
      { es: "Soy tan alto como mi hermano.", fr: "Je suis aussi grand que mon frère." },
    ],
    difficulty: 1,
  },
  {
    id: "g_050",
    title: "Comparatifs irréguliers",
    explanation:
      "Certains adjectifs ont des formes comparatives irrégulières : bueno→mejor, malo→peor, grande→mayor, pequeño→menor. Ceux-ci n'utilisent pas 'más'.",
    examples: [
      { es: "Este restaurante es mejor que aquel.", fr: "Ce restaurant est meilleur que celui-là." },
      { es: "Mi hermano mayor vive en Londres.", fr: "Mon frère aîné vit à Londres." },
      { es: "Hoy me siento peor que ayer.", fr: "Aujourd'hui je me sens plus mal qu'hier." },
    ],
    difficulty: 2,
  },
  {
    id: "g_051",
    title: "Superlatifs",
    explanation:
      "Le superlatif utilise 'el/la/los/las + más/menos + adjectif (+ de)'. Le superlatif absolu utilise -ísimo/a : rápido → rapidísimo.",
    examples: [
      { es: "Es la ciudad más bonita de España.", fr: "C'est la plus belle ville d'Espagne." },
      { es: "Es el estudiante menos aplicado de la clase.", fr: "C'est l'élève le moins appliqué de la classe." },
      { es: "La comida estaba buenísima.", fr: "La nourriture était excellente." },
    ],
    difficulty: 2,
  },
  // ─── GUSTAR-LIKE VERBS ───────────────────────────────────────────
  {
    id: "g_052",
    title: "Gustar (aimer/plaire)",
    explanation:
      "Gustar utilise les pronoms COI (me, te, le, nos, os, les) + gusta (singulier) ou gustan (pluriel). La chose aimée est le sujet.",
    examples: [
      { es: "Me gusta el café.", fr: "J'aime le café." },
      { es: "¿Te gustan los deportes?", fr: "Tu aimes les sports ?" },
      { es: "Nos gusta viajar.", fr: "Nous aimons voyager." },
    ],
    difficulty: 1,
  },
  {
    id: "g_053",
    title: "Autres verbes de type gustar",
    explanation:
      "Plusieurs verbes suivent le modèle de gustar : encantar (adorer), molestar (déranger), importar (importer), interesar (intéresser), faltar (manquer), doler (avoir mal), parecer (sembler).",
    examples: [
      { es: "Me encanta la música.", fr: "J'adore la musique." },
      { es: "¿Te duele la cabeza?", fr: "Tu as mal à la tête ?" },
      { es: "No me importa.", fr: "Ça m'est égal." },
      { es: "Les interesa la historia.", fr: "Ils s'intéressent à l'histoire." },
    ],
    difficulty: 2,
  },
  // ─── COMMON VERB PHRASES ─────────────────────────────────────────
  {
    id: "g_054",
    title: "Tener que + Infinitif (devoir)",
    explanation:
      "Tener que + infinitif exprime l'obligation ou la nécessité. Conjuguer tener ; le second verbe reste à l'infinitif.",
    examples: [
      { es: "Tengo que estudiar para el examen.", fr: "Je dois étudier pour l'examen." },
      { es: "Tienes que comer más verduras.", fr: "Tu dois manger plus de légumes." },
    ],
    difficulty: 1,
  },
  {
    id: "g_055",
    title: "Ir a + Infinitif (futur proche)",
    explanation:
      "Ir a + infinitif exprime des projets ou intentions dans un futur proche. Conjuguer ir ; le verbe d'action reste à l'infinitif.",
    examples: [
      { es: "Voy a cocinar esta noche.", fr: "Je vais cuisiner ce soir." },
      { es: "¿Vas a venir a la fiesta?", fr: "Tu vas venir à la fête ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_056",
    title: "Acabar de + Infinitif (venir de faire)",
    explanation:
      "Acabar de + infinitif signifie 'venir de faire quelque chose'. Conjuguer acabar au présent pour le passé récent.",
    examples: [
      { es: "Acabo de llegar.", fr: "Je viens d'arriver." },
      { es: "Acabamos de comer.", fr: "Nous venons de manger." },
    ],
    difficulty: 2,
  },
  {
    id: "g_057",
    title: "Estar + Gérondif (en train de)",
    explanation:
      "Estar + gérondif (-ando pour -ar, -iendo pour -er/-ir) exprime des actions en cours.",
    conjugation_table: {
      "presente progresivo": {
        yo: "estoy hablando",
        tú: "estás hablando",
        "él/ella": "está hablando",
        nosotros: "estamos hablando",
        vosotros: "estáis hablando",
        ellos: "están hablando",
      },
    },
    examples: [
      { es: "Estoy estudiando español.", fr: "Je suis en train d'étudier l'espagnol." },
      { es: "¿Qué estás haciendo?", fr: "Qu'est-ce que tu fais ?" },
    ],
    difficulty: 1,
  },
  {
    id: "g_058",
    title: "Hay que + Infinitif (il faut)",
    explanation:
      "Hay que + infinitif est une expression impersonnelle signifiant 'il faut'. Elle ne précise pas qui.",
    examples: [
      { es: "Hay que practicar todos los días.", fr: "Il faut pratiquer tous les jours." },
      { es: "Hay que tener paciencia.", fr: "Il faut être patient." },
    ],
    difficulty: 1,
  },
  {
    id: "g_059",
    title: "Deber + Infinitif (devoir)",
    explanation:
      "Deber + infinitif exprime une obligation morale ou un conseil appuyé (devoir). Deber de + infinitif exprime la probabilité.",
    examples: [
      { es: "Debes dormir más.", fr: "Tu devrais dormir davantage." },
      { es: "Debemos respetar las reglas.", fr: "Nous devons respecter les règles." },
      { es: "Debe de ser tarde.", fr: "Il doit être tard." },
    ],
    difficulty: 2,
  },
  {
    id: "g_060",
    title: "Soler + Infinitif (avoir l'habitude de)",
    explanation:
      "Soler + infinitif exprime des actions habituelles ('avoir l'habitude de'). Utilisé uniquement au présent et à l'imparfait.",
    examples: [
      { es: "Suelo desayunar a las ocho.", fr: "D'habitude, je prends le petit-déjeuner à huit heures." },
      { es: "Solíamos ir a la playa en verano.", fr: "Nous avions l'habitude d'aller à la plage en été." },
    ],
    difficulty: 2,
  },
];
