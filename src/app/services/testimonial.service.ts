import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Testimonial {
  id?: string;
  name: string;
  text: string;
  approved?: boolean;
  date?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private apiUrl = `https://backend-acompanamiento.onrender.com/api/testimonials`;

  constructor(private http: HttpClient) {}

  getApprovedTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/approved`);
  }

  getAllTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/all`);
  }

  createTestimonial(testimonial: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.post<Testimonial>(this.apiUrl, testimonial);
  }

  toggleApproval(id: string): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.apiUrl}/${id}/approve`, {});
  }

  deleteTestimonial(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
