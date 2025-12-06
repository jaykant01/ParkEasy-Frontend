import {Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Parking} from '../../services/parking/parking';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-list-space',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './list-space.html',
  styleUrl: './list-space.css',
})
export class ListSpace {
  spaceForm: FormGroup;
  previews: string[] = [];
  files: File[] = [];
  isDragging = false;

  // MATCH BACKEND ENUM EXACTLY
  amenitiesList = [
    { name: "COVERED_PARKING" },
    { name: "CCTV_SURVEILLANCE" },
    { name: "EV_CHARGING" },
    { name: "SECURITY_GUARD" },
    { name: "WHEELCHAIR_ACCESS" },
    { name: "ACCESS_24_7" },
    { name: "LIGHTING" },
    { name: "SHADE" }
  ];

  selectedAmenities: string[] = [];

  weekDays = [
    "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ];
  selectedDays: string[] = [];

  constructor(
    private fb: FormBuilder,
    private parking: Parking,
    private router: Router
  ) {
    this.spaceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],

      latitude: ['', Validators.required],
      longitude: ['', Validators.required],

      parkingType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      totalSpaces: ['', Validators.required],
      pricePerHour: ['', Validators.required],

      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  // ------------------ CHECKBOX SUPPORT (HTML EXPECTS THIS) ------------------
  isAmenitySelected(name: string): boolean {
    return this.selectedAmenities.includes(name);
  }

  // AMENITIES
  toggleAmenity(i: number) {
    const name = this.amenitiesList[i].name;

    if (this.selectedAmenities.includes(name)) {
      this.selectedAmenities = this.selectedAmenities.filter(a => a !== name);
    } else {
      this.selectedAmenities.push(name);
    }
  }

  // DAYS
  toggleDay(day: string) {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays.push(day);
    }
  }

  // GEOLOCATION
  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.spaceForm.patchValue({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => alert("Unable to fetch location")
    );
  }

  // FILE HANDLING
  onFileSelected(event: any) { this.handleFiles(event.target.files); }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files) this.handleFiles(e.dataTransfer.files);
  }

  handleFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      this.files.push(file);

      const reader = new FileReader();
      reader.onload = e => this.previews.push(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
  }

  // ------------------ FIXED onCancel() ------------------
  onCancel() {
    this.spaceForm.reset();
    this.previews = [];
    this.files = [];
    this.selectedAmenities = [];
    this.selectedDays = [];
  }

  // ------------------ SUBMIT (YOUR 2 STEP FLOW) ------------------
  onSubmit() {
    this.spaceForm.markAllAsTouched();

    if (this.spaceForm.invalid || this.files.length === 0) {
      alert("Fill all required fields + upload at least 1 image.");
      return;
    }

    const payload: any = {
      ...this.spaceForm.value,
      latitude: Number(this.spaceForm.value.latitude),
      longitude: Number(this.spaceForm.value.longitude),
      totalSpaces: Number(this.spaceForm.value.totalSpaces),
      pricePerHour: Number(this.spaceForm.value.pricePerHour),
      amenities: this.selectedAmenities,
      availableDays: this.selectedDays,
      imageUrls: []
    };

    const formData = new FormData();
    this.files.forEach(f => formData.append("images", f));

    this.parking.uploadImages(formData).pipe(
      switchMap((urls: string[]) => {
        payload.imageUrls = urls;
        return this.parking.createParking(payload);
      })
    ).subscribe({
      next: () => {
        alert("Parking Space Created!");
        this.router.navigate(['/my-spaces']);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to create space.");
      }
    });
  }
  formatAmenity(name: string): string {
    return name.replace(/_/g, ' ');
  }

}
