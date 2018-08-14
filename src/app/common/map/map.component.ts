import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { MapService } from './map.service'

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @Input() location: string

  @Input() locationSubject: Subject<any>

  isPositionError: boolean = false

  lat: number
  lng: number

  constructor(private mapService: MapService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.locationSubject) {
      this.locationSubject.subscribe((location: string) => {
        this.getLocation(location)
      })
    }
  }

  ngOnDestroy() {
    if (this.locationSubject) {
      this.locationSubject.unsubscribe()
    }
  }

  getLocation(location) {
    this.mapService.getGeoLocation(location).subscribe((coordinates) => {
      this.lat = coordinates.lat
      this.lng = coordinates.lng

      this.ref.detectChanges()
    }, () => {
      this.isPositionError = true
      this.ref.detectChanges()
    })
  }
 
  mapReadyHandler() {
    this.getLocation(this.location)
  }
}
