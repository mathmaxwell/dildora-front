// ─────────────────────────────────────────────────────────────────────────
// Full pregnancy card model — reproduces the paper "Карта беременной" 1:1.
// Field groups follow the two scanned pages of the card.
// ─────────────────────────────────────────────────────────────────────────

/** A complaint / symptom: a checkbox plus an optional free-text note. */
export interface ComplaintItem {
  checked: boolean
  note: string
}

/** One ultrasound metric measured across two trimesters. */
export interface USRow {
  t1: string
  t2: string
}

export interface FormState {
  // ── 1. Паспортная часть (Passport) ──
  fishka: string            // Фишка №
  year: string              // Год
  fio: string               // Ф.И.О
  age: string               // Возраст
  birthDate: string         // Дата рождения
  regDate: string           // Дата взятия на учёт
  residence: '' | 'city' | 'village'
  workplace: string         // Место работы
  phone: string             // Тел. номер
  nationality: string       // Национальность
  maritalStatus: string     // Семейное положение
  flightDuringPreg: boolean // Во время бер-ти на самолёте
  flightCount: string       // Сколько раз
  flightReason: string      // Срок / зачем
  department: string        // Отд. (отделение)
  birthHistoryNo: string    // № и/р (история родов)

  // ── 2. Антропометрия (Anthropometry) ──
  weight: string            // Вес (кг)
  height: string            // Рост (см)
  lastMenstr: string        // Дата последней менструации
  gestWeeks: string         // Срок — недель
  gestDays: string          // Срок — дней

  // ── 3. Факторы риска (Risk factors, checkboxes) ──
  rfAnemia: boolean
  rfObesity: boolean
  rfInfections: boolean
  rfDiabetes: boolean
  rfThrombophilia: boolean
  rfSmoking: boolean
  rfCardio: boolean
  rfCovid: boolean
  rfAlcohol: boolean

  // ── 4. Жалобы и общее состояние (Complaints & status) ──
  bpSystolic: string
  bpDiastolic: string
  pain: ComplaintItem
  bleeding: ComplaintItem
  fetalMovement: ComplaintItem
  discharge: ComplaintItem
  generalCondition: '' | 'satisfactory' | 'moderate' | 'severe'
  pulmonarySystem: string   // Лёгочная система
  cardioSystem: string      // ССС
  git: string               // ЖКТ
  urinarySystem: string     // Мочев. выделит. система
  edema: '' | 'none' | 'legs' | 'wholeBody'
  conditionCause: string    // Общее состояние обусловлено (АД и т.д.)
  deliveryMethod: string    // Метод родоразрешения
  amniotomy: string         // Гландии, амниотомия

  // ── 5. Анамнез vitae (Past illnesses, checkboxes) ──
  avMeasles: boolean
  avRubella: boolean
  avChickenpox: boolean
  avMumps: boolean
  avHepatitis: boolean
  avAri: boolean
  avAppendectomy: boolean
  avTransfusion: boolean
  // Соматические заболевания (Somatic diseases, checkboxes)
  sdHypertension: boolean
  sdDiabetes: boolean
  sdGoiter: boolean
  sdObesity: boolean
  sdCardio: boolean
  sdAnemia: boolean
  sdUrolithiasis: boolean
  sdVaricose: boolean
  sdAsthma: boolean
  sdAllergy: boolean
  heredity: string          // Наследственность

  // ── 6. Репродуктивный анамнез (Reproductive) ──
  menarche: string          // Менархе (лет)
  menstrCycle: '' | 'regular' | 'irregular'
  cycleLength: string       // Каждые ___ дней
  pnm: string               // ПНМ
  prs: string               // ПРС
  sexualLife: string        // Половая жизнь
  marriage: '' | 'registered' | 'unregistered'

  // ── 7. Акушерский анамнез (Obstetric anamnesis) ──
  infertility: string       // Бесплодие
  pregCount: string         // Беременность по счёту (Бер.)
  birthCount: string        // Роды
  cesareanCount: string     // к/с
  termBirths: string        // ср. роды (срочные)
  pretermBirths: string     // прежд. роды
  abortions: string         // Аборты
  miscarriages: string      // выкидыши
  ectopic: string           // вн. маточная
  opa: string               // ОПА (отягощённый акушерский анамнез)
  prevComp: string          // Предыдущие осложнения (свободный текст)
  conception: '' | 'spontaneous' | 'stimulation' | 'ivf'
  // Течение данной беременности (Course)
  fhVomiting: boolean       // I половина — рвота
  fhAri: boolean            // I половина — ОРИ
  fhImg: boolean            // I половина — ИМГ
  fhThreat: boolean         // I половина — угроза/аборт
  shAri: boolean            // II половина — ОРИ
  shImg: boolean            // II половина — ИМГ
  shThreatPreterm: boolean  // II половина — угроза преждев. родов

