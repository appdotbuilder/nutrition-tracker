import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Food Item schema
export const foodItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand: z.string().nullable(),
  serving_size: z.number().positive(),
  serving_unit: z.string(),
  calories_per_serving: z.number().nonnegative(),
  protein_per_serving: z.number().nonnegative(),
  carbs_per_serving: z.number().nonnegative(),
  fat_per_serving: z.number().nonnegative(),
  is_custom: z.boolean(),
  created_by_user_id: z.number().nullable(),
  created_at: z.coerce.date()
});

export type FoodItem = z.infer<typeof foodItemSchema>;

export const createFoodItemInputSchema = z.object({
  name: z.string().min(1),
  brand: z.string().nullable(),
  serving_size: z.number().positive(),
  serving_unit: z.string().min(1),
  calories_per_serving: z.number().nonnegative(),
  protein_per_serving: z.number().nonnegative(),
  carbs_per_serving: z.number().nonnegative(),
  fat_per_serving: z.number().nonnegative(),
  is_custom: z.boolean().default(true),
  created_by_user_id: z.number()
});

export type CreateFoodItemInput = z.infer<typeof createFoodItemInputSchema>;

// Food Log Entry schema
export const foodLogEntrySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  food_item_id: z.number(),
  serving_amount: z.number().positive(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  logged_at: z.coerce.date(),
  created_at: z.coerce.date()
});

export type FoodLogEntry = z.infer<typeof foodLogEntrySchema>;

export const createFoodLogEntryInputSchema = z.object({
  user_id: z.number(),
  food_item_id: z.number(),
  serving_amount: z.number().positive(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  logged_at: z.coerce.date().optional() // Defaults to current time if not provided
});

export type CreateFoodLogEntryInput = z.infer<typeof createFoodLogEntryInputSchema>;

// Nutrition Goals schema
export const nutritionGoalsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  daily_calories: z.number().positive(),
  daily_protein: z.number().nonnegative(),
  daily_carbs: z.number().nonnegative(),
  daily_fat: z.number().nonnegative(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type NutritionGoals = z.infer<typeof nutritionGoalsSchema>;

export const createNutritionGoalsInputSchema = z.object({
  user_id: z.number(),
  daily_calories: z.number().positive(),
  daily_protein: z.number().nonnegative(),
  daily_carbs: z.number().nonnegative(),
  daily_fat: z.number().nonnegative()
});

export type CreateNutritionGoalsInput = z.infer<typeof createNutritionGoalsInputSchema>;

export const updateNutritionGoalsInputSchema = z.object({
  id: z.number(),
  daily_calories: z.number().positive().optional(),
  daily_protein: z.number().nonnegative().optional(),
  daily_carbs: z.number().nonnegative().optional(),
  daily_fat: z.number().nonnegative().optional()
});

export type UpdateNutritionGoalsInput = z.infer<typeof updateNutritionGoalsInputSchema>;

// Meal Plan schema
export const mealPlanSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  planned_date: z.coerce.date(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  created_at: z.coerce.date()
});

export type MealPlan = z.infer<typeof mealPlanSchema>;

export const createMealPlanInputSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1),
  planned_date: z.coerce.date(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack'])
});

export type CreateMealPlanInput = z.infer<typeof createMealPlanInputSchema>;

// Meal Plan Item schema
export const mealPlanItemSchema = z.object({
  id: z.number(),
  meal_plan_id: z.number(),
  food_item_id: z.number(),
  serving_amount: z.number().positive(),
  created_at: z.coerce.date()
});

export type MealPlanItem = z.infer<typeof mealPlanItemSchema>;

export const createMealPlanItemInputSchema = z.object({
  meal_plan_id: z.number(),
  food_item_id: z.number(),
  serving_amount: z.number().positive()
});

export type CreateMealPlanItemInput = z.infer<typeof createMealPlanItemInputSchema>;

// Progress Report Input schema
export const progressReportInputSchema = z.object({
  user_id: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date()
});

export type ProgressReportInput = z.infer<typeof progressReportInputSchema>;

// Progress Report Response schema
export const progressReportSchema = z.object({
  period: z.object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date()
  }),
  totals: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  }),
  daily_averages: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  }),
  goals_comparison: z.object({
    calories_percentage: z.number(),
    protein_percentage: z.number(),
    carbs_percentage: z.number(),
    fat_percentage: z.number()
  }).nullable()
});

export type ProgressReport = z.infer<typeof progressReportSchema>;