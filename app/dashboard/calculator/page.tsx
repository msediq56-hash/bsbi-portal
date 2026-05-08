"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Audience,
  Level,
  CertificateType,
  EnglishProofType,
  PaymentMode,
  BACHELOR_PROGRAMS,
  MASTER_PROGRAMS,
  CAMPUSES,
  UNIS,
  calculate,
  CalcOutput,
} from "@/lib/bsbi-data";

// ===========================================================================
// Wizard step state
// ===========================================================================
type Step = 1 | 2 | 3 | 4;

interface WizardState {
  audience: Audience | null;
  level: Level | null;
  certType: CertificateType | null;
  gpaPercent: number;
  englishProof: EnglishProofType | null;
  ieltsScore: number;
  duolingoScore: number;
  toeflScore: number;
  moiFromEnglishMediumUni: boolean;
  programId: string;
  paymentMode: PaymentMode;
}

const initialState: WizardState = {
  audience: null,
  level: null,
  certType: null,
  gpaPercent: 75,
  englishProof: null,
  ieltsScore: 6.0,
  duolingoScore: 100,
  toeflScore: 80,
  moiFromEnglishMediumUni: false,
  programId: "",
  paymentMode: "full",
};

// ===========================================================================
// Certificate type options per audience+level
// ===========================================================================
function getCertOptions(audience: Audience, level: Level): { value: CertificateType; label: string; note?: string }[] {
  if (level === "Master") {
    return [
      { value: "BACHELOR_DEGREE", label: "Bachelor's degree (any recognized university)" },
    ];
  }
  // Bachelor
  if (audience === "Turkey") {
    return [
      { value: "TR_NATIONAL_HIGH", label: "Turkish High School (Lise / Anadolu / Açık / Meslek)", note: "All types accepted, no YKS required" },
      { value: "IB", label: "International Baccalaureate (IB)" },
      { value: "A_LEVELS", label: "Cambridge A-Levels" },
      { value: "AMERICAN_DIPLOMA", label: "American High School Diploma + AP/SAT" },
      { value: "PARTIAL_BACHELOR_2YR", label: "Already completed 2+ years of bachelor's", note: "Year 3 Direct Entry path" },
    ];
  }
  return [
    { value: "ARAB_NATIONAL_HIGH", label: "National/Government High School (Arab country)", note: "Foundation Year mandatory" },
    { value: "IB", label: "International Baccalaureate (IB)" },
    { value: "A_LEVELS", label: "Cambridge A-Levels / IGCSE" },
    { value: "AMERICAN_DIPLOMA", label: "American High School Diploma + AP/SAT" },
    { value: "ABITUR", label: "German Abitur" },
    { value: "BACCALAUREAT_FR", label: "French Baccalauréat" },
    { value: "PARTIAL_BACHELOR_2YR", label: "Already completed 2+ years of bachelor's", note: "Year 3 Direct Entry path" },
  ];
}

