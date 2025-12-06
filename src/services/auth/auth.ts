import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl: string = `${environment.apiUrl}/auth`;
  // private userUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private router: Router) { }

  // Register
  register(payload: { name: any; email: any; password: any }) : Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  //Login
  login(payload : {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  isLoggedIn(){
    return !! localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {});
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getUserDetails() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return {
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role")
    };
  }
}
