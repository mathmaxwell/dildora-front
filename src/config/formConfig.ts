import type { StringKey, BoolKey, ComplaintKey } from '../types/form'

// ─────────────────────────────────────────────────────────────────────────
// Declarative description of the whole pregnancy card.
// The section components render purely from this config + i18n.
// `tr` values below are i18n keys (looked up in src/i18n/*).
// ─────────────────────────────────────────────────────────────────────────

export type FieldType =
  | 'text' | 'number' | 'date' | 'textarea' | 'select' | 'toggle' | 'bp' | 'bmi'

export interface Opt {
  value: string
  tr: string          // i18n key for the option label (or literal if startsWith '#')
}

export interface FieldDef {
  /** store key (or 'bp'/'bmi' for composite/computed widgets). */
  id: StringKey | 'bp' | 'bmi'
  type: FieldType
  unit?: string       // i18n key for unit adornment
  ph?: string         // i18n key for placeholder
  min?: number
  max?: number
  step?: 'any'
  opts?: Opt[]
  xs?: number
  sm?: number
  rows?: number       // for textarea
  helper?: string     // i18n key
}

export interface CheckGroup {
  titleTr?: string    // optional sub-title i18n key
  keys: BoolKey[]     // each key's label is tr[key]
}

export interface SectionDef {
  id: string          // used for color + icon mapping
  titleTr: string     // i18n key for the section title
  fields?: FieldDef[]
  checks?: CheckGroup[]
  complaints?: ComplaintKey[] // render as checkbox + collapsible note
  ultrasound?: boolean // render the bespoke 2-trimester table
}

// Reusable option sets
const YESNO_RESIDENCE: Opt[] = [
  { value: 'city', tr: 'optCity' },
  { value: 'village', tr: 'optVillage' },
]

