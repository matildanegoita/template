import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../language-switcher/language.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);
  private _footerConfig = signal<any | null>(null);

  footerConfig = computed(() => this._footerConfig());
  isSticky = computed(() => this._footerConfig()?.sticky); // Default false dacă nu există

  constructor() {
    this.loadFooterConfig();
  }

  loadFooterConfig() {
    this.http.get('/config/footer-config.json').subscribe({
      next: (config: any) => {
        console.log("Loaded footer config:", config); // DEBUG
        this._footerConfig.set(config);
      },
      error: (err) => console.error('Failed to load footer config:', err)
    });
  }

  translate(key: string): string {
    return this.languageService.translate(`footer.${key}`);
  }
}
