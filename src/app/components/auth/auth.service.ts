import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, Subject, switchMap, tap } from "rxjs";
import { throwError } from "rxjs";
import { User } from "./user.model";
import { map } from "rxjs";
import { Router } from "@angular/router";
import { LanguageService } from "../language-switcher/language.service";


export interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered ?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{
   
    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer: any;
    private languageService = inject(LanguageService);

    constructor(private http: HttpClient, private router: Router){
        this.autoLogin();
    }
    
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            switchMap((resData) => {
                return this.sendEmailVerification(resData.idToken);
            }),
            catchError(this.handleError), tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn); })
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
    
    
    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdGegGOjeag6upB1c2k1kaaguEah8-l5w',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(switchMap((resData) => {
            return this.checkEmailVerification(resData.idToken).pipe(
                switchMap((isVerified) => {
                    if (!isVerified) {
                        return throwError(() => ({
                            error: {
                                error: { message: 'EMAIL_NOT_VERIFIED' }
                            }
                        }));
                    }
                    return [resData]; 
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
                    errorMessage = `Firebase Error: ${errorKey}`; // Mesaj fallback
            }
        
            console.log(`🔥 Firebase Error: ${errorKey}`); // Debugging
        
            return throwError(() => new Error(errorMessage));
    }
}
