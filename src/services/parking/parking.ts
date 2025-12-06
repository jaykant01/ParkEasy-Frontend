import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Auth} from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class Parking {
  private readonly baseUrl = `${environment.apiUrl}/parking`;

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {}

  private authHeadersJson(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // STEP 1: Upload images → multipart/form-data
  uploadImages(formData: FormData): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}` // DO NOT SET Content-Type
    });
    return this.http.post<string[]>(
      `${this.baseUrl}/upload-images`,
      formData,
      { headers }
    );
  }

  // STEP 2: Create parking → JSON only
  createParking(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/create`,
      payload,
      { headers: this.authHeadersJson() }
    );
  }

  getMySpaces(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/my-spaces`,
      { headers: this.authHeadersJson() }
    );
  }

  deleteSpace(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/delete-space/${id}`,
      { headers: this.authHeadersJson() }
    );
  }

  updateSpace(id: number, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/edit-space/${id}`,
      payload,
      { headers: this.authHeadersJson() }
    );
  }
}
