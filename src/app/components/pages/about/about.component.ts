import { Component, inject } from '@angular/core';
import { LanguageService } from '../../language-switcher/language.service';
@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
   private languageService = inject(LanguageService);
 
   translate(key: string): string {
     return this.languageService.translate(key);
   }
}