  // ── 8. УЗИ-фетометрия (Ultrasound, two trimesters) ──
  usKtr: USRow
  usTvp: USRow
  usYolkSac: USRow
  usBpr: USRow
  usDb: USRow
  usOj: USRow
  usOg: USRow
  usNoseBone: USRow
  usNeckFold: USRow
  usHr: USRow
  usVenousDuct: USRow
  usPapp: USRow
  usHcg: USRow
  usMom: USRow
  usNptt: USRow
  usRiskT21: USRow
  usRiskT18: USRow
  usRiskT13: USRow
  amniocentesis: string
  placentaLocation: '' | 'anterior' | 'posterior' | 'fundus' | 'lateral'

  // ── 9. Плацента / околоплодные воды (Placenta / amniotic fluid) ──
  placentaMaturity: '' | '0' | 'I' | 'II' | 'III'
  placentaThickness: string // мм
  bloodGroup: '' | 'O(I)' | 'A(II)' | 'B(III)' | 'AB(IV)'
  rhesus: '' | 'pos' | 'neg'
  afOligo: boolean          // маловодие
  afPoly: boolean           // многоводие
  afAcutePoly: boolean      // острое многоводие
  afAcuteOligo: boolean     // острое маловодие
  afNormal: boolean         // норма
  iaj: string               // ИАЖ
  gestationTerm: string     // срок гестации (недель)

  // ── 9b. Роды (Delivery) ──
  deliveryDate: string      // Дата родов
  deliveryTerm: string      // Срок родов (недель)
  cesarean: '' | 'planned' | 'emergency' // Кесарево сечение
  cesareanIndication: string // Показание (к кесареву)

  // ── 10. Исход (Outcome) ──
  babyWeight: string        // Вес реб (г)
  apgar: string             // АПГАР (баллы)
  fetalDeath: boolean       // Гибель плода
  chromosomalPathology: string // Хромосом. патология
  vpr: string               // ВПР
  neonatalDeath: boolean    // Неонат. смерть
  newbornScreening: string  // Скрининг новорождённых
  babyVaccinations: string  // Прививки

  // ── 11. Вакцинация (Vaccination) ──
  covidVaccineDate: string
  covidVaccineBrand: string // Pfizer / Sputnik / AstraZeneca / ZF-UZ-VAC / Sinovac
  measlesVaccine: string
  fluVaccine: string        // Vaxigrip / Influvac / Grippol / Fluarix / Fluzone
  fluVaccineDate: string
  fluVaccineTerm: string

  // ── 12. Контрацепция (Contraception, checkboxes) ──
  cIud: boolean             // ВМС
  cOc: boolean              // ОК
  cIc: boolean              // ИК
  cDhs: boolean             // ДХС
  cCondom: boolean          // презерватив

  // ── 13. Лекарства / питание / образ жизни ──
  medications: string       // Препараты + срок (свободный текст)
  onf: string               // О.Н.Ф
  nMeat: boolean
  nBeans: boolean
  nEgg: boolean
  nRice: boolean
  nFastfood: boolean
  nFish: boolean
  nOil: boolean
  chemicalContact: string   // Контакт с химич. агентами, порошки
  hairColoring: string      // Окрашивание волос

  // ── 14. Лабораторные анализы (Lab tests — bonus, kept from prior version) ──
  hgb: string
  rbc: string
  wbc: string
  plt: string
  glcBlood: string
  ferritin: string
  iron: string
  alt: string
  ast: string
  creatinine: string
  protein: string
  glcUrine: string
  ketones: string
}

/** Keys whose value is a plain string (text / number / date / select). */
export type StringKey = {
  [K in keyof FormState]: FormState[K] extends string ? K : never
}[keyof FormState]

/** Keys whose value is a boolean (checkbox). */
export type BoolKey = {
  [K in keyof FormState]: FormState[K] extends boolean ? K : never
}[keyof FormState]

/** Keys holding a ComplaintItem. */
export type ComplaintKey = {
  [K in keyof FormState]: FormState[K] extends ComplaintItem ? K : never
}[keyof FormState]

/** Keys holding an ultrasound USRow. */
export type USKey = {
  [K in keyof FormState]: FormState[K] extends USRow ? K : never
}[keyof FormState]
