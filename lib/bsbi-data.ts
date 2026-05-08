// ============================================================================
// BSBI Data — Single source of truth for the advisor portal
// Version: 2026
// Sources: Arabic Advisor Guide 2026 (master) + Regional/International Flyers
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export type AwardingUni = "UCA" | "Chichester" | "Roehampton" | "CUC" | "UNINETTUNO";
export type Campus = "Berlin" | "Hamburg" | "Paris" | "Barcelona" | "Madrid";
export type Level = "Bachelor" | "Master";
export type Audience = "Turkey" | "International";
export type PaymentMode = "full" | "installment";
export type Pathway = "direct-3yr" | "foundation-4yr" | "year3-direct";
export type GpaTier = "90+" | "70-89" | "50-69" | "below50";
export type EnglishProofType = "IELTS" | "Duolingo" | "TOEFL" | "MOI" | "None";

export type CertificateType =
  // Turkey
  | "TR_NATIONAL_HIGH" // Lise / Anadolu / Açık Lise / Meslek Lisesi
  // International — direct-entry-eligible
  | "IB"
  | "A_LEVELS"
  | "AMERICAN_DIPLOMA"
  | "ABITUR"
  | "BACCALAUREAT_FR"
  // International — Foundation required
  | "ARAB_NATIONAL_HIGH"
  // Master only
  | "BACHELOR_DEGREE"
  // Year 3 Direct
  | "PARTIAL_BACHELOR_2YR";

// ============================================================================
// CAMPUS / UNI METADATA
// ============================================================================

export const CAMPUSES: Record<Campus, { nameEn: string; nameAr: string; country: string }> = {
  Berlin: { nameEn: "Berlin", nameAr: "برلين", country: "Germany" },
  Hamburg: { nameEn: "Hamburg", nameAr: "هامبورغ", country: "Germany" },
  Paris: { nameEn: "Paris", nameAr: "باريس", country: "France" },
  Barcelona: { nameEn: "Barcelona", nameAr: "برشلونة", country: "Spain" },
  Madrid: { nameEn: "Madrid", nameAr: "مدريد", country: "Spain" },
};

export const UNIS: Record<AwardingUni, { nameFull: string; country: string }> = {
  UCA: { nameFull: "University for the Creative Arts", country: "UK" },
  Chichester: { nameFull: "University of Chichester", country: "UK" },
  Roehampton: { nameFull: "University of Roehampton", country: "UK" },
  CUC: { nameFull: "Concordia University Chicago", country: "USA" },
  UNINETTUNO: { nameFull: "UNINETTUNO", country: "Italy" },
};

// ============================================================================
// BACHELOR PROGRAMS
// All bachelors: yearly tuition €10,425
// Available pathways: 3-year direct, 4-year (Foundation + 3), Year 3 Direct
// ============================================================================

export const BACHELOR_YEARLY_FEE = 10425;

export interface BachelorProgram {
  id: string;
  nameEn: string;
  nameAr: string;
  uni: AwardingUni;
  campus: Campus;
  intakes3yr: string[]; // for direct entry path
  intakes4yr: string[]; // for foundation path (and year-3-direct generally aligns)
  isArtProgram: boolean; // portfolio required for direct entry
}

export const BACHELOR_PROGRAMS: BachelorProgram[] = [
  // BERLIN
  {
    id: "ba-int-business-uca-berlin",
    nameEn: "BSc (Hons) International Business & Management",
    nameAr: "بكالوريوس الأعمال الدولية والإدارة",
    uni: "UCA",
    campus: "Berlin",
    intakes3yr: ["Feb", "May", "Oct"],
    intakes4yr: ["Feb", "May", "Oct"],
    isArtProgram: false,
  },
  {
    id: "ba-tourism-uca-berlin",
    nameEn: "BA (Hons) Tourism and Hospitality Management",
    nameAr: "بكالوريوس السياحة وإدارة الضيافة",
    uni: "UCA",
    campus: "Berlin",
    intakes3yr: ["Feb", "Oct"],
    intakes4yr: ["Feb", "Oct"],
    isArtProgram: false,
  },
  {
    id: "ba-cs-uca-berlin",
    nameEn: "BSc (Hons) Computer Science and Digitisation",
    nameAr: "بكالوريوس علوم الحاسب والرقمنة",
    uni: "UCA",
    campus: "Berlin",
    intakes3yr: ["Feb", "Oct"],
    intakes4yr: ["Feb", "Oct"],
    isArtProgram: false,
  },
  {
    id: "ba-psychology-chi-berlin",
    nameEn: "BSc Psychology",
    nameAr: "بكالوريوس علم النفس",
    uni: "Chichester",
    campus: "Berlin",
    intakes3yr: ["Feb", "Oct"],
    intakes4yr: ["Feb", "Oct"],
    isArtProgram: false,
  },
  {
    id: "ba-media-chi-berlin",
    nameEn: "BA (Hons) Media and Communications",
    nameAr: "بكالوريوس الإعلام والاتصال",
    uni: "Chichester",
    campus: "Berlin",
    intakes3yr: ["Feb", "Oct"],
    intakes4yr: ["Feb", "Oct"],
    isArtProgram: false,
  },
  // HAMBURG (Arts)
  {
    id: "ba-graphic-uca-hamburg",
    nameEn: "BA (Hons) Graphic Design",
    nameAr: "بكالوريوس التصميم الجرافيكي",
    uni: "UCA",
    campus: "Hamburg",
    intakes3yr: ["Oct"], // 3-year direct only Oct
    intakes4yr: ["Feb", "Oct"], // 4-year with Foundation: Feb/Oct
    isArtProgram: true,
  },
  {
    id: "ba-animation-uca-hamburg",
    nameEn: "BA (Hons) Animation",
    nameAr: "بكالوريوس الرسوم المتحركة",
    uni: "UCA",
    campus: "Hamburg",
    intakes3yr: ["Oct"],
    intakes4yr: ["Feb", "Oct"],
    isArtProgram: true,
  },
];

