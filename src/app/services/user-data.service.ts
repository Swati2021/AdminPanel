import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  constructor(private http: HttpClient) { }

  getUsersData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
}
