// Internal food list for the tracker's search/add feature. NOT public SEO
// pages — deliberately, per the decision to avoid duplicating
// proteintracker.com.au's food content. Protein-per-100g/100ml figures are
// approximate (brand, cut and preparation all cause real variation) —
// shown to the user as such in the tracker UI.
//
// Names use US English (the site's main audience); `aliases` keeps other
// common names searchable ("prawns", "mince", "yoghurt").

export interface HouseholdServing {
  label: string; // one serving, as a user would say it: "1 large egg", "½ cup"
  amount: number; // grams, or ml for liquids
}

export interface FoodItem {
  id: string;
  name: string;
  category: "Meat" | "Fish & Seafood" | "Dairy" | "Eggs" | "Plant Protein" | "Protein Products";
  proteinPer100: number; // per 100g, or per 100ml for liquids
  unit: "g" | "ml";
  defaultServingGrams: number;
  aliases?: string[];
  // Household measures offered before weight, first one is the default.
  servings?: HouseholdServing[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // Meat
  { id: "chicken-breast", name: "Chicken breast, cooked", category: "Meat", proteinPer100: 31, unit: "g", defaultServingGrams: 150 },
  { id: "chicken-thigh", name: "Chicken thigh, cooked", category: "Meat", proteinPer100: 26, unit: "g", defaultServingGrams: 150,
    servings: [{ label: "1 thigh (meat only)", amount: 52 }] },
  { id: "chicken-drumstick", name: "Chicken drumstick, cooked", category: "Meat", proteinPer100: 28, unit: "g", defaultServingGrams: 100,
    servings: [{ label: "1 drumstick (meat only)", amount: 44 }] },
  { id: "beef-steak", name: "Beef steak, lean, grilled", category: "Meat", proteinPer100: 31, unit: "g", defaultServingGrams: 200 },
  { id: "beef-mince", name: "Ground beef, lean, cooked", category: "Meat", proteinPer100: 26, unit: "g", defaultServingGrams: 150,
    aliases: ["beef mince", "hamburger", "burger patty"],
    servings: [{ label: "1 patty (4 oz raw)", amount: 85 }] },
  { id: "ground-turkey", name: "Ground turkey, cooked", category: "Meat", proteinPer100: 27, unit: "g", defaultServingGrams: 113,
    aliases: ["turkey mince"] },
  { id: "pork-loin", name: "Pork loin, cooked", category: "Meat", proteinPer100: 27, unit: "g", defaultServingGrams: 150 },
  { id: "turkey-breast", name: "Turkey breast, cooked", category: "Meat", proteinPer100: 29, unit: "g", defaultServingGrams: 150 },
  { id: "lamb", name: "Lamb, lean, cooked", category: "Meat", proteinPer100: 25, unit: "g", defaultServingGrams: 150 },
  { id: "bacon", name: "Bacon, cooked", category: "Meat", proteinPer100: 37, unit: "g", defaultServingGrams: 50,
    servings: [{ label: "1 slice", amount: 8 }] },
  { id: "ham", name: "Ham, deli-sliced", category: "Meat", proteinPer100: 21, unit: "g", defaultServingGrams: 50,
    aliases: ["lunch meat", "cold cuts"] },
  { id: "beef-jerky", name: "Beef jerky", category: "Meat", proteinPer100: 33, unit: "g", defaultServingGrams: 30 },

  // Fish & Seafood
  { id: "tuna", name: "Tuna, canned in water", category: "Fish & Seafood", proteinPer100: 25, unit: "g", defaultServingGrams: 95,
    servings: [{ label: "1 can (5 oz), drained", amount: 113 }] },
  { id: "salmon", name: "Salmon, cooked", category: "Fish & Seafood", proteinPer100: 23, unit: "g", defaultServingGrams: 150,
    servings: [{ label: "1 fillet", amount: 154 }] },
  { id: "canned-salmon", name: "Salmon, canned", category: "Fish & Seafood", proteinPer100: 22, unit: "g", defaultServingGrams: 95 },
  { id: "prawns", name: "Shrimp, cooked", category: "Fish & Seafood", proteinPer100: 24, unit: "g", defaultServingGrams: 100,
    aliases: ["prawns"] },
  { id: "white-fish", name: "White fish (cod/basa), cooked", category: "Fish & Seafood", proteinPer100: 20, unit: "g", defaultServingGrams: 150,
    aliases: ["pollock", "haddock"] },
  { id: "tilapia", name: "Tilapia, cooked", category: "Fish & Seafood", proteinPer100: 26, unit: "g", defaultServingGrams: 113 },
  { id: "barramundi", name: "Barramundi, cooked", category: "Fish & Seafood", proteinPer100: 21, unit: "g", defaultServingGrams: 150 },

  // Dairy
  { id: "greek-yoghurt", name: "Greek yogurt, plain", category: "Dairy", proteinPer100: 10, unit: "g", defaultServingGrams: 200,
    aliases: ["yoghurt"],
    servings: [
      { label: "1 container (5.3 oz)", amount: 150 },
      { label: "1 cup", amount: 245 },
    ] },
  { id: "high-protein-yoghurt", name: "High-protein yogurt", category: "Dairy", proteinPer100: 10, unit: "g", defaultServingGrams: 160,
    aliases: ["yoghurt", "skyr", "icelandic"],
    servings: [{ label: "1 container (5.3 oz)", amount: 150 }] },
  { id: "cottage-cheese", name: "Cottage cheese", category: "Dairy", proteinPer100: 11, unit: "g", defaultServingGrams: 150,
    servings: [
      { label: "½ cup", amount: 113 },
      { label: "1 cup", amount: 226 },
    ] },
  { id: "milk", name: "Milk, regular", category: "Dairy", proteinPer100: 3.4, unit: "ml", defaultServingGrams: 250,
    servings: [{ label: "1 cup", amount: 237 }] },
  { id: "cheddar", name: "Cheddar cheese", category: "Dairy", proteinPer100: 25, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "1 slice", amount: 21 }] },
  { id: "mozzarella", name: "Mozzarella", category: "Dairy", proteinPer100: 22, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "1 string cheese", amount: 28 }] },
  { id: "parmesan", name: "Parmesan", category: "Dairy", proteinPer100: 38, unit: "g", defaultServingGrams: 20,
    servings: [{ label: "1 tbsp, grated", amount: 5 }] },
  { id: "ricotta", name: "Ricotta", category: "Dairy", proteinPer100: 11, unit: "g", defaultServingGrams: 100,
    servings: [{ label: "½ cup", amount: 124 }] },

  // Eggs
  { id: "egg", name: "Whole egg", category: "Eggs", proteinPer100: 12.5, unit: "g", defaultServingGrams: 50,
    servings: [{ label: "1 large egg", amount: 50 }] },
  { id: "egg-white", name: "Egg white", category: "Eggs", proteinPer100: 11, unit: "g", defaultServingGrams: 33,
    servings: [
      { label: "1 large egg white", amount: 33 },
      { label: "¼ cup liquid egg whites", amount: 61 },
    ] },

  // Plant Protein
  { id: "tofu-firm", name: "Tofu, firm", category: "Plant Protein", proteinPer100: 8, unit: "g", defaultServingGrams: 150,
    servings: [{ label: "½ cup", amount: 126 }] },
  { id: "tofu-silken", name: "Tofu, silken", category: "Plant Protein", proteinPer100: 5, unit: "g", defaultServingGrams: 150 },
  { id: "tempeh", name: "Tempeh", category: "Plant Protein", proteinPer100: 19, unit: "g", defaultServingGrams: 100,
    servings: [{ label: "1 cup", amount: 166 }] },
  { id: "lentils", name: "Lentils, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200,
    servings: [{ label: "1 cup", amount: 198 }] },
  { id: "chickpeas", name: "Chickpeas, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200,
    aliases: ["garbanzo"],
    servings: [{ label: "1 cup", amount: 164 }] },
  { id: "black-beans", name: "Black beans, cooked", category: "Plant Protein", proteinPer100: 9, unit: "g", defaultServingGrams: 200,
    servings: [{ label: "1 cup", amount: 172 }] },
  { id: "kidney-beans", name: "Kidney beans, cooked", category: "Plant Protein", proteinPer100: 8.7, unit: "g", defaultServingGrams: 200,
    servings: [{ label: "1 cup", amount: 177 }] },
  { id: "edamame", name: "Edamame, cooked", category: "Plant Protein", proteinPer100: 11, unit: "g", defaultServingGrams: 100,
    servings: [{ label: "1 cup, shelled", amount: 155 }] },
  { id: "peanut-butter", name: "Peanut butter", category: "Plant Protein", proteinPer100: 25, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "2 tbsp", amount: 32 }] },
  { id: "almonds", name: "Almonds", category: "Plant Protein", proteinPer100: 21, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "1 handful (23 almonds)", amount: 28 }] },
  { id: "peanuts", name: "Peanuts", category: "Plant Protein", proteinPer100: 25, unit: "g", defaultServingGrams: 30 },
  { id: "quinoa", name: "Quinoa, cooked", category: "Plant Protein", proteinPer100: 4.4, unit: "g", defaultServingGrams: 185,
    servings: [{ label: "1 cup", amount: 185 }] },
  { id: "oats", name: "Oats, dry", category: "Plant Protein", proteinPer100: 13, unit: "g", defaultServingGrams: 50,
    aliases: ["oatmeal", "porridge"],
    servings: [{ label: "½ cup", amount: 40 }] },
  { id: "soy-milk", name: "Soy milk", category: "Plant Protein", proteinPer100: 3.3, unit: "ml", defaultServingGrams: 250,
    servings: [{ label: "1 cup", amount: 237 }] },

  // Protein Products
  { id: "whey-protein", name: "Whey protein powder", category: "Protein Products", proteinPer100: 80, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "1 scoop", amount: 30 }] },
  { id: "plant-protein-powder", name: "Plant protein powder", category: "Protein Products", proteinPer100: 75, unit: "g", defaultServingGrams: 30,
    servings: [{ label: "1 scoop", amount: 30 }] },
  { id: "protein-shake-rtd", name: "Protein shake, ready-to-drink", category: "Protein Products", proteinPer100: 9.2, unit: "ml", defaultServingGrams: 325,
    servings: [{ label: "1 bottle (11 fl oz)", amount: 325 }] },
  { id: "protein-bar", name: "Protein bar", category: "Protein Products", proteinPer100: 25, unit: "g", defaultServingGrams: 60,
    servings: [{ label: "1 bar", amount: 60 }] },
];
