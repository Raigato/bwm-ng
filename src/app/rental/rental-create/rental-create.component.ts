import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';

@Component({
  selector: 'bwm-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {

  newRental: Rental
  rentalCategories: string[] = Rental.CATEGORIES
  errors: any[] = []

  constructor(private rentalService: RentalService,
              private router: Router) { }

  ngOnInit() {
    this.newRental = new Rental()
    this.newRental.shared = false
  }

  handleImageChange() {
    this.newRental.image = 'https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/13/image.jpeg'
  }

  createRental() {
    this.rentalService.createRental(this.newRental).subscribe(
      (rental: Rental) => {
        this.router.navigate(['/rentals/' + rental._id])
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.errors
      }
    )
  }
}
