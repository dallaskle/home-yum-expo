// database.types.ts

/**
 * User
 * Stores authentication and basic profile data.
 */
export interface User {
    userId: string; // Primary Key
    username: string;
    email: string;
    passwordHash: string;
    profilePic?: string; // optional
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Video
   * Holds short-form cooking/recipe video details.
   * Videos are attached to scheduled meals and optionally to recipes.
   */
  export interface Video {
    videoId: string; // Primary Key
    userId: string; // Foreign Key to User (uploader)
    videoTitle: string;
    videoDescription: string;
    mealName: string;
    mealDescription: string;
    videoUrl: string; // URL or file path to the video
    thumbnailUrl: string;
    duration: number; // e.g., in seconds
    uploadedAt: Date;
    source: string; // e.g., "native upload", "TikTok link"
    userReaction?: UserVideoReaction | null; // The current user's reaction to this video
    tryListItem?: UserTryList | null; // Whether this video is in the user's try list
  }
  
  /**
   * VideoDetails
   * A subset of Video information used in other contexts
   */
  export interface VideoDetails {
    videoId: string;
    mealName: string;
    mealDescription: string;
    thumbnailUrl: string;
  }
  
  /**
   * Meal
   * Acts as the core scheduling table for cooking sessions.
   * Each meal record represents a planned cooking event.
   */
  export interface Meal {
    mealId: string; // Primary Key
    userId: string; // Foreign Key to User (uploader)
    videoId: string; // Foreign Key to Video
    mealDate: string; // Scheduled date for the meal (ISO date string or custom format)
    mealTime: string; // Scheduled time for the meal (e.g., "18:30")
    completed: boolean; // Indicates if the meal has been prepared/completed
    createdAt: Date;
    updatedAt: Date;
    video?: VideoDetails; // Optional video details included when fetching meals
    rating?: MealRating;
  }
  
  /**
   * Recipe
   * Stores overall recipe details.
   * A recipe can be linked to a video (if using a one-to-one mapping).
   */
  export interface Recipe {
    recipeId: string; // Primary Key
    videoId?: string; // Foreign Key to Video, if applicable
    title?: string;
    summary?: string;
    additionalNotes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * RecipeItem
   * Breaks a recipe into individual, ordered steps (todos).
   */
  export interface RecipeItem {
    recipeItemId: string; // Primary Key
    recipeId: string; // Foreign Key to Recipe
    stepOrder: number; // Determines the sequence of steps
    instruction: string;
    additionalDetails?: string;
  }
  
  /**
   * Ingredient
   * Lists the ingredients required for a recipe with their nutritional information.
   */
  export interface Ingredient {
    ingredientId: string;
    name: string;
    amount: number;
    amountDescription: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    fiber: number;
  }
  
  /**
   * Nutrition
   * Captures structured nutritional information for a recipe.
   */
  export interface Nutrition {
    nutritionId: string; // Primary Key
    videoId: string; // Foreign Key to Video
    calories: number;
    fat: number;         // in grams
    protein: number;     // in grams
    carbs: number;       // in grams
    fiber: number;       // in grams
    ingredients: Ingredient[]; // List of ingredients with their nutrition info
    serving_sizes: string;    // Serving size information
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * ReactionType Enum
   * Defines the types of reactions a user can have.
   */
  export enum ReactionType {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
  }
  
  /**
   * UserVideoReaction
   * Records user reactions (likes/dislikes) on videos.
   */
  export interface UserVideoReaction {
    reactionId: string; // Primary Key
    userId: string; // Foreign Key to User
    videoId: string; // Foreign Key to Video
    reactionType: ReactionType;
    reactionDate: Date;
  }
  
  /**
   * UserTryList
   * Stores items (videos) that a user wants to try later.
   */
  export interface UserTryList {
    tryListId: string; // Primary Key
    userId: string; // Foreign Key to User
    videoId: string; // Foreign Key to Video
    addedDate: Date;
    notes?: string; // Optional comments
  }
  
  /**
   * MealRating
   * Stores user ratings for meals they've tried
   */
  export interface MealRating {
    ratingId: string;
    userId: string;
    videoId: string;
    mealId: string;  // Making this required
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
    video?: Video;
  }
  
  /**
   * ManualRecipeIngredient
   * Represents an ingredient in a manual recipe
   */
  export interface ManualRecipeIngredient {
    name: string;
    amount: number;
    amountDescription: string;
  }
  
  /**
   * ManualRecipeInstruction
   * Represents a step in the recipe instructions
   */
  export interface ManualRecipeInstruction {
    step: number;
    text: string;
  }
  
  /**
   * ManualRecipeData
   * The recipe data returned from the recipe generator
   */
  export interface ManualRecipeData {
    success: boolean;
    title: string;
    description: string;
    servings: string;
    prepTime: string;
    cookTime: string;
    ingredients: ManualRecipeIngredient[];
    instructions: ManualRecipeInstruction[];
    tips: string[];
  }
  
  /**
   * ManualRecipeImage
   * The image data returned from the image generator
   */
  export interface ManualRecipeImage {
    success: boolean;
    url: string;
    prompt: string;
  }
  
  /**
   * ManualRecipeResponse
   * The complete response from the manual recipe generation endpoint
   */
  export interface ManualRecipeResponse {
    logId: string;
    recipe: ManualRecipeData;
    mealImage: ManualRecipeImage;
    status: 'initial_generated' | 'updated' | 'completed';
  }
  
  // Supabase Database Type
  export type Database = {
    public: {
      Tables: {
        videos: {
          Row: Video;
          Insert: Omit<Video, 'videoId'>;
          Update: Partial<Omit<Video, 'videoId'>>;
        };
        users: {
          Row: User;
          Insert: Omit<User, 'userId'>;
          Update: Partial<Omit<User, 'userId'>>;
        };
        meals: {
          Row: Meal;
          Insert: Omit<Meal, 'mealId'>;
          Update: Partial<Omit<Meal, 'mealId'>>;
        };
        recipes: {
          Row: Recipe;
          Insert: Omit<Recipe, 'recipeId'>;
          Update: Partial<Omit<Recipe, 'recipeId'>>;
        };
        recipe_items: {
          Row: RecipeItem;
          Insert: Omit<RecipeItem, 'recipeItemId'>;
          Update: Partial<Omit<RecipeItem, 'recipeItemId'>>;
        };
        ingredients: {
          Row: Ingredient;
          Insert: Omit<Ingredient, 'ingredientId'>;
          Update: Partial<Omit<Ingredient, 'ingredientId'>>;
        };
        nutrition: {
          Row: Nutrition;
          Insert: Omit<Nutrition, 'nutritionId'>;
          Update: Partial<Omit<Nutrition, 'nutritionId'>>;
        };
        user_video_reactions: {
          Row: UserVideoReaction;
          Insert: Omit<UserVideoReaction, 'reactionId'>;
          Update: Partial<Omit<UserVideoReaction, 'reactionId'>>;
        };
        user_try_list: {
          Row: UserTryList;
          Insert: Omit<UserTryList, 'tryListId'>;
          Update: Partial<Omit<UserTryList, 'tryListId'>>;
        };
        meal_ratings: {
          Row: MealRating;
          Insert: Omit<MealRating, 'ratingId'>;
          Update: Partial<Omit<MealRating, 'ratingId'>>;
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        reaction_type: ReactionType;
      };
    };
  };
  