import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { User } from '../../shared/models/user';
import { RecipeComponent } from '../../components/recipe/recipe.component';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [
    NavbarComponent,
    RecipeComponent
  ],
  templateUrl: './my-recipes.component.html',
  styleUrl: './my-recipes.component.scss'
})
export class MyRecipesComponent {
  recipes: Recipe[] = []
  user?: User
  /**
   *
   */
  constructor(private recipeService: RecipesService) {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle the error gracefully, like setting user to null
        // this.user = null;
      }
    }
    if (this.user?._id)
      recipeService.getRecipesByUserId(this.user?._id).subscribe(
        data => {
          this.recipes = data
        }
      )
  }
}
