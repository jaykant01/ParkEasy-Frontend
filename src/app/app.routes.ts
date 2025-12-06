import { Routes } from '@angular/router';
import {HeroSection} from '../components/hero-section/hero-section';
import {HomePage} from '../components/home-page/home-page';
import {Signup} from '../components/signup/signup';
import {Login} from '../components/login/login';
import {authGuard} from '../guards/auth-guard';
import {ListSpace} from '../components/list-space/list-space';
import {MyParkspace} from '../components/my-parkspace/my-parkspace';

export const routes: Routes = [
  { path: '', component: HeroSection, pathMatch: 'full' },
  { path: 'signup', component: Signup, title: 'Signup' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'home', component: HomePage, title: 'Home' , canActivate: [authGuard] },
  { path: 'list-space', component: ListSpace, title: 'List Space' , canActivate: [authGuard] },
  { path: 'my-spaces', component: MyParkspace, title: 'My Space' , canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
