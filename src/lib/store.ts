'use client';

import { User, Meal, WaterLog, Exercise, WeightLog, AISuggestion, Food } from './types';

// Store simples usando localStorage para persistência
// Em produção, substituir por Supabase ou outro backend

class AppStore {
  private storageKey = 'caloria-ai-data';

  private getData() {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  private setData(data: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // User
  getUser(): User | null {
    const data = this.getData();
    return data?.user || null;
  }

  setUser(user: User) {
    const data = this.getData() || {};
    // Garantir que campos de assinatura existam
    if (!user.tipo_plano) user.tipo_plano = 'free';
    if (!user.status_assinatura) user.status_assinatura = 'inativo';
    data.user = user;
    this.setData(data);
  }

  updateUserSubscription(
    tipo_plano: 'free' | 'basico' | 'premium' | 'elite',
    status_assinatura: 'ativo' | 'inativo' | 'trial',
    stripe_customer_id?: string,
    stripe_subscription_id?: string
  ) {
    const user = this.getUser();
    if (!user) return;

    user.tipo_plano = tipo_plano;
    user.status_assinatura = status_assinatura;
    if (stripe_customer_id) user.stripe_customer_id = stripe_customer_id;
    if (stripe_subscription_id) user.stripe_subscription_id = stripe_subscription_id;

    this.setUser(user);
  }

  // Meals
  getMeals(userId: string, date?: string): Meal[] {
    const data = this.getData();
    let meals = data?.meals || [];
    meals = meals.filter((m: Meal) => m.userId === userId);
    if (date) {
      meals = meals.filter((m: Meal) => m.date === date);
    }
    return meals;
  }

  addMeal(meal: Meal) {
    const data = this.getData() || {};
    data.meals = data.meals || [];
    data.meals.push(meal);
    this.setData(data);
  }

  // Water
  getWaterLogs(userId: string, date: string): WaterLog[] {
    const data = this.getData();
    const logs = data?.waterLogs || [];
    return logs.filter((w: WaterLog) => w.userId === userId && w.date === date);
  }

  addWaterLog(log: WaterLog) {
    const data = this.getData() || {};
    data.waterLogs = data.waterLogs || [];
    data.waterLogs.push(log);
    this.setData(data);
  }

  // Exercises
  getExercises(userId: string, date?: string): Exercise[] {
    const data = this.getData();
    let exercises = data?.exercises || [];
    exercises = exercises.filter((e: Exercise) => e.userId === userId);
    if (date) {
      exercises = exercises.filter((e: Exercise) => e.date === date);
    }
    return exercises;
  }

  addExercise(exercise: Exercise) {
    const data = this.getData() || {};
    data.exercises = data.exercises || [];
    data.exercises.push(exercise);
    this.setData(data);
  }

  // Weight
  getWeightLogs(userId: string): WeightLog[] {
    const data = this.getData();
    const logs = data?.weightLogs || [];
    return logs.filter((w: WeightLog) => w.userId === userId);
  }

  addWeightLog(log: WeightLog) {
    const data = this.getData() || {};
    data.weightLogs = data.weightLogs || [];
    data.weightLogs.push(log);
    this.setData(data);
  }

  // AI Suggestions
  getSuggestions(userId: string): AISuggestion[] {
    const data = this.getData();
    const suggestions = data?.suggestions || [];
    return suggestions.filter((s: AISuggestion) => s.userId === userId);
  }

  addSuggestion(suggestion: AISuggestion) {
    const data = this.getData() || {};
    data.suggestions = data.suggestions || [];
    data.suggestions.push(suggestion);
    this.setData(data);
  }

  markSuggestionAsRead(suggestionId: string) {
    const data = this.getData() || {};
    const suggestions = data.suggestions || [];
    const suggestion = suggestions.find((s: AISuggestion) => s.id === suggestionId);
    if (suggestion) {
      suggestion.status = 'read';
      this.setData(data);
    }
  }

  // Foods
  getFoods(): Food[] {
    const data = this.getData();
    return data?.foods || [];
  }

  addFood(food: Food) {
    const data = this.getData() || {};
    data.foods = data.foods || [];
    data.foods.push(food);
    this.setData(data);
  }

  searchFoods(query: string): Food[] {
    const foods = this.getFoods();
    const lowerQuery = query.toLowerCase();
    return foods.filter(f => 
      f.name.toLowerCase().includes(lowerQuery) ||
      f.brand?.toLowerCase().includes(lowerQuery)
    );
  }

  // Auth
  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  logout() {
    const data = this.getData() || {};
    delete data.user;
    this.setData(data);
  }

  // Subscription checks
  hasActiveSubscription(): boolean {
    const user = this.getUser();
    return user?.status_assinatura === 'ativo' || user?.status_assinatura === 'trial';
  }

  isPremiumUser(): boolean {
    const user = this.getUser();
    return user?.tipo_plano === 'premium' || user?.tipo_plano === 'elite';
  }

  isEliteUser(): boolean {
    const user = this.getUser();
    return user?.tipo_plano === 'elite';
  }
}

export const store = new AppStore();