export const SECTIONS: SectionDef[] = [
  // ── 1. Passport ──
  {
    id: 'passport',
    titleTr: 'secPassport',
    fields: [
      { id: 'fio', type: 'text', sm: 8 },
      { id: 'fishka', type: 'text', sm: 4 },
      { id: 'age', type: 'number', unit: 'unitYears', min: 10, max: 60, sm: 4 },
      { id: 'birthDate', type: 'date', sm: 4 },
      { id: 'year', type: 'number', min: 1900, max: 2100, sm: 4 },
      { id: 'regDate', type: 'date', sm: 4 },
      { id: 'residence', type: 'select', opts: YESNO_RESIDENCE, sm: 4 },
      { id: 'nationality', type: 'text', sm: 4 },
      { id: 'phone', type: 'text', sm: 6 },
      { id: 'workplace', type: 'text', sm: 6 },
      { id: 'maritalStatus', type: 'text', sm: 6 },
      { id: 'department', type: 'text', sm: 6 },
      { id: 'birthHistoryNo', type: 'text', sm: 6 },
      { id: 'flightCount', type: 'number', min: 0, max: 50, sm: 3 },
      { id: 'flightReason', type: 'text', sm: 3 },
    ],
    checks: [{ keys: ['flightDuringPreg'] }],
  },

  // ── 2. Anthropometry ──
  {
    id: 'anthro',
    titleTr: 'secAnthro',
    fields: [
      { id: 'weight', type: 'number', unit: 'unitKg', min: 30, max: 200, step: 'any', sm: 4 },
      { id: 'height', type: 'number', unit: 'unitCm', min: 100, max: 220, sm: 4 },
      { id: 'bmi', type: 'bmi', sm: 4 },
      { id: 'lastMenstr', type: 'date', sm: 4 },
      { id: 'gestWeeks', type: 'number', unit: 'unitWeeks', min: 1, max: 42, sm: 4 },
      { id: 'gestDays', type: 'number', unit: 'unitDays', min: 0, max: 6, sm: 4 },
    ],
  },

  // ── 3. Risk factors ──
  {
    id: 'risk',
    titleTr: 'secRisk',
    checks: [{
      keys: [
        'rfAnemia', 'rfObesity', 'rfInfections', 'rfDiabetes', 'rfThrombophilia',
        'rfSmoking', 'rfCardio', 'rfCovid', 'rfAlcohol',
      ],
    }],
  },

  // ── 4. Complaints & status ──
  {
    id: 'complaint',
    titleTr: 'secComplaints',
    fields: [
      { id: 'bp', type: 'bp' },
      {
        id: 'generalCondition', type: 'select', sm: 6,
        opts: [
          { value: 'satisfactory', tr: 'optSatisfactory' },
          { value: 'moderate', tr: 'optModerate' },
          { value: 'severe', tr: 'optSevere' },
        ],
      },
      {
        id: 'edema', type: 'select', sm: 6,
        opts: [
          { value: 'none', tr: 'optEdemaNone' },
          { value: 'legs', tr: 'optEdemaLegs' },
          { value: 'wholeBody', tr: 'optEdemaWhole' },
        ],
      },
      { id: 'conditionCause', type: 'text', sm: 6 },
      { id: 'pulmonarySystem', type: 'text', sm: 6 },
      { id: 'cardioSystem', type: 'text', sm: 6 },
      { id: 'git', type: 'text', sm: 6 },
      { id: 'urinarySystem', type: 'text', sm: 6 },
      { id: 'deliveryMethod', type: 'text', sm: 6 },
      { id: 'amniotomy', type: 'text', sm: 6 },
    ],
    complaints: ['pain', 'bleeding', 'fetalMovement', 'discharge'],
  },

  // ── 5. Anamnesis vitae + somatic diseases ──
  {
    id: 'anamnesis',
    titleTr: 'secAnamnesis',
    checks: [
      {
        titleTr: 'grpPastIllness',
        keys: [
          'avMeasles', 'avRubella', 'avChickenpox', 'avMumps',
          'avHepatitis', 'avAri', 'avAppendectomy', 'avTransfusion',
        ],
      },
      {
        titleTr: 'grpSomatic',
        keys: [
          'sdHypertension', 'sdDiabetes', 'sdGoiter', 'sdObesity', 'sdCardio',
          'sdAnemia', 'sdUrolithiasis', 'sdVaricose', 'sdAsthma', 'sdAllergy',
        ],
      },
    ],
    fields: [{ id: 'heredity', type: 'textarea', rows: 2, xs: 12 }],
  },

  // ── 6. Reproductive ──
  {
    id: 'reproductive',
    titleTr: 'secReproductive',
    fields: [
      { id: 'menarche', type: 'number', unit: 'unitYears', min: 8, max: 20, sm: 4 },
      {
        id: 'menstrCycle', type: 'select', sm: 4,
        opts: [
          { value: 'regular', tr: 'optRegular' },
          { value: 'irregular', tr: 'optIrregular' },
        ],
      },
      { id: 'cycleLength', type: 'number', unit: 'unitDays', min: 14, max: 60, sm: 4 },
      { id: 'pnm', type: 'date', sm: 6 },
      { id: 'prs', type: 'text', sm: 6 },
      { id: 'sexualLife', type: 'text', sm: 6 },
      {
        id: 'marriage', type: 'select', sm: 6,
        opts: [
          { value: 'registered', tr: 'optRegistered' },
          { value: 'unregistered', tr: 'optUnregistered' },
        ],
      },
    ],
  },

  // ── 7. Obstetric anamnesis ──
  {
    id: 'obstetric',
    titleTr: 'secObstetric',
    fields: [
      { id: 'infertility', type: 'text', sm: 12 },
      { id: 'pregCount', type: 'number', min: 1, max: 20, sm: 3 },
      { id: 'birthCount', type: 'number', min: 0, max: 20, sm: 3 },
      { id: 'cesareanCount', type: 'number', min: 0, max: 10, sm: 3 },
      { id: 'termBirths', type: 'number', min: 0, max: 20, sm: 3 },
      { id: 'pretermBirths', type: 'number', min: 0, max: 20, sm: 3 },
      { id: 'abortions', type: 'number', min: 0, max: 20, sm: 3 },
      { id: 'miscarriages', type: 'number', min: 0, max: 20, sm: 3 },
      { id: 'ectopic', type: 'number', min: 0, max: 10, sm: 3 },
      { id: 'opa', type: 'text', sm: 12 },
      {
        id: 'conception', type: 'select', sm: 12,
        opts: [
          { value: 'spontaneous', tr: 'optSpontaneous' },
          { value: 'stimulation', tr: 'optStimulation' },
          { value: 'ivf', tr: 'optIvf' },
        ],
      },
      { id: 'prevComp', type: 'textarea', rows: 2, xs: 12 },
    ],
    checks: [
      { titleTr: 'grpFirstHalf', keys: ['fhVomiting', 'fhAri', 'fhImg', 'fhThreat'] },
      { titleTr: 'grpSecondHalf', keys: ['shAri', 'shImg', 'shThreatPreterm'] },
    ],
  },

  // ── 8. Ultrasound fetometry ──
  {
    id: 'ultrasound',
    titleTr: 'secUltrasound',
    ultrasound: true,
    fields: [
      {
        id: 'placentaLocation', type: 'select', sm: 6,
        opts: [
          { value: 'anterior', tr: 'optAnterior' },
          { value: 'posterior', tr: 'optPosterior' },
          { value: 'fundus', tr: 'optFundus' },
          { value: 'lateral', tr: 'optLateral' },
        ],
      },
      { id: 'amniocentesis', type: 'text', sm: 6 },
    ],
  },

  // ── 9. Placenta / amniotic fluid ──
  {
    id: 'placenta',
    titleTr: 'secPlacenta',
    fields: [
      {
        id: 'placentaMaturity', type: 'select', sm: 4,
        opts: [
          { value: '0', tr: '#0' }, { value: 'I', tr: '#I' },
          { value: 'II', tr: '#II' }, { value: 'III', tr: '#III' },
        ],
      },
      { id: 'placentaThickness', type: 'number', unit: 'unitMm', min: 0, max: 80, sm: 4 },
      {
        id: 'bloodGroup', type: 'select', sm: 4,
        opts: [
          { value: 'O(I)', tr: '#O(I)' }, { value: 'A(II)', tr: '#A(II)' },
          { value: 'B(III)', tr: '#B(III)' }, { value: 'AB(IV)', tr: '#AB(IV)' },
        ],
      },
      {
        id: 'rhesus', type: 'toggle', sm: 4,
        opts: [
          { value: 'pos', tr: 'optRhPos' },
          { value: 'neg', tr: 'optRhNeg' },
        ],
      },
      { id: 'iaj', type: 'number', unit: 'unitMm', min: 0, max: 400, step: 'any', sm: 4 },
      { id: 'gestationTerm', type: 'number', unit: 'unitWeeks', min: 1, max: 42, sm: 4 },
    ],
    checks: [{
      titleTr: 'grpAmnioticFluid',
      keys: ['afNormal', 'afOligo', 'afPoly', 'afAcutePoly', 'afAcuteOligo'],
    }],
  },

  // ── 9b. Delivery (Роды) ──
  {
    id: 'delivery',
    titleTr: 'secDelivery',
    fields: [
      { id: 'deliveryDate', type: 'date', sm: 6 },
      { id: 'deliveryTerm', type: 'number', unit: 'unitWeeks', min: 20, max: 45, sm: 6 },
      {
        id: 'cesarean', type: 'select', sm: 6,
        opts: [
          { value: 'planned', tr: 'optPlanned' },
          { value: 'emergency', tr: 'optEmergency' },
        ],
      },
      { id: 'cesareanIndication', type: 'text', sm: 6 },
    ],
  },

  // ── 10. Outcome ──
  {
    id: 'outcome',
    titleTr: 'secOutcome',
    fields: [
      { id: 'babyWeight', type: 'number', unit: 'unitG', min: 300, max: 6000, sm: 4 },
      { id: 'apgar', type: 'text', ph: 'apgarPh', sm: 4 },
      { id: 'chromosomalPathology', type: 'text', sm: 4 },
      { id: 'vpr', type: 'text', sm: 6 },
      { id: 'newbornScreening', type: 'text', sm: 6 },
      { id: 'babyVaccinations', type: 'text', sm: 12 },
    ],
    checks: [{ keys: ['fetalDeath', 'neonatalDeath'] }],
  },

  // ── 11. Vaccination ──
  {
    id: 'vaccine',
    titleTr: 'secVaccine',
    fields: [
      { id: 'covidVaccineDate', type: 'date', sm: 6 },
      {
        id: 'covidVaccineBrand', type: 'select', sm: 6,
        opts: [
          { value: 'pfizer', tr: 'optPfizer' },
          { value: 'sputnik', tr: 'optSputnik' },
          { value: 'astrazeneca', tr: 'optAstrazeneca' },
          { value: 'zfuzvac', tr: 'optZfuzvac' },
          { value: 'sinovac', tr: 'optSinovac' },
        ],
      },
      { id: 'measlesVaccine', type: 'text', sm: 12 },
      {
        id: 'fluVaccine', type: 'select', sm: 4,
        opts: [
          { value: 'vaxigrip', tr: '#Vaxigrip' },
          { value: 'influvac', tr: '#Influvac' },
          { value: 'grippol', tr: '#Grippol Plus' },
          { value: 'fluarix', tr: '#Fluarix' },
          { value: 'fluzone', tr: '#Fluzone' },
        ],
      },
      { id: 'fluVaccineDate', type: 'date', sm: 4 },
      { id: 'fluVaccineTerm', type: 'number', unit: 'unitWeeks', min: 1, max: 42, sm: 4 },
    ],
  },

  // ── 12. Contraception ──
  {
    id: 'contraception',
    titleTr: 'secContraception',
    checks: [{ keys: ['cIud', 'cOc', 'cIc', 'cDhs', 'cCondom'] }],
  },

  // ── 13. Medications / nutrition / lifestyle ──
  {
    id: 'lifestyle',
    titleTr: 'secLifestyle',
    fields: [
      { id: 'medications', type: 'textarea', rows: 3, xs: 12 },
      { id: 'onf', type: 'text', sm: 6 },
      { id: 'chemicalContact', type: 'text', sm: 6 },
      { id: 'hairColoring', type: 'text', sm: 12 },
    ],
    checks: [{
      titleTr: 'grpNutrition',
      keys: ['nMeat', 'nBeans', 'nEgg', 'nRice', 'nFastfood', 'nFish', 'nOil'],
    }],
  },
]

