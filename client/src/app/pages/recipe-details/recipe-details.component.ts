import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../shared/services/recipes.service';
import { Recipe } from '../../shared/models/recipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
// import { MatIcon } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { IgxPreventDocumentScrollModule } from '@infragistics/igx-layouts';
// import { IgxGridModule } from '@infragistics/igx-grid';
// import { IgxToastModule } from '@infragistics/igx-toast';
// import { IgcFormsModule } from '@infragistics/igx-forms';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { User } from '../../shared/models/user';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TimePipe } from "../../shared/pipes/time.pipe";
import { StarComponent } from '../../components/star/star.component';
import { MultiplyDirective } from '../../shared/directives/multiply.directive';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecipeDialogComponent } from '../../components/delete-recipe-dialog/delete-recipe-dialog.component';
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatGridTile } from '@angular/material/grid-list';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
  imports: [
    // MatCard,
    // MatCardHeader,
    // MatCardTitle,
    // MatCardSubtitle,
    // MatCardContent,
    CommonModule,
    MatIconModule,
    // MatIcon,
    FormsModule,
    MatTooltipModule,
    // MatError,
    // MatIconButton,
    MatButtonModule,
    // MatIconButton,
    // MatTooltip,
    MatListModule,
    NavbarComponent,
    MatCardModule,
    CommonModule,
    TimePipe,
    StarComponent,
    MultiplyDirective,
    MatGridTile,
    MatIconModule,
  ]
})
export class RecipeDetailsComponent {

  @Input('rating') public rating: number = 3;
  @Input('starCount') public starCount: number = 5;
  @Input('color') public color: string = 'accent';
  @Output() private ratingUpdated = new EventEmitter();

  private snackBarDuration: number = 2000;
  public ratingArr: number[] = [];
  recipe?: Recipe
  user?: User
  layers: Layer[] = []
  isOwnRecipe: boolean = false
  useFontAwesome = true; // Or set it to false for Material Design icons
  formattedDate?:String
  constructor(private route: ActivatedRoute, private recipeService: RecipesService, private snackBar: MatSnackBar, private router: Router,
    private dialog: MatDialog
  ) {

  }
  deleteRecipe(): void {
    const dialogRef = this.dialog.open(DeleteRecipeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.recipe?._id) {
        this.recipeService.deleteRecipe(this.recipe._id).subscribe(() => {
          console.log('Recipe deleted');
          const confirmationDialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
          confirmationDialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/allRecipes']);
          });
        });
      }
    });
  }

  ngOnInit() {
    this.recipeService.getRecipeById(this.route.snapshot.params['id']).subscribe(
      data => {
        this.recipe = data
        console.log('recipe', data);
        const date = new Date(this.recipe.date);
        this.formattedDate = date.toLocaleDateString("he-IL");
        console.log('formattedDate', this.formattedDate);
        this.layers = this.recipe.layers as Layer[];
        const storedUser = localStorage.getItem('user');

        if (storedUser !== null) {
          this.user = JSON.parse(storedUser); // Type assertion (careful usage)
        }
        this.isOwnRecipe = this.user?._id == this.recipe?.user
        console.log('user', this.user);
        console.log(' this.recipe?.user', this.recipe?.user);

        console.log('this.user?._id == this.recipe?.user', this.user?._id == this.recipe?.user);

      }
    )

    console.log("a " + this.starCount)
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }

  }
  onClick(rating: number) {
    console.log(rating)
    this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration
    });
    this.ratingUpdated.emit(rating);
    return false;
  }
  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  
  getArray(): number[] {
    return new Array(this.recipe?.difficulty);
  }
  getOpositeArray(): number[] {
    return new Array(5 - (this.recipe?.difficulty ?? 0));
  }
  delete() {
    if (this.recipe?._id)
      this.recipeService.deleteRecipe(this.recipe?._id).subscribe(
        data => {
          console.log('delete', data);

        }
      )
  }
  edit() {
    const id = this.recipe?._id
    if (id)
      this.router.navigate(['recipeForm', id])
  }

}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}

interface Layer {
  description: string; // Other properties as needed
  ingredients: String[]
}
