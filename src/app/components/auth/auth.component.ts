import { CommonModule, NgFor } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
    imports: [ FormsModule, CommonModule ],
})

export class AuthComponent{
    isLoginMode = true;
    isResetMode = false;
    error: string | null = null;
    successMessage: string | null = null;
    

    constructor(private authService: AuthService){}

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
        let authObs: Observable<AuthResponseData>;

        if(this.isLoginMode){
           authObs =  this.authService.login(email, password)
        }else{
        authObs = this.authService.signup(email, password)
    }
    authObs.subscribe({
        next: resData => {
        console.log(resData);
    }, 
    error: errorMessage => {
        console.log(errorMessage);
        this.error=errorMessage;
    }
    });
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
    clearMessages() {
        this.error = null;
        this.successMessage = null;
    }
}