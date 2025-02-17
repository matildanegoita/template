import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');
  theme$ = this.currentTheme.asObservable();

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    this.currentTheme.next(theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log("Theme applied:", theme);
  }
}
