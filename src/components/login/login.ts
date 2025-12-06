import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Auth} from '../../services/auth/auth';

@Component({
  selector: 'app-login',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f(): any {
    return this.form.controls;
  }

  loginWithGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  ngOnInit(): void {
    // Handle redirect-from-Google token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/home']).then(() => {});
    }
  }



  submit() {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);   // optional
        }
        this.router.navigate(['/home']).then(() => {});         // or homepage
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
