import { Component, inject, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Import the necessary modules and components
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, 
    ReactiveFormsModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    routes,
    CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})

// Main application component
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
  private snackBar =  inject(MatSnackBar);

  ngOnInit() {
    this.getEmployees();
  }

  // Inject MatDialog to open dialogs
  constructor(private dialog: MatDialog, private http: HttpClient) {}

  // Open dialog to add new employee
  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees(); // Refresh list
        this.snackBar.open('Employee added successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  // Open edit dialog
  openEditDialog(employee: any) {
    
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '600px',
      data: employee // Pass the employee data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees(); // Refresh list after edit
        this.snackBar.open('Employee updated successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-success']
        });
      }
    });
  }

  // Open confirmation dialog for deletion
  openDialogForDelete(employee: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: `[ ID : ${employee.id} ] ${employee.firstName} ${employee.lastName}, Are you sure you want to delete this employee ?`, employeeId: employee.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.snackBar.open('Employee deleted successfully', 'Close', {
          duration: 6000,
          panelClass: ['snackbar-error']
        });
        this.getEmployees(); // Refresh list after confirmation
      }
    });
  }

  // Fetch employees from the server
  getEmployees() {
    this.http.get<any[]>('http://localhost:8443/api/v1/employee/all').subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Failed to load employee data', err)
    });
  }
}

