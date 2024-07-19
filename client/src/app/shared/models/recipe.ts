import { Category } from "./category";
import { User } from "./user";

export interface Recipe {
    _id: String;
    name: String;
    description: string;
    categories: Category[];
    preparationTimeInMinutes: number;
    difficulty: number;
    date: Date;
    layers: Layer[];
    instructions: String[];
    image: String;
    isPrivate: Boolean;
    user?: String;
}

export interface Layer {
    description: String;
    ingredients: String[];
}
