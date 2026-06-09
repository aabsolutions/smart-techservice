import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';

import { TicketsService } from '../services/tickets.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { ClientsService } from '../../services/clients.service';
import { UsersManagementService as UsersService } from '../../../superadmin/services/users.service';
import { ClientDialogComponent } from '../../clients/client-dialog/client-dialog.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  router = inject(Router);
  
  ticketsService = inject(TicketsService);
  catalogsService = inject(CatalogsService);
  clientsService = inject(ClientsService);
  usersService = inject(UsersService);
  swal = inject(SwalService);

  ticketForm!: FormGroup;

  clients: any[] = [];
  technicians: any[] = [];
  brands: any[] = [];
  equipmentTypes: any[] = [];

  serviceTypes = ['Reparación', 'Mantenimiento', 'Diagnóstico'];
  repairTypes = ['Garantía', 'Fuera de garantía', 'Cortesía'];

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.ticketForm = this.fb.group({
      clientId: ['', Validators.required],
      assignedTechnicianId: [''],
      physicalOrder: [''],
      devices: this.fb.array([this.createDeviceGroup()])
    });
  }

  get devices(): FormArray {
    return this.ticketForm.get('devices') as FormArray;
  }

  createDeviceGroup(): FormGroup {
    return this.fb.group({
      brand: ['', Validators.required],
      equipmentType: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: [''],
      issueDescription: ['', Validators.required],
      accessories: [''],
      serviceType: ['', Validators.required],
      repairType: ['', Validators.required],
      observations: ['']
    });
  }

  addDevice() {
    this.devices.push(this.createDeviceGroup());
  }

  removeDevice(index: number) {
    if (this.devices.length > 1) {
      this.devices.removeAt(index);
    }
  }

  loadData() {
    this.clientsService.getAll().subscribe((res: any[]) => this.clients = res);
    
    // Fetch technicians directly via the API query
    this.usersService.getAll({ role: 'TECHNICIAN' }).subscribe((res: any[]) => {
      this.technicians = res;
    });

    this.catalogsService.findByCategory('BRAND').subscribe((res: any[]) => this.brands = res);
    this.catalogsService.findByCategory('EQUIPMENT_TYPE').subscribe((res: any[]) => this.equipmentTypes = res);
  }

  openClientDialog() {
    const dialogRef = this.dialog.open(ClientDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadData();
    });
  }

  addCatalog(category: string) {
    this.swal.prompt(`Nuevo valor para ${category === 'BRAND' ? 'Marca' : 'Tipo de Equipo'}`).then(result => {
      if (result.isConfirmed && result.value?.trim()) {
        this.catalogsService.create({ category, name: result.value.trim() }).subscribe({
          next: () => this.loadData(),
          error: (err) => this.swal.error('Error al guardar', err.error?.message || 'Error guardando catálogo')
        });
      }
    });
  }

  onSubmit() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    
    this.ticketsService.create(this.ticketForm.value).subscribe({
      next: (res) => {
        this.swal.success('¡Orden creada!', 'La orden de servicio fue registrada exitosamente.');
        this.router.navigate(['/receptionist/tickets']);
      },
      error: (err) => {
        this.swal.error('Error al crear la orden', err.error?.message || 'Intente de nuevo.');
      }
    });
  }
}
