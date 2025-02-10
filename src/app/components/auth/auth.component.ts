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
    error: string | null = null;

    constructor(private authService: AuthService){}

    onSwitchModel(){
        this.isLoginMode = !this.isLoginMode;
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

}