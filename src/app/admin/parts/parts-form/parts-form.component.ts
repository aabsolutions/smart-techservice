import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PartsService, Part } from '../services/parts.service';
import { SwalService } from '@core/service/swal.service';
import { CatalogsService } from '@shared/services/catalogs.service';
import { SuppliersService, Supplier } from '../../suppliers/services/suppliers.service';
import { SuppliersFormComponent } from '../../suppliers/suppliers-form/suppliers-form.component';
import { PromptDialogComponent } from '@shared/components/prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'app-parts-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './parts-form.component.html'
})
export class PartsFormComponent implements OnInit {
  partsService = inject(PartsService);
  swal = inject(SwalService);
  fb = inject(FormBuilder);
  catalogsService = inject(CatalogsService);
  suppliersService = inject(SuppliersService);
  dialog = inject(MatDialog);

  partForm: FormGroup;
  isEdit = false;
  categories: any[] = [];
  suppliers: Supplier[] = [];

  constructor(
    public dialogRef: MatDialogRef<PartsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { part?: Part }
  ) {
    this.isEdit = !!data?.part;
    this.partForm = this.fb.group({
      code: [data?.part?.code || '', [Validators.required]],
      name: [data?.part?.name || '', [Validators.required]],
      description: [data?.part?.description || ''],
      price: [data?.part?.price || 0, [Validators.required, Validators.min(0)]],
      cost: [data?.part?.cost || 0, [Validators.min(0)]],
      stock: [data?.part?.stock || 0, [Validators.min(0)]],
      category: [data?.part?.category || ''],
      supplierId: [data?.part?.supplierId || null],
      isActive: [data?.part?.isActive ?? true]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.suppliersService.findAll().subscribe(res => this.suppliers = res);
  }

  loadCategories() {
    this.catalogsService.findByCategory('PART_CATEGORY').subscribe((res: any[]) => {
      this.categories = res;
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: '400px',
      data: { title: 'Nueva Categoría de Pieza', placeholder: 'Nombre de la categoría' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.trim()) {
        this.catalogsService.create({ category: 'PART_CATEGORY', name: result.trim() }).subscribe({
          next: () => this.loadCategories(),
          error: (err) => this.swal.error('Error', err.error?.message || 'No se pudo guardar la categoría')
        });
      }
    });
  }

  addSupplier() {
    const dialogRef = this.dialog.open(SuppliersFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  onSubmit() {
    if (this.partForm.invalid) return;

    const partData = this.partForm.value;

    if (this.isEdit && this.data.part?._id) {
      this.partsService.update(this.data.part._id, partData).subscribe({
        next: () => {
          this.swal.success('Actualizado', 'La pieza ha sido actualizada correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => this.swal.error('Error', err.error?.message || 'No se pudo actualizar la pieza')
      });
    } else {
      this.partsService.create(partData).subscribe({
        next: () => {
          this.swal.success('Creado', 'La pieza ha sido creada correctamente');
          this.dialogRef.close(true);
        },
        error: (err) => this.swal.error('Error', err.error?.message || 'No se pudo crear la pieza')
      });
    }
  }
}
