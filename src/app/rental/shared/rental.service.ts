import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

import { Rental } from './rental.model'

@Injectable()
export class RentalService {

  constructor(private http: HttpClient) {}

  public getRentalById(rentalId: string): Observable<any> {
    return this.http.get('/api/v1/rentals/' + rentalId)
  }

  public getRentals(): Observable<any> {
    return this.http.get('/api/v1/rentals')
  }

  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get('/api/v1/rentals?city=' + city)
  }

  public createRental(rentalData: Rental): Observable<any> {
    return this.http.post('/api/v1/rentals', rentalData)
  }

  public getUserRentals(): Observable<any> {
    return this.http.get('/api/v1/rentals/manage')
  }

  public deleteRental(rentalId: string): Observable<any> {
    return this.http.delete('/api/v1/rentals/' + rentalId)
  }
}