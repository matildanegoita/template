import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  private _menuConfig = signal<any | null>(null); // Signal pentru configurația meniului
  sidebarExpanded = signal(false); // Signal pentru starea sidebar-ului
  selectedLanguage = signal<string>('ro'); // Limba selectată
  // Computed pentru acces ușor la config
  menuConfig = computed(() => this._menuConfig());

  constructor(private http: HttpClient) {
    this.loadMenuConfig();
  }

  loadMenuConfig() {
    this.http.get('/config/menu-config.json').subscribe({
      next: (config: any) => this._menuConfig.set(config),
      error: (err) => console.error('Failed to load menu config:', err)
    });
  }

  toggleSidebar() {
    this.sidebarExpanded.set(!this.sidebarExpanded());
  }

  onMenuItemClick(menuItem: string) {
    console.log(`Menu item clicked: ${menuItem}`);
  }
}
