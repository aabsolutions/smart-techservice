import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AuditManagementService } from '../services/audit.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-superadmin-audit-log',
  standalone: true,
  imports: [CommonModule, MatTableModule, BreadcrumbComponent, DatePipe],
  templateUrl: './audit-log.component.html',
})
export class AuditLogComponent implements OnInit {
  auditService = inject(AuditManagementService);
  cdr = inject(ChangeDetectorRef);
  logs: any[] = [];
  displayedColumns: string[] = ['timestamp', 'action', 'performedBy', 'targetUser', 'ip'];

  ngOnInit() {
    this.auditService.getAll().subscribe(data => {
      this.logs = data;
      this.cdr.markForCheck();
    });
  }
}
