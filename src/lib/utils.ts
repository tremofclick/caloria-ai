import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User, ActivityLevel, Goal } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toTimeString().split(' ')[0].substring(0, 5);
}

export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female' | 'other'): number {
  // Fórmula de Mifflin-St Jeor
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return bmr * multipliers[activityLevel];
}

export function calculateDailyCalories(user: Partial<User>): number {
  if (!user.currentWeight || !user.height || !user.birthDate || !user.gender || !user.activityLevel) {
    return 2000; // default
  }

  const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
  const bmr = calculateBMR(user.currentWeight, user.height, age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);

  // Ajustar baseado no objetivo
  if (user.goal === 'lose') {
    return Math.round(tdee - 500); // déficit de 500 kcal
  } else if (user.goal === 'gain') {
    return Math.round(tdee + 300); // superávit de 300 kcal
  }
  return Math.round(tdee);
}

export function calculateMacros(calories: number, goal: Goal) {
  // Distribuição de macros baseada no objetivo
  let proteinPercent = 0.30;
  let carbPercent = 0.40;
  let fatPercent = 0.30;

  if (goal === 'lose') {
    proteinPercent = 0.35;
    carbPercent = 0.35;
    fatPercent = 0.30;
  } else if (goal === 'gain') {
    proteinPercent = 0.30;
    carbPercent = 0.45;
    fatPercent = 0.25;
  }

  return {
    protein: Math.round((calories * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((calories * carbPercent) / 4), // 4 cal/g
    fat: Math.round((calories * fatPercent) / 9), // 9 cal/g
  };
}

export function getActivityLevelLabel(level: ActivityLevel): string {
  const labels = {
    sedentary: 'Sedentário',
    light: 'Levemente ativo',
    moderate: 'Moderadamente ativo',
    active: 'Muito ativo',
    very_active: 'Extremamente ativo'
  };
  return labels[level];
}

export function getGoalLabel(goal: Goal): string {
  const labels = {
    lose: 'Perder peso',
    maintain: 'Manter peso',
    gain: 'Ganhar peso'
  };
  return labels[goal];
}
