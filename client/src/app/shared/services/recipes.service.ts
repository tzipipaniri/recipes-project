import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Recipe } from '../models/recipe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
   private http = inject(HttpClient);
  private usersURL = `${environment.apiURL}/recipes`;
  private _recipes: Recipe[] = [];
  getRecipes(search?:String,page?:Number,perPage?:Number){
    let url=this.usersURL
    if(search)
      url+=`${this.usersURL}?search=${search}`
    if(page)
      url+=`?page=${page}`
    if(perPage)
      url+=`?perPage${perPage}`
    return this.http.get<Recipe[]>(url);
  }
  getRecipeById(id:String){
    return this.http.get<Recipe>(`${this.usersURL}/${id}`);
  }
  getRecipesByUserId(id:String){
    return this.http.get<Recipe[]>(`${this.usersURL}/userId/${id}`);
  }
  getRecipesByPreparationTime(minutes:Number){
    return this.http.get<Recipe[]>(`${this.usersURL}/time/${minutes}`);
  }
 
  // addRecipe(r:Recipe,headers:HttpHeaders){
  //   const options = {
  //     headers,
  //     observe: 'events'
  //   };
  //   const {name,
  //     desription,
  //     categories,
  //     preparationTimeInMinutes,
  //     difficulty,
  //     date,
  //     layers,
  //     instructions,
  //     image,
  //     isPrivate}=r
  //   return this.http.post<Recipe>(`http://localhost:5000/recipes`,{name,
  //   desription,
  //   categories,
  //   preparationTimeInMinutes,
  //   difficulty,
  //   date,
  //   layers,
  //   instructions,
  //   image,
  //   isPrivate},{headers});
  // }
  addRecipe(formData: FormData, headers: HttpHeaders) {
    return this.http.post<Recipe>(`${this.usersURL}`, formData, { headers });
  }
  
  updateRecipe(formData: FormData) {
    const recipeId = formData.get('_id') as string;
    return this.http.put<Recipe>(`${this.usersURL}/${recipeId}`, formData);
  }  
  
  deleteRecipe(id:String){
    return this.http.delete<Recipe>(`${this.usersURL}/${id}`);
  }
}