// ============================================================================
// MASTER PROGRAMS
// Pricing + intakes per Arabic guide (master source)
// ============================================================================

export interface MasterProgram {
  id: string;
  nameEn: string;
  nameAr: string;
  uni: AwardingUni;
  campus: Campus;
  durationMonths: number;
  intakes: string[];
  baseFee: number; // total program fee
  hamburgException35?: boolean; // €9,048 for everyone (full pay) regardless of audience
  notes?: string;
}

export const MASTER_PROGRAMS: MasterProgram[] = [
  // ===== BERLIN =====
  {
    id: "m-global-mba-uca-berlin",
    nameEn: "Global MBA",
    nameAr: "ماجستير إدارة الأعمال العالمي",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Jul", "Oct"],
    baseFee: 15525,
  },
  {
    id: "m-finance-uca-berlin",
    nameEn: "MSc Finance & Investment",
    nameAr: "ماجستير التمويل والاستثمار",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-ai-uca-berlin",
    nameEn: "MSc Artificial Intelligence",
    nameAr: "ماجستير الذكاء الاصطناعي",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-data-uca-berlin",
    nameEn: "MSc Data Analytics",
    nameAr: "ماجستير تحليل البيانات",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-it-uca-berlin",
    nameEn: "MSc Information Technology Management",
    nameAr: "ماجستير إدارة تكنولوجيا المعلومات",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-realestate-uca-berlin",
    nameEn: "MSc Real Estate and Asset Management",
    nameAr: "ماجستير العقارات وإدارة الأصول",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-sports-uca-berlin",
    nameEn: "MSc Sports Management",
    nameAr: "ماجستير الإدارة الرياضية",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-tourism-uca-berlin",
    nameEn: "MA Tourism, Hospitality and Event Management",
    nameAr: "ماجستير السياحة والضيافة وإدارة الفعاليات",
    uni: "UCA",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-digmkt-chi-berlin",
    nameEn: "MSc Digital Marketing",
    nameAr: "ماجستير التسويق الرقمي",
    uni: "Chichester",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-intbiz-chi-berlin",
    nameEn: "MSc International Business",
    nameAr: "ماجستير الأعمال الدولية",
    uni: "Chichester",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-healthpsych-chi-berlin",
    nameEn: "MSc Health Psychology",
    nameAr: "ماجستير علم النفس الصحي",
    uni: "Chichester",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
    notes: "Personal Statement + Letter of Recommendation required at application",
  },
  {
    id: "m-engmgmt-chi-berlin",
    nameEn: "MSc Engineering Management",
    nameAr: "ماجستير إدارة الهندسة",
    uni: "Chichester",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-execmba-chi-berlin",
    nameEn: "Executive MBA (12-month version)",
    nameAr: "ماجستير إدارة الأعمال التنفيذي",
    uni: "Chichester",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["May", "Jul", "Oct"],
    baseFee: 14425,
    notes: "Requires IELTS 6.5 (no less than 6.0) + 2 years work experience",
  },
  {
    id: "m-projmgmt-roe-berlin",
    nameEn: "MSc Project Management",
    nameAr: "ماجستير إدارة المشاريع",
    uni: "Roehampton",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-logistics-roe-berlin",
    nameEn: "MSc Global Logistics & Supply Chain",
    nameAr: "ماجستير اللوجستيات وسلاسل التوريد",
    uni: "Roehampton",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-hr-roe-berlin",
    nameEn: "MSc Global Human Resources Management",
    nameAr: "ماجستير إدارة الموارد البشرية الدولية",
    uni: "Roehampton",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-inthealth-uni-berlin",
    nameEn: "MSc International Health Management",
    nameAr: "ماجستير إدارة الصحة الدولية",
    uni: "UNINETTUNO",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-energy-uni-berlin",
    nameEn: "MA Energy Management",
    nameAr: "ماجستير إدارة الطاقة",
    uni: "UNINETTUNO",
    campus: "Berlin",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 14425,
  },
  {
    id: "m-mba-cuc-berlin",
    nameEn: "MBA",
    nameAr: "ماجستير إدارة الأعمال",
    uni: "CUC",
    campus: "Berlin",
    durationMonths: 24,
    intakes: ["Jan", "Mar", "May", "Aug", "Oct"],
    baseFee: 19440,
  },
  {
    id: "m-innov-cuc-berlin",
    nameEn: "MA Innovation & Entrepreneurship",
    nameAr: "ماجستير الابتكار وريادة الأعمال",
    uni: "CUC",
    campus: "Berlin",
    durationMonths: 24,
    intakes: ["Jan", "Mar", "May", "Aug", "Oct"],
    baseFee: 16200,
  },

  // ===== HAMBURG =====
  {
    id: "m-visualcomm-uca-hamburg",
    nameEn: "MA Visual Communication",
    nameAr: "ماجستير التواصل البصري",
    uni: "UCA",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 13920,
  },
  {
    id: "m-ux-uca-hamburg",
    nameEn: "MA User Experience Design",
    nameAr: "ماجستير تصميم تجربة المستخدم",
    uni: "UCA",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 13920,
  },
  {
    id: "m-game-uca-hamburg",
    nameEn: "MA Game Design",
    nameAr: "ماجستير تصميم الألعاب",
    uni: "UCA",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 13920,
  },
  {
    id: "m-maritime-chi-hamburg",
    nameEn: "MBA in Maritime and Shipping Management",
    nameAr: "ماجستير إدارة الشحن البحري",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 13920,
  },
  {
    id: "m-fashion-chi-hamburg",
    nameEn: "MA Fashion and Luxury Brand Management",
    nameAr: "ماجستير إدارة الأزياء والعلامات الفاخرة",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "Oct"],
    baseFee: 13920,
  },
  {
    id: "m-execmba-chi-hamburg",
    nameEn: "Executive MBA",
    nameAr: "ماجستير إدارة الأعمال التنفيذي",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["May", "Oct"],
    baseFee: 13920,
    hamburgException35: true,
  },
  {
    id: "m-logistics-chi-hamburg",
    nameEn: "MSc Logistics",
    nameAr: "ماجستير اللوجستيات",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["May", "Oct"],
    baseFee: 13920,
    hamburgException35: true,
  },
  {
    id: "m-inthealth-chi-hamburg",
    nameEn: "MSc International Health Management",
    nameAr: "ماجستير إدارة الصحة الدولية",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["May", "Oct"],
    baseFee: 13920,
    hamburgException35: true,
  },
  {
    id: "m-globalmba-chi-hamburg",
    nameEn: "Global MBA",
    nameAr: "ماجستير إدارة الأعمال العالمي",
    uni: "Chichester",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["Feb", "May", "Oct"],
    baseFee: 14850,
  },
  {
    id: "m-cyber-roe-hamburg",
    nameEn: "MSc Cyber Security",
    nameAr: "ماجستير الأمن السيبراني",
    uni: "Roehampton",
    campus: "Hamburg",
    durationMonths: 18,
    intakes: ["May", "Oct"],
    baseFee: 13920,
  },

  // ===== PARIS (RNCP Titre L7 + BSBI Master) =====
  {
    id: "m-paris-globalmba",
    nameEn: "RNCP Titre L7 (PPA) + Global MBA (BSBI)",
    nameAr: "شهادة فرنسية (PPA) + ماجستير إدارة الأعمال العالمي",
    uni: "Chichester",
    campus: "Paris",
    durationMonths: 24,
    intakes: ["Jul", "Nov"],
    baseFee: 18000,
  },
  {
    id: "m-paris-itmgmt",
    nameEn: "RNCP Titre L7 (ESGI) + Master in IT Management (BSBI)",
    nameAr: "شهادة فرنسية (ESGI) + ماجستير إدارة تكنولوجيا المعلومات",
    uni: "Chichester",
    campus: "Paris",
    durationMonths: 24,
    intakes: ["Jul", "Nov"],
    baseFee: 15000,
  },
  {
    id: "m-paris-digmkt",
    nameEn: "RNCP Titre L7 (PPA) + Master in Digital Marketing (BSBI)",
    nameAr: "شهادة فرنسية (PPA) + ماجستير التسويق الرقمي",
    uni: "Chichester",
    campus: "Paris",
    durationMonths: 24,
    intakes: ["Nov"],
    baseFee: 15000,
  },
  {
    id: "m-paris-tourism",
    nameEn: "RNCP Titre L7 (PPA) + Master in Tourism, Hospitality & Event (BSBI)",
    nameAr: "شهادة فرنسية (PPA) + ماجستير السياحة والضيافة",
    uni: "Chichester",
    campus: "Paris",
    durationMonths: 24,
    intakes: ["Jul", "Nov"],
    baseFee: 15000,
  },
  {
    id: "m-paris-finance",
    nameEn: "RNCP Titre L7 (PPA) + Master in Finance & Investment (BSBI)",
    nameAr: "شهادة فرنسية (PPA) + ماجستير التمويل والاستثمار",
    uni: "Chichester",
    campus: "Paris",
    durationMonths: 24,
    intakes: ["Nov"],
    baseFee: 15000,
  },

  // ===== BARCELONA =====
  {
    id: "m-bcn-globalmba",
    nameEn: "Master in Global MBA (BSBI & Chichester)",
    nameAr: "ماجستير إدارة الأعمال العالمي",
    uni: "Chichester",
    campus: "Barcelona",
    durationMonths: 18,
    intakes: ["Jun", "Oct"],
    baseFee: 18000,
  },
  {
    id: "m-bcn-data",
    nameEn: "Master in Data Analytics (BSBI & Chichester)",
    nameAr: "ماجستير تحليل البيانات",
    uni: "Chichester",
    campus: "Barcelona",
    durationMonths: 18,
    intakes: ["Oct"],
    baseFee: 15000,
  },
  {
    id: "m-bcn-maritime",
    nameEn: "MBA Maritime and Shipping Management (BSBI & Chichester)",
    nameAr: "ماجستير إدارة الشحن البحري",
    uni: "Chichester",
    campus: "Barcelona",
    durationMonths: 18,
    intakes: ["Oct"],
    baseFee: 15000,
  },
  {
    id: "m-bcn-inthealth",
    nameEn: "Master in International Health Management (BSBI & Chichester)",
    nameAr: "ماجستير إدارة الصحة الدولية",
    uni: "Chichester",
    campus: "Barcelona",
    durationMonths: 18,
    intakes: ["Oct"],
    baseFee: 15000,
  },

  // ===== MADRID =====
  {
    id: "m-mad-globalmba",
    nameEn: "Master in Global MBA (BSBI & Chichester)",
    nameAr: "ماجستير إدارة الأعمال العالمي",
    uni: "Chichester",
    campus: "Madrid",
    durationMonths: 18,
    intakes: ["Oct"],
    baseFee: 18000,
  },
];

