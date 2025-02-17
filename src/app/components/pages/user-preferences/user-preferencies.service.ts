import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  private currentTheme = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');
  theme$ = this.currentTheme.asObservable();
  constructor() {
    this.applyTheme(this.currentTheme.value);
  }
  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    this.currentTheme.next(theme);
    this.applyTheme(theme);
  }
  private applyTheme(theme: string) {
    // Elimină orice temă anterioară
    document.documentElement.classList.remove('light-theme', 'dark-theme');
  
    // Aplică tema curentă
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  
    console.log(`Tema aplicată: ${theme}`); // Debug
  }
  
  }

