import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================

type EntryType = "recipe" | "ingredient";
interface CookbookEntry {
  name: string;
  type: EntryType;
}

interface RequiredItem {
  name: string;
  quantity: number;
}

interface Recipe extends CookbookEntry {
  requiredItems: RequiredItem[];
}

interface Ingredient extends CookbookEntry {
  cookTime: number;
}

interface RecipeSummary {
  name: string;
  cookTime: number;
  /**
   * A required item, where the item is guaranteed to be a base ingredient (i.e does not require a recipe).
   */
  ingredients: RequiredItem[];
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: { [name: string]: Recipe | Ingredient } = {};

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.replace(/[-_]/g, " ").replace(/[^a-zA-Z ]/g, "");
  recipeName = recipeName
    .split(" ")
    .filter(word => word !== "")
    .map(word => word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(" ");
  return recipeName || null;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook

function isCookbookEntry(data: unknown): data is CookbookEntry {
  if (typeof data !== "object" || data === null) return false;
  const entry = data as Record<string, unknown>;
  return (!!entry.name && (entry.type === "recipe" || entry.type === "ingredient"));
}

function isRecipe(data: unknown): data is Recipe {
  if (isCookbookEntry(data) && "requiredItems" in data && Array.isArray(data.requiredItems)) {
    const names = [];
    for (const item of data.requiredItems) {
      if ( typeof item.name === "string" && names.indexOf(item.name) === -1 
        && typeof item.quantity === "number" && item.quantity >= 0
      ) {
        names.push(item.name);
      }
      else {
        return false;
      }
    }
    return true;
  }
  return false;
}

function isIngredient(data: unknown): data is Ingredient {
  return isCookbookEntry(data) && "cookTime" in data && typeof data.cookTime === "number" && data.cookTime >= 0;
}

app.post("/entry", (req: Request, res: Response) => {
  const data = req.body;
  if ((isRecipe(data) || isIngredient(data)) && !cookbook[data.name]) {
    cookbook[data.name] = data;
    res.status(200).send("Success");
    return;
  }
  res.status(400).send();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name\

class RecipeSummaryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function addRequiredItem(ingredient: RequiredItem, list: RequiredItem[]) {
  const entry = list.find(item => item.name === ingredient.name);
  if (entry) {
    entry.quantity += ingredient.quantity;
  }
  else {
    list.push({ name: ingredient.name, quantity: ingredient.quantity });
  }
}

function getRecipeSummary(recipe: Recipe): RecipeSummary {
  let cookTime = 0;
  const ingredients: RequiredItem[] = [];
  recipe.requiredItems.forEach(recipeItem => {
    if (!cookbook[recipeItem.name]) {
      throw new RecipeSummaryError("Could not find cookbook entry in cookbook.");
    }
    else if (cookbook[recipeItem.name].type === "ingredient") {
      addRequiredItem(recipeItem, ingredients);
      cookTime += (cookbook[recipeItem.name] as Ingredient).cookTime * recipeItem.quantity;
    }
    else {
      const subRecipe = cookbook[recipeItem.name] as Recipe;
      const summary = getRecipeSummary(subRecipe);
      summary.ingredients.forEach(ingredient => {
        for (let i = 0; i < recipeItem.quantity; i++) {
          addRequiredItem(ingredient, ingredients);
        }
      });
      cookTime += recipeItem.quantity * summary.cookTime;
    }
  });
  return { name: recipe.name, cookTime, ingredients };
}

app.get("/summary", (req: Request, res: Response) => {
  if (typeof req.query.name === "string" && cookbook[req.query.name]?.type === "recipe") {
    try {
      const summary = getRecipeSummary(cookbook[req.query.name] as Recipe);
      res.status(200).send(summary);
    }
    catch (e) {
      if (e instanceof RecipeSummaryError) {
        res.status(400).send(e.message);
      }
      else {
        throw e;
      }
    }
  }
  else {
    res.status(400).send("Not a recipe.");
  }
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
