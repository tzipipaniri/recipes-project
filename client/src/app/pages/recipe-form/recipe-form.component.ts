import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Layer, Recipe } from '../../shared/models/recipe';
import { UsersService } from '../../shared/services/users.service';
import { RecipesService } from '../../shared/services/recipes.service';
import { HttpHeaders } from '@angular/common/http';
import { Category } from '../../shared/models/category';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService } from '../../shared/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { OverlayModule, Overlay } from '@angular/cdk/overlay';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecipeDialogComponent } from '../../components/delete-recipe-dialog/delete-recipe-dialog.component';
import { MessageComponent } from '../../components/message/message.component';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    // BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    NavbarComponent,
    // MatFormFieldControl,
    MatFormFieldModule,
    OverlayModule,
    MatIcon,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {

  selectedCategories: any[] = []; // Initialize as an empty array
  cleanSelectedOptions: string[] = []
  onCategoriesChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
    this.cleanSelectedOptions = selectedOptions.map(option => option.slice(option.indexOf("'") + 1, option.lastIndexOf("'")));
    console.log('cleanSelectedOptions:', this.cleanSelectedOptions);
  }

  description1: String = ''
  ingredients: String = ''
  layers: Layer[] = [
    { description: '', ingredients: [''] }
  ]
  numLayer: Number = 1
  instructions: String[] = []
  instruction1: String = ''
  toppings = new FormControl('')
  categories: Category[] = []
  id: String = this.route.snapshot.params['id']
  recipe: Recipe = {
    _id: '',
    name: '',
    description: '',
    categories: [],
    preparationTimeInMinutes: 10,
    difficulty: 5,// עקרונית אין ברירת מחדל
    date: new Date(),// 
    layers: [],
    instructions: [],
    image: '',
    isPrivate: false
  }
  selectedFile: File | null = null;
  imagePreview?: String
  numInstructions: number = 1;

  categoriesSelect: string[] = [];
  userForm: FormGroup = new FormGroup({
    name: new FormControl(this.recipe.name, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(this.recipe.description, [Validators.required, Validators.minLength(3)]),
    categories: new FormControl('', [Validators.minLength(3)]),
    preparationTimeInMinutes: new FormControl(this.recipe.preparationTimeInMinutes),
    difficulty: new FormControl(null, [Validators.required,Validators.min(1),Validators.max(5)]),
    // date:new FormControl()
    // layers: new FormArray( 
    //   [new FormGroup({
    //     description: new FormControl('', [Validators.required, Validators.minLength(3)]),//
    //     ingredients: new FormControl('', [Validators.required, Validators.minLength(3)]),//
    //   })]
    // ),
    layers: new FormArray(
      [new FormGroup({
        description: new FormControl(''),//, [Validators.required, Validators.minLength(3)]
        ingredients: new FormArray([
          new FormControl('')// [Validators.required, Validators.minLength(3)]
        ])
      })]
    ),
    instructions: new FormArray([
      new FormControl('', [Validators.required, Validators.minLength(3)])
    ]),
    isPrivate: new FormControl(false)
  })

  nameControl = this.userForm.get('name');
  showErrors = false;
  categoriesArray: String[] = []

  setShowErrors1() {
    console.log('onBlur');

    this.showErrors = true
    console.log("getErrorMessages2(userForm.controls['name'].errors)", this.getErrorMessages2(this.userForm.controls['name'].errors));

  }
  /**
   *
   */


  constructor(private recipeService: RecipesService, private categoryService: CategoriesService, private router: Router, private route: ActivatedRoute
    , private dialog: MatDialog, private cdRef: ChangeDetectorRef
  ) {

    this.userForm.statusChanges.subscribe(() => {
      if (this.userForm.invalid && this.nameControl?.touched) {
        this.showErrors = true;
      } else {
        this.showErrors = false;
      }
    });
    if (this.id != 'add') {
      recipeService.getRecipeById(this.id).subscribe(
        data => {
          this.recipe = data
          this.layers = data.layers
          this.categoriesArray = this.recipe.categories.map(c => c.description)
        }
      )
    }
    categoryService.getCategories().subscribe(
      data => {
        this.categories = data
        for (let i = 0; i < data.length; i++) {
          this.categoriesSelect[i] = data[i].description
          // if (this.categoriesArray.includes(data[i].description)) {
          //   this.selectedCategories[i]
          // }
        }
        console.log('categoriesSelect', this.categoriesSelect);
      }
    )


  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    console.log('oninit');

    if (id !== 'add') {

      //   this.userForm.markAllAsTouched(); // Mark all controls as touched for immediate validation
      //   this.recipeService.getRecipeById(id).subscribe(
      //     data => {
      //       this.recipe = data;
      //       this.userForm.patchValue({
      //         name: this.recipe.name,
      //         description: this.recipe.description,
      //         // categories: this.recipe.categories.map(c => c.description).join(', '), // Assuming 'categories' is an array of descriptions
      //         categories: '',
      //         preparationTimeInMinutes: this.recipe.preparationTimeInMinutes,
      //         difficulty: this.recipe.difficulty,
      //         isPrivate: this.recipe.isPrivate,

      //         // ... other form controls if needed
      //       });
      //     }
      //   );
      // }
      // else {
      console.log('update');

      this.recipeService.getRecipeById(id).subscribe(
        data => {
          this.recipe = data
          console.log('recipe for edit', data);
          console.log('this.recipe?.isPrivate', this.recipe.isPrivate);

          this.userForm.patchValue({
            name: this.recipe.name,
            description: this.recipe.description,
            // categories: new FormControl('', [Validators.minLength(3)]),
            preparationTimeInMinutes: this.recipe.preparationTimeInMinutes,
            difficulty: this.recipe.difficulty,
            // layers: new FormArray(
            //   [new FormGroup({
            //     description: new FormControl(''),
            //     ingredients: new FormArray([
            //       new FormControl('')
            //     ])
            //   })]
            // ),
            // instructions: new FormArray([
            //   new FormControl('vdsxhu')
            // ]),
            isPrivate: new FormControl(this.recipe?.isPrivate)
          });
          // Assuming you receive the recipe data in a variable called 'recipeLayers'
          if (this.recipe.layers && this.recipe.layers.length > 0) {
            // if (this.userForm.get('layers')?.value[0].controls.description.value == '') {
            console.log('Removing empty layer:', this.userForm.value.layers[0]);
            (this.userForm.get('layers') as FormArray).removeAt(0);
            console.log('Layers after removal:', this.userForm.value.layers);
            // }
            this.recipe.layers.forEach(layer => {
              console.log('layer', layer);

              const layerGroup = new FormGroup({
                description: new FormControl(layer.description, [Validators.required, Validators.minLength(3)]),
                ingredients: new FormArray([]) // Initialize ingredients as an empty FormArray
              });

              // Push ingredients into the layer's ingredients FormArray
              layer.ingredients.forEach(ingredient => {
                (layerGroup.get('ingredients') as FormArray).push(new FormControl(ingredient, [Validators.required, Validators.minLength(3)]));
              });

              // Push the completed layer group into the layers FormArray
              (this.userForm.get('layers') as FormArray).push(layerGroup);
            });
          }
          // if (this.recipe.instructions && this.recipe.instructions.length > 0) {
          // (this.userForm.get('layers') as FormArray).removeAt(0);

          // this.recipe.instructions.forEach(i => {
          //   (this.userForm.get('instructions') as FormArray).push(new FormControl(i));
          // });
          // Initialize instructions
          console.log('Initial Instructions:', this.recipe.instructions);
          if (this.recipe.instructions && this.recipe.instructions.length > 0) {
            (this.userForm.get('instructions') as FormArray).clear(); // Clear default empty instruction
            this.recipe.instructions.forEach(instruction => {
              (this.userForm.get('instructions') as FormArray).push(
                new FormControl(instruction, [Validators.required, Validators.minLength(3)])
              );
            });
          }
          console.log('Form Instructions:', this.userForm.get('instructions')?.value);
          // const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
          // this.cleanSelectedOptions = selectedOptions.map(option => option.slice(option.indexOf("'") + 1, option.lastIndexOf("'")));
          // console.log('cleanSelectedOptions:', this.cleanSelectedOptions);
          this.imagePreview = this.recipe?.image
        },
        error => {
          console.log('error in recipe by id for update', error);
        }
      )
      // }
    }
  }

  ifSelected(c: String) {
    console.log('category selected ', this.categoriesArray.includes(c));

    return (this.categoriesArray.includes(c))

  }

  onIngredientInput(layerIndex: number, ingredientIndex: number, event: Event) {
    const layers = this.userForm.get('layers') as FormArray;
    const ingredients = layers.at(layerIndex).get('ingredients') as FormArray;
    const input = event.target as HTMLInputElement;

    // Check if the user is typing in the last ingredient input field
    if (ingredientIndex === ingredients.length - 1 && input.value) {
      // Check if the last ingredient input field is not empty
      // if (ingredients.at(ingredientIndex).value !== '') {
      // If not empty, add a new ingredient input field at the end
      ingredients.push(new FormControl(''));
      // }
    }
    else if (!input.value && ingredientIndex !== this.instructionsArray.length - 1) {
      this.removeEmptyIngredients(this.instructionsArray.length - 1);
    }

    // if (input.value && index === this.instructionsArray.length - 1) {
    //   this.addInstruction();
    // } else if (!input.value && index !== this.instructionsArray.length - 1) {
    //   this.removeInstruction(this.instructionsArray.length - 1);
    // }
  }

  // קבע את הפונקציה לקבלת הוראות כפונקציה ציבורית
  get instructionControls() {
    console.log('len', (this.userForm.get('instruction') as FormArray).controls);

    return (this.userForm.get('instruction') as FormArray).controls;
  }
  // Inside your component class
  getFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }
  get instructionsArray() {

    return this.userForm.get('instructions') as FormArray;
  }
  get layersArray() {
    return this.userForm.get('layers') as FormArray;
  }



  AddLayer(d: String, i: String) {
    console.log('sescription', d);
    console.log('sescription', this.description1);
    console.log('ingredients', this.ingredients.split(','));
    // if (this.description1.length == 1)
    this.layers.push({ description: this.description1, ingredients: this.ingredients.split(',') })
    // this.description1 = ''
    // this.ingredients = ''
  }

  createLayer(): FormGroup {
    // this.instructionsArray.push(new FormControl(''));

    return new FormGroup({
      description: new FormControl(''),
      ingredients: new FormArray([
        new FormControl('')
      ])
    });
  }

  addLayer() {
    // this.layersArray.push(this.createLayer());
    // console.log('this.layersArray',this.layersArray);
    // this.layersArray.markAsDirty(); // Trigger change detection
    // this.cdRef.detectChanges(); // Explicit change detection

    // const newLayer = new FormGroup({
    //   description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    //   ingredients: new FormArray([
    //     new FormControl('', [Validators.required, Validators.minLength(3)])
    //   ])
    // });
    this.layersArray.push(this.createLayer())
    console.log('this.layersArray', this.layersArray);


  }
  // addLayer() {
  //   const layersControl = this.userForm.get('layers');
  //   if (layersControl instanceof FormArray) {
  //     const newLayer = new FormGroup({
  //       description: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //       ingredients: new FormArray([
  //         new FormControl('', [Validators.required, Validators.minLength(3)])
  //       ])
  //     });
  //     layersControl.push(newLayer);
  //   }
  // }



  // removeLayer(index: number) {
  //   if (this.layersArray.length > 1) {
  //     this.layersArray.removeAt(index);
  //   }
  // }

  // AddInstruction(instruction: String) {
  //   this.instructions.push(instruction)
  //   // this.instruction1 = ''
  // }
  AddInstruction($event: Event) {
    console.log('event', event);
  }
  addInstructionField() {
    const instructionArray = this.userForm.get('instruction') as FormArray;
    instructionArray.push(new FormControl('', [Validators.required, Validators.minLength(3)]));
  }

  removeInstructionField(index: number) {
    const instructionArray = this.userForm.get('instruction') as FormArray;
    if (instructionArray.length > 1) {
      instructionArray.removeAt(index);
    }
  }

  // Method to track changes in instruction fields and add/remove fields accordingly
  onInstructionChange(index: number) {
    const instructionArray = this.userForm.get('instruction') as FormArray;
    const instructionField = instructionArray.at(index) as FormControl;

    // Add a new field if the current field is not empty and it's the last field
    if (instructionField.value && index === instructionArray.length - 1) {
      this.addInstructionField();
    }

    // Remove a field if it's empty and there are more than one fields
    if (!instructionField.value && instructionArray.length > 1) {
      this.removeInstructionField(index);
    }
  }
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      console.log('event.target.files[0]', event.target.files[0]);

      this.selectedFile = event.target.files[0];
      //   const reader = new FileReader();
      //   reader.onload = () => {
      //     this.imagePreview = reader.result;
      //   };
      //   reader.readAsDataURL(this.selectedFile);
      // }
    }
  }



  async save() {
    // Get the layers array from the form
    const layersArray = this.userForm.get('layers') as FormArray;

    // Iterate through each layer
    layersArray.controls.forEach((layerGroup: AbstractControl, layerIndex: number) => {
      const ingredientsArray = layerGroup.get('ingredients') as FormArray;

      // Check if the last ingredient is empty and remove it if true
      if (ingredientsArray.length > 0) {
        const lastIngredientControl = ingredientsArray.at(ingredientsArray.length - 1);
        if (lastIngredientControl.value.trim() === '') {
          ingredientsArray.removeAt(ingredientsArray.length - 1);
        }
      }
    });
    this.userForm.value.instructions.splice(this.userForm.value.instructions.length - 1, 1)
    let arr: Category[] = [];
    for (let i = 0; i < this.cleanSelectedOptions.length; i++) {
      if (this.cleanSelectedOptions) {
        arr[i] = { _id: '', description: this.cleanSelectedOptions[i] };
      }
    }
    if (this.userForm.value.categories != '') {
      const newCategory: Category = { _id: '', description: this.userForm.value.categories };
      arr.push(newCategory);
    }
    if (arr.length > 0) {
      console.log('full');
      this.userForm.value.categories = 'category'
    }

    if (this.userForm.invalid) {
      console.log('invalid');
      this.showErrors = true
      this.logFormValidationErrors();
      return
    }

    for (let i = 0; i < this.userForm.value.layers.length; i++) {
      const element = this.userForm.value.layers[i];
    }
    
    console.log('this.userForm.value.layers', JSON.stringify(this.userForm.value.layers));
    console.log('this.userForm.value.instructions', JSON.stringify(this.userForm.value.instructions));
    console.log('JSON.stringify(arr)', JSON.stringify(arr));
    console.log('arr', arr);

    const formData = new FormData();
    formData.append('name', this.userForm.value.name);
    formData.append('description', this.userForm.value.description);
    if (this.id == 'add')

      formData.append('categories', JSON.stringify(arr));
    else
      formData.append('categories', JSON.stringify(this.recipe.categories));

    formData.append('preparationTimeInMinutes', this.userForm.value.preparationTimeInMinutes);
    formData.append('difficulty', this.userForm.value.difficulty);
    formData.append('layers', JSON.stringify(this.userForm.value.layers));
    formData.append('instructions', JSON.stringify(this.userForm.value.instructions));
    console.log('this.userForm.value.isPrivate', this.userForm.value.isPrivate);
    if (this.id == 'add')
      formData.append('isPrivate', this.userForm.value.isPrivate);
    // formData.append('date', new Date().toISOString());

    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    if (this.id === 'add') {
      console.log('difficulty', this.userForm.value.difficulty);

      console.log('send', this.userForm.value);

      await this.recipeService.addRecipe(formData, headers).subscribe(response => {
        console.log('response in add recipe', response);
      },
        error => {
          console.log('error in add recipe', error);

        }
      );
    } else {
      formData.append('_id', this.id as string); // Add _id to formData
      this.recipeService.updateRecipe(formData).subscribe(data => {
        console.log('update', data);
      });
    }
    const dialogRef = this.dialog.open(MessageComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['allRecipes']);

    });
    // alert('המתכון נשמר בהצלחה');
  }

  logFormValidationErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          console.log(`Control: ${key}, Index: ${index}, Errors:`, arrayControl.errors);
        });
      } else {
        console.log(`Control: ${key}, Errors:`, control?.errors);
      }
    });

    // Log detailed errors for instructions array
    const instructionsArray = this.userForm.get('instructions') as FormArray;
    instructionsArray.controls.forEach((control, index) => {
      console.log(`Instruction ${index} Errors:`, control.errors);
    });
  }


  getErrorMessages(control: FormControl<string>): string[] | null {
    if (control?.value) {
      const errors = control.errors;
      if (!errors) {
        return [];
      }

      const messages: string[] = [];
      for (const errorKey in errors) {
        switch (errorKey) {
          case 'required':
            messages.push('This field is required.');
            break;
          case 'minlength':
            messages.push(`This field must be at least ${errors[errorKey].requiredLength} characters long.`);
            break;
          case 'maxlength':
            messages.push(`This field must be no longer than ${errors[errorKey].requiredLength} characters long.`);
            break;
          // Add more error cases as needed
        }
      }
      return messages;
    }

    return null
  }

  getErrorMessages2(control: import("@angular/forms").ValidationErrors | null): String | null {
    console.log('control', control);
    for (const errorKey in control) {
      switch (errorKey) {
        case 'required':
          return 'שדה חובה';
          break;
        case 'minlength':
          return `השדה חייב להיות לפחות באורך ${control[errorKey].requiredLength} תוים `;
          break;
        case 'maxlength':
          return `השדה לא יכול להכיל יותר מ ${control[errorKey].requiredLength} תוים`;
          break;
          case 'min':
            return `הערך חייב להיות גדול או שווה ל- ${control[errorKey].min}`;
          case 'max':
            return `הערך חייב להיות קטן או שווה ל- ${control[errorKey].max}`;
        // Add more error cases as needed
      }
    }
    return null;
  }

  // Assuming you have a FormGroup called instructionsForm containing the FormArray instructions
  // and the FormArray is initialized with an initial FormControl

  // Add an instruction to the FormArray
  addInstruction() {
    this.instructionsArray.push(new FormControl(''));
  }

  // Remove an instruction from the FormArray at a specific index
  removeInstruction(index: number) {
    if (this.instructionsArray.length > 1) {
      this.instructionsArray.removeAt(index);
    }
  }


  onInputChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value && index === this.instructionsArray.length - 1) {
      this.addInstruction();
    } else if (!input.value && index !== this.instructionsArray.length - 1) {
      this.removeInstruction(this.instructionsArray.length - 1);
    }
  }














  // Add a method to dynamically add new ingredient inputs
  // addIngredient(i: number) {
  //   const ingredients = (this.userForm.get('layers') as FormArray).at(i).get('ingredients') as FormArray;
  //   ingredients.push(new FormControl('', [Validators.required, Validators.minLength(3)]));
  // }
  //gpt
  addIngredient(layerIndex: number, value: String) {
    this.getIngredientsArray(layerIndex).push(new FormControl(value));
  }


  // Add a method to remove empty ingredient inputs
  removeEmptyIngredients(i: number) {
    const ingredients = (this.userForm.get('layers') as FormArray).at(i).get('ingredients') as FormArray;
    for (let j = ingredients.length - 1; j >= 0; j--) {
      if (ingredients.at(j).value.trim() === '') {
        ingredients.removeAt(j);
      }
    }
  }

  // Add a method to remove a layer
  removeLayer(i: number) {
    const layerToRemove = this.layersArray.at(i) as FormGroup;
    const ingredientsArray = layerToRemove.get('ingredients') as FormArray;
    ingredientsArray.clear();
    this.layersArray.removeAt(i);
    console.log('this.layersArray', this.layersArray);
    this.cdRef.detectChanges();
    // const layersControl = this.userForm.get('layers');
    // if (layersControl instanceof FormArray) {
    //   layersControl.removeAt(i);
    // }
  }
  // getIngredientsArray(layerIndex: number) {
  //   return (this.layersArray.at(layerIndex).get('ingredients') as FormArray).controls;
  // }
  // getIngredientsArray(i: number): FormControl<any>[] {
  //   const layer = this.layersArray.at(i) as FormGroup;
  //   const ingredientsArray = layer.get('ingredients') as FormArray;
  //   if (i === 0) {
  //     // Initialize ingredientsArray for the first layer with an empty FormControl
  //     if (ingredientsArray.length === 0) {
  //       ingredientsArray.push(new FormControl('', [Validators.required, Validators.minLength(3)]));
  //     }
  //   }

  //   // Create a new array of type FormControl<any>[] and populate it with filtered controls
  //   const filteredControls = ingredientsArray.controls.filter(control => control instanceof FormControl) as FormControl<any>[];
  //   return filteredControls;
  // }
  //GPT
  getIngredientsArray(layerIndex: number) {
    return this.layersArray.at(layerIndex).get('ingredients') as FormArray;
  }
  // removeIngredient(layerIndex: number, ingredientIndex: number): void {
  //   const ingredientsArray = this.getIngredientsArray(layerIndex);
  //   ingredientsArray.removeAt(ingredientIndex);
  // }
  removeIngredient(layerIndex: number, ingredientIndex: number) {
    this.getIngredientsArray(layerIndex).removeAt(ingredientIndex);
  }
  onIngredientInputChange(event: Event, layerIndex: number, ingredientIndex: number) {
    const input = event.target as HTMLInputElement;
    const ingredientsArray = this.getIngredientsArray(layerIndex);
    if (input.value && ingredientIndex === ingredientsArray.length - 1) {
      this.addIngredient(layerIndex, '');
    } else if (!input.value && ingredientIndex !== ingredientsArray.length - 1) {
      this.removeIngredient(layerIndex, ingredientIndex);
    }
  }
}

