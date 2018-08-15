import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UcWordsPipe } from 'ngx-pipes';
import { ToastrService } from 'ngx-toastr';

import { RentalService } from '../shared/rental.service'
import { Rental } from '../shared/rental.model'

@Component({
  selector: 'bwm-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {

  rental: Rental

  rentalCategories: string[] = Rental.CATEGORIES

  locationSubject: Subject<any> = new Subject
  
  constructor(private route: ActivatedRoute,
              private rentalService: RentalService,
              private ucwords: UcWordsPipe,
              private toastr: ToastrService) {
                this.transformLocation = this.transformLocation.bind(this)
              }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.getRental(params['rentalId'])
      }
    )
  }

  transformLocation(location: string): string {
    return this.ucwords.transform(location)
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe(
      (data: Rental) => {
        this.rental = data
      }
    )
  }

  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
      (updatedRental: Rental) => {
        this.rental = updatedRental

        if (rentalData.city || rentalData.street) {
          this.locationSubject.next(this.rental.city + ' ' + this.rental.street)
        }
      },
      (err: HttpErrorResponse) => {
        this.toastr.error(err.error.errors[0].detail, 'Error:')
        this.getRental(rentalId)
      })
  }

  countBedroomAssets(assetsNum: number) {
    return parseInt(<any>this.rental.bedrooms || 0, 10) + assetsNum
  }
}
