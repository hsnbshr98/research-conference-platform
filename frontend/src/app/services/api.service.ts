import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getApiRoot(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, {
      username: username,
      password: password
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, userData);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Token ${token}`
    });
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/departments/`, {
      headers: this.getAuthHeaders()
    });
  }

  getResearchers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/researchers/`, {
      headers: this.getAuthHeaders()
    });
  }
  createResearcher(researcherData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/researchers/`, researcherData, {
    headers: this.getAuthHeaders()
  });
}

  getConferences(): Observable<any> {
    return this.http.get(`${this.baseUrl}/conferences/`, {
      headers: this.getAuthHeaders()
    });
  }

  getPapers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/papers/`, {
      headers: this.getAuthHeaders()
    });
  }
  createPaper(paperData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/papers/`, paperData, {
    headers: this.getAuthHeaders()
  });
}
}