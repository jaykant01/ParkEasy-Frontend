import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Parking} from '../../services/parking/parking';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  nearbySpaces: any[] = [];
  loading = false;

  constructor(private parking: Parking) {}

  findParking() {

    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    this.loading = true;

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.parking.findNearby(lat, lng, 3).subscribe({

          next: (res) => {
            console.log("NEARBY RESPONSE:", res);
            this.nearbySpaces = res;
          },

          error: (err) => {
            console.error(err);
            alert("Failed to load nearby parking.");
          },

          complete: () => {
            this.loading = false;
          }

        });
      },

      () => {
        alert("Location permission is required.");
        this.loading = false;
      }

    );
  }
}
