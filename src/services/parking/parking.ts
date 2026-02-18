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
    private http: HttpClient
  ) {}

  // STEP 1: Upload images → multipart/form-data
  uploadImages(formData: FormData): Observable<string[]> {
    return this.http.post<string[]>(
      `${this.baseUrl}/upload-images`,
      formData
    );
  }

  // STEP 2: Create parking → JSON only
  createParking(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/create`,
      payload
    );
  }

  getMySpaces(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/my-spaces`
    );
  }

  getSpaceById(id: number) {
    return this.http.get(
      `${this.baseUrl}/${id}`
    );
  }


  deleteSpace(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/delete-space/${id}`
    );
  }

  updateSpace(id: number, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/edit-space/${id}`,
      payload
    );
  }

  findNearby(lat: number, lng: number, radiusKm: number = 3) {
    return this.http.get<any[]>(
      `${this.baseUrl}/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
    );
  }

}
