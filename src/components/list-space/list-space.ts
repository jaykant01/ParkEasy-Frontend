import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Parking} from '../../services/parking/parking';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-list-space',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './list-space.html',
  styleUrl: './list-space.css',
})
export class ListSpace implements OnInit{
  spaceForm!: FormGroup;

  previews: string[] = [];
  files: File[] = [];

  selectedAmenities: string[] = [];
  selectedDays: string[] = [];

  isDragging = false;
  isSubmitting = false;

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

  weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];


  constructor(
    private fb: FormBuilder,
    private parking: Parking,
    private router: Router
  ) {}

  ngOnInit() {

    this.spaceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],

      latitude: [null, Validators.required],
      longitude: [null, Validators.required],

      parkingType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      totalSpaces: ['', Validators.required],
      pricePerHour: ['', Validators.required],

      description: ['', [Validators.required, Validators.minLength(20)]]
    });

    this.getLocation();
  }

  // ✅ GEOLOCATION
  getLocation() {

    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {

      this.spaceForm.patchValue({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

    });
  }

  // ✅ FILE HANDLING
  onFileSelected(event: any) {
    this.handleFiles(event.target.files);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;

    if (e.dataTransfer?.files) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  handleFiles(fileList: FileList) {

    Array.from(fileList).forEach(file => {

      if (!file.type.startsWith("image/")) return;

      if (file.size > 5_000_000) {
        alert("Max image size is 5MB");
        return;
      }

      this.files.push(file);

      const reader = new FileReader();
      reader.onload = e =>
        this.previews.push(e.target?.result as string);

      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
  }

  toggleAmenity(name: string) {

    if (this.selectedAmenities.includes(name)) {
      this.selectedAmenities =
        this.selectedAmenities.filter(a => a !== name);
    } else {
      this.selectedAmenities.push(name);
    }
  }

  toggleDay(day: string) {

    if (this.selectedDays.includes(day)) {
      this.selectedDays =
        this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays.push(day);
    }
  }

  onCancel() {
    this.spaceForm.reset();
    this.files = [];
    this.previews = [];
    this.selectedAmenities = [];
    this.selectedDays = [];
  }

  // ✅ FINAL SUBMIT
  onSubmit() {

    if (this.spaceForm.invalid) {
      this.spaceForm.markAllAsTouched();
      alert("Please fill all required fields.");
      return;
    }

    if (this.files.length === 0) {
      alert("Upload at least one image.");
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();

    this.files.forEach(file => {
      formData.append("images", file);
    });

    this.parking.uploadImages(formData).pipe(

      switchMap((keys: string[]) => {

        const payload = {

          ...this.spaceForm.value,

          latitude: Number(this.spaceForm.value.latitude),
          longitude: Number(this.spaceForm.value.longitude),
          totalSpaces: Number(this.spaceForm.value.totalSpaces),
          pricePerHour: Number(this.spaceForm.value.pricePerHour),

          amenities: this.selectedAmenities,
          availableDays: this.selectedDays,

          imageKeys: keys
        };

        return this.parking.createParking(payload);
      })

    ).subscribe({

      next: () => {
        alert("Parking Space Created 🚀");
        this.router.navigate(['/my-spaces']);
      },

      error: (err) => {
        console.error(err);
        alert("Failed to create parking.");
        this.isSubmitting = false;
      }
    });
  }

  formatAmenity(name: string): string {
    return name.replace(/_/g, ' ');
  }
}
