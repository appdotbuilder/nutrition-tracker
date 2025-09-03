import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Schema imports
import { 
  createUserInputSchema,
  createFoodItemInputSchema,
  createFoodLogEntryInputSchema,
  createNutritionGoalsInputSchema,
  updateNutritionGoalsInputSchema,
  createMealPlanInputSchema,
  createMealPlanItemInputSchema,
  progressReportInputSchema
} from './schema';

// Handler imports
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { createFoodItem } from './handlers/create_food_item';
import { getFoodItems, getFoodItemsByUser } from './handlers/get_food_items';
import { createFoodLogEntry } from './handlers/create_food_log_entry';
import { getFoodLogEntriesByUser, getFoodLogEntriesByUserAndDate } from './handlers/get_food_log_entries';
import { createNutritionGoals } from './handlers/create_nutrition_goals';
import { getActiveNutritionGoalsByUser } from './handlers/get_nutrition_goals';
import { updateNutritionGoals } from './handlers/update_nutrition_goals';
import { createMealPlan } from './handlers/create_meal_plan';
import { getMealPlansByUser, getMealPlansByUserAndDate } from './handlers/get_meal_plans';
import { createMealPlanItem } from './handlers/create_meal_plan_item';
import { getMealPlanItemsByPlan } from './handlers/get_meal_plan_items';
import { getProgressReport } from './handlers/get_progress_report';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),

  // Food items management
  createFoodItem: publicProcedure
    .input(createFoodItemInputSchema)
    .mutation(({ input }) => createFoodItem(input)),
  
  getFoodItems: publicProcedure
    .query(() => getFoodItems()),
  
  getFoodItemsByUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getFoodItemsByUser(input.userId)),

  // Food logging
  createFoodLogEntry: publicProcedure
    .input(createFoodLogEntryInputSchema)
    .mutation(({ input }) => createFoodLogEntry(input)),
  
  getFoodLogEntriesByUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getFoodLogEntriesByUser(input.userId)),
  
  getFoodLogEntriesByUserAndDate: publicProcedure
    .input(z.object({ 
      userId: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date()
    }))
    .query(({ input }) => getFoodLogEntriesByUserAndDate(input.userId, input.startDate, input.endDate)),

  // Nutrition goals
  createNutritionGoals: publicProcedure
    .input(createNutritionGoalsInputSchema)
    .mutation(({ input }) => createNutritionGoals(input)),
  
  getActiveNutritionGoalsByUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getActiveNutritionGoalsByUser(input.userId)),
  
  updateNutritionGoals: publicProcedure
    .input(updateNutritionGoalsInputSchema)
    .mutation(({ input }) => updateNutritionGoals(input)),

  // Meal planning
  createMealPlan: publicProcedure
    .input(createMealPlanInputSchema)
    .mutation(({ input }) => createMealPlan(input)),
  
  getMealPlansByUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getMealPlansByUser(input.userId)),
  
  getMealPlansByUserAndDate: publicProcedure
    .input(z.object({ 
      userId: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date()
    }))
    .query(({ input }) => getMealPlansByUserAndDate(input.userId, input.startDate, input.endDate)),
  
  createMealPlanItem: publicProcedure
    .input(createMealPlanItemInputSchema)
    .mutation(({ input }) => createMealPlanItem(input)),
  
  getMealPlanItemsByPlan: publicProcedure
    .input(z.object({ mealPlanId: z.number() }))
    .query(({ input }) => getMealPlanItemsByPlan(input.mealPlanId)),

  // Progress reports
  getProgressReport: publicProcedure
    .input(progressReportInputSchema)
    .query(({ input }) => getProgressReport(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC Nutrition Tracker server listening at port: ${port}`);
}

start();