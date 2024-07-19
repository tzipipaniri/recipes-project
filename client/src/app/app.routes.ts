import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AllRecipesComponent } from './pages/all-recipes/all-recipes.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { MyRecipesComponent } from './pages/my-recipes/my-recipes.component';
import { authGuard } from './shared/guards/auth.guard';
import { RecipeFormComponent } from './pages/recipe-form/recipe-form.component';
import { UsersComponent } from './pages/users/users.component';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [

    // { path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent), pathMatch: 'full' },
    // { path: 'about', loadComponent: () => import('./pages/about/about.component').then(f => f.AboutComponent) },
    // { path: 'products', loadComponent: () => import('./pages/list/list.component').then(f => f.ListComponent) },
    // 
    { path: '', component:HomeComponent, pathMatch: 'full' },
    { path: 'register/:username/:password', component:RegisterComponent },
    { path: 'login', component:LoginComponent },
    { path: 'allRecipes', component:AllRecipesComponent },
    { path: 'recipe/:recipe',component:RecipeComponent},
    { path: 'details/:id', component:RecipeDetailsComponent},

    { path: 'recipeForm/:id',component:RecipeFormComponent, canActivate: [authGuard]},
    { path: 'myRecipes',component:MyRecipesComponent, canActivate: [authGuard]},
    { path: 'users',component:UsersComponent,canActivate: [adminGuard]},

    // {path:'',loadComponent:()=>import('./components/navbar/navbar.component').then(c=>c.NavbarComponent),pathMatch:'full'},
];
