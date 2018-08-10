import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private url: string

  constructor(private authService: AuthService,
              private router: Router) { }

  private urlIncludes(page: string): boolean {
    return this.url.includes(page)
  }

  private handleAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      this.router.navigate(['/rentals'])
      return false
    }

    return true
  }

  private handleNotAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      return true
    }
    
    this.router.navigate(['/login'])
    return false
  }

  private isLoginOrRegister(): boolean {
    if (this.urlIncludes('login') || this.urlIncludes('register')) {
      return true
    }

    return false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.url = state.url

    if (this.authService.isAuthenticated()) {
      return this.handleAuthState()
    }

    return this.handleNotAuthState()
  }
}
