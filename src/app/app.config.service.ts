import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable()
export class AppConfigService {
  constructor(private http: HttpClient) {}

  getMenuConfig(): Observable<any> {
    return this.http.get('/config/menu-config.json').pipe(
      catchError((err) => {
        console.error('Error loading menu config', err);
        return of([]);
      })
    );
  }
  
  getSidebarConfig(): Observable<any> {
    return this.http.get('/config/sidebar-config.json').pipe(
      catchError((err) => {
        console.error('Error loading sidebar config', err);
        return of({ enabled: false });
      })
    );
  }
  getLanguageSwitcherConfig(): Observable<any> {
    return this.http.get('/config/language-switcher-config.json').pipe(
      catchError((err) => {
        console.error('Error loading language switcher config', err);
        return of({ enabled: false });
      })
    );
  }
  
}
