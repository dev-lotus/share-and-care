import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-borrow-listing',
  templateUrl: './add-borrow-listing.component.html',
  styleUrls: ['./add-borrow-listing.component.css']
})
export class AddBorrowListingComponent implements OnInit {

  lat = 23.41248256345665;
  lng = 88.48786130507187;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/satellite-streets-v11'

  // data
  source: any;
  markers: any;
  constructor() {
       (mapboxgl as any).accessToken = environment.mapbox.accessToken ;
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [this.lng, this.lat]
    });
    

   const trackPin = 
      new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      });

       /// Add map controls
   const navControl = new mapboxgl.NavigationControl({
    visualizePitch:true
  });

  this.map.addControl(navControl,"bottom-right");
  this.map.addControl(trackPin,"bottom-right")

  var marker = new mapboxgl.Marker();

  const add_marker =  (event: { lngLat: any; }) => {
var coordinates = event.lngLat;
console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
marker.setLngLat(coordinates).addTo(this.map);
}

this.map.on('click', add_marker);
   
      }


}
