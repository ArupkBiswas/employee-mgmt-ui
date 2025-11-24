import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Standalone Router
import { RouterOutlet } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Core Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None,

  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class App implements OnInit {

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'joiningDate',
    'jobId',
    'salary',
    'commissionPct',
    'managerId',
    'departmentId',
    'actions'
  ];

  employees: any[] = [];
  private snackBar = inject(MatSnackBar);

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.getEmployees();
  }

  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees();
        this.snackBar.open('Employee added successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  openEditDialog(employee: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees();
        this.snackBar.open('Employee updated successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  openDialogForDelete(employee: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `[ ID : ${employee.id} ] ${employee.firstName} ${employee.lastName}, Are you sure you want to delete this employee ?`,
        employeeId: employee.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.snackBar.open('Employee deleted successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-error']
        });
        this.getEmployees();
      }
    });
  }

  getEmployees() {
    this.http.get<any[]>('http://localhost:8443/api/v1/employee/all').subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Failed to load employee data', err)
    });
  }
}
