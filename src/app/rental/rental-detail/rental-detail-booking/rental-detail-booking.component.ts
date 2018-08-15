import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import { Booking } from '../../../booking/shared/booking.model';
import { HelperService } from '../../../common/service/helper.service';
import { Rental } from '../../shared/rental.model';
import { BookingService } from '../../../booking/shared/booking.service';
import { AuthService } from '../../../auth/shared/auth.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() rental: Rental;
  @ViewChild(DaterangePickerComponent)
    private picker: DaterangePickerComponent;
  @ViewChild('bookingNoteTitle')
    private someParagraph: ElementRef;

  newBooking: Booking
  modalRef: any

  daterange: any = {};
  bookedOutDates: any[] = []
  errors: any[] = []

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkForInvalidDates.bind(this)
  };

  constructor(private helper: HelperService,
              private modal: NgbModal,
              private bookingService: BookingService,
              private toastr: ToastrService,
              public auth: AuthService) { }

  ngOnInit() {
    this.newBooking = new Booking()
    this.getBookedOutDates()

    //this.someParagraph.nativeElement.style.color = "red"
  }

  private checkForInvalidDates(date) {
    return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) || date.diff(moment(), 'days') < 0
  }

  private getBookedOutDates() {
    const bookings: Booking[] = this.rental.bookings

    if (bookings && bookings.length > 0) {
      bookings.forEach((booking: Booking) => {
        const dateRange = this.helper.getBookingRangeOfDates(booking.startAt, booking.endAt)
        this.bookedOutDates.push(...dateRange)
      })
    }
  }

  private addNewBookedOutDates(bookingData: any) {
    const dateRange = this.helper.getBookingRangeOfDates(bookingData.startAt, bookingData.endAt)
    this.bookedOutDates.push(...dateRange)
  }

  private resetDatePicker() {
    this.picker.datePicker.setStartDate(moment())
    this.picker.datePicker.setEndDate(moment())
    this.picker.datePicker.element.val('')
  }

  openConfirmModal(content) {
    this.errors = []
    this.modalRef = this.modal.open(content)
  }

  createBooking() {
    this.newBooking.rental = this.rental

    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData: any) => {
        this.addNewBookedOutDates(bookingData)
        this.newBooking = new Booking()
        this.modalRef.close()
        this.resetDatePicker()
        this.toastr.success('Booking has been successfully created! Check your booking details in manage section', 'Success!')
      },
      (err: any) => {
        this.errors = err.error.errors
      }
    )
  }

  selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = value.end.diff(value.start, 'days')
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate
  }
}
