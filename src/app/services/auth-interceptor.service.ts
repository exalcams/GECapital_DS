import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const authorizationData = JSON.parse(localStorage.getItem('authorizationData'));
        // if (authorizationData) {
        //     const token: string = authorizationData['access_token'];

        //     if (token) {
        //         request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        //     }
        // }
        if (!request.url.includes('Attachment') && !request.url.includes('token')) {
            request = request.clone({
                headers: request.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
                    .set('Pragma', 'no-cache')
                    .set('Expires', '0')
            });
            if (!request.headers.has('Content-Type')) {
                request = request.clone({
                    headers: request.headers.set('Content-Type', 'application/json')
                });
            }
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
