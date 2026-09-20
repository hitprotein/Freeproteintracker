// Internal food list for the tracker's search/add feature. NOT public SEO
// pages — deliberately, per the decision to avoid duplicating
// proteintracker.com.au's food content. Protein-per-100g/100ml figures are
// approximate (brand, cut and preparation all cause real variation) —
// shown to the user as such in the tracker UI.

export interface FoodItem {
  id: string;
  name: string;
  category: "Meat" | "Fish & Seafood" | "Dairy" | "Eggs" | "Plant Protein" | "Protein Products";
  proteinPer100: number; // per 100g, or per 100ml for liquids
  unit: "g" | "ml";
  defaultServingGrams: number;
}

export const FOOD_DATABASE: FoodItem[] = [
  // Meat
  { id: "chicken-breast", name: "Chicken breast, cooked", category: "Meat", proteinPer100: 31, unit: "g", defaultServingGrams: 150 },
  { id: "chicken-thigh", name: "Chicken thigh, cooked", category: "Meat", proteinPer100: 26, unit: "g", defaultServingGrams: 150 },
  { id: "chicken-drumstick", name: "Chicken drumstick, cooked", category: "Meat", proteinPer100: 28, unit: "g", defaultServingGrams: 100 },
  { id: "beef-steak", name: "Beef steak, lean, grilled", category: "Meat", proteinPer100: 31, unit: "g", defaultServingGrams: 200 },
  { id: "beef-mince", name: "Beef mince, lean, cooked", category: "Meat", proteinPer100: 26, unit: "g", defaultServingGrams: 150 },
  { id: "pork-loin", name: "Pork loin, cooked", category: "Meat", proteinPer100: 27, unit: "g", defaultServingGrams: 150 },
  { id: "turkey-breast", name: "Turkey breast, cooked", category: "Meat", proteinPer100: 29, unit: "g", defaultServingGrams: 150 },
  { id: "lamb", name: "Lamb, lean, cooked", category: "Meat", proteinPer100: 25, unit: "g", defaultServingGrams: 150 },
  { id: "bacon", name: "Bacon, cooked", category: "Meat", proteinPer100: 37, unit: "g", defaultServingGrams: 50 },
  { id: "ham", name: "Ham, deli-sliced", category: "Meat", proteinPer100: 21, unit: "g", defaultServingGrams: 50 },
  { id: "beef-jerky", name: "Beef jerky", category: "Meat", proteinPer100: 33, unit: "g", defaultServingGrams: 30 },

  // Fish & Seafood
  { id: "tuna", name: "Tuna, canned in water", category: "Fish & Seafood", proteinPer100: 25, unit: "g", defaultServingGrams: 95 },
  { id: "salmon", name: "Salmon, cooked", category: "Fish & Seafood", proteinPer100: 23, unit: "g", defaultServingGrams: 150 },
  { id: "canned-salmon", name: "Salmon, canned", category: "Fish & Seafood", proteinPer100: 22, unit: "g", defaultServingGrams: 95 },
  { id: "prawns", name: "Prawns, cooked", category: "Fish & Seafood", proteinPer100: 24, unit: "g", defaultServingGrams: 100 },
  { id: "white-fish", name: "White fish (basa/cod), cooked", category: "Fish & Seafood", proteinPer100: 20, unit: "g", defaultServingGrams: 150 },
  { id: "barramundi", name: "Barramundi, cooked", category: "Fish & Seafood", proteinPer100: 21, unit: "g", defaultServingGrams: 150 },

  // Dairy
  { id: "greek-yoghurt", name: "Greek yoghurt, plain", category: "Dairy", proteinPer100: 10, unit: "g", defaultServingGrams: 200 },
  { id: "high-protein-yoghurt", name: "High-protein yoghurt", category: "Dairy", proteinPer100: 10, unit: "g", defaultServingGrams: 160 },
  { id: "cottage-cheese", name: "Cottage cheese", category: "Dairy", proteinPer100: 11, unit: "g", defaultServingGrams: 150 },
  { id: "milk", name: "Milk, regular", category: "Dairy", proteinPer100: 3.4, unit: "ml", defaultServingGrams: 250 },
  { id: "cheddar", name: "Cheddar cheese", category: "Dairy", proteinPer100: 25, unit: "g", defaultServingGrams: 30 },
  { id: "mozzarella", name: "Mozzarella", category: "Dairy", proteinPer100: 22, unit: "g", defaultServingGrams: 30 },
  { id: "parmesan", name: "Parmesan", category: "Dairy", proteinPer100: 38, unit: "g", defaultServingGrams: 20 },
  { id: "ricotta", name: "Ricotta", category: "Dairy", proteinPer100: 11, unit: "g", defaultServingGrams: 100 },

  // Eggs
  { id: "egg", name: "Whole egg", category: "Eggs", proteinPer100: 12.5, unit: "g", defaultServingGrams: 50 },
  { id: "egg-white", name: "Egg white", category: "Eggs", proteinPer100: 11, unit: "g", defaultServingGrams: 33 },

  // Plant Protein
  { id: "tofu-firm", name: "Tofu, firm", category: "Plant Protein", proteinPer100: 8, unit: "g", defaultServingGrams: 150 },
  { id: "tofu-silken", name: "Tofu, silken", category: "Plant Protein", proteinPer100: 5, unit: "g", defaultServingGrams: 150 },
  { id: "tempeh", name: "Tempeh", category: "Plant Protein", proteinPer100: 19, unit: "g", defaultServingGrams: 100 },
  { id: "lentils", name: "Lentils, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200 },
  { id: "chickpeas", name: "Chickpeas, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200 },
  { id: "black-beans", name: "Black beans, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200 },
  { id: "kidney-beans", name: "Kidney beans, cooked", category: "Plant Protein", proteinPer100: 8.7, unit: "g", defaultServingGrams: 200 },
  { id: "edamame", name: "Edamame, cooked", category: "Plant Protein", proteinPer100: 11, unit: "g", defaultServingGrams: 100 },
  { id: "peanut-butter", name: "Peanut butter", category: "Plant Protein", proteinPer100: 25, unit: "g", defaultServingGrams: 30 },
  { id: "almonds", name: "Almonds", category: "Plant Protein", proteinPer100: 21, unit: "g", defaultServingGrams: 30 },
  { id: "peanuts", name: "Peanuts", category: "Plant Protein", proteinPer100: 25, unit: "g", defaultServingGrams: 30 },
  { id: "quinoa", name: "Quinoa, cooked", category: "Plant Protein", proteinPer100: 4.4, unit: "g", defaultServingGrams: 185 },
  { id: "oats", name: "Oats, dry", category: "Plant Protein", proteinPer100: 13, unit: "g", defaultServingGrams: 50 },
  { id: "soy-milk", name: "Soy milk", category: "Plant Protein", proteinPer100: 3.3, unit: "ml", defaultServingGrams: 250 },

  // Protein Products
  { id: "whey-protein", name: "Whey protein powder", category: "Protein Products", proteinPer100: 80, unit: "g", defaultServingGrams: 30 },
  { id: "plant-protein-powder", name: "Plant protein powder", category: "Protein Products", proteinPer100: 75, unit: "g", defaultServingGrams: 30 },
  { id: "protein-bar", name: "Protein bar", category: "Protein Products", proteinPer100: 25, unit: "g", defaultServingGrams: 60 },
];
