import type { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { id: 's1', time: '11h45', status: 'available', capacity: 6, taken: 1 },
  { id: 's2', time: '12h00', status: 'almost-full', capacity: 6, taken: 5 },
  { id: 's3', time: '12h15', status: 'full', capacity: 6, taken: 6 },
  { id: 's4', time: '12h30', status: 'available', capacity: 6, taken: 2 },
  { id: 's5', time: '12h45', status: 'available', capacity: 6, taken: 1 },
  { id: 's6', time: '13h00', status: 'almost-full', capacity: 6, taken: 5 },
  { id: 's7', time: '13h15', status: 'available', capacity: 6, taken: 0 },
];
