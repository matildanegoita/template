import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private _footerConfig = signal<any | null>(null); // Configurația Footer-ului

  // Computed pentru accesarea configurației
  footerConfig = computed(() => this._footerConfig());

  constructor(private http: HttpClient) {
    this.loadFooterConfig();
  }

  loadFooterConfig() {
    this.http.get('/config/footer-config.json').subscribe({
      next: (config: any) => this._footerConfig.set(config),
      error: (err) => console.error('Failed to load footer config:', err)
    });
  }
}
