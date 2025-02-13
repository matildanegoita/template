import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { AuthService } from '../components/auth/auth.service';


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db = getDatabase();

  constructor(private authService: AuthService) {}


  async saveUserPreferences(userId: string, preferences: { language: string; theme: string }) {
    const userRef = ref(this.db, `userPreferences/${userId}`);
    try {
      await set(userRef, preferences);
      console.log('Preferences saved successfully.');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }


  async getUserPreferences(userId: string): Promise<{ language: string; theme: string } | null> {
    const userRef = ref(this.db, `userPreferences/${userId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No preferences found, using defaults.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
  }
}
