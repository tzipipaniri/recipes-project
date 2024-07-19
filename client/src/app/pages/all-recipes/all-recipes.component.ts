import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Recipe } from '../../shared/models/recipe';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../../shared/services/recipes.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../shared/models/category';
import { CategoriesService } from '../../shared/services/categories.service';
import { RecipeComponent } from '../../components/recipe/recipe.component';
import { BehaviorSubject } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    RecipeComponent,
    MatDividerModule,
    MatIconModule,
    NavbarComponent
  ],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.scss'
})
export class AllRecipesComponent {

  filterByName(name: string) {
    console.log('name', name);
    this.server.getRecipes(name).subscribe(
      data => {
        console.log('data', data);
        this.recipes = data
      }
    )
  }
  selectCategory($event: Event) {
    if (event) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedId = selectElement.value;
      // this.selectCategory(selectedDescription);
      this.categoryDesc = selectedId
      console.log('categoryDesc', this.categoryDesc);

    }

  }
  categoryDesc: String = ''
  // recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);
  recipes: Recipe[] = []
  categories: Category[] = []
  page: number = 1
  constructor(private http: HttpClient, private server: RecipesService, private router: Router, private serverCategory: CategoriesService) {
    server.getRecipes().subscribe(
      data => {
        console.log('recipes', data);
        this.recipes = data
      }
    )
    serverCategory.getCategories().subscribe(
      data => {
        console.log('categories', data);
        this.categories = data
      }
    )
  }

  disableSelect = new FormControl(false);

  findObjectInArray(arr: Recipe[], obj: Recipe) {
    for (let i = 0; i < arr.length; i++) {
      // if(arr[i].name)      
    }
  }

  // search(name: String,preparationTimeInMinutes:number) {
  //   console.log('name',name=='');
  //   console.log('preparationTimeInMinutes',preparationTimeInMinutes);
  //   console.log('category',this.categoryDesc=='');
  //   let recipesByName;
  //   // let recipesByCategory: { recipes: Recipe[] }[] = [ /* רשימת הקטגוריות כאן */ ];

  //     this.server.getRecipes(name).subscribe(
  //     data=>{
  //       // recipesByName=data
  //       this.recipes=data
  //       console.log('name =""',data);

  //     }
  //   )
  //   if(this.categoryDesc!=''){

  //     this.serverCategory.getCategoryById(this.categoryDesc).subscribe(
  //       data=>{
  //         let recipesByCategory=data.recipes
  //          this.recipes = this.recipes.filter(recipe => 
  //           recipesByCategory.some(categoryRecipe => categoryRecipe._id === recipe._id)
  //         );

  //       }
  //     )
  //   }
  //   if(preparationTimeInMinutes>0)
  //   this.server.getRecipesByPreparationTime(preparationTimeInMinutes).subscribe(
  //     data=>{
  //       let recipesByTime=data
  //       console.log('recipesByTime',recipesByTime);

  //       this.recipes = this.recipes.filter(recipe => 
  //         recipesByTime.some(categoryRecipe => categoryRecipe._id === recipe._id)
  //       );
  //       console.log('recipes by time after',this.recipes);

  //     }
  //   )
  // }

  search(name: string, preparationTimeInMinutes: number) {
    console.log('name', name);
    console.log('preparationTimeInMinutes', preparationTimeInMinutes);
    console.log('category', this.categoryDesc);

    //   const recipes$ = this.server.getRecipes(name);
    //   const category$ = this.categoryDesc !== '' ? this.serverCategory.getCategoryById(this.categoryDesc) : of({ recipes: [] });
    //   const preparationTime$ = preparationTimeInMinutes > 0 ? this.server.getRecipesByPreparationTime(preparationTimeInMinutes) : of([]);

    //   forkJoin([recipes$, category$, preparationTime$]).pipe(
    //     map(([recipes, categoryData, recipesByTime]) => {
    //       let filteredRecipes = recipes;

    //       if (this.categoryDesc !== '') {
    //         const recipesByCategory = categoryData.recipes;
    //         filteredRecipes = filteredRecipes.filter(recipe =>
    //           recipesByCategory?.some(categoryRecipe => categoryRecipe._id === recipe._id)
    //         );
    //       }
    //       if (preparationTimeInMinutes > 0) {
    //         filteredRecipes = filteredRecipes.filter(recipe =>
    //           recipesByTime.some(timeRecipe => timeRecipe._id === recipe._id)
    //         );
    //       }
    //       return filteredRecipes;
    //     })
    //   ).subscribe(filteredRecipes => {
    //     this.recipes = filteredRecipes;
    //     console.log('Filtered recipes:', this.recipes);
    //   });
    this.server.getRecipes(name).subscribe(
      data => {
        console.log('desc', this.categoryDesc);

        this.recipes = data
        if (this.categoryDesc != '')
          this.recipes = this.recipes.filter(recipe => {
            return recipe.categories.some(cat => cat.description?.toString() === this.categoryDesc);
          });
        if (preparationTimeInMinutes > 0)
          this.searchByTime(preparationTimeInMinutes)
        console.log('recipes', this.recipes);

      }
    )
  }

  searchByTime(time: number) {
    this.server.getRecipesByPreparationTime(time).subscribe(
      data => {
        // const recipesByTime = data as Recipe[]; // נניח שהנתונים מהשרת הם מערך של מתכונים
        this.recipes = this.recipes.filter(recipe => {
          return data.some(recipeFromData => recipeFromData._id === recipe._id);
        });
      }
    );
  }
  
  display(id: String) {
    console.log('id', id);
    this.router.navigate(['recipe', id])
  }

  next() {
    this.page++
    this.server.getRecipes('', this.page).subscribe(
      data => {
        console.log('recipes', data);
        this.recipes = data
      }
    )
  }
}
