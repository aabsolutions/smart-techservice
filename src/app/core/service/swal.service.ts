import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

// Force SweetAlert container above Angular Material overlays
const SWAL_Z = '999999';

/** Returns only the didOpen callback – typed as a Pick to avoid polluting union inference */
function zIdx(): Pick<SweetAlertOptions, 'didOpen'> {
  return {
    didOpen: () => {
      const el = document.querySelector('.swal2-container') as HTMLElement | null;
      if (el) el.style.zIndex = SWAL_Z;
    }
  };
}

/** Merge base options with the z-index callback, typed as SweetAlertOptions */
function swalOpts(base: Record<string, unknown>): SweetAlertOptions {
  // Append to CDK overlay if it exists so it shares the same stacking context as Material dialogs
  const overlay = document.querySelector('.cdk-overlay-container');
  const target = overlay ? (overlay as HTMLElement) : 'body';

  return Object.assign({ target }, base, zIdx()) as SweetAlertOptions;
}

@Injectable({ providedIn: 'root' })
export class SwalService {

  /** Toast-style success notification (top-right, auto-closes) */
  success(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      icon: 'success',
      title,
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }));
  }

  /** Toast-style error notification (top-right, auto-closes) */
  error(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      icon: 'error',
      title,
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    }));
  }

  /** Toast-style warning notification */
  warning(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      icon: 'warning',
      title,
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    }));
  }

  /** Toast-style info notification */
  info(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      icon: 'info',
      title,
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
    }));
  }

  /** Destructive confirm dialog – resolves true if user confirms */
  confirm(
    title: string,
    text: string,
    confirmText = 'Sí, continuar',
    cancelText = 'Cancelar'
  ): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }));
  }

  /** Neutral question dialog */
  question(
    title: string,
    text: string,
    confirmText = 'Sí',
    cancelText = 'Cancelar'
  ): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }));
  }

  /** Inline prompt for short text input */
  prompt(title: string, placeholder = ''): Promise<SweetAlertResult> {
    return Swal.fire(swalOpts({
      title,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value: string) => {
        if (!value?.trim()) return 'Este campo es requerido';
        return undefined;
      },
    }));
  }
}
