import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable()
export class AppConfigService {
  constructor(private http: HttpClient) {}

  getMenuConfig(): Observable<any> {
    return this.http.get('/assets/menu-config.json').pipe(
      catchError((err) => {
        console.error('Error loading menu config', err);
        return of([]);
      })
    );
  }

  getFooterConfig(): Observable<any> {
    return this.http.get('/assets/footer-config.json').pipe(
      catchError((err) => {
        console.error('Error loading footer config', err);
        return of({ enabled: false });
      })
    );
  }

  getSidebarConfig(): Observable<any> {
    return this.http.get('/assets/sidebar-config.json').pipe(
      catchError((err) => {
        console.error('Error loading sidebar config', err);
        return of({ enabled: false });
      })
    );
  }
}
