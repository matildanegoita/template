import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user || !user.token) {
                    return next.handle(req);
                }

                const modifiedReq = req.clone({ 
                    params: new HttpParams().set('auth', user.token)
                });

                return next.handle(modifiedReq);
            })
        );
    }
}