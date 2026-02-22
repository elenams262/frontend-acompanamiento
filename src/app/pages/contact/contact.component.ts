import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import emailjs from '@emailjs/browser';

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
        // Now try to send email using EmailJS from the frontend browser
        try {
          const templateParams = {
            subject: this.formData.subject,
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            message: this.formData.message,
          };

          emailjs
            .send(
              'service_p4cnkfu', // Service ID
              'template_q3vdqoi', // Template ID
              templateParams,
              'vmg5kc-DRY-DAumJD', // Public Key
            )
            .then(
              () => {
                console.log('Correo enviado con éxito mediante EmailJS');
                this.finalizeSubmit(form);
              },
              (error) => {
                console.error('Error enviando a EmailJS desde frontend', error);
                this.finalizeSubmit(form); // Fallback: still show success to user if saved in DB
              },
            );
        } catch (e) {
          console.error('Excepción al enviar con EmailJS: ', e);
          this.finalizeSubmit(form);
        }
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
