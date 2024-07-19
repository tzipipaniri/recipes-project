import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Recipe } from '../../shared/models/recipe';
import { RecipesService } from '../../shared/services/recipes.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../shared/models/user';
import { MultiplyDirective } from '../../shared/directives/multiply.directive';

@Component({
  selector: 'app-recipe',
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
    MultiplyDirective
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent {

  user?: User
  @Input() recipe?: Recipe; // מגדירים את ה-input שמקבל את אובייקט המתכון
  // recipe?:Recipe
  id: String = ''
  formatDate:String=''
  date(d: Date) {
    const date = new Date(d);
    const formattedDate = date.toLocaleDateString("he-IL");
    console.log('response', formattedDate);
    return formattedDate
  }
  constructor(private route: Router, private server: RecipesService) {
    // server.getRecipeById()
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    if (this.recipe?.date)
      this.formatDate = this.date(this.recipe?.date)
  }
  // ngOnInit(){

  //   //this.recipe=this.route.snapshot.params['recipe']
  //   console.log(this.route.snapshot.params['recipe']);
  //   this.id=this.route.snapshot.params['recipe']
  //   this.server.getRecipeById(this.id).subscribe(
  //     data=>{
  //       this.recipe=data
  //     }
  //   )
  // }
  details() {
    this.route.navigate(['details', this.recipe?._id])
  }
}