// ============================================================================
// ENGLISH LANGUAGE RULES (Master + Direct Bachelor)
// Foundation has its own (lower) requirements — see FOUNDATION_ENGLISH below
// ============================================================================

export interface EnglishRule {
  ieltsMin: number;
  ieltsPerSection: number;
  duolingoMin: number | null; // null = not accepted
  toeflMin: number | null;
  moiAccepted: boolean;
  ietAccepted: boolean;
  notes?: string;
}

// Master-level rules per awarding uni
export const MASTER_ENGLISH: Record<AwardingUni, EnglishRule> = {
  UCA: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 105,
    toeflMin: 80,
    moiAccepted: true,
    ietAccepted: true,
    notes: "Duolingo 100-104 → free IET test allowed",
  },
  Chichester: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 105,
    toeflMin: 80,
    moiAccepted: false,
    ietAccepted: false,
    notes: "IELTS or Duolingo only. CV + recommendation letter required for ALL programs.",
  },
  Roehampton: {
    ieltsMin: 6.5,
    ieltsPerSection: 5.5,
    duolingoMin: null,
    toeflMin: 89,
    moiAccepted: false,
    ietAccepted: false,
    notes: "STRICT: IELTS 6.5 only. No Duolingo, no MOI, no IET.",
  },
  CUC: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 95,
    toeflMin: 80,
    moiAccepted: false,
    ietAccepted: false,
  },
  UNINETTUNO: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 95,
    toeflMin: 80,
    moiAccepted: true,
    ietAccepted: true,
    notes: "Duolingo 90-94 → free IET test allowed",
  },
};

