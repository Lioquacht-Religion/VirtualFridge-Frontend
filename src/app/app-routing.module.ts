import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { StorageComponent } from './storage/storage.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeViewComponent } from './recipe/recipe-view/recipe-view.component';
import { StorageViewComponent } from './storage/storage-view/storage-view.component';


const routes: Routes = [

  { path: 'link_register', component: RegisterComponent },
  { path: 'link_login', component: LoginComponent },
  { path: 'link_menu', component: MenuComponent },
  { path: 'link_storage/:userID', component: StorageComponent },
  { path: 'link_recipe/:userID', component: RecipeComponent },
  { path: 'link_storageview/:storageID', component: StorageViewComponent },
  { path: 'link_recipeview/:recipeID', component: RecipeViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
