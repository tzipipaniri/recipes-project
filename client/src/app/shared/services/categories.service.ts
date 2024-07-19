import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private _categories: Category[] = [];
  private http = inject(HttpClient);
  private usersURL = `${environment.apiURL}/categories`;
  // constructor(private http:HttpClient) { }

  getCategories(){
    return this.http.get<Category[]>(`${this.usersURL}`);
  }
  get categoriesWithrecipes(){
    return this.http.get<Category[]>(`${this.usersURL}/categories/withRecipes`);
  }
  getCategoryById(id:String){
    return this.http.get<Category>(`${this.usersURL}/${id}`);
  }
  
}
