import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditDialogService } from './edit.employee.service'; // Assuming you have a service to handle employee data

@Component({
  selector: 'app-edit-dialog',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  employeeForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private employeeService: EditDialogService // Assuming you have a service to handle employee data
  ) {
    this.employeeForm = this.fb.group({
      id: [this.data.id],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      phoneNumber: [this.data.phoneNumber],
      joiningDate: [this.data.joiningDate, Validators.required],
      jobId: [this.data.jobId],
      salary: [this.data.salary],
      commissionPct: [this.data.commissionPct],
      managerId: [this.data.managerId],
      departmentId: [this.data.departmentId]
    });
  }

  // Method to handle form submission
  onSubmit(employeeForm: any): void {
    const id = this.data.id; // Get the employee ID from the data passed to the dialog
    if (!id) {
      console.error('Employee ID is required for editing.');
      return;
    }
    if (this.employeeForm.valid) {
      this.employeeService.editEmployee(id, employeeForm).subscribe({
        next: (response) => {
          console.log('Employee edited successfully:', response);
          alert('Employee edited successfully!');
          this.dialogRef.close(true); // signal success
        },
        error: (err) => {
          console.error('Error editing employee:', err);
          alert('Failed to edit employee. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
