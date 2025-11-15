// Tipos do Caloria AI

export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
export type SuggestionType = 'diet' | 'water' | 'exercise';
export type SuggestionStatus = 'new' | 'read';
export type PlanType = 'free' | 'basico' | 'premium' | 'elite';
export type SubscriptionStatus = 'ativo' | 'inativo' | 'trial';

export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  birthDate: string;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight?: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
  dailyCalorieGoal: number;
  dailyProteinGoal: number; // g
  dailyCarbGoal: number; // g
  dailyFatGoal: number; // g
  dailyWaterGoal: number; // ml
  darkMode: boolean;
  unitSystem: 'metric' | 'imperial';
  notifications: boolean;
  integrations: string[];
  // Campos de assinatura
  tipo_plano: PlanType;
  status_assinatura: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  barcode?: string;
  isCustom: boolean;
  userId?: string;
  createdAt: string;
}

export interface MealItem {
  id: string;
  foodId: string;
  food: Food;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  time: string;
  type: MealType;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string;
  amount: number; // ml
  time: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  userId: string;
  type: ExerciseType;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
  time: string;
  source: 'manual' | 'imported';
  createdAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string;
  weight: number; // kg
  waist?: number; // cm
  hips?: number; // cm
  chest?: number; // cm
  arms?: number; // cm
  thighs?: number; // cm
  notes?: string;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  userId: string;
  date: string;
  text: string;
  type: SuggestionType;
  status: SuggestionStatus;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  exerciseCalories: number;
  mealsCount: number;
  exercisesCount: number;
}
