import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translations: any = {};
  private language = new BehaviorSubject<string>('en');
  language$ = this.language.asObservable();

  constructor(private http: HttpClient) {}

  loadLanguage(lang: string) {
    this.http.get(`/assets/i18/${lang}.json`).subscribe({
      next: (data) => {
        this.translations = data;
        this.language.next(lang);
      },
      error: () => console.error(`Could not load language file for ${lang}`),
    });
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }
}
