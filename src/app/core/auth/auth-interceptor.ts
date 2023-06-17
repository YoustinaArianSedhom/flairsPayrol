import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./model/auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // No need sense plugin itself send token with each resource server url




    // const token = this._authService.accessToken;
    // if (token) request = request.clone({
    //   headers: request.headers
    //     .set('Authorization', `Bearer ${token}`)
    // });


    return next.handle(request);
  }
}
