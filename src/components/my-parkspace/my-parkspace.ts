import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Parking} from '../../services/parking/parking';
import {NgForOf, NgIf} from '@angular/common';

export interface ParkingSpace {
  id: number;
  title: string;
  address: string;
  city: string;
  zip: string;

  parkingType: string;
  vehicleType: string;

  latitude: number;
  longitude: number;

  pricePerHour: number;
  totalSpaces: number;

  description: string;

  amenities: string[];
  availableDays: string[];
  imageUrls: string[];

  status: string;
  userId: string;
}

@Component({
  selector: 'app-my-parkspace',
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './my-parkspace.html',
  styleUrl: './my-parkspace.css',
})
export class MyParkspace implements OnInit {
  spaces: ParkingSpace[] = [];

  constructor(
    private parkingService: Parking,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpaces();
  }

  loadSpaces() {
    this.parkingService.getMySpaces().subscribe({
      next: (res: ParkingSpace[]) => {
        this.spaces = res;
      },
      error: (err) => {
        console.error('Error loading spaces:', err);
      }
    });
  }

  viewSpace(id: number) {
    alert("View Space — Future Implementation");
  }

  openMap(space: ParkingSpace) {
    alert("Map View is coming soon!");
  }

  editSpace(id: number) {
    this.router.navigate(['/list-space'], { queryParams: { id } });
  }

  deleteSpace(id: number) {
    if (!confirm("Delete this space permanently?")) return;

    this.parkingService.deleteSpace(id).subscribe({
      next: () => {
        this.spaces = this.spaces.filter(s => s.id !== id);
      },
      error: (err) => console.error("Delete failed:", err)
    });
  }
}
