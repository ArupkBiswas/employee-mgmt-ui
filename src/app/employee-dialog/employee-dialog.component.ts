import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


interface Roles{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  standalone: true,
  styleUrls: ['./employee-dialog.component.scss'],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatIconModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter() ]
})
export class EmployeeDialogComponent {
  employeeForm: FormGroup;
  private snackBar =  inject(MatSnackBar);
  roles: Roles[] = [
    {value: 'ADMIN', viewValue: 'Admin'},
    {value: 'USER', viewValue: 'User'}
  ];
  hidePassword = true;

  constructor(
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      joiningDate: [''],
      jobId: [''],
      salary: [''],
      commissionPct: [''],
      managerId: [''],
      departmentId: [''],
      role: ['USER', Validators.required],
      password: ['', Validators.required],
      enabled : [true]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: () => {
          this.dialogRef.close(true); // signal success
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert(`Error: ${err.message}`);
        }
      });
    } else {
      this.snackBar.open('Please enter all required fields', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-error']
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
