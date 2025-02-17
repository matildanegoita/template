import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private http = inject(HttpClient);
  private translations: any = {};
  private currentLanguage = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguage.asObservable();

  constructor() {
    this.loadLanguage(this.currentLanguage.value); // Limba implicită
  }

  loadLanguage(lang: string) {
    this.http.get(`/assets/i18/${lang}.json`).subscribe({
      next: (data: any) => {
        this.translations = data;
        this.currentLanguage.next(lang);
      },
      error: () => console.error(`Could not load language file for ${lang}`),
    });
  }

  translate(key: string): string {
    const keys = key.split('.'); 
    let result: any = this.translations;
    
    for (const k of keys) {
      result = result?.[k]; // Accesează fiecare nivel din JSON
      if (!result) return key; // Dacă nu există traducerea, returnează cheia originală
    }
  
    return result;
  }
  setLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.currentLanguage.next(lang);
    this.loadLanguage(lang);
    console.log(`Language set to: ${lang}`);
  }
  getLanguage(): string {
    return this.currentLanguage.value;
  }
}