// ===========================================================================
// Page
// ===========================================================================
export default function CalculatorPage() {
  const router = useRouter();
  const supabase = createClient();
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<WizardState>(initialState);
  const [result, setResult] = useState<CalcOutput | null>(null);

  // Auth gate
  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("advisors").select("status").eq("id", user.id).single();
      if (!data || data.status !== "approved") {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }
      setAuthChecked(true);
    }
    check();
  }, [router, supabase]);

  // Filtered programs for the selected level
  const availablePrograms = useMemo(() => {
    if (state.level === "Bachelor") return BACHELOR_PROGRAMS;
    if (state.level === "Master") return MASTER_PROGRAMS;
    return [];
  }, [state.level]);

  // Group programs by campus for the dropdown
  const programsByCampus = useMemo(() => {
    const groups: Record<string, { id: string; nameEn: string; uni: string; campus: string }[]> = {};
    for (const p of availablePrograms) {
      if (!groups[p.campus]) groups[p.campus] = [];
      groups[p.campus].push({ id: p.id, nameEn: p.nameEn, uni: p.uni, campus: p.campus });
    }
    return groups;
  }, [availablePrograms]);

  // Validation per step
  const canProceed = useMemo(() => {
    if (step === 1) return state.audience && state.level && state.certType && state.gpaPercent > 0;
    if (step === 2) return state.englishProof !== null;
    if (step === 3) return state.programId !== "";
    return true;
  }, [step, state]);

  function next() {
    if (step < 4) setStep((step + 1) as Step);
  }
  function back() {
    if (step > 1) setStep((step - 1) as Step);
  }
  function reset() {
    setState(initialState);
    setResult(null);
    setStep(1);
  }

  function runCalculation() {
    if (!state.audience || !state.level || !state.certType || !state.englishProof) return;
    const out = calculate({
      audience: state.audience,
      level: state.level,
      certType: state.certType,
      gpaPercent: state.gpaPercent,
      englishProof: state.englishProof,
      ieltsScore: state.englishProof === "IELTS" ? state.ieltsScore : undefined,
      duolingoScore: state.englishProof === "Duolingo" ? state.duolingoScore : undefined,
      toeflScore: state.englishProof === "TOEFL" ? state.toeflScore : undefined,
      moiFromEnglishMediumUni: state.englishProof === "MOI" ? state.moiFromEnglishMediumUni : false,
      programId: state.programId,
      paymentMode: state.paymentMode,
    });
    setResult(out);
    setStep(4);
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-bsbi-blue">
              ← Back to dashboard
            </Link>
            <h1 className="text-xl font-black text-bsbi-dark mt-1">Eligibility Calculator</h1>
          </div>
          {result && (
            <button
              onClick={reset}
              className="text-sm text-bsbi-blue font-semibold hover:underline"
            >
              New calculation
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step indicator */}
        {!result && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= s ? "bg-bsbi-dark text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-bsbi-dark" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Student profile</span>
              <span>English</span>
              <span>Program & payment</span>
            </div>
          </div>
        )}

        {/* Step 1: Student profile */}
        {step === 1 && !result && (
          <Step1
            state={state}
            setState={setState}
            certOptions={state.audience && state.level ? getCertOptions(state.audience, state.level) : []}
          />
        )}

        {/* Step 2: English */}
        {step === 2 && !result && <Step2 state={state} setState={setState} />}

        {/* Step 3: Program + payment */}
        {step === 3 && !result && (
          <Step3 state={state} setState={setState} programsByCampus={programsByCampus} />
        )}

        {/* Step 4: Result */}
        {step === 4 && result && <ResultView result={result} state={state} />}

        {/* Navigation */}
        {!result && (
          <div className="flex justify-between mt-8">
            <button
              onClick={back}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={next}
                disabled={!canProceed}
                className="px-6 py-2.5 rounded-lg font-semibold bg-bsbi-dark text-white hover:bg-bsbi-blue disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={runCalculation}
                disabled={!canProceed}
                className="px-6 py-2.5 rounded-lg font-semibold bg-bsbi-dark text-white hover:bg-bsbi-blue disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Calculate eligibility
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ===========================================================================
// Step 1 — Student profile
// ===========================================================================
function Step1({
  state,
  setState,
  certOptions,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  certOptions: { value: CertificateType; label: string; note?: string }[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bsbi-dark">Student profile</h2>
        <p className="text-sm text-gray-600 mt-1">Tell us about the student.</p>
      </div>

      {/* Audience */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Where did the student graduate from?</label>
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            selected={state.audience === "Turkey"}
            onClick={() => setState({ ...state, audience: "Turkey", certType: null })}
            title="Turkey 🇹🇷"
            subtitle="Graduated high school in Turkey"
          />
          <ToggleCard
            selected={state.audience === "International"}
            onClick={() => setState({ ...state, audience: "International", certType: null })}
            title="International 🌍"
            subtitle="Arab countries / other international"
          />
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Study level</label>
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            selected={state.level === "Bachelor"}
            onClick={() => setState({ ...state, level: "Bachelor", certType: null, programId: "" })}
            title="Bachelor"
            subtitle="3-4 year undergraduate"
          />
          <ToggleCard
            selected={state.level === "Master"}
            onClick={() => setState({ ...state, level: "Master", certType: "BACHELOR_DEGREE", programId: "" })}
            title="Master"
            subtitle="18-24 month postgraduate"
          />
        </div>
      </div>

      {/* Certificate type — only shown if audience+level set */}
      {state.audience && state.level && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate type</label>
          <div className="space-y-2">
            {certOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setState({ ...state, certType: opt.value })}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  state.certType === opt.value
                    ? "border-bsbi-dark bg-bsbi-light/30"
                    : "border-gray-200 hover:border-bsbi-blue"
                }`}
              >
                <div className="font-semibold text-sm text-bsbi-dark">{opt.label}</div>
                {opt.note && <div className="text-xs text-gray-500 mt-0.5">{opt.note}</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GPA / grade */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {state.level === "Master" ? "Bachelor's GPA / grade" : "High school GPA / grade"}: <span className="text-bsbi-blue">{state.gpaPercent}%</span>
        </label>
        <input
          type="range"
          min={40}
          max={100}
          step={1}
          value={state.gpaPercent}
          onChange={(e) => setState({ ...state, gpaPercent: parseInt(e.target.value) })}
          className="w-full accent-bsbi-dark"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>40%</span>
          <span>50%</span>
          <span>70%</span>
          <span>90%</span>
          <span>100%</span>
        </div>
        {state.gpaPercent < 50 && (
          <p className="text-xs text-amber-600 mt-2">
            ⚠ Below 50% requires special review — flag for Mahmood before any commitment.
          </p>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Step 2 — English
// ===========================================================================
function Step2({
  state,
  setState,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
}) {
  const proofs: { value: EnglishProofType; label: string; subtitle: string }[] = [
    { value: "IELTS", label: "IELTS", subtitle: "Most accepted" },
    { value: "Duolingo", label: "Duolingo", subtitle: "Not accepted by Roehampton" },
    { value: "TOEFL", label: "TOEFL iBT", subtitle: "Accepted by all" },
    { value: "MOI", label: "MOI Letter", subtitle: "UCA Berlin/Hamburg + UNINETTUNO only" },
    { value: "None", label: "None yet", subtitle: "Student needs to take a test" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bsbi-dark">English proficiency</h2>
        <p className="text-sm text-gray-600 mt-1">What proof of English does the student have?</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Type of proof</label>
        <div className="space-y-2">
          {proofs.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setState({ ...state, englishProof: p.value })}
              className={`w-full text-left p-3 rounded-lg border-2 transition ${
                state.englishProof === p.value
                  ? "border-bsbi-dark bg-bsbi-light/30"
                  : "border-gray-200 hover:border-bsbi-blue"
              }`}
            >
              <div className="font-semibold text-sm text-bsbi-dark">{p.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{p.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Score inputs */}
      {state.englishProof === "IELTS" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IELTS overall score: <span className="text-bsbi-blue">{state.ieltsScore.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={4.0}
            max={9.0}
            step={0.5}
            value={state.ieltsScore}
            onChange={(e) => setState({ ...state, ieltsScore: parseFloat(e.target.value) })}
            className="w-full accent-bsbi-dark"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4.0</span>
            <span>5.0</span>
            <span>6.0</span>
            <span>7.0</span>
            <span>9.0</span>
          </div>
        </div>
      )}

      {state.englishProof === "Duolingo" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duolingo score: <span className="text-bsbi-blue">{state.duolingoScore}</span>
          </label>
          <input
            type="range"
            min={50}
            max={160}
            step={5}
            value={state.duolingoScore}
            onChange={(e) => setState({ ...state, duolingoScore: parseInt(e.target.value) })}
            className="w-full accent-bsbi-dark"
          />
        </div>
      )}

      {state.englishProof === "TOEFL" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            TOEFL iBT score: <span className="text-bsbi-blue">{state.toeflScore}</span>
          </label>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={state.toeflScore}
            onChange={(e) => setState({ ...state, toeflScore: parseInt(e.target.value) })}
            className="w-full accent-bsbi-dark"
          />
        </div>
      )}

      {state.englishProof === "MOI" && (
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.moiFromEnglishMediumUni}
              onChange={(e) => setState({ ...state, moiFromEnglishMediumUni: e.target.checked })}
              className="mt-1 w-4 h-4 accent-bsbi-dark"
            />
            <div className="text-sm">
              <div className="font-semibold text-gray-700">MOI confirms English-medium institution within last 5 years</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Letter on official letterhead with stamp, stating English was the language of instruction.
              </div>
            </div>
          </label>
        </div>
      )}

      {state.englishProof === "None" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          ⚠ Student needs an English proficiency test before applying. Most programs accept IELTS, Duolingo, or TOEFL. The Foundation Year requires lower scores than direct entry.
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Step 3 — Program & Payment
// ===========================================================================
interface ProgramRow {
  id: string;
  nameEn: string;
  uni: string;
  campus: string;
}

function Step3({
  state,
  setState,
  programsByCampus,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  programsByCampus: Record<string, ProgramRow[]>;
}) {
  const campusOrder = ["Berlin", "Hamburg", "Paris", "Barcelona", "Madrid"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bsbi-dark">Program & payment</h2>
        <p className="text-sm text-gray-600 mt-1">Pick the program and payment plan.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Program</label>
        <select
          value={state.programId}
          onChange={(e) => setState({ ...state, programId: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bsbi-blue focus:border-transparent outline-none bg-white"
        >
          <option value="">— Select a program —</option>
          {campusOrder.map((campus) => {
            const list = programsByCampus[campus];
            if (!list || list.length === 0) return null;
            return (
              <optgroup key={campus} label={`${campus} (${list.length} program${list.length > 1 ? "s" : ""})`}>
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameEn} ({p.uni})
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment mode</label>
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            selected={state.paymentMode === "full"}
            onClick={() => setState({ ...state, paymentMode: "full" })}
            title="Full payment"
            subtitle="Higher scholarship · pay within 6 weeks of Study Agreement"
          />
          <ToggleCard
            selected={state.paymentMode === "installment"}
            onClick={() => setState({ ...state, paymentMode: "installment" })}
            title="Installment"
            subtitle="Lower scholarship + plan fee · deposit + monthly"
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 4 — Result
// ===========================================================================
function ResultView({ result, state }: { result: CalcOutput; state: WizardState }) {
  const eligColor = {
    Eligible: "bg-green-50 border-green-200 text-green-800",
    Conditional: "bg-amber-50 border-amber-200 text-amber-800",
    NotEligible: "bg-red-50 border-red-200 text-red-800",
  }[result.eligibility];

  const eligLabel = {
    Eligible: "✅ Eligible",
    Conditional: "⚠ Eligible with conditions",
    NotEligible: "❌ Not eligible",
  }[result.eligibility];

  const pathwayLabel = result.pathway
    ? {
        "direct-3yr": "Direct entry · 3-year bachelor",
        "foundation-4yr": "Foundation Year + 3-year bachelor (4 years total)",
        "year3-direct": "Year 3 Direct Entry · 1 year",
      }[result.pathway]
    : null;

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className={`rounded-xl border-2 p-6 ${eligColor}`}>
        <div className="text-2xl font-black mb-1">{eligLabel}</div>
        <div className="text-sm opacity-80">
          {result.programName} · {UNIS[result.awardingUni].nameFull} · {CAMPUSES[result.campus].nameEn}
        </div>
        {pathwayLabel && <div className="text-sm font-semibold mt-2">{pathwayLabel}</div>}
      </div>

      {/* Blockers */}
      {result.blockers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="font-bold text-red-800 mb-2">🛑 Blockers — must resolve before applying</div>
          <ul className="space-y-1 text-sm text-red-800">
            {result.blockers.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tuition breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="font-bold text-bsbi-dark mb-4">💰 Tuition breakdown</div>

        {state.level === "Bachelor" && result.scholarshipPerYear && result.pathway ? (
          <BachelorBreakdown result={result} state={state} />
        ) : (
          <MasterBreakdown result={result} state={state} />
        )}
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="font-bold text-amber-800 mb-2">⚠ Warnings</div>
          <ul className="space-y-1 text-sm text-amber-800">
            {result.warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {result.notes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="font-bold text-blue-800 mb-2">ℹ Notes</div>
          <ul className="space-y-1 text-sm text-blue-800">
            {result.notes.map((n, i) => (
              <li key={i}>• {n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Documents checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="font-bold text-bsbi-dark mb-3">📄 Documents checklist</div>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {result.documentsChecklist.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-bsbi-blue mt-0.5">☐</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BachelorBreakdown({ result, state }: { result: CalcOutput; state: WizardState }) {
  if (!result.scholarshipPerYear || !result.pathway) return null;
  const fee = result.baseFeeAnnualOrTotal;
  const sch = result.scholarshipPerYear;
  const yearsToShow =
    result.pathway === "direct-3yr"
      ? [{ y: 1, label: "Year 1", s: sch.y1 }, { y: 2, label: "Year 2", s: sch.y2 }, { y: 3, label: "Year 3", s: sch.y3 }]
      : result.pathway === "foundation-4yr"
      ? [{ y: 1, label: "Foundation", s: sch.y1 }, { y: 2, label: "Year 2", s: sch.y2 }, { y: 3, label: "Year 3", s: sch.y3 }, { y: 4, label: "Year 4", s: sch.y4 }]
      : [{ y: 3, label: "Year 3 only", s: sch.y3 }];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 text-sm mb-4">
        <div>
          <div className="text-xs text-gray-500">Annual base fee</div>
          <div className="font-bold text-bsbi-dark text-lg">€{fee.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Payment mode</div>
          <div className="font-bold text-bsbi-dark text-lg capitalize">{state.paymentMode}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total program cost</div>
          <div className="font-bold text-bsbi-dark text-lg">€{result.finalTuitionTotalProgram.toLocaleString()}</div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Per-year breakdown</div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-gray-100">
            <tr>
              <th className="text-left py-2">Year</th>
              <th className="text-right py-2">Scholarship</th>
              <th className="text-right py-2">Fee after scholarship</th>
            </tr>
          </thead>
          <tbody>
            {yearsToShow.map((row) => {
              const yearFee = Math.round(fee * (1 - row.s));
              return (
                <tr key={row.y} className="border-b border-gray-50 last:border-b-0">
                  <td className="py-2 font-semibold">{row.label}</td>
                  <td className="text-right py-2">{(row.s * 100).toFixed(0)}%</td>
                  <td className="text-right py-2 font-bold text-bsbi-blue">€{yearFee.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MasterBreakdown({ result, state }: { result: CalcOutput; state: WizardState }) {
  const fee = result.baseFeeAnnualOrTotal;
  const sch = result.scholarshipPercent || 0;
  const final = result.finalTuitionYear1OrTotal;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">Base program fee</div>
          <div className="font-bold text-bsbi-dark text-lg">€{fee.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Scholarship</div>
          <div className="font-bold text-bsbi-dark text-lg">{(sch * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Final tuition</div>
          <div className="font-bold text-bsbi-blue text-xl">€{final.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Payment mode: <span className="font-semibold capitalize text-gray-700">{state.paymentMode}</span> · Audience: <span className="font-semibold text-gray-700">{state.audience}</span>
      </div>
    </div>
  );
}

// ===========================================================================
// Toggle card
// ===========================================================================
function ToggleCard({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition ${
        selected ? "border-bsbi-dark bg-bsbi-light/30" : "border-gray-200 hover:border-bsbi-blue"
      }`}
    >
      <div className="font-bold text-sm text-bsbi-dark">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
    </button>
  );
}
