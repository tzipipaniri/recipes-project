import { Recipe } from "./recipe";

export interface Category {
    
    _id: String;
    description: string;
    recipes?:[Recipe]
}
