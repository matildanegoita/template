import { inject, Injectable } from "@angular/core";
import { Firestore, doc, getDoc, setDoc, updateDoc } from "@angular/fire/firestore";
import { from, map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    private firestore = inject(Firestore);
    
    saveUserProfile(userId: string, email: string, hashedPassword: string, language: string, theme: string): Observable<void> {
        const userRef = doc(this.firestore, `users/${userId}`);
        return from(setDoc(userRef, { email, hashedPassword, language, theme }));
    }

    getUserProfile(userId: string): Observable<any> {
        const userRef = doc(this.firestore, `users/${userId}`);
        return from(getDoc(userRef)).pipe(
            map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
        );
    }
    getUserLanguage(localId: string): Observable<string> {
        const userRef = doc(this.firestore, `users/${localId}`);
        return from(getDoc(userRef)).pipe(
          map((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              return userData?.["language"] || 'en';
            } else {
              return 'en';
            }
          })
        );
      }

      async updateUserLanguage(userId: string, language: string): Promise<void> {
        const userRef = doc(this.firestore, `users/${userId}`);
        const docSnap = await getDoc(userRef);
      
        if (docSnap.exists()) {
          await updateDoc(userRef, { language });
        } else {
          await setDoc(userRef, { language });
        }
        console.log("Limbă actualizată cu succes!");
      }
      
      async updateUserTheme(userId: string, theme: string): Promise<void> {
        const userRef = doc(this.firestore, `users/${userId}`);
        const docSnap = await getDoc(userRef);
      
        if (docSnap.exists()) {
          await updateDoc(userRef, { theme });
        } else {
          await setDoc(userRef, { theme });
        }
        console.log("Temă actualizată cu succes!");
      }
      

    updateUserPassword(userId: string, newPassword: string): Observable<void> {
        const hashedPassword = btoa(newPassword); // Criptare simplă
        const userRef = doc(this.firestore, `users/${userId}`);
        return from(updateDoc(userRef, { hashedPassword }));
    }
}