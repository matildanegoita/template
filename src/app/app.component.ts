import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./components/menu/menu.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, SidebarComponent, FooterComponent, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'template';
}
