import { Category, TipOption } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: 'fas fa-globe' },
  { id: 'Challenge', name: 'Challenge', icon: 'fas fa-trophy' },
  { id: 'Art', name: 'Art', icon: 'fas fa-palette' },
  { id: 'Music', name: 'Music', icon: 'fas fa-music' },
  { id: 'Gaming', name: 'Gaming', icon: 'fas fa-gamepad' },
  { id: 'Writing', name: 'Writing', icon: 'fas fa-pen-fancy' },
  { id: 'Photography', name: 'Photography', icon: 'fas fa-camera' },
  { id: 'Fitness', name: 'Fitness', icon: 'fas fa-dumbbell' },
  { id: 'Tech', name: 'Tech', icon: 'fas fa-microchip' },
  { id: 'Fashion', name: 'Fashion', icon: 'fas fa-tshirt' },
  { id: 'Food', name: 'Food', icon: 'fas fa-utensils' },
  { id: 'Dance', name: 'Dance', icon: 'fas fa-shoe-prints' },
  { id: 'Comedy', name: 'Comedy', icon: 'fas fa-laugh-squint' },
  { id: 'Travel', name: 'Travel', icon: 'fas fa-plane' }
];

export const CATEGORY_ICONS: Record<string, string> = {
  Challenge: '<i class="fas fa-trophy"></i>',
  Art: '<i class="fas fa-palette"></i>',
  Music: '<i class="fas fa-music"></i>',
  Gaming: '<i class="fas fa-gamepad"></i>',
  Writing: '<i class="fas fa-pen-fancy"></i>',
  Photography: '<i class="fas fa-camera"></i>',
  Fitness: '<i class="fas fa-dumbbell"></i>',
  Tech: '<i class="fas fa-microchip"></i>',
  Fashion: '<i class="fas fa-tshirt"></i>',
  Food: '<i class="fas fa-utensils"></i>',
  Dance: '<i class="fas fa-shoe-prints"></i>',
  Comedy: '<i class="fas fa-laugh-squint"></i>',
  Travel: '<i class="fas fa-plane"></i>'
};

export const TIP_OPTIONS = [
  { coins: 20, xp: 2 },
  { coins: 50, xp: 5 },
  { coins: 70, xp: 7 },
  { coins: 100, xp: 10 }
];

export const REPORT_REASONS: string[] = [
  'Sexual Harassment',
  'Violence',
  'Hate Speech',
  'Harassment',
  'Spam',
  'Misinformation',
  'Copyright Infringement',
  'Impersonation'
];