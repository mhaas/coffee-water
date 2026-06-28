import { ionsToProfile, normaliseAlkalinity } from '../calculate/ions'
import type { WaterIons } from '../calculate/ions'
import type { SourceInfo } from './types'

export interface WaterPreset {
  id: string
  name: string
  ions: WaterIons
  inputMode: 'ions' | 'direct'
  hardness: number
  alkalinity: number
  isCustom?: boolean
  source?: SourceInfo
}

const preset = (
  id: string,
  name: string,
  ions: WaterIons,
  extra?: object
): WaterPreset => ({
  id,
  name,
  ions,
  inputMode: 'ions',
  ...ionsToProfile(ions),
  ...extra
})

const wiesloch_sg_hco3 = normaliseAlkalinity(16.4, 'KH')
const wiesloch_sh_hco3 = normaliseAlkalinity(19.2, 'KH')
const walldorf_hco3 = normaliseAlkalinity(5.52, 'mmolL_ks43')
const st_ingbert_hco3 = normaliseAlkalinity(1.02, 'mmolL_ks43')

export const waterPresets: WaterPreset[] = [
  preset('pure_ro', 'Pure RO / Distilled',
    { ca: 0, mg: 0, hco3: 0, alkUnit: 'mgL_hco3' }
  ),

  preset('black_forest_still', 'Black Forest Still',
    { ca: 6.7, mg: 2.6, hco3: 30.5, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.blackforest-still.de/produkte/black-forest-still.html' } }
  ),

  preset('volvic', 'Volvic',
    { ca: 13.0, mg: 9.0, hco3: 80.0, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.volvic.de/produkte/volvic-natuerliches-mineralwasser/volvic-naturelle/05l.html' } }
  ),

  preset('evian', 'Evian',
    { ca: 80, mg: 26, hco3: 360, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.evian.com/de_ch/unser-mineralwasser/wasserqualitaet/' } }
  ),

  preset('mannheim_kaefertal', 'Mannheim Tap (Käfertal)',
    { ca: 118, mg: 14, hco3: 352, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-kaefertal.pdf' } }
  ),

  preset('mannheim_rheinau', 'Mannheim Tap (Rheinau)',
    { ca: 111, mg: 21, hco3: 332, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-rheinau.pdf' } }
  ),

  preset('schwetzinger_hardt', 'Schwetzinger Hardt Tap',
    { ca: 101, mg: 17, hco3: 337, alkUnit: 'mgL_hco3' },
    { source: { url: 'https://www.mvv.de/fileadmin/user_upload_pk_gewk/pdf/Wasser/wasserqualitaet-schwetzingerhardt.pdf' } }
  ),

  preset('st_ingbert', 'St. Ingbert Tap',
    { ca: 25.7, mg: 2.2, hco3: st_ingbert_hco3, alkUnit: 'mmolL_ks43' },
    { source: { url: 'https://www.biosphaeren-stadtwerke.de/app/uploads/sites/2/2025/04/Ausgang-Wasserwerk-IGB.pdf' } }
  ),

  preset('wiesloch_stadtgebiet', 'Wiesloch Tap (Stadtgebiet)',
    { ca: 125, mg: 24, hco3: wiesloch_sg_hco3, alkUnit: 'KH' },
    { source: { url: 'https://www.stadtwerke-wiesloch.de/pb/site/stadtwerke-wiesloch/get/documents_E1695113663/stadtwerke-wiesloch/Dateien/Trinkwasser/Trinkwasseranalysen_2024.pdf' } }
  ),

  preset('wiesloch_schatthausen', 'Wiesloch Tap (Schatthausen)',
    { ca: 116, mg: 24, hco3: wiesloch_sh_hco3, alkUnit: 'KH' },
    { source: { url: 'https://www.stadtwerke-wiesloch.de/pb/site/stadtwerke-wiesloch/get/documents_E1695113663/stadtwerke-wiesloch/Dateien/Trinkwasser/Trinkwasseranalysen_2024.pdf' } }
  ),

  preset('walldorf', 'Walldorf Tap',
    { ca: 135, mg: 19.3, hco3: walldorf_hco3, alkUnit: 'mmolL_ks43' },
    { source: { url: 'https://www.hardtgruppe.de/analysen/2026-02_analyse.pdf' } }
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

export const getPresetById = (id: string): WaterPreset | undefined => {
  return waterPresets.find(preset => preset.id === id)
}