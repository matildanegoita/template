import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, from, Observable, Subject, switchMap, take, tap } from "rxjs";
import { throwError } from "rxjs";
import { User } from "./user.model";
import { map } from "rxjs";
import { Router } from "@angular/router";
import { LanguageService } from "../language-switcher/language.service";
import { DatabaseService } from "../../database/database.service";


export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService{
   
    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer: any;
    private languageService = inject(LanguageService);
    private databaseService= inject(DatabaseService);
    constructor(private http: HttpClient, private router: Router){
        this.autoLogin();
    }
    
    signup(email: string, password: string, language: string): Observable<AuthResponseData>{
        const hashedPassword = btoa(password);
        const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const detectedLanguage = navigator.language.slice(0, 2);
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            switchMap((resData) => {
                return this.sendEmailVerification(resData.idToken).pipe(
                    switchMap(() => {
                        // Salvăm profilul utilizatorului cu limba detectată
                        return this.databaseService.saveUserProfile(resData.localId, email, hashedPassword, detectedLanguage, theme);
                    }),
                    tap(() => {
                        this.languageService.setLanguage(detectedLanguage); // 🔹 Setăm limba în Language Picker
                    }),
                    map(() => resData)
                );
            }),
            catchError(this.handleError),
            tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn); })
        );
}
    sendEmailVerification(idToken: string): Observable<any> {
        return this.http.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w`,
            { requestType: "VERIFY_EMAIL", idToken }
        ).pipe(
            catchError(this.handleError),
            tap(() => {
                console.log("Verification email sent!");
            })
        );
    }
    
    
    login(email: string, password: string): Observable<AuthResponseData>{
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            switchMap((resData) => {
                return this.checkEmailVerification(resData.idToken).pipe(
                    switchMap((isVerified) => {
                        if (!isVerified) {
                            return throwError(() => ({
                                error: {
                                    error: { message: 'EMAIL_NOT_VERIFIED' }
                                }
                            }));
                        }
                        
                        return from(this.databaseService.getUserProfile(resData.localId)).pipe(
                            tap(userProfile => {
                                if (userProfile && userProfile.language) {
                                    this.languageService.setLanguage(userProfile.language);
                                }
                            }),
                            map(() => resData)
                        );
                    })
                );
            }),
            catchError(this.handleError),
            tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn); })
        );
    }
    autoLogin(){
       const userData:{
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
       } = JSON.parse(localStorage.getItem('userData')!);
       if (!userData){
        return;
       }
       const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
       if(loadedUser.token){
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration);
       }
    }
    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
    checkEmailVerification(idToken: string): Observable<boolean> {
        return this.http.post<any>(
            'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            { idToken }
        ).pipe(
            map(response => response.users[0]?.emailVerified || false),
            catchError(this.handleError)
        );
    }
    autoLogout(expirationDuration: number){
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

   
    resetPassword(email: string) {
        return this.http.post<{ email: string }>(
            'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            {
                requestType: "PASSWORD_RESET",
                email: email
            }
        ).pipe(
            catchError(this.handleError),
            tap(() => {
                console.log(`Password reset email sent to ${email}`);
            })
        );
    }
    updateUserPassword(newPassword: string): Observable<any> {
        return this.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    return throwError(() => new Error('No authenticated user!'));
                }
    
                return this.http.post<any>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
                    {
                        idToken: user.token,
                        password: newPassword,
                        returnSecureToken: true
                    }
                ).pipe(
                    switchMap(resData => {
                        // 🔹 Convertim Promise în Observable cu `from()`
                        return from(this.databaseService.updateUserPassword(user.id, newPassword)).pipe(
                            map(() => resData) // Returnăm răspunsul inițial după actualizare
                        );
                    }),
                    tap(() => console.log('Password successfully updated in Firebase Authentication and Firestore.')),
                    catchError(this.handleError)
                );
            })
        );
    }
    
    private handleAuthentication (email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user= new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => new Error(errorMessage));
        }
        const errorKey=errorRes.error.error.message

        switch (errorKey) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Credentials were not found.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Credentials were not found.';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid login credentials.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'This user has been disabled.';
                break;
            case 'INVALID_ID_TOKEN':
                errorMessage = 'Invalid session token. Please login again.';
                break;
            case 'EMAIL_NOT_VERIFIED':
                errorMessage = 'Please verify your email before logging in.';
                break;

                default:
                    errorMessage = `Firebase Error: ${errorKey}`; 
            }
        
            console.log(` Firebase Error: ${errorKey}`); 
        
            return throwError(() => new Error(errorMessage));
    }
}