// Direct Bachelor English requirements (per awarding uni — same as master baselines)
export const DIRECT_BACHELOR_ENGLISH: Record<AwardingUni, EnglishRule> = {
  UCA: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 105,
    toeflMin: 80,
    moiAccepted: true,
    ietAccepted: true,
  },
  Chichester: {
    ieltsMin: 6.0,
    ieltsPerSection: 5.5,
    duolingoMin: 105,
    toeflMin: 80,
    moiAccepted: false,
    ietAccepted: false,
  },
  Roehampton: {
    ieltsMin: 6.5,
    ieltsPerSection: 5.5,
    duolingoMin: null,
    toeflMin: 89,
    moiAccepted: false,
    ietAccepted: false,
  },
  CUC: { ieltsMin: 6.0, ieltsPerSection: 5.5, duolingoMin: 95, toeflMin: 80, moiAccepted: false, ietAccepted: false },
  UNINETTUNO: { ieltsMin: 6.0, ieltsPerSection: 5.5, duolingoMin: 95, toeflMin: 80, moiAccepted: true, ietAccepted: true },
};

// Foundation Year — does NOT accept MOI or IET; requires actual exam
export const FOUNDATION_ENGLISH = {
  uca: { ieltsMin: 5.0, ieltsPerSection: 4.5, duolingoMin: 95, toeflMin: 72 },
  chichester: { ieltsMin: 5.5, ieltsPerSection: 5.5, duolingoMin: 95, toeflMin: 72 },
  moiAccepted: false,
  ietAccepted: false,
};

