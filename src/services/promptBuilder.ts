import type { FormState } from '../types/form'
import type { Lang, Translations } from '../types/lang'
import { SECTIONS, US_ROWS, type FieldDef } from '../config/formConfig'

const SYSTEM: Record<Lang, string> = {
  ru: `Ты — опытный акушер-гинеколог. Проанализируй данные беременной пациентки и дай краткое клиническое заключение.
Структурируй ответ строго по разделам:

🩺 **Общее состояние**
⚠️ **На что обратить внимание**
🔬 **Отклонения в анализах**
📋 **Рекомендации**

Будь конкретным и профессиональным. Если данных мало — скажи об этом. Отвечай на русском языке.`,

  uz: `Siz tajribali akusher-ginekologsiz. Homilador bemorning ma'lumotlarini tahlil qilib, qisqacha klinik xulosa bering.
Javobni qat'iy bo'limlarga ajrating:

🩺 **Umumiy holat**
⚠️ **Alohida e'tibor berilishi kerak**
🔬 **Tahlillardagi og'ishlar**
📋 **Tavsiyalar**

Aniq va professional bo'ling. O'zbek tilida javob bering.`,

  en: `You are an experienced obstetrician-gynecologist. Analyze the pregnant patient's data and provide a concise clinical assessment.
Structure your response strictly by sections:

🩺 **General condition**
⚠️ **Areas of concern / red flags**
🔬 **Lab abnormalities**
📋 **Recommendations**

Be specific and professional. If data is insufficient, mention it. Respond in English.`,
}

const HEADER: Record<Lang, string> = {
  ru: '\n--- ДАННЫЕ ПАЦИЕНТКИ ---',
  uz: "\n--- BEMOR MA'LUMOTLARI ---",
  en: '\n--- PATIENT DATA ---',
}

function line(label: string, value: string): string {
  return `  ${label}: ${value}`
}

/** Resolve the human-readable value of a single config field. */
function fieldValue(def: FieldDef, form: FormState, tr: Translations): string | null {
  if (def.type === 'bmi') {
    const w = parseFloat(form.weight)
    const h = parseFloat(form.height)
    if (w > 0 && h > 0) return (w / Math.pow(h / 100, 2)).toFixed(1)
    return null
  }
  if (def.type === 'bp') {
    if (!form.bpSystolic && !form.bpDiastolic) return null
    return `${form.bpSystolic || '?'}/${form.bpDiastolic || '?'} ${tr.bpUnit}`
  }
  const raw = form[def.id as keyof FormState]
  if (typeof raw !== 'string' || !raw) return null
  if (def.opts) {
    const opt = def.opts.find((o) => o.value === raw)
    if (opt) return opt.tr.startsWith('#') ? opt.tr.slice(1) : (tr[opt.tr] ?? raw)
  }
  return def.unit ? `${raw} ${tr[def.unit]}` : raw
}

export function buildPrompt(form: FormState, tr: Translations, lang: Lang): string {
  const parts: string[] = [SYSTEM[lang], HEADER[lang]]

  for (const section of SECTIONS) {
    const lines: string[] = []

    // Simple fields
    for (const def of section.fields ?? []) {
      const v = fieldValue(def, form, tr)
      if (v) lines.push(line(tr[def.id] ?? def.id, v))
    }

    // Checkbox groups → list the checked items
    for (const group of section.checks ?? []) {
      const on = group.keys.filter((k) => form[k]).map((k) => tr[k])
      if (on.length) {
        const prefix = group.titleTr ? `${tr[group.titleTr]}: ` : ''
        lines.push(`  + ${prefix}${on.join(', ')}`)
      }
    }

    // Complaints with notes
    for (const key of section.complaints ?? []) {
      const item = form[key]
      if (item.checked) {
        const note = item.note ? ` — ${item.note}` : ''
        lines.push(`  + ${tr[key]}${note}`)
      }
    }

    // Ultrasound table
    if (section.ultrasound) {
      for (const row of US_ROWS) {
        const v = form[row.id as keyof FormState] as unknown as { t1: string; t2: string }
        if (v.t1 || v.t2) {
          lines.push(line(tr[row.tr], `${v.t1 || '—'} / ${v.t2 || '—'}`))
        }
      }
    }

    if (lines.length) parts.push(`\n${tr[section.titleTr]}:\n${lines.join('\n')}`)
  }

  // Lab tests (kept separately from the config)
  const labFields: { k: keyof FormState; l: string; u?: string }[] = [
    { k: 'hgb', l: tr.hgb, u: 'г/л' }, { k: 'rbc', l: tr.rbc, u: '×10¹²/л' },
    { k: 'wbc', l: tr.wbc, u: '×10⁹/л' }, { k: 'plt', l: tr.plt, u: '×10⁹/л' },
    { k: 'glcBlood', l: tr.glcBlood, u: 'ммоль/л' }, { k: 'ferritin', l: tr.ferritin, u: 'нг/мл' },
    { k: 'iron', l: tr.iron, u: 'мкмоль/л' }, { k: 'alt', l: tr.alt, u: 'Ед/л' },
    { k: 'ast', l: tr.ast, u: 'Ед/л' }, { k: 'creatinine', l: tr.creatinine, u: 'мкмоль/л' },
  ]
  const blood = labFields
    .filter(({ k }) => form[k])
    .map(({ k, l, u }) => line(l, `${form[k]}${u ? ` ${u}` : ''}`))
  if (blood.length) parts.push(`\n${tr.bloodTests}:\n${blood.join('\n')}`)

  const urineMap: Record<string, string> = {
    neg: tr.neg, traces: tr.traces, '+': '+', '++': '++', '+++': '+++',
  }
  const urine: string[] = []
  if (form.protein) urine.push(line(tr.protein, urineMap[form.protein] || form.protein))
  if (form.glcUrine) urine.push(line(tr.glcUrine, urineMap[form.glcUrine] || form.glcUrine))
  if (form.ketones) urine.push(line(tr.ketones, urineMap[form.ketones] || form.ketones))
  if (urine.length) parts.push(`\n${tr.urineTests}:\n${urine.join('\n')}`)

  return parts.join('\n')
}

/** Returns true if at least some meaningful data is filled. */
export function hasEnoughData(form: FormState): boolean {
  return !!(
    form.fio || form.age || form.gestWeeks || form.weight ||
    form.bpSystolic || form.hgb || form.glcBlood || form.pregCount ||
    form.pain.checked || form.bleeding.checked || form.fetalMovement.checked ||
    form.rfAnemia || form.rfDiabetes || form.rfCardio
  )
}
