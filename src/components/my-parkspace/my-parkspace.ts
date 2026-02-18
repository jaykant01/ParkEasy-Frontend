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
  standalone: true,
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
  loading = false;

  constructor(
    private parkingService: Parking,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpaces();
  }

  loadSpaces() {

    this.loading = true;

    this.parkingService.getMySpaces().subscribe({
      next: (res: ParkingSpace[]) => {

        // Ensure arrays never null
        this.spaces = res.map(space => ({
          ...space,
          amenities: space.amenities || [],
          availableDays: space.availableDays || [],
          imageUrls: space.imageUrls || []
        }));

      },
      error: (err) => {
        console.error('Error loading spaces:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
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

  openMap(space: ParkingSpace) {
    alert("Map View coming soon 🚀");
  }

  viewSpace(id: number) {
    alert("View Page coming soon 🚀");
  }
}
