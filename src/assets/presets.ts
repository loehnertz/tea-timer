import type { TeaPreset } from './types'

export const gongFuBrewPresets: TeaPreset[] = [
  { name: 'White', waterTemp: 85, amount: 3.5, firstInfusion: 20, additionalInfusions: 10 },
  { name: 'Green', waterTemp: 80, amount: 3, firstInfusion: 15, additionalInfusions: 3 },
  { name: 'Yellow', waterTemp: 85, amount: 3.5, firstInfusion: 15, additionalInfusions: 5 },
  { name: 'Oolong (strip)', waterTemp: 99, amount: 4.5, firstInfusion: 20, additionalInfusions: 5 },
  { name: 'Oolong (ball)', waterTemp: 99, amount: 6, firstInfusion: 25, additionalInfusions: 5 },
  {
    name: 'Black (small leaf)',
    waterTemp: 90,
    amount: 4.5,
    firstInfusion: 10,
    additionalInfusions: 5,
  },
  {
    name: 'Black (large leaf)',
    waterTemp: 95,
    amount: 4,
    firstInfusion: 15,
    additionalInfusions: 5,
  },
  { name: 'Dark (raw)', waterTemp: 95, amount: 5, firstInfusion: 10, additionalInfusions: 3 },
  { name: 'Dark (ripe)', waterTemp: 99, amount: 5, firstInfusion: 10, additionalInfusions: 5 },
]

export const westernBrewPresets: TeaPreset[] = [
  { name: 'White', waterTemp: 85, amount: 0.6, firstInfusion: 180, additionalInfusions: 60 },
  { name: 'Green', waterTemp: 80, amount: 0.5, firstInfusion: 120, additionalInfusions: 60 },
  { name: 'Yellow', waterTemp: 85, amount: 0.6, firstInfusion: 120, additionalInfusions: 60 },
  {
    name: 'Oolong (strip)',
    waterTemp: 99,
    amount: 0.8,
    firstInfusion: 120,
    additionalInfusions: 30,
  },
  { name: 'Oolong (ball)', waterTemp: 99, amount: 1, firstInfusion: 120, additionalInfusions: 30 },
  {
    name: 'Black (small leaf)',
    waterTemp: 90,
    amount: 0.8,
    firstInfusion: 120,
    additionalInfusions: 60,
  },
  {
    name: 'Black (large leaf)',
    waterTemp: 95,
    amount: 0.7,
    firstInfusion: 120,
    additionalInfusions: 60,
  },
  { name: 'PuErh (raw)', waterTemp: 95, amount: 0.9, firstInfusion: 120, additionalInfusions: 30 },
  { name: 'PuErh (ripe)', waterTemp: 99, amount: 0.9, firstInfusion: 120, additionalInfusions: 30 },
]
