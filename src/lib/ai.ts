import { Food, MealItem } from './types';
import { generateId } from './utils';

// Configuração da Perplexity AI
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Função para chamar Perplexity AI
async function callPerplexityAI(prompt: string, imageUrl?: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    console.warn('Perplexity API Key não configurada. Usando modo simulado.');
    return simulateFoodAnalysis(prompt);
  }

  try {
    const messages: any[] = [
      {
        role: 'system',
        content: 'Você é um especialista em nutrição. Analise alimentos e forneça informações nutricionais precisas em formato JSON com: name, servingSize, servingUnit, calories, protein, carbs, fat, category.'
      },
      {
        role: 'user',
        content: imageUrl 
          ? [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          : prompt
      }
    ];

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages,
        temperature: 0.2,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Perplexity API error:', response.status, errorData);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao chamar Perplexity AI:', error);
    return simulateFoodAnalysis(prompt);
  }
}

// Simulação de análise de alimentos (fallback)
function simulateFoodAnalysis(prompt: string): string {
  const mockData = [
    {
      name: 'Arroz branco',
      servingSize: 150,
      servingUnit: 'g',
      calories: 195,
      protein: 4,
      carbs: 43,
      fat: 0.5,
      category: 'Grãos'
    },
    {
      name: 'Frango grelhado',
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      category: 'Proteínas'
    },
    {
      name: 'Brócolis cozido',
      servingSize: 80,
      servingUnit: 'g',
      calories: 27,
      protein: 2.3,
      carbs: 5.5,
      fat: 0.3,
      category: 'Vegetais'
    }
  ];

  return JSON.stringify(mockData);
}

// Análise de imagem com Perplexity AI
export async function analyzeFoodImage(imageData: string): Promise<MealItem[]> {
  try {
    const prompt = `Analise esta imagem de comida e identifique todos os alimentos visíveis. 
    Para cada alimento, forneça: nome, porção estimada (em gramas ou ml), calorias, proteínas, carboidratos e gorduras.
    Retorne APENAS um array JSON válido com os alimentos detectados.`;

    const response = await callPerplexityAI(prompt, imageData);
    
    // Parse da resposta
    let foodsData;
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      foodsData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch {
      // Se falhar, usar dados simulados
      foodsData = JSON.parse(simulateFoodAnalysis(''));
    }

    // Converter para MealItems
    return foodsData.map((foodData: any) => {
      const food: Food = {
        id: generateId(),
        name: foodData.name,
        category: foodData.category || 'Diversos',
        servingSize: foodData.servingSize || 100,
        servingUnit: foodData.servingUnit || 'g',
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        isCustom: false,
        createdAt: new Date().toISOString()
      };

      return {
        id: generateId(),
        foodId: food.id,
        food,
        quantity: 1,
        unit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
      };
    });
  } catch (error) {
    console.error('Erro na análise de imagem:', error);
    // Fallback para simulação
    await new Promise(resolve => setTimeout(resolve, 1500));
    return simulateFoodAnalysis('').then(data => {
      const foodsData = JSON.parse(data);
      return foodsData.map((foodData: any) => {
        const food: Food = {
          id: generateId(),
          name: foodData.name,
          category: foodData.category,
          servingSize: foodData.servingSize,
          servingUnit: foodData.servingUnit,
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
          isCustom: false,
          createdAt: new Date().toISOString()
        };

        return {
          id: generateId(),
          foodId: food.id,
          food,
          quantity: 1,
          unit: food.servingUnit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat
        };
      });
    });
  }
}

// Análise de texto com Perplexity AI
export async function analyzeFoodText(text: string): Promise<MealItem[]> {
  try {
    const prompt = `Analise esta descrição de refeição: "${text}"
    Identifique todos os alimentos mencionados e suas quantidades.
    Para cada alimento, forneça: nome, porção (em gramas, ml ou unidades), calorias, proteínas, carboidratos e gorduras.
    Retorne APENAS um array JSON válido com os alimentos identificados.`;

    const response = await callPerplexityAI(prompt);
    
    // Parse da resposta
    let foodsData;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      foodsData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch {
      // Fallback para análise simples
      foodsData = [{
        name: text,
        servingSize: 100,
        servingUnit: 'g',
        calories: 250,
        protein: 10,
        carbs: 30,
        fat: 8,
        category: 'Diversos'
      }];
    }

    return foodsData.map((foodData: any) => {
      const food: Food = {
        id: generateId(),
        name: foodData.name,
        category: foodData.category || 'Diversos',
        servingSize: foodData.servingSize || 100,
        servingUnit: foodData.servingUnit || 'g',
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        isCustom: false,
        createdAt: new Date().toISOString()
      };

      return {
        id: generateId(),
        foodId: food.id,
        food,
        quantity: 1,
        unit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
      };
    });
  } catch (error) {
    console.error('Erro na análise de texto:', error);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockFood: Food = {
      id: generateId(),
      name: text,
      category: 'Diversos',
      servingSize: 100,
      servingUnit: 'g',
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 8,
      isCustom: false,
      createdAt: new Date().toISOString()
    };

    return [{
      id: generateId(),
      foodId: mockFood.id,
      food: mockFood,
      quantity: 1,
      unit: mockFood.servingUnit,
      calories: mockFood.calories,
      protein: mockFood.protein,
      carbs: mockFood.carbs,
      fat: mockFood.fat
    }];
  }
}

