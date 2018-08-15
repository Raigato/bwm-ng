
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { JwtHelperService } from '@auth0/angular-jwt'
import * as moment from 'moment'
import 'rxjs/Rx'

const jwt = new JwtHelperService()

class DecodedToken {
  exp: number = 0
  username: string = ''
}

@Injectable()
export class AuthService {
  private decodedToken

  constructor(private http: HttpClient) {
    this.decodedToken = JSON.parse(localStorage.getItem('bwm_meta')) || new DecodedToken()
  }

  private saveToken(token: any): string {
    this.decodedToken = jwt.decodeToken(token.token)

    localStorage.setItem('bwm_auth', token.token)
    localStorage.setItem('bwm_meta', JSON.stringify(this.decodedToken))

    return token
  }

  private getExpiration() {
    return moment.unix(this.decodedToken.exp)
  }

  public register(userCredentials: any): Observable<any> {
    return this.http.post('/api/v1/users/register', userCredentials)
  }

  public login(userCredentials: any): Observable<any> {
    return this.http.post('/api/v1/users/auth', userCredentials).pipe(map(
      (token) => {
        return this.saveToken(token)
      }))
  }

  public logout() {
    localStorage.removeItem('bwm_auth')
    localStorage.removeItem('bwm_meta')

    this.decodedToken = new DecodedToken()
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(this.getExpiration())
  }

  public getAuthToken(): string {
    return localStorage.getItem('bwm_auth')
  }

  public getUsername(): string {
    return this.decodedToken.username
  }
}