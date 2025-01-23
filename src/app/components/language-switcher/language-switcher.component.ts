import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
})
export class LanguageSwitcherComponent {
  private _languageConfig = signal<any | null>(null); // Configurația limbilor
  selectedLanguage = signal<string>('ro'); // Limba selectată implicit

  // Computed pentru limbile activate
  activeLanguages = computed(() =>
    this._languageConfig()?.languages.filter((lang: any) => lang.enabled) || []
  );

  constructor(private http: HttpClient) {
    this.loadLanguageConfig();
  }

  // Metoda pentru încărcarea configurării limbilor
  loadLanguageConfig() {
    this.http.get('/config/language-switcher-config.json').subscribe({
      next: (config: any) => this._languageConfig.set(config.languageSwitcher),
      error: (err) => console.error('Failed to load language config:', err),
    });
  }

  // Metodă pentru schimbarea limbii
  changeLanguage(language: string) {
    if (language !== this.selectedLanguage()) {
      this.selectedLanguage.set(language);
      console.log(`Language switched to: ${language}`);
    }
  }
}