// ============================================================================
// SCHOLARSHIP / PRICING LOGIC
// ============================================================================

// Bachelor scholarship tiers (% per year) — full payment
// Source: Arabic Guide page 12
export interface BachelorYearlyScholarship {
  y1: number; y2: number; y3: number; y4: number;
}

export function getBachelorScholarshipFull(audience: Audience, gpaTier: GpaTier): BachelorYearlyScholarship {
  if (gpaTier === "below50") return { y1: 0, y2: 0, y3: 0, y4: 0 };
  if (gpaTier === "90+") return { y1: 0.55, y2: 0.55, y3: 0.55, y4: 0.55 };
  if (gpaTier === "70-89") return { y1: 0.35, y2: 0.40, y3: 0.45, y4: 0.55 };
  // 50-69 — differs by audience
  if (audience === "Turkey") return { y1: 0.30, y2: 0.35, y3: 0.40, y4: 0.55 };
  return { y1: 0.20, y2: 0.25, y3: 0.30, y4: 0.55 };
}

// Installment = Full minus 5pp per year (per Arabic Guide page 19)
export function getBachelorScholarshipInstallment(audience: Audience, gpaTier: GpaTier): BachelorYearlyScholarship {
  const f = getBachelorScholarshipFull(audience, gpaTier);
  return {
    y1: Math.max(0, f.y1 - 0.05),
    y2: Math.max(0, f.y2 - 0.05),
    y3: Math.max(0, f.y3 - 0.05),
    y4: Math.max(0, f.y4 - 0.05),
  };
}

// Master scholarship %
// Source: Arabic Guide pages 13, 17
export function getMasterScholarshipPercent(
  audience: Audience,
  campus: Campus,
  paymentMode: PaymentMode,
  hamburgException35: boolean
): number {
  // Hamburg 3 exceptions: 35% even for international (full pay only)
  if (hamburgException35 && paymentMode === "full") return 0.35;

  if (campus === "Berlin" || campus === "Hamburg") {
    if (paymentMode === "full") return audience === "Turkey" ? 0.35 : 0.30;
    return 0.15; // installment same for both audiences
  }
  // Paris / Barcelona / Madrid
  if (paymentMode === "full") {
    // Regional (Turkey) vs International — flyer pricing differs
    // Turkey full pay (regional): MBA Global = 12,900; Master = 10,950 from 18,000/15,000
    // International full pay: MBA Global = 13,800; Master = 11,700
    return audience === "Turkey" ? 0.283 : 0.233; // computed below per program; this default is rough
  }
  return 0.05; // installment Paris/Spain
}

// More accurate Paris/Spain pricing: lookup table
export function getParisSpainFullPayPrice(audience: Audience, baseFee: number): number {
  // baseFee 18000 (Global MBA) or 15000 (other masters)
  if (baseFee === 18000) return audience === "Turkey" ? 12900 : 13800;
  if (baseFee === 15000) return audience === "Turkey" ? 10950 : 11700;
  return baseFee; // fallback
}

// Installment fees
export const INSTALLMENT_PLAN_FEE = {
  shortPlan6mo: 300,
  longPlan7to10mo: 500,
};

export const DEPOSIT = {
  germany: 1500,
  parisSpain: 2000,
};

// ============================================================================
// CALCULATION ENGINE
// ============================================================================

export interface CalcInput {
  audience: Audience;
  level: Level;
  certType: CertificateType;
  gpaPercent: number; // 0-100
  englishProof: EnglishProofType;
  ieltsScore?: number; // if IELTS
  duolingoScore?: number;
  toeflScore?: number;
  moiFromEnglishMediumUni?: boolean; // for master + UCA Berlin/Hamburg + UNINETTUNO
  programId: string;
  paymentMode: PaymentMode;
}

export interface CalcOutput {
  eligibility: "Eligible" | "Conditional" | "NotEligible";
  pathway?: Pathway;
  durationYears?: number;
  awardingUni: AwardingUni;
  campus: Campus;
  programName: string;
  // Pricing
  baseFeeAnnualOrTotal: number; // annual for bachelor, total for master
  scholarshipPercent?: number;
  scholarshipPerYear?: BachelorYearlyScholarship; // bachelor only
  finalTuitionYear1OrTotal: number;
  finalTuitionTotalProgram: number; // total across all years
  // Extras
  warnings: string[];
  blockers: string[]; // hard fails
  documentsChecklist: string[];
  notes: string[];
}