// Ultrasound metric rows (rendered as a 2-trimester table)
export const US_ROWS: { id: string; tr: string; unit?: string }[] = [
  { id: 'usKtr', tr: 'usKtr', unit: 'unitMm' },
  { id: 'usTvp', tr: 'usTvp', unit: 'unitMm' },
  { id: 'usYolkSac', tr: 'usYolkSac', unit: 'unitMm' },
  { id: 'usBpr', tr: 'usBpr', unit: 'unitMm' },
  { id: 'usDb', tr: 'usDb', unit: 'unitMm' },
  { id: 'usOj', tr: 'usOj', unit: 'unitMm' },
  { id: 'usOg', tr: 'usOg', unit: 'unitMm' },
  { id: 'usNoseBone', tr: 'usNoseBone', unit: 'unitMm' },
  { id: 'usNeckFold', tr: 'usNeckFold', unit: 'unitMm' },
  { id: 'usHr', tr: 'usHr', unit: 'unitBpm' },
  { id: 'usVenousDuct', tr: 'usVenousDuct' },
  { id: 'usPapp', tr: 'usPapp' },
  { id: 'usHcg', tr: 'usHcg' },
  { id: 'usMom', tr: 'usMom' },
  { id: 'usNptt', tr: 'usNptt' },
  { id: 'usRiskT21', tr: 'usRiskT21' },
  { id: 'usRiskT18', tr: 'usRiskT18' },
  { id: 'usRiskT13', tr: 'usRiskT13' },
]
