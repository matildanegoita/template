import { CommonModule, NgFor } from "@angular/common";
import { Component, inject, NgModule } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { LanguageService } from "../language-switcher/language.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    imports: [ FormsModule, CommonModule ],
})

export class AuthComponent{
    isLoginMode = true;
    isLoading=false;
    isResetMode = false;
    theme: string = 'light';
    error: string | null = null;
    successMessage: string | null = null;
    languageService= inject (LanguageService);
    

    constructor(private authService: AuthService, private router: Router){}

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
        this.isResetMode=false;
    }
 
    onResetPasswordMode() {
        this.isResetMode = true; 
        this.isLoginMode = false;
        this.clearMessages();
    }
     onSubmit (form:NgForm){
        if (!form.valid){
            return;
        }
        const email=form.value.email;
        const password=form.value.password;
        const language = navigator.language.slice(0, 2);
        const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        if(this.isLoginMode){
            this.isLoading = true;
           this.authService.login(email, password).subscribe({
            next: (resData) => {
                console.log('Logged in:', resData);
                this.isLoading = false;
                this.router.navigate(['/home']);
            },
            error: (errorMessage) => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
           });
        }else{
            this.isLoading = true;
            this.authService.signup(email, password, language).subscribe({
                next: (resData) => {
                    console.log(resData);
                    this.isLoading = false;
                    this.isLoginMode = !this.isLoginMode;
                    this.successMessage = "Verification email sent! Please check your inbox.";
                },
                error: (errorMessage) => {
                    console.log(errorMessage);
                    this.error = errorMessage;
                    this.isLoading = false;
                }
            });
    }
        form.reset();
     }
    
     onForgotPassword(form: NgForm) {
        if (!form.valid) {
            this.error = "Please enter your email!"
            return;
        }

        const email = form.value.email;
        this.clearMessages();
        this.authService.resetPassword(email).subscribe({
            next: () => {
                this.successMessage = "Password reset email sent! Check your inbox.";
                this.isResetMode= true;
            },
            error: errorMessage => {
                this.error = errorMessage;
            }
        });
        form.reset();
    }
    onSendVerificationEmail() {
        this.clearMessages();
        const user = this.authService.user.value;
        if (!user) {
            this.error = "You must be logged in to verify your email.";
            return;
        }

        this.authService.sendEmailVerification(user.token!).subscribe({
            next: () => {
                this.successMessage = "Verification email sent! Check your inbox.";
            },
            error: (errorMessage) => {
                this.error = errorMessage;
            },
        });
    }
    clearMessages() {
        this.error = null;
        this.successMessage = null;
    }
    translate(key: string): string {
        return this.languageService.translate(key) || key; // Dacă nu există traducerea, folosește cheia originală
      } 
}