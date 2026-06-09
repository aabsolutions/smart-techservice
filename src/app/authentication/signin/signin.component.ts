import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, Role } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '@shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    RouterLink,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class SigninComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);

  authForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  rememberMe = false;
  selectedRole = 'superadmin';
  showDeviceVerification = false;

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['superadmin', Validators.required],
      password: ['Super@dmin123', Validators.required],
    });
  }
  
  get f() {
    return this.authForm.controls;
  }

  adminSet() {
    this.selectedRole = 'admin';
    this.authForm.get('username')?.setValue('admin');
    this.authForm.get('password')?.setValue('admin@123');
  }

  technicianSet() {
    this.selectedRole = 'technician';
    this.authForm.get('username')?.setValue('technician');
    this.authForm.get('password')?.setValue('tech@123');
  }

  receptionistSet() {
    this.selectedRole = 'receptionist';
    this.authForm.get('username')?.setValue('receptionist');
    this.authForm.get('password')?.setValue('rec@123');
  }

  clientSet() {
    this.selectedRole = 'client';
    this.authForm.get('username')?.setValue('client');
    this.authForm.get('password')?.setValue('client@123');
  }

  getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    const browserInfo = userAgent.match(/(firefox|msie|chrome|safari)[\s/]([\d.]+)/i);
    const browserName = browserInfo ? browserInfo[1] : 'unknown';
    const browserVersion = browserInfo ? browserInfo[2] : 'unknown';
    let osName = 'unknown';
    if (userAgent.indexOf('Win') !== -1) osName = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) osName = 'MacOS';
    else if (userAgent.indexOf('Linux') !== -1) osName = 'Linux';
    else if (userAgent.indexOf('Android') !== -1) osName = 'Android';
    else if (userAgent.indexOf('iOS') !== -1) osName = 'iOS';
    return `${browserName}-${browserVersion}-${osName}`;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';

    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      this.loading = false;
      return;
    }

    this.authService.login(this.f['username'].value, this.f['password'].value, this.rememberMe).subscribe({
      next: (response) => {
        const role = response.user.roles?.[0];
        this.loading = false;
        if (role?.name === Role.SuperAdmin) {
          this.router.navigate(['/superadmin/dashboard']);
        } else if (role?.name === Role.Admin) {
          this.router.navigate(['/admin/dashboard/main']);
        } else if (role?.name === Role.Technician) {
          this.router.navigate(['/technician/dashboard']);
        } else if (role?.name === Role.Receptionist) {
          this.router.navigate(['/receptionist/dashboard']);
        } else if (role?.name === Role.Client) {
          this.router.navigate(['/client-portal/dashboard']);
        } else {
          this.router.navigate(['/authentication/signin']);
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = error;
        this.submitted = false;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
