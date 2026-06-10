import { Component, Inject, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { TicketsService } from '../../../receptionist/tickets/services/tickets.service';
import { AuthService } from '../../../core/service/auth.service';
import { CloudinaryService } from '@core/service/cloudinary.service';
import { SwalService } from '@core/service/swal.service';
import { UsersManagementService as UsersService } from '../../../superadmin/services/users.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ticket-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './ticket-detail-dialog.component.html'
})
export class TicketDetailDialogComponent implements OnInit {
  ticketsService: TicketsService = inject(TicketsService);
  authService: AuthService = inject(AuthService);
  cloudinaryService: CloudinaryService = inject(CloudinaryService);
  swal: SwalService = inject(SwalService);
  matDialog: MatDialog = inject(MatDialog);
  usersService: UsersService = inject(UsersService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  noteText: string = '';
  currentUser: any;
  isReceptionistView: boolean = false;

  // Technician reassignment (receptionist)
  technicians: any[] = [];
  selectedTechnicianId: string | null = null;

  // Stores File objects pending upload
  pendingFiles: File[] = [];
  // Stores preview URLs (object URLs) for the UI preview
  photoPreviews: string[] = [];
  // Stores the final Cloudinary URLs after successful upload
  uploadedUrls: string[] = [];

  isUploading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TicketDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticket: any }
  ) {
    this.currentUser = this.authService.currentUser();
    this.isReceptionistView = this.authService.hasRole('RECEPTIONIST');
  }

  ngOnInit() {
    if (this.canAssignTechnician()) {
      this.usersService.getAll({ role: 'TECHNICIAN' }).subscribe((res: any[]) => {
        this.technicians = res;
        this.selectedTechnicianId = this.data.ticket.assignedTechnician?._id ?? null;
        this.cdr.detectChanges();
      });
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      this.pendingFiles.push(file);
      this.photoPreviews.push(URL.createObjectURL(file));
    });

    // Reset input so the same file can be re-selected if needed
    event.target.value = '';
    this.cdr.detectChanges();
  }

  removePhoto(index: number) {
    URL.revokeObjectURL(this.photoPreviews[index]);
    this.pendingFiles.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }

  private clearPhotos() {
    this.photoPreviews.forEach(url => URL.revokeObjectURL(url));
    this.pendingFiles = [];
    this.photoPreviews = [];
    this.uploadedUrls = [];
  }

  /** Upload pending files to Cloudinary, then save the note */
  async addNote() {
    if (!this.noteText.trim() && this.pendingFiles.length === 0) return;

    this.isUploading = true;

    try {
      // 1. Upload images if any
      let photoUrls: string[] = [];
      if (this.pendingFiles.length > 0) {
        const result = await this.cloudinaryService.uploadFiles(this.pendingFiles).toPromise();
        photoUrls = result?.urls ?? [];
      }

      // 2. Save note with real Cloudinary URLs
      this.ticketsService.updateStatus(
        this.data.ticket._id,
        this.data.ticket.status,
        this.noteText,
        photoUrls
      ).subscribe({
        next: () => {
          if (!this.data.ticket.statusHistory) this.data.ticket.statusHistory = [];
          this.data.ticket.statusHistory.push({
            status: this.data.ticket.status,
            notes: this.noteText,
            photos: photoUrls,
            createdAt: new Date()
          });
          this.noteText = '';
          this.clearPhotos();
          this.isUploading = false;
          this.swal.success('Registro guardado', 'La bitácora fue actualizada correctamente.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isUploading = false;
          this.swal.error('Error al guardar', err.error?.message || 'Intente de nuevo.');
        }
      });
    } catch (err: any) {
      this.isUploading = false;
      this.swal.error('Error al subir imágenes', err?.message || 'No se pudieron subir las fotos a Cloudinary.');
    }
  }

  // ─── Role checks ─────────────────────────────────────────────────────────────

  canDeleteNote(history: any, index: number): boolean {
    if (index === 0 || history.status === 'REGISTRADO') return false;
    const isCreator = history.changedBy === this.currentUser?._id;
    const isAdmin = this.authService.isSuperAdmin() || this.authService.hasRole('ADMIN');
    return isCreator || isAdmin;
  }

  canAddNote(): boolean {
    return this.authService.isSuperAdmin() ||
           this.authService.hasRole('ADMIN') ||
           this.authService.hasRole('TECHNICIAN') ||
           this.authService.hasRole('RECEPTIONIST');
  }

  canAssignTechnician(): boolean {
    return this.authService.isSuperAdmin() ||
           this.authService.hasRole('ADMIN') ||
           this.authService.hasRole('RECEPTIONIST');
  }

  assignTechnician() {
    this.ticketsService.update(this.data.ticket._id, {
      assignedTechnicianId: this.selectedTechnicianId ?? undefined
    }).subscribe({
      next: (updated: any) => {
        this.data.ticket.assignedTechnician = updated.assignedTechnician;
        this.swal.success('Técnico asignado', 'La asignación fue actualizada correctamente.');
        this.dialogRef.close(true);
      },
      error: (err: any) => this.swal.error('Error al asignar', err.error?.message || 'Intente de nuevo.')
    });
  }

  canSeeEvidenceSection(): boolean {
    return this.canAddNote() || this.canDeliverTicket();
  }

  canOnlyDeliver(): boolean {
    return !this.canAddNote() && this.canDeliverTicket();
  }

  canDeliverTicket(): boolean {
    const isReceptionistOrAdmin = this.authService.isSuperAdmin() ||
                                  this.authService.hasRole('ADMIN') ||
                                  this.authService.hasRole('RECEPTIONIST');
    return isReceptionistOrAdmin && this.data.ticket.status === 'LISTO PARA ENTREGA';
  }

  // ─── Deliver ticket ───────────────────────────────────────────────────────────

  isSystemNote(notes: string | undefined): boolean {
    if (!notes) return false;
    return notes.startsWith('Cambio de estado') || notes.startsWith('Estado pasa de') || notes.includes('Movido en el tablero Kanban');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'RECIBIDO': return 'bg-info';
      case 'EN DIAGNÓSTICO': return 'bg-warning';
      case 'ESPERANDO APROBACIÓN': return 'bg-danger';
      case 'EN REPARACIÓN': return 'bg-primary';
      case 'LISTO PARA ENTREGA': return 'bg-success';
      case 'ENTREGADO': return 'bg-dark';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'RECIBIDO': return 'inbox';
      case 'EN DIAGNÓSTICO': return 'search';
      case 'ESPERANDO APROBACIÓN': return 'pending_actions';
      case 'EN REPARACIÓN': return 'engineering';
      case 'LISTO PARA ENTREGA': return 'local_shipping';
      case 'ENTREGADO': return 'done_all';
      default: return 'info';
    }
  }

  async deliverTicket() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '¿Entregar Equipo?',
        message: 'Se marcará el equipo como ENTREGADO y se dará por cerrado el servicio.',
        confirmText: 'Sí, entregar',
        icon: 'local_shipping',
        color: 'primary'
      }
    });

    const isConfirmed = await dialogRef.afterClosed().toPromise();
    if (!isConfirmed) return;

    this.isUploading = true;
    const deliveryNote = this.noteText.trim() || 'Equipo entregado al cliente por recepción';

    try {
      let photoUrls: string[] = [];
      if (this.pendingFiles.length > 0) {
        const result = await this.cloudinaryService.uploadFiles(this.pendingFiles).toPromise();
        photoUrls = result?.urls ?? [];
      }

      this.ticketsService.updateStatus(this.data.ticket._id, 'ENTREGADO', deliveryNote, photoUrls).subscribe({
        next: () => {
          this.data.ticket.status = 'ENTREGADO';
          if (!this.data.ticket.statusHistory) this.data.ticket.statusHistory = [];
          this.data.ticket.statusHistory.push({
            status: 'ENTREGADO',
            notes: deliveryNote,
            photos: photoUrls,
            createdAt: new Date()
          });
          this.noteText = '';
          this.clearPhotos();
          this.isUploading = false;
          this.cdr.detectChanges();
          this.swal.success('¡Equipo Entregado!', 'El ticket ha sido cerrado correctamente.');
        },
        error: (err) => {
          this.isUploading = false;
          this.swal.error('Error al entregar', err.error?.message);
        }
      });
    } catch (err: any) {
      this.isUploading = false;
      this.swal.error('Error al subir imágenes', 'No se pudieron subir las fotos de evidencia.');
    }
  }

  // ─── Delete note ──────────────────────────────────────────────────────────────

  deleteNote(history: any, index: number) {
    if (!history._id) return;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '¿Eliminar nota?',
        message: 'Esta acción no se puede deshacer',
        confirmText: 'Sí, eliminar',
        icon: 'warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.ticketsService.removeHistory(this.data.ticket._id, history._id).subscribe({
          next: () => {
            this.data.ticket.statusHistory.splice(index, 1);
            this.swal.success('Nota eliminada');
            this.cdr.detectChanges();
          },
          error: () => this.swal.error('Error al eliminar', 'No se pudo eliminar la nota.')
        });
      }
    });
  }
}
