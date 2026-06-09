import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersManagementService } from '../services/users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { User } from '@core/models/interface';

@Component({
  selector: 'app-superadmin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, BreadcrumbComponent],
  templateUrl: './users.component.html',
})
export class UsersManagementComponent implements OnInit {
  usersService = inject(UsersManagementService);
  dialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);
  
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'name', 'roles', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll().subscribe((data) => {
      this.users = data;
      this.cdr.markForCheck();
    });
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: user || null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deactivate(id: string) {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.usersService.deactivate(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
