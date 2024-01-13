//intercepts for https requests to add authentication data
//

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concat, Observable, throwError } from "rxjs";
import { VFridgeService } from "./vfridge-service";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor{
  constructor(private vfservice : VFridgeService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiUrl : boolean = req.url.startsWith(this.vfservice.base_api);
      if(this.vfservice.userLogined && isApiUrl) {
        req = req.clone({
          setHeaders: {
            Authorization:
              'Basic ' + window.btoa(this.vfservice.user.email + ':' + this.vfservice.user.password)
          }
        });
      }

      return next.handle(req);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private vfservice : VFridgeService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(catchError(err => {
        if (err.status === 401) {
          this.vfservice.userLogined = false;
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      }))
  }
}


