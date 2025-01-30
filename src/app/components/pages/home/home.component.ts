import { Component, inject } from '@angular/core';
import { LanguageService } from '../../language-switcher/language.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private languageService = inject(LanguageService);

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
