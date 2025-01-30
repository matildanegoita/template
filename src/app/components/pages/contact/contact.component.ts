import { Component, inject } from '@angular/core';
import { LanguageService } from '../../language-switcher/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private languageService = inject(LanguageService);

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