export function gpaTierFor(percent: number): GpaTier {
  if (percent >= 90) return "90+";
  if (percent >= 70) return "70-89";
  if (percent >= 50) return "50-69";
  return "below50";
}

// Determine bachelor pathway
export function determineBachelorPathway(
  audience: Audience,
  certType: CertificateType,
  gpaPercent: number,
  englishMeetsDirect: boolean,
  englishMeetsFoundation: boolean
): { pathway: Pathway | null; reason: string } {
  // Year 3 Direct
  if (certType === "PARTIAL_BACHELOR_2YR") {
    if (gpaPercent >= 60 && englishMeetsDirect) {
      return { pathway: "year3-direct", reason: "Completed 2+ years at recognized university with 60%+" };
    }
    return { pathway: null, reason: "Year 3 Direct requires 60%+ GPA + IELTS 6.0" };
  }

  // International — Arab national high school = MUST do Foundation
  if (audience === "International" && certType === "ARAB_NATIONAL_HIGH") {
    if (gpaPercent >= 60 && englishMeetsFoundation) {
      return { pathway: "foundation-4yr", reason: "Arab national high school requires Foundation Year (mandatory rule)" };
    }
    return { pathway: null, reason: "Need 60%+ GPA AND IELTS 5.0 minimum for Foundation" };
  }

  // International — accepted international certs → direct entry possible
  if (audience === "International" && ["IB", "A_LEVELS", "AMERICAN_DIPLOMA", "ABITUR", "BACCALAUREAT_FR"].includes(certType)) {
    if (englishMeetsDirect) {
      return { pathway: "direct-3yr", reason: "Accepted international certificate + sufficient English" };
    }
    if (englishMeetsFoundation) {
      return { pathway: "foundation-4yr", reason: "International certificate but English below direct threshold" };
    }
    return { pathway: null, reason: "English below Foundation threshold (need IELTS 5.0+)" };
  }

  // Turkey — national high school (any type: Lise/Anadolu/Açık/Meslek)
  if (audience === "Turkey" && certType === "TR_NATIONAL_HIGH") {
    if (gpaPercent >= 70 && englishMeetsDirect) {
      return { pathway: "direct-3yr", reason: "70%+ GPA + sufficient English → 3-year direct entry" };
    }
    if (gpaPercent >= 60 && englishMeetsFoundation) {
      return { pathway: "foundation-4yr", reason: "60-69% GPA OR English below direct threshold → Foundation Year" };
    }
    return { pathway: null, reason: "Need 60%+ GPA AND IELTS 5.0+ to qualify for any pathway" };
  }

  return { pathway: null, reason: "Could not determine pathway from inputs" };
}

// Check English against rule — returns whether it satisfies
export function checkEnglish(
  proof: EnglishProofType,
  scores: { ielts?: number; duolingo?: number; toefl?: number },
  rule: EnglishRule,
  moiFromEnglishMedium: boolean
): { meets: boolean; reason: string } {
  if (proof === "IELTS") {
    if (scores.ielts === undefined) return { meets: false, reason: "IELTS score not provided" };
    if (scores.ielts >= rule.ieltsMin) return { meets: true, reason: `IELTS ${scores.ielts} ≥ ${rule.ieltsMin}` };
    return { meets: false, reason: `IELTS ${scores.ielts} below required ${rule.ieltsMin}` };
  }
  if (proof === "Duolingo") {
    if (rule.duolingoMin === null) return { meets: false, reason: "This university does not accept Duolingo" };
    if (scores.duolingo === undefined) return { meets: false, reason: "Duolingo score not provided" };
    if (scores.duolingo >= rule.duolingoMin) return { meets: true, reason: `Duolingo ${scores.duolingo} ≥ ${rule.duolingoMin}` };
    return { meets: false, reason: `Duolingo ${scores.duolingo} below required ${rule.duolingoMin}` };
  }
  if (proof === "TOEFL") {
    if (rule.toeflMin === null) return { meets: false, reason: "TOEFL minimum not defined for this university" };
    if (scores.toefl === undefined) return { meets: false, reason: "TOEFL score not provided" };
    if (scores.toefl >= rule.toeflMin) return { meets: true, reason: `TOEFL ${scores.toefl} ≥ ${rule.toeflMin}` };
    return { meets: false, reason: `TOEFL ${scores.toefl} below required ${rule.toeflMin}` };
  }
  if (proof === "MOI") {
    if (!rule.moiAccepted) return { meets: false, reason: "This university does not accept MOI letters" };
    if (!moiFromEnglishMedium) return { meets: false, reason: "MOI must confirm English-medium institution within last 5 years" };
    return { meets: true, reason: "MOI accepted — student may take free IET test instead" };
  }
  return { meets: false, reason: "No English proof provided — official test required before application" };
}

