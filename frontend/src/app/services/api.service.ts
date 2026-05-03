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
      username,
      password
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, userData);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Token ${token}`
    });
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/departments/`, {
      headers: this.getAuthHeaders()
    });
  }

  createDepartment(departmentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/departments/`, departmentData, {
      headers: this.getAuthHeaders()
    });
  }

  updateDepartment(id: number, departmentData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/departments/${id}/`, departmentData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/departments/${id}/`, {
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

  updateResearcher(id: number, researcherData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/researchers/${id}/`, researcherData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteResearcher(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/researchers/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  getConferences(): Observable<any> {
    return this.http.get(`${this.baseUrl}/conferences/`, {
      headers: this.getAuthHeaders()
    });
  }

  createConference(conferenceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/conferences/`, conferenceData, {
      headers: this.getAuthHeaders()
    });
  }

  updateConference(id: number, conferenceData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/conferences/${id}/`, conferenceData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteConference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/conferences/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  attendConference(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/conferences/${id}/attend/`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  leaveConference(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/conferences/${id}/leave/`, {}, {
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

  updatePaper(id: number, paperData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/papers/${id}/`, paperData, {
      headers: this.getAuthHeaders()
    });
  }

  deletePaper(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/papers/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }
}