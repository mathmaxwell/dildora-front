import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  FormState, ComplaintItem, USRow,
  StringKey, BoolKey, ComplaintKey, USKey,
} from '../types/form'

const mkC = (): ComplaintItem => ({ checked: false, note: '' })
const mkUS = (): USRow => ({ t1: '', t2: '' })

const initial: FormState = {
  // Passport
  fishka: '', year: '', fio: '', age: '', birthDate: '', regDate: '',
  residence: '', workplace: '', phone: '', nationality: '', maritalStatus: '',
  flightDuringPreg: false, flightCount: '', flightReason: '',
  department: '', birthHistoryNo: '',

  // Anthropometry
  weight: '', height: '', lastMenstr: '', gestWeeks: '', gestDays: '',

  // Risk factors
  rfAnemia: false, rfObesity: false, rfInfections: false, rfDiabetes: false,
  rfThrombophilia: false, rfSmoking: false, rfCardio: false, rfCovid: false,
  rfAlcohol: false,

  // Complaints & status
  bpSystolic: '', bpDiastolic: '',
  pain: mkC(), bleeding: mkC(), fetalMovement: mkC(), discharge: mkC(),
  generalCondition: '', pulmonarySystem: '', cardioSystem: '', git: '',
  urinarySystem: '', edema: '',
  conditionCause: '', deliveryMethod: '', amniotomy: '',

  // Anamnesis vitae
  avMeasles: false, avRubella: false, avChickenpox: false, avMumps: false,
  avHepatitis: false, avAri: false, avAppendectomy: false, avTransfusion: false,
  // Somatic diseases
  sdHypertension: false, sdDiabetes: false, sdGoiter: false, sdObesity: false,
  sdCardio: false, sdAnemia: false, sdUrolithiasis: false, sdVaricose: false,
  sdAsthma: false, sdAllergy: false,
  heredity: '',

  // Reproductive
  menarche: '', menstrCycle: '', cycleLength: '', pnm: '', prs: '',
  sexualLife: '', marriage: '',

  // Obstetric anamnesis
  infertility: '', pregCount: '', birthCount: '', cesareanCount: '',
  termBirths: '', pretermBirths: '', abortions: '', miscarriages: '',
  ectopic: '', opa: '', prevComp: '', conception: '',
  fhVomiting: false, fhAri: false, fhImg: false, fhThreat: false,
  shAri: false, shImg: false, shThreatPreterm: false,

  // Ultrasound
  usKtr: mkUS(), usTvp: mkUS(), usYolkSac: mkUS(), usBpr: mkUS(), usDb: mkUS(),
  usOj: mkUS(), usOg: mkUS(), usNoseBone: mkUS(), usNeckFold: mkUS(), usHr: mkUS(),
  usVenousDuct: mkUS(), usPapp: mkUS(), usHcg: mkUS(), usMom: mkUS(), usNptt: mkUS(),
  usRiskT21: mkUS(), usRiskT18: mkUS(), usRiskT13: mkUS(),
  amniocentesis: '', placentaLocation: '',

  // Placenta / amniotic fluid
  placentaMaturity: '', placentaThickness: '', bloodGroup: '', rhesus: '',
  afOligo: false, afPoly: false, afAcutePoly: false, afAcuteOligo: false,
  afNormal: false, iaj: '', gestationTerm: '',

  // Delivery (Роды)
  deliveryDate: '', deliveryTerm: '', cesarean: '', cesareanIndication: '',

  // Outcome
  babyWeight: '', apgar: '', fetalDeath: false, chromosomalPathology: '',
  vpr: '', neonatalDeath: false, newbornScreening: '', babyVaccinations: '',

  // Vaccination
  covidVaccineDate: '', covidVaccineBrand: '', measlesVaccine: '',
  fluVaccine: '', fluVaccineDate: '', fluVaccineTerm: '',

  // Contraception
  cIud: false, cOc: false, cIc: false, cDhs: false, cCondom: false,

  // Medications / nutrition / lifestyle
  medications: '', onf: '',
  nMeat: false, nBeans: false, nEgg: false, nRice: false, nFastfood: false,
  nFish: false, nOil: false,
  chemicalContact: '', hairColoring: '',

  // Lab tests
  hgb: '', rbc: '', wbc: '', plt: '', glcBlood: '', ferritin: '', iron: '',
  alt: '', ast: '', creatinine: '', protein: '', glcUrine: '', ketones: '',
}

interface FormStore extends FormState {
  setField: (key: StringKey, val: string) => void
  setBool: (key: BoolKey, val: boolean) => void
  setComplaint: (key: ComplaintKey, field: keyof ComplaintItem, val: boolean | string) => void
  setUS: (key: USKey, trimester: keyof USRow, val: string) => void
  reset: () => void
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      ...initial,
      setField: (key, val) => set({ [key]: val } as unknown as Partial<FormStore>),
      setBool: (key, val) => set({ [key]: val } as unknown as Partial<FormStore>),
      setComplaint: (key, field, val) =>
        set((s) => ({ [key]: { ...(s[key] as ComplaintItem), [field]: val } })),
      setUS: (key, trimester, val) =>
        set((s) => ({ [key]: { ...(s[key] as USRow), [trimester]: val } })),
      reset: () => set(initial),
    }),
    {
      // Черновик формы переживает обновление/случайное закрытие страницы.
      name: 'dildora-form-draft',
      // Сохраняем только данные, без функций-экшенов.
      partialize: (s) => {
        const { setField, setBool, setComplaint, setUS, reset, ...data } = s
        void setField; void setBool; void setComplaint; void setUS; void reset
        return data
      },
    },
  ),
)
