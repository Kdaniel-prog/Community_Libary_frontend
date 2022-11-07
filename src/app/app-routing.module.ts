import { NgModule } from '@angular/core';
import { GuardsCheckEnd, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/guards.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent/*, canActivate: [AuthGuard]*/},
  { path: 'profile', component: ProfileComponent/*, canActivate: [AuthGuard]*/},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
