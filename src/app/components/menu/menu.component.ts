import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../language-switcher/language.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy{

  private languageService = inject(LanguageService);
  private _menuConfig = signal<any | null>(null);
  sidebarExpanded = signal(false);
  selectedLanguage = signal<string>('en');
  isAuthenticated = signal(false); 
  private userSub: Subscription | null = null;

  menuConfig = computed(() => this._menuConfig());
  isSticky = computed(() => this._menuConfig()?.sticky ?? false);
  isTransparent = computed(() => this._menuConfig()?.transparent ?? false);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadMenuConfig();
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated.set(!!user); 
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe(); 
    }
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

  // toggleSidebar() {
  //   this.sidebarExpanded.set(!this.sidebarExpanded());
  // }

  // onMenuItemClick(menuItem: string) {
  //   console.log(`Menu item clicked: ${menuItem}`);
  // }
  onLogout() {
    this.authService.logout();
  }
  translate(key: string): string {
    return this.languageService.translate(key) || key; // Dacă nu există traducerea, folosește cheia originală
  }  

}