// Build documents checklist
export function buildDocumentsChecklist(
  level: Level,
  pathway: Pathway | undefined,
  uni: AwardingUni,
  audience: Audience,
  isArtProgram: boolean
): string[] {
  const docs: string[] = [];
  docs.push("Passport (valid 12+ months)");

  if (level === "Bachelor") {
    docs.push("High school diploma + transcript (in original language + English)");
    if (audience === "International") {
      docs.push("All documents must be authenticated (3 steps: original + translation + apostille/embassy)");
    }
  } else {
    docs.push("Bachelor degree + transcript (in original language + English)");
    if (uni === "UNINETTUNO" || uni === "CUC") {
      docs.push("High school diploma + transcript (also required by UNINETTUNO/CUC)");
    }
    if (audience === "International") {
      docs.push("All documents must be authenticated (3 steps: original + translation + apostille/embassy)");
    }
  }

  docs.push("English proficiency proof (IELTS/Duolingo/TOEFL — or MOI letter where accepted)");
  docs.push("CV in English (PDF format)");

  if (level === "Master") {
    if (uni !== "Roehampton") {
      docs.push("Motivation letter (Why Germany? Why this program? Why BSBI?)");
    }
    if (uni === "UCA") {
      docs.push("Recommendation letter — required if graduated 2+ years ago (always for Global MBA)");
    }
    if (uni === "Chichester") {
      docs.push("Recommendation letter — required for ALL Chichester programs regardless of graduation year");
    }
    if (uni === "UNINETTUNO" || uni === "CUC") {
      docs.push("Recommendation letter where applicable");
    }
  } else {
    docs.push("Motivation letter (Why Germany? Why this program? Why BSBI?)");
  }

  if (isArtProgram) {
    docs.push("Portfolio (5 works) + 500-word motivation statement (PDF max 512MB) — required for direct entry only");
  }

  if (pathway === "foundation-4yr" || pathway === "direct-3yr") {
    if (level === "Bachelor") {
      docs.push("Passport-spec photo");
    }
  }

  return docs;
}

