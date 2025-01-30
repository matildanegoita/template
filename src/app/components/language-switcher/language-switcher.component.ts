import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language-switcher/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);
  languages = ['ro', 'en', 'de', 'es', 'it'];
  selectedLanguage = 'en';

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    this.selectedLanguage = selectedLang;
    this.languageService.loadLanguage(selectedLang);
  }
}
