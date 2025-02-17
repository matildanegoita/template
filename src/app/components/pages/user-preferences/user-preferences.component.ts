import { Component, HostBinding, inject, NgModule, OnInit } from '@angular/core';
import { DatabaseService } from '../../../database/database.service';
import { AuthService } from '../../auth/auth.service';
import { LanguageService } from '../../language-switcher/language.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from './user-preferencies.service';
import { doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent implements OnInit {
  selectedLanguage = 'en';
  selectedTheme = 'light';
  userId: string | null = null;
  languages = ['en', 'ro', 'de', 'es', 'it'];
  themes: string[] = ['light', 'dark'];

  languageService=inject(LanguageService);
  private preferencesService = inject(UserPreferencesService);
  private authService = inject(AuthService);
  private databaseService=inject(DatabaseService);
  
  ngOnInit() {
    // 🟡 Ascultăm schimbările de utilizator și preluăm preferințele
    this.authService.user.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadUserPreferences(user.id);
      }
    });

    // 🟡 Ascultăm schimbările de temă și limbă din serviciu
    this.preferencesService.theme$.subscribe(theme => {
      this.selectedTheme = theme;
   
    });

    this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  async loadUserPreferences(userId: string) {
    try {
      const preferences = await this.databaseService.getUserProfile(userId).toPromise();
      if (preferences) {
        this.selectedLanguage = preferences.language || 'en';
        this.selectedTheme = preferences.theme || 'light';
        this.languageService.setLanguage(this.selectedLanguage);
        this.preferencesService.setTheme(this.selectedTheme);
      } else {
        this.setDefaultPreferences();
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
    console.log('Language changed to:', this.selectedLanguage);
  }
  onThemeChange() {
    this.preferencesService.setTheme(this.selectedTheme);
    console.log('Theme changed to:', this.selectedTheme);
  }

  async savePreferences(form?: NgForm) {
    if (form && form.invalid) {
      console.error('Invalid form');
      return;
    }
  
    if (!this.userId) {
      console.error('No user ID found');
      return;
    }
  
    const preferences = {
      language: this.selectedLanguage,
      theme: this.selectedTheme
    };
    try {
      await this.databaseService.updateUserLanguage(this.userId, this.selectedLanguage);
      await this.databaseService.updateUserTheme(this.userId, this.selectedTheme);
      
      console.log('Preferințe salvate cu succes:', preferences);
  
      // Aplică preferințele în interfață
      this.languageService.setLanguage(this.selectedLanguage);
      this.preferencesService.setTheme(this.selectedTheme);
    } catch (error) {
      console.error('Eroare la salvarea preferințelor:', error);
    }
  }

  setDefaultPreferences() {
    this.selectedLanguage = navigator.language.split('-')[0] || 'en';
    this.selectedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.languageService.setLanguage(this.selectedLanguage);
    this.preferencesService.setTheme(this.selectedTheme);
  }
  
  
}
