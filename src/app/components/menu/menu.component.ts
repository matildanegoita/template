import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../language-switcher/language.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  private languageService = inject(LanguageService);
  private _menuConfig = signal<any | null>(null); // Signal pentru configurația meniului
  sidebarExpanded = signal(false); // Signal pentru starea sidebar-ului
  selectedLanguage = signal<string>('ro'); // Limba selectată

  menuConfig = computed(() => this._menuConfig());
  isSticky = computed(() => this._menuConfig()?.sticky ?? false); // Default false dacă nu există
  isTransparent = computed(() => this._menuConfig()?.transparent ?? false); // Default false
  constructor(private http: HttpClient) {
    this.loadMenuConfig();
  }

  loadMenuConfig() {
    this.http.get('/config/menu-config.json').subscribe({
      next: (config: any) => {
        console.log("Loaded menu config:", config); // DEBUG
        this._menuConfig.set(config);
      },
      error: (err) => console.error('Failed to load menu config:', err)
    });
  }

  toggleSidebar() {
    this.sidebarExpanded.set(!this.sidebarExpanded());
  }

  onMenuItemClick(menuItem: string) {
    console.log(`Menu item clicked: ${menuItem}`);
  }

  translate(key: string): string {
    return this.languageService.translate(key) || key; // Dacă nu există traducerea, folosește cheia originală
  }  

}
