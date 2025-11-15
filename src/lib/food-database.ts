// Mock de banco de dados de alimentos
// Em produção, conectar a uma API real como USDA FoodData Central, Open Food Facts, etc.

import { Food } from './types';
import { generateId } from './utils';

export const mockFoodDatabase: Food[] = [
  // Grãos e Cereais
  {
    id: generateId(),
    name: 'Arroz branco cozido',
    category: 'Grãos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Arroz integral cozido',
    category: 'Grãos',
    servingSize: 100,
    servingUnit: 'g',
    calories: 112,
    protein: 2.6,
    carbs: 24,
    fat: 0.9,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Pão francês',
    category: 'Pães',
    servingSize: 50,
    servingUnit: 'g',
    calories: 135,
    protein: 4.5,
    carbs: 27,
    fat: 1,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Pão integral',
    category: 'Pães',
    servingSize: 50,
    servingUnit: 'g',
    calories: 120,
    protein: 5,
    carbs: 22,
    fat: 2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Macarrão cozido',
    category: 'Massas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  
  // Proteínas
  {
    id: generateId(),
    name: 'Frango grelhado',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Peito de frango',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Carne bovina magra',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Ovo cozido',
    category: 'Proteínas',
    servingSize: 50,
    servingUnit: 'g',
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Salmão grelhado',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Tilápia grelhada',
    category: 'Proteínas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 128,
    protein: 26,
    carbs: 0,
    fat: 2.7,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  
  // Vegetais
  {
    id: generateId(),
    name: 'Brócolis cozido',
    category: 'Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 35,
    protein: 2.4,
    carbs: 7,
    fat: 0.4,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Alface',
    category: 'Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 15,
    protein: 1.4,
    carbs: 2.9,
    fat: 0.2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Tomate',
    category: 'Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Cenoura',
    category: 'Vegetais',
    servingSize: 100,
    servingUnit: 'g',
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  
  // Frutas
  {
    id: generateId(),
    name: 'Banana',
    category: 'Frutas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Maçã',
    category: 'Frutas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Morango',
    category: 'Frutas',
    servingSize: 100,
    servingUnit: 'g',
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  
  // Laticínios
  {
    id: generateId(),
    name: 'Leite integral',
    category: 'Laticínios',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 122,
    protein: 6.4,
    carbs: 9.2,
    fat: 6.2,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Leite desnatado',
    category: 'Laticínios',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 68,
    protein: 6.8,
    carbs: 9.8,
    fat: 0.4,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Iogurte natural',
    category: 'Laticínios',
    servingSize: 100,
    servingUnit: 'g',
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Queijo mussarela',
    category: 'Laticínios',
    servingSize: 30,
    servingUnit: 'g',
    calories: 85,
    protein: 6.3,
    carbs: 0.6,
    fat: 6.3,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  
  // Bebidas
  {
    id: generateId(),
    name: 'Café sem açúcar',
    category: 'Bebidas',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Suco de laranja natural',
    category: 'Bebidas',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 90,
    protein: 1.4,
    carbs: 21,
    fat: 0.4,
    isCustom: false,
    createdAt: new Date().toISOString()
  }
];

// Função para buscar alimentos
export function searchFoods(query: string): Food[] {
  const lowerQuery = query.toLowerCase();
  return mockFoodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.category.toLowerCase().includes(lowerQuery)
  );
}

// Função para buscar por código de barras
export function searchByBarcode(barcode: string): Food | null {
  return mockFoodDatabase.find(food => food.barcode === barcode) || null;
}
