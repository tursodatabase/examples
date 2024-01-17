import { createContextId } from "@builder.io/qwik";
import type { User, AppState } from "~/utils/types";

export const APP_STATE = createContextId<AppState>('app_state');
export const ITEMS_PER_PAGE = 20;
export const DEFAULT_USER: User = {
  id: 1,
  first_name: "Iku",
  last_name: "Turso",
  email: "turso@iku.mail",
  address: "Salt water swamp",
  created_at: 1682339296,
  avatar: "https://res.cloudinary.com/djx5h4cjt/image/upload/chiselstrike-assets/Turso-Symbol-Blue.jpg"
}