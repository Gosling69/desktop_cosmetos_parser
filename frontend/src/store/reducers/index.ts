
import { sitesReducer } from "./sitesReducer";

export const rootReducer = sitesReducer
export type RootState = ReturnType<typeof rootReducer>