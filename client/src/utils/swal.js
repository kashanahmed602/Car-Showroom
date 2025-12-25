import Swal from 'sweetalert2';

// Success notification
export const showSuccess = (message, title = 'Success!') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#2563eb',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading'
    }
  });
};

// Error notification
export const showError = (message, title = 'Error!') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading'
    }
  });
};

// Warning notification
export const showWarning = (message, title = 'Warning!') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading'
    }
  });
};

// Info notification
export const showInfo = (message, title = 'Info') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading'
    }
  });
};

// Confirmation dialog
export const showConfirm = (message, title = 'Are you sure?', confirmText = 'Yes', cancelText = 'Cancel') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading',
      cancelButton: 'font-heading'
    }
  });
};

// Delete confirmation (red danger style)
export const showDeleteConfirm = (message, title = 'Delete Confirmation') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'font-body',
      title: 'font-heading',
      confirmButton: 'font-heading',
      cancelButton: 'font-heading'
    }
  });
};

// Loading notification
export const showLoading = (message = 'Please wait...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'font-body',
      title: 'font-heading'
    }
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Toast notification (non-blocking)
export const showToast = (message, icon = 'success', position = 'top-end') => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'font-body'
    }
  });

  return Toast.fire({
    icon: icon,
    title: message
  });
};

