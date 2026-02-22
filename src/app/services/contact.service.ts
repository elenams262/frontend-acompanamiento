import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://backend-acompanamiento.onrender.com/api/contact';

  contacts = signal<Contact[]>([]);
  private http = inject(HttpClient);

  constructor() {
    this.loadContacts();
  }

  loadContacts() {
    this.http.get<Contact[]>(this.apiUrl).subscribe(
      (contacts) => this.contacts.set(contacts),
      (error) => console.error('Error loading contacts', error),
    );
  }

  addContact(contactData: Partial<Contact>) {
    return this.http.post<Contact>(this.apiUrl, contactData);
  }

  getConfig() {
    return this.http.get<{ accessKey: string }>(
      'https://backend-acompanamiento.onrender.com/api/config/web3forms',
    );
  }

  deleteContact(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(
      () => this.loadContacts(),
      (error) => console.error('Error deleting contact', error),
    );
  }
}
