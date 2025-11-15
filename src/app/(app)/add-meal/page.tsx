'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { analyzeFoodImage, analyzeFoodText, searchByBarcode, searchFoods } from '@/lib/ai';
import { generateId, formatDate, formatTime } from '@/lib/utils';
import { MealItem, Meal, Food } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Barcode, MessageSquare, Search, ArrowLeft, Loader2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function AddMealPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('photo');
  const [loading, setLoading] = useState(false);
  const [detectedItems, setDetectedItems] = useState<MealItem[]>([]);
  const [textInput, setTextInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? store.getUser() : null;
  
  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return null;
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const items = await analyzeFoodImage(reader.result as string);
        setDetectedItems(items);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Erro ao analisar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    try {
      const items = await analyzeFoodText(textInput);
      setDetectedItems(items);
      setTextInput('');
    } catch (error) {
      alert('Erro ao analisar texto');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanner = async () => {
    setLoading(true);
    try {
      // Simular escaneamento
      const mockBarcode = '7891234567890';
      const food = await searchByBarcode(mockBarcode);
      if (food) {
        setDetectedItems([{
          id: generateId(),
          foodId: food.id,
          food,
          quantity: 1,
          unit: food.servingUnit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat
        }]);
      }
    } catch (error) {
      alert('Erro ao escanear código de barras');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      const results = await searchFoods(searchInput);
      setSearchResults(results);
    } catch (error) {
      alert('Erro ao buscar alimentos');
    } finally {
      setLoading(false);
    }
  };

  const addFoodFromSearch = (food: Food) => {
    const newItem: MealItem = {
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
    setDetectedItems([...detectedItems, newItem]);
    setSearchResults([]);
    setSearchInput('');
  };

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...detectedItems];
    const item = newItems[index];
    const newQuantity = Math.max(0.1, item.quantity + delta);

    item.quantity = newQuantity;
    item.calories = Math.round(item.food.calories * newQuantity);
    item.protein = Math.round(item.food.protein * newQuantity * 10) / 10;
    item.carbs = Math.round(item.food.carbs * newQuantity * 10) / 10;
    item.fat = Math.round(item.food.fat * newQuantity * 10) / 10;

    setDetectedItems(newItems);
  };

  const removeItem = (index: number) => {
    setDetectedItems(detectedItems.filter((_, i) => i !== index));
  };

  const saveMeal = () => {
    if (detectedItems.length === 0) return;

    const totalCalories = detectedItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = detectedItems.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = detectedItems.reduce((sum, item) => sum + item.carbs, 0);
    const totalFat = detectedItems.reduce((sum, item) => sum + item.fat, 0);

    const meal: Meal = {
      id: generateId(),
      userId: user.id,
      date: formatDate(new Date()),
      time: formatTime(new Date()),
      type: 'snack',
      items: detectedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      createdAt: new Date().toISOString()
    };

    store.addMeal(meal);
    router.push('/dashboard');
  };

  const totalCalories = detectedItems.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Adicionar Refeição
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <TabsTrigger value="photo" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Camera className="w-5 h-5 mr-2" />
              Foto
            </TabsTrigger>
            <TabsTrigger value="barcode" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Barcode className="w-5 h-5 mr-2" />
              Código
            </TabsTrigger>
            <TabsTrigger value="text" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <MessageSquare className="w-5 h-5 mr-2" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photo" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Tire uma foto da sua refeição
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nossa IA identificará os alimentos e calculará as calorias automaticamente
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl h-12 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Tirar Foto
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="barcode" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                <Barcode className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Escaneie o código de barras
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aponte a câmera para o código de barras do produto
              </p>
              <Button
                onClick={handleBarcodeScanner}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl h-12 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Escaneando...
                  </>
                ) : (
                  <>
                    <Barcode className="w-5 h-5 mr-2" />
                    Escanear
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Descreva sua refeição
              </h3>
              <Input
                placeholder="Ex: 2 fatias de pão integral com queijo branco e café sem açúcar"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextAnalysis()}
                className="h-12 rounded-xl"
              />
              <Button
                onClick={handleTextAnalysis}
                disabled={loading || !textInput.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Analisar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Buscar alimento
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome do alimento..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 rounded-xl flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading || !searchInput.trim()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl h-12 px-6"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((food) => (
                    <div
                      key={food.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => addFoodFromSearch(food)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {food.name}
                          </h4>
                          {food.brand && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {food.brand}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {food.servingSize}{food.servingUnit} • {food.calories} kcal
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && searchResults.length === 0 && searchInput && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                  Nenhum resultado encontrado. Tente outra busca.
                </p>
              )}
              
              {!searchInput && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Busque em mais de 1 milhão de alimentos
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detected Items */}
        {detectedItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Alimentos detectados
            </h3>
            
            {detectedItems.map((item, index) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.food.name}
                    </h4>
                    {item.food.brand && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.food.brand}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, -0.5)}
                    className="rounded-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, 0.5)}
                    className="rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Calorias</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Proteína</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gordura</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.fat}g</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Total
                </span>
                <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {totalCalories} kcal
                </span>
              </div>
            </div>

            <Button
              onClick={saveMeal}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl h-12 text-lg font-semibold"
            >
              Salvar Refeição
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
