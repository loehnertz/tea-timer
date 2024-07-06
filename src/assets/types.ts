export interface TeaPreset {
  name: string
  waterTemp: number
  amount: number
  firstInfusion: number
  additionalInfusions: number
}

export interface Settings {
  initialTime: number
  incrementTime: number
  infusionCount: number
  method: BrewMethod
  savedAt: number
}

export enum BrewMethod {
  GONG_FU = 'gong-fu-brew',
  WESTERN = 'western-brew',
}
