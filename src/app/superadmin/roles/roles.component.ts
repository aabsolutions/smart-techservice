import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RolesManagementService } from '../services/roles.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { RolePermissionsDialogComponent } from './role-permissions-dialog/role-permissions-dialog.component';

@Component({
  selector: 'app-superadmin-roles',
  standalone: true,
  imports: [CommonModule, MatTableModule, BreadcrumbComponent, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './roles.component.html',
})
export class RolesManagementComponent implements OnInit {
  rolesService = inject(RolesManagementService);
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  roles: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'priority', 'permissions', 'system', 'actions'];

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getAll().subscribe(data => {
      this.roles = data;
      this.cdr.markForCheck();
    });
  }

  editPermissions(role: any) {
    const dialogRef = this.dialog.open(RolePermissionsDialogComponent, {
      width: '600px',
      data: { role }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadRoles();
    });
  }
}