// Busca por código de barras com Perplexity AI
export async function searchByBarcode(barcode: string): Promise<Food | null> {
  try {
    const prompt = `Busque informações nutricionais do produto com código de barras: ${barcode}
    Forneça: nome do produto, marca, porção padrão, calorias, proteínas, carboidratos e gorduras.
    Retorne APENAS um objeto JSON válido com essas informações.`;

    const response = await callPerplexityAI(prompt);
    
    let foodData;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      foodData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch {
      // Fallback
      foodData = {
        name: 'Produto escaneado',
        brand: 'Marca Exemplo',
        servingSize: 30,
        servingUnit: 'g',
        calories: 150,
        protein: 3,
        carbs: 20,
        fat: 6,
        category: 'Alimentos processados'
      };
    }

    return {
      id: generateId(),
      name: foodData.name,
      brand: foodData.brand,
      category: foodData.category || 'Alimentos processados',
      servingSize: foodData.servingSize || 100,
      servingUnit: foodData.servingUnit || 'g',
      calories: foodData.calories || 0,
      protein: foodData.protein || 0,
      carbs: foodData.carbs || 0,
      fat: foodData.fat || 0,
      barcode,
      isCustom: false,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na busca por código de barras:', error);
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      id: generateId(),
      name: 'Produto escaneado',
      brand: 'Marca Exemplo',
      category: 'Alimentos processados',
      servingSize: 30,
      servingUnit: 'g',
      calories: 150,
      protein: 3,
      carbs: 20,
      fat: 6,
      barcode,
      isCustom: false,
      createdAt: new Date().toISOString()
    };
  }
}

// Busca de alimentos com Perplexity AI
export async function searchFoods(query: string): Promise<Food[]> {
  try {
    const prompt = `Busque informações nutricionais para: "${query}"
    Liste até 5 alimentos relacionados com: nome, marca (se aplicável), porção padrão, calorias, proteínas, carboidratos e gorduras.
    Retorne APENAS um array JSON válido.`;

    const response = await callPerplexityAI(prompt);
    
    let foodsData;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      foodsData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch {
      foodsData = [];
    }

    return foodsData.map((foodData: any) => ({
      id: generateId(),
      name: foodData.name,
      brand: foodData.brand,
      category: foodData.category || 'Diversos',
      servingSize: foodData.servingSize || 100,
      servingUnit: foodData.servingUnit || 'g',
      calories: foodData.calories || 0,
      protein: foodData.protein || 0,
      carbs: foodData.carbs || 0,
      fat: foodData.fat || 0,
      isCustom: false,
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro na busca de alimentos:', error);
    return [];
  }
}

// Gerar sugestões de IA baseadas no histórico
export function generateAISuggestions(
  dailyCalories: number,
  dailyProtein: number,
  dailyCarbs: number,
  dailyFat: number,
  dailyWater: number,
  calorieGoal: number,
  proteinGoal: number,
  waterGoal: number
): string[] {
  const suggestions: string[] = [];

  // Sugestões baseadas em calorias
  if (dailyCalories < calorieGoal * 0.5) {
    suggestions.push('Você está consumindo poucas calorias hoje. Que tal adicionar um lanche saudável?');
  } else if (dailyCalories > calorieGoal * 1.2) {
    suggestions.push('Você ultrapassou sua meta calórica. Tente equilibrar nas próximas refeições.');
  }

  // Sugestões baseadas em proteína
  if (dailyProtein < proteinGoal * 0.6) {
    suggestions.push('Você está perto de bater sua meta de proteína hoje, que tal adicionar uma fonte de proteína no jantar?');
  }

  // Sugestões baseadas em água
  if (dailyWater < waterGoal * 0.5) {
    suggestions.push('Não esqueça de se hidratar! Você ainda não atingiu metade da sua meta de água.');
  }

  // Sugestões gerais
  if (suggestions.length === 0) {
    suggestions.push('Você está indo muito bem! Continue assim para atingir suas metas.');
  }

  return suggestions;
}
