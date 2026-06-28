// @flow

import { ionsToProfile, normaliseAlkalinity } from '../calculate/ions'
import type { WaterIons } from '../calculate/ions'

export type WaterPreset = {
  id: string,
  name: string,
  ions: WaterIons,
  inputMode: 'ions' | 'direct',
  hardness: number,    // mg/L CaCO3 — derived from ions, or direct entry
  alkalinity: number,  // mg/L CaCO3 — derived from ions, or direct entry
  isCustom?: boolean
}

// ---------------------------------------------------------------------------
// Helper: build a preset from raw ion values
// ---------------------------------------------------------------------------
const preset = (
  id: string,
  name: string,
  ions: WaterIons,
  extra?: Object
): WaterPreset => ({
  id,
  name,
  ions,
  inputMode: 'ions',
  ...ionsToProfile(ions),
  ...extra
})

// ---------------------------------------------------------------------------
// Wiesloch / Walldorf: source gives °KH or mmol/L — normalise to mg/L HCO3
// ---------------------------------------------------------------------------
// Wiesloch Stadtgebiet: Carbonathärte 16.4 °KH
const wiesloch_sg_hco3 = normaliseAlkalinity(16.4, 'KH')    // ≈ 357 mg/L HCO3
// Wiesloch Schatthausen: Carbonathärte 19.2 °KH
const wiesloch_sh_hco3 = normaliseAlkalinity(19.2, 'KH')    // ≈ 419 mg/L HCO3
// Walldorf: Säurekapazität KS4.3 5.52 mmol/L
const walldorf_hco3 = normaliseAlkalinity(5.52, 'mmolL_ks43') // ≈ 337 mg/L HCO3

export const waterPresets: Array<WaterPreset> = [
  preset('pure_ro', 'Pure RO / Distilled',
    { ca: 0, mg: 0, hco3: 0, alkUnit: 'mgL_hco3' }
  ),

  preset('black_forest_still', 'Black Forest Still',
    // Source: https://www.blackforest-still.de/produkte/black-forest-still.html
    // Spring: Hansjakobquelle in Bad Rippoldsau, Schwarzwald
    // Raw ions (mg/L): Ca 6.7, Mg 2.6, HCO3 30.5, Na 1.1, K 1.7, SO4 2.9, Cl 0.8
    { ca: 6.7, mg: 2.6, hco3: 30.5, alkUnit: 'mgL_hco3' }
  ),

  preset('volvic', 'Volvic',
    // Source: https://www.volvic.de/produkte/volvic-natuerliches-mineralwasser/volvic-naturelle/05l.html
    // Raw ions (mg/L): Ca 13.0, Mg 9.0, HCO3 80.0, Na 12.0, K 7.0, Cl 16.0, SO4 9.0, Si 31.0
    { ca: 13.0, mg: 9.0, hco3: 80.0, alkUnit: 'mgL_hco3' }
  ),

  preset('evian', 'Evian',
    // Source: https://www.evian.com/de_ch/unser-mineralwasser/wasserqualitaet/
    // Raw ions (mg/L): Ca 80, Mg 26, HCO3 360, K 1, Na 6.5, NO3 3.8, SO4 15, Si 14, Cl 10
    { ca: 80, mg: 26, hco3: 360, alkUnit: 'mgL_hco3' }
  ),

  preset('mannheim_kaefertal', 'Mannheim Tap (Käfertal)',
    // Source: https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-kaefertal.pdf
    // MVV Netze GmbH, Wasserwerk Käfertal — sampled 13.04.2026
    // Raw ions (mg/L): Ca 118, Mg 14, HCO3 352, Gesamthärte 19.7 °dH
    { ca: 118, mg: 14, hco3: 352, alkUnit: 'mgL_hco3' }
  ),

  preset('mannheim_rheinau', 'Mannheim Tap (Rheinau)',
    // Source: https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-rheinau.pdf
    // MVV Netze GmbH, Wasserwerk Rheinau — sampled 13.04.2026
    // Raw ions (mg/L): Ca 111, Mg 21, HCO3 332, Gesamthärte 20.4 °dH
    { ca: 111, mg: 21, hco3: 332, alkUnit: 'mgL_hco3' }
  ),

  preset('schwetzinger_hardt', 'Schwetzinger Hardt Tap',
    // Source: https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-schwetzingerhardt.pdf
    // ZWK Zweckverband Wasserversorgung Kurpfalz — sampled 13.04.2026
    // Raw ions (mg/L): Ca 101, Mg 17, HCO3 337, Gesamthärte 17.9 °dH
    { ca: 101, mg: 17, hco3: 337, alkUnit: 'mgL_hco3' }
  ),

  preset('wiesloch_stadtgebiet', 'Wiesloch Tap (Stadtgebiet)',
    // Source: https://www.stadtwerke-wiesloch.de/.../Trinkwasseranalysen_2024.pdf
    // Stadtwerke Wiesloch, Versorgungszone Wiesloch — sampled 20.11.2024
    // Raw ions (mg/L): Ca 125, Mg 24, Carbonathärte 16.4 °KH → HCO3 ≈ 357 mg/L
    { ca: 125, mg: 24, hco3: wiesloch_sg_hco3, alkUnit: 'KH' }
  ),

  preset('wiesloch_schatthausen', 'Wiesloch Tap (Schatthausen)',
    // Source: https://www.stadtwerke-wiesloch.de/.../Trinkwasseranalysen_2024.pdf
    // Stadtwerke Wiesloch, Versorgungszone Schatthausen — sampled 20.11.2024
    // Raw ions (mg/L): Ca 116, Mg 24, Carbonathärte 19.2 °KH → HCO3 ≈ 419 mg/L
    { ca: 116, mg: 24, hco3: wiesloch_sh_hco3, alkUnit: 'KH' }
  ),

  preset('walldorf', 'Walldorf Tap',
    // Source: https://www.hardtgruppe.de/analysen/2026-02_analyse.pdf
    // Institut Kuhlmann, Analysenbefund Nr. 26/01076-01-d — sampled 2026-02
    // Raw ions (mg/L): Ca 135, Mg 19.3, Säurekapazität KS4.3 5.52 mmol/L → HCO3 ≈ 337 mg/L
    { ca: 135, mg: 19.3, hco3: walldorf_hco3, alkUnit: 'mmolL_ks43' }
  ),

  {
    id: 'custom',
    name: 'Custom...',
    ions: { ca: 20, mg: 10, hco3: 50, alkUnit: 'mgL_hco3' },
    inputMode: 'ions',
    ...ionsToProfile({ ca: 20, mg: 10, hco3: 50 }),
    isCustom: true
  }
]

export const getPresetById = (id: string): ?WaterPreset => {
  return waterPresets.find(preset => preset.id === id)
}
