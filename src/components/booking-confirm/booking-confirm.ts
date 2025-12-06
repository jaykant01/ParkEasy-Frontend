import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-booking-confirm',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './booking-confirm.html',
  styleUrl: './booking-confirm.css',
})
export class BookingConfirm {
  // Mock data for the confirmation
  payment: string = 'card';

  booking = {
    parkingSpace: {
      title: 'Downtown Parking Lot',
      address: '123 Main St, City Center',
      image: '',
    },
    price: 275,
    spots: 12,
    date: '2025-12-03',
    startTime: '14:00',
    endTime: '16:00'
  };

  // CALCULATIONS
  get duration(): number {
    const start = +this.booking.startTime.split(':')[0];
    const end = +this.booking.endTime.split(':')[0];
    return end - start;
  }

  get baseAmount(): number {
    return this.duration * this.booking.price;
  }

  get fee(): number {
    return Math.round(this.baseAmount * 0.10);
  }

  get total(): number {
    return this.baseAmount + this.fee;
  }

  confirmBooking() {
    alert("Booking Confirmed!");
  }
}
