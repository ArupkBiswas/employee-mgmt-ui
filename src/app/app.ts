import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
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

  ngOnInit() {
    this.getEmployees();
  }

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmployees(); // Refresh list
      }
    });
  }

  // deleteEmployee(employeeId: number) {
  //   this.http.delete(`http://localhost:8443/api/v1/employee/${employeeId}`).subscribe({
  //     next: () => this.getEmployees(), // Refresh list after deletion
  //     error: (err) => console.error('Failed to delete employee', err)
  //   });
  // }
//   deleteEmployee(employeeId: number) {
//   this.http.delete(`http://localhost:8443/api/v1/employee/${employeeId}`, { observe: 'response' })
//     .subscribe({
//       next: (response) => {
//         console.log('Deleted successfully:', response.status); // Expect 204
//         this.getEmployees();
//       },
//       error: (err) => {
//         console.error('Delete failed:', err.status, err.message);
//         alert(`Error ${err.status}: ${err.message}`);
//       }
//     });
// }
  openDialogForDelete(employeeId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this employee?', employeeId : employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.getEmployees(); // Refresh list after confirmation
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

