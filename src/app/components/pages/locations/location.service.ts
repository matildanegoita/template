import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private countriesApiUrl = 'https://countriesnow.space/api/v0.1/countries/positions';
  private citiesApiUrl = 'https://countriesnow.space/api/v0.1/countries/cities';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<string[]> {
    return this.http.get<any>(this.countriesApiUrl).pipe(
      map(response => {
        if (!response.data) return [];

        return response.data.map((country: any) => country.name);
      }),
      catchError(this.handleError)
    );
  }

  getCities(country: string): Observable<string[]> {
    return this.http.post<any>(this.citiesApiUrl, { country }).pipe(
      map(response => {
        if (!response.data || response.data.length === 0) return [];

        return response.data; // Returnează toate orașele disponibile
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: please try again later.`;
    } else {
      errorMessage = `Try again later.`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
