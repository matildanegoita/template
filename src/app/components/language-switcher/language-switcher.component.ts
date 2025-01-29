import { Component, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  private _languageConfig = signal<any | null>(null); // Configurația pentru language switcher

  selectedLanguage = signal<string>('en'); // Limba selectată implicit

  // Computed pentru acces ușor la configurație
  languageSwitcherConfig = computed(() => this._languageConfig());

  enabledLanguages = computed(() =>
    this.languageSwitcherConfig()?.languages.filter((language: any) => language.enabled) || []
  );
  // Computed pentru verificare dacă language switcher este activ
  isEnabled = computed(() => this._languageConfig()?.enabled === true);

  constructor(private http: HttpClient) {
    this.loadLanguageSwitcherConfig();
  }

  loadLanguageSwitcherConfig() {
    this.http.get('/config/language-switcher-config.json').subscribe({
      next: (config: any) => {
        console.log('Loaded Language Switcher Config:', config); // Debug
        this._languageConfig.set(config.languageSwitcher);
      },
      error: (err) => console.error('Failed to load language switcher config:', err)
    });
  }

  changeLanguage(language: string) {
    if (language !== this.selectedLanguage() && this.isEnabled()) {
      this.selectedLanguage.set(language);
      console.log(`Language switched to: ${language}`);
    }
  }
}
