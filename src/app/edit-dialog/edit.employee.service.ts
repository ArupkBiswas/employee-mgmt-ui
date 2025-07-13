import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EditDialogService {
  constructor(private http: HttpClient) {}

  editEmployee(id: number, employee: any): Observable<any> {
    return this.http.patch<any>(`http://localhost:8443/api/v1/employee/update/${id}`, employee, {observe: 'response'});
  }
}