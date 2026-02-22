import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactService = inject(ContactService);

  formData = {
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    privacyPolicy: false,
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit(form: NgForm) {
    if (form.invalid || !this.formData.privacyPolicy) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    this.contactService.addContact(this.formData).subscribe({
      next: (response) => {
        // Now try to send email using Web3Forms from the frontend browser
        this.contactService.getConfig().subscribe({
          next: async (config) => {
            if (config.accessKey) {
              try {
                await fetch('https://api.web3forms.com/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body: JSON.stringify({
                    access_key: config.accessKey,
                    subject: `Nuevo mensaje de contacto: ${this.formData.subject}`,
                    from_name: this.formData.name,
                    email: this.formData.email,
                    message: `Has recibido un nuevo mensaje de contacto.\n\nNombre: ${this.formData.name}\nTeléfono: ${this.formData.phone}\nEmail: ${this.formData.email}\nAsunto: ${this.formData.subject}\n\nMensaje:\n${this.formData.message}`,
                  }),
                });
              } catch (e) {
                console.error('Error enviando a web3forms desde frontend', e);
              }
            }

            this.finalizeSubmit(form);
          },
          error: () => this.finalizeSubmit(form),
        });
      },
      error: (error) => {
        console.error('Error submitting form to db', error);
        this.isSubmitting = false;
        this.submitError = true;
      },
    });
  }

  private finalizeSubmit(form: NgForm) {
    this.isSubmitting = false;
    this.submitSuccess = true;
    form.resetForm();
    this.formData.privacyPolicy = false;

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.submitSuccess = false;
    }, 5000);
  }
}
