import { CommonModule, NgFor } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
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

        if(this.isLoginMode){
            // ...
        }else{
        this.authService.signup(email, password).subscribe(resData => {
            console.log(resData);
        }, errorRes => {
            console.log(errorRes);
            switch(errorRes.error.message){
                case 'EMAIL_EXISTS':
                    this.error='This email exists already';
            }
            this.error = 'An error occurred!'
        });
    }
        form.reset();
     }

}