import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="d-flex align-items-center gap-2 text-{{data.color || 'primary'}}" style="outline: none;">
      <mat-icon>{{data.icon || 'help_outline'}}</mat-icon> {{data.title}}
    </h2>
    <mat-dialog-content>
      <p class="mb-0 py-2 fs-6">{{data.message}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="px-4 pb-3">
      <button mat-button mat-dialog-close>{{data.cancelText || 'Cancelar'}}</button>
      <button mat-raised-button [color]="data.color || 'primary'" [mat-dialog-close]="true">
        {{data.confirmText || 'Confirmar'}}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      title: string; 
      message: string; 
      confirmText?: string; 
      cancelText?: string;
      icon?: string;
      color?: 'primary' | 'accent' | 'warn';
    }
  ) {}
}
