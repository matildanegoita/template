import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {  provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './app/components/auth/auth-interceptor.service';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { provideAuth, getAuth } from '@angular/fire/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w",
  authDomain: "template-bfd48.firebaseapp.com",
  databaseURL: "https://template-bfd48-default-rtdb.firebaseio.com/",
  projectId: "template-bfd48",
  storageBucket: "template-bfd48.appspot.com",
  messagingSenderId: "428551668869",
  appId: "1:428551668869:web:564c808ed369ea1c7915ec",
  measurementId: "G-PRDVRCMYCT"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: AuthInterceptorService, useClass: AuthInterceptorService },
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()) 
  ]
}).catch(err => console.error(err));

