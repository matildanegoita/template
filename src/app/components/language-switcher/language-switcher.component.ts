import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language-switcher/language.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  private http = inject(HttpClient);
  public languageService = inject(LanguageService);

  private _languages = signal<any[]>([]);
  private _enabled = signal<boolean>(true);  // Stocăm limbile disponibile
  selectedLanguage = signal<string>('en'); // Limba implicită
  
  constructor() {
    this.loadLanguages();
  }

  loadLanguages() {
    this.http.get('/config/language-switcher-config.json').subscribe({
      next: (data: any) => {
        console.log("Loaded languages:", data.languageSwitcher.languages); 
        this._languages.set(data.languageSwitcher.languages.filter((lang: any) => lang.enabled)); 
        this._enabled.set(data.languageSwitcher.enabled); // Setăm dacă apare sau nu
      },
      error: (err) => console.error('Failed to load languages:', err)
    });
  }

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    this.selectedLanguage.set(selectedLang);
    this.languageService.loadLanguage(selectedLang);
  }

  languages = computed(() => this._languages()); // Computed pentru UI
  isEnabled = computed(() => this._enabled());
}