// MAIN CALCULATOR
export function calculate(input: CalcInput): CalcOutput {
  const warnings: string[] = [];
  const blockers: string[] = [];
  const notes: string[] = [];

  // Find program
  const program = input.level === "Bachelor"
    ? BACHELOR_PROGRAMS.find(p => p.id === input.programId)
    : MASTER_PROGRAMS.find(p => p.id === input.programId);

  if (!program) {
    return {
      eligibility: "NotEligible",
      awardingUni: "UCA",
      campus: "Berlin",
      programName: "Unknown",
      baseFeeAnnualOrTotal: 0,
      finalTuitionYear1OrTotal: 0,
      finalTuitionTotalProgram: 0,
      warnings,
      blockers: ["Program not found in catalog"],
      documentsChecklist: [],
      notes,
    };
  }

  const englishScores = {
    ielts: input.ieltsScore,
    duolingo: input.duolingoScore,
    toefl: input.toeflScore,
  };

  // Pathway determination (Bachelor only)
  let pathway: Pathway | undefined;
  let durationYears: number | undefined;
  let isBachelor = input.level === "Bachelor";

  if (isBachelor) {
    const directRule = DIRECT_BACHELOR_ENGLISH[program.uni];
    const foundationRuleUca = FOUNDATION_ENGLISH.uca;
    const foundationRuleChi = FOUNDATION_ENGLISH.chichester;
    const foundationRule = program.uni === "Chichester" ? foundationRuleChi : foundationRuleUca;
    const foundationEnglishRule: EnglishRule = {
      ...foundationRule,
      moiAccepted: false,
      ietAccepted: false,
    };

    const directCheck = checkEnglish(input.englishProof, englishScores, directRule, !!input.moiFromEnglishMediumUni);
    const foundationCheck = checkEnglish(input.englishProof, englishScores, foundationEnglishRule, false);

    const pw = determineBachelorPathway(
      input.audience,
      input.certType,
      input.gpaPercent,
      directCheck.meets,
      foundationCheck.meets
    );

    if (pw.pathway === null) {
      blockers.push(pw.reason);
    } else {
      pathway = pw.pathway;
      durationYears = pathway === "direct-3yr" ? 3 : pathway === "foundation-4yr" ? 4 : 1;
      notes.push(pw.reason);
    }

    if ((program as BachelorProgram).isArtProgram && pathway === "direct-3yr") {
      notes.push("Art program: portfolio (5 works) + 500-word statement required for direct entry");
    }
  } else {
    // Master English check
    const rule = MASTER_ENGLISH[program.uni];
    const check = checkEnglish(input.englishProof, englishScores, rule, !!input.moiFromEnglishMediumUni);
    if (!check.meets) {
      blockers.push(`English requirement not met: ${check.reason}`);
    } else {
      notes.push(`English: ${check.reason}`);
    }
    durationYears = (program as MasterProgram).durationMonths / 12;

    if (program.uni === "Roehampton" && input.englishProof !== "IELTS") {
      blockers.push("Roehampton requires IELTS 6.5 — does not accept Duolingo, MOI, or IET");
    }
  }

  // Pricing
  let baseFeeAnnualOrTotal = 0;
  let scholarshipPercent: number | undefined;
  let scholarshipPerYear: BachelorYearlyScholarship | undefined;
  let finalTuitionYear1OrTotal = 0;
  let finalTuitionTotalProgram = 0;
  const gpaTier = gpaTierFor(input.gpaPercent);

  if (isBachelor) {
    const bp = program as BachelorProgram;
    baseFeeAnnualOrTotal = BACHELOR_YEARLY_FEE;
    scholarshipPerYear = input.paymentMode === "full"
      ? getBachelorScholarshipFull(input.audience, gpaTier)
      : getBachelorScholarshipInstallment(input.audience, gpaTier);

    const yearsArr = pathway === "direct-3yr"
      ? [scholarshipPerYear.y1, scholarshipPerYear.y2, scholarshipPerYear.y3]
      : pathway === "foundation-4yr"
      ? [scholarshipPerYear.y1, scholarshipPerYear.y2, scholarshipPerYear.y3, scholarshipPerYear.y4]
      : pathway === "year3-direct"
      ? [scholarshipPerYear.y3]
      : [];

    finalTuitionYear1OrTotal = BACHELOR_YEARLY_FEE * (1 - yearsArr[0] || 0);
    finalTuitionTotalProgram = yearsArr.reduce((sum, sch) => sum + BACHELOR_YEARLY_FEE * (1 - sch), 0);
    void bp;
  } else {
    const mp = program as MasterProgram;
    baseFeeAnnualOrTotal = mp.baseFee;

    if (mp.campus === "Paris" || mp.campus === "Barcelona" || mp.campus === "Madrid") {
      // Use lookup
      if (input.paymentMode === "full") {
        finalTuitionYear1OrTotal = getParisSpainFullPayPrice(input.audience, mp.baseFee);
        scholarshipPercent = 1 - finalTuitionYear1OrTotal / mp.baseFee;
      } else {
        scholarshipPercent = 0.05;
        finalTuitionYear1OrTotal = mp.baseFee * 0.95;
      }
    } else {
      scholarshipPercent = getMasterScholarshipPercent(input.audience, mp.campus, input.paymentMode, !!mp.hamburgException35);
      finalTuitionYear1OrTotal = mp.baseFee * (1 - scholarshipPercent);
    }
    finalTuitionTotalProgram = finalTuitionYear1OrTotal;
  }

  // Add installment plan fee notice
  if (input.paymentMode === "installment") {
    notes.push(`Installment plan adds €${INSTALLMENT_PLAN_FEE.shortPlan6mo} (6mo) or €${INSTALLMENT_PLAN_FEE.longPlan7to10mo} (7-10mo) plan fee`);
    const dep = (program.campus === "Paris" || program.campus === "Barcelona" || program.campus === "Madrid")
      ? DEPOSIT.parisSpain
      : DEPOSIT.germany;
    notes.push(`Deposit €${dep} (part of total fees, not extra)`);
  }

  // Common warnings
  if (program.uni === "Roehampton") {
    warnings.push("Roehampton requires IELTS 6.5 (no less than 5.5 in any section). No Duolingo, no MOI, no IET.");
  }
  if (input.englishProof === "MOI" && (program.uni === "Chichester" || program.uni === "Roehampton" || program.uni === "CUC")) {
    warnings.push(`${program.uni} does not accept MOI — student needs official IELTS/Duolingo/TOEFL`);
  }
  if (input.audience === "Turkey" && input.gpaPercent < 70 && pathway !== "foundation-4yr" && isBachelor) {
    warnings.push("GPA 60-69 → Foundation Year required for Turkey audience");
  }

  // Documents
  const documentsChecklist = buildDocumentsChecklist(
    input.level,
    pathway,
    program.uni,
    input.audience,
    isBachelor && (program as BachelorProgram).isArtProgram
  );

  const eligibility: CalcOutput["eligibility"] =
    blockers.length > 0 ? "NotEligible"
    : warnings.length > 0 ? "Conditional"
    : "Eligible";

  return {
    eligibility,
    pathway,
    durationYears,
    awardingUni: program.uni,
    campus: program.campus,
    programName: program.nameEn,
    baseFeeAnnualOrTotal,
    scholarshipPercent,
    scholarshipPerYear,
    finalTuitionYear1OrTotal: Math.round(finalTuitionYear1OrTotal),
    finalTuitionTotalProgram: Math.round(finalTuitionTotalProgram),
    warnings,
    blockers,
    documentsChecklist,
    notes,
  };
}
