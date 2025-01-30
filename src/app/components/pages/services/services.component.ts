import { Component, inject } from '@angular/core';
import { LanguageService } from '../../language-switcher/language.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  private languageService = inject(LanguageService);

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
