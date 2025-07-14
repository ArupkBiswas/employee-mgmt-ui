import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from './confirmation-dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  standalone: true,
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialog {
  constructor(
    private dialog: MatDialog, 
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
    public dialogRef: MatDialogRef<ConfirmationDialog>
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { employeeId: this.data.employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onConfirm(result.employeeId); // Handle confirmation logic
        console.log('Employee deleted');
      } else {
        // Handle cancellation logic here
        console.log('Deletion cancelled');
      }
    });
  }

  onConfirm(employeeId: number) {
  this.http.delete(`http://localhost:8443/api/v1/employee/delete/${employeeId}`, { observe: 'response' })
    .subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response.status);
        this.dialog.closeAll(); // old: doesn't return result

        // New: return something to the calling component
        // Better: use dialogRef.close() instead of dialog.closeAll()
        this.dialogRef.close('deleted');
      },
      error: (err) => {
        console.error('Delete failed:', err.status, err.message);
        alert(`Error ${err.status}: ${err.message}`);
      }
    });
}

  onCancel(): void {
    // Logic for canceling deletion
    this.dialog.closeAll(); // Close the dialog
  }
  // Additional methods can be added as needed
  // to handle the confirmation dialog's behavior
  // such as closing the dialog or performing actions based on user input.
}
