import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MapComponent } from './map.component'
import { AgmCoreModule } from '@agm/core'
import { CamelizePipe } from 'ngx-pipes'

import { MapService } from './map.service'

@NgModule({
  declarations: [
    MapComponent
  ],
  exports: [
    MapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBKcDVdpRosE1krKgrvDg0ReOvWDBBpskQ'
    })
  ],
  providers: [
    MapService,
    CamelizePipe
  ]
})
export class MapModule { }
