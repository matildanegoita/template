import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private _sidebarConfig = signal<any | null>(null); // Configurație din JSON
  private _currentPage = signal<string>(''); // Pagină curentă
  sidebarVisible = signal(false); // Control pentru afișare Sidebar

  // Computed pentru secțiunea curentă
  currentSection = computed(() => {
    const config = this._sidebarConfig();
    return config?.sections?.find((section: any) => section.title.toLowerCase() === this._currentPage()) || null;
  });

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.loadSidebarConfig();
    this.trackCurrentPage();
  }

  loadSidebarConfig() {
    this.http.get('/config/sidebar-config.json').subscribe({
      next: (config: any) => this._sidebarConfig.set(config),
      error: (err) => console.error('Failed to load sidebar config:', err)
    });
  }

  trackCurrentPage() {
    this.router.events.subscribe(() => {
      const routePath = this.route.snapshot.firstChild?.routeConfig?.path || 'home';
      this._currentPage.set(routePath);
    });
  }

  toggleSidebar() {
    console.log('Toggling sidebar. Current state:', this.sidebarVisible());
    this.sidebarVisible.set(!this.sidebarVisible());
    console.log('New state:', this.sidebarVisible());
  }
  
}
