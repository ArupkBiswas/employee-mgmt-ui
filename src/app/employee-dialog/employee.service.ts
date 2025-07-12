import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  addEmployee(employee: any): Observable<any> {
    return this.http.post('/api/employees', employee); // replace with your backend endpoint
  }
}