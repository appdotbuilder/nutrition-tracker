import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for meal types
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Food Items table
export const foodItemsTable = pgTable('food_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'), // Nullable by default
  serving_size: numeric('serving_size', { precision: 10, scale: 2 }).notNull(),
  serving_unit: text('serving_unit').notNull(),
  calories_per_serving: numeric('calories_per_serving', { precision: 10, scale: 2 }).notNull(),
  protein_per_serving: numeric('protein_per_serving', { precision: 10, scale: 2 }).notNull(),
  carbs_per_serving: numeric('carbs_per_serving', { precision: 10, scale: 2 }).notNull(),
  fat_per_serving: numeric('fat_per_serving', { precision: 10, scale: 2 }).notNull(),
  is_custom: boolean('is_custom').notNull().default(true),
  created_by_user_id: integer('created_by_user_id'), // Nullable for pre-populated items
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Food Log Entries table
export const foodLogEntriesTable = pgTable('food_log_entries', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  food_item_id: integer('food_item_id').notNull(),
  serving_amount: numeric('serving_amount', { precision: 10, scale: 2 }).notNull(),
  meal_type: mealTypeEnum('meal_type').notNull(),
  logged_at: timestamp('logged_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Nutrition Goals table
export const nutritionGoalsTable = pgTable('nutrition_goals', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  daily_calories: numeric('daily_calories', { precision: 10, scale: 2 }).notNull(),
  daily_protein: numeric('daily_protein', { precision: 10, scale: 2 }).notNull(),
  daily_carbs: numeric('daily_carbs', { precision: 10, scale: 2 }).notNull(),
  daily_fat: numeric('daily_fat', { precision: 10, scale: 2 }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Meal Plans table
export const mealPlansTable = pgTable('meal_plans', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  name: text('name').notNull(),
  planned_date: date('planned_date').notNull(),
  meal_type: mealTypeEnum('meal_type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Meal Plan Items table
export const mealPlanItemsTable = pgTable('meal_plan_items', {
  id: serial('id').primaryKey(),
  meal_plan_id: integer('meal_plan_id').notNull(),
  food_item_id: integer('food_item_id').notNull(),
  serving_amount: numeric('serving_amount', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  foodItems: many(foodItemsTable),
  foodLogEntries: many(foodLogEntriesTable),
  nutritionGoals: many(nutritionGoalsTable),
  mealPlans: many(mealPlansTable),
}));

export const foodItemsRelations = relations(foodItemsTable, ({ one, many }) => ({
  createdByUser: one(usersTable, {
    fields: [foodItemsTable.created_by_user_id],
    references: [usersTable.id],
  }),
  foodLogEntries: many(foodLogEntriesTable),
  mealPlanItems: many(mealPlanItemsTable),
}));

export const foodLogEntriesRelations = relations(foodLogEntriesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [foodLogEntriesTable.user_id],
    references: [usersTable.id],
  }),
  foodItem: one(foodItemsTable, {
    fields: [foodLogEntriesTable.food_item_id],
    references: [foodItemsTable.id],
  }),
}));

export const nutritionGoalsRelations = relations(nutritionGoalsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [nutritionGoalsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const mealPlansRelations = relations(mealPlansTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [mealPlansTable.user_id],
    references: [usersTable.id],
  }),
  mealPlanItems: many(mealPlanItemsTable),
}));

export const mealPlanItemsRelations = relations(mealPlanItemsTable, ({ one }) => ({
  mealPlan: one(mealPlansTable, {
    fields: [mealPlanItemsTable.meal_plan_id],
    references: [mealPlansTable.id],
  }),
  foodItem: one(foodItemsTable, {
    fields: [mealPlanItemsTable.food_item_id],
    references: [foodItemsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type FoodItem = typeof foodItemsTable.$inferSelect;
export type NewFoodItem = typeof foodItemsTable.$inferInsert;

export type FoodLogEntry = typeof foodLogEntriesTable.$inferSelect;
export type NewFoodLogEntry = typeof foodLogEntriesTable.$inferInsert;

export type NutritionGoals = typeof nutritionGoalsTable.$inferSelect;
export type NewNutritionGoals = typeof nutritionGoalsTable.$inferInsert;

export type MealPlan = typeof mealPlansTable.$inferSelect;
export type NewMealPlan = typeof mealPlansTable.$inferInsert;

export type MealPlanItem = typeof mealPlanItemsTable.$inferSelect;
export type NewMealPlanItem = typeof mealPlanItemsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  foodItems: foodItemsTable,
  foodLogEntries: foodLogEntriesTable,
  nutritionGoals: nutritionGoalsTable,
  mealPlans: mealPlansTable,
  mealPlanItems: mealPlanItemsTable,
};