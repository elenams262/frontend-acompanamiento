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
    commercial: false,
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

    const consentText = this.formData.commercial 
      ? '[Consentimiento comercial: SÍ - Desea recibir comunicaciones comerciales]' 
      : '[Consentimiento comercial: NO - Solo acepta la política de privacidad para la consulta]';
      
    const finalMessage = `${this.formData.message}\n\n${consentText}`;

    const dataToSend = {
      ...this.formData,
      message: finalMessage
    };

    this.contactService.addContact(dataToSend).subscribe({
      next: (response) => {
        // Now try to send email using EmailJS from the frontend browser
        try {
          const templateParams = {
            subject: dataToSend.subject,
            name: dataToSend.name,
            email: dataToSend.email,
            phone: dataToSend.phone,
            message: dataToSend.message,
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
    this.formData.commercial = false;

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.submitSuccess = false;
    }, 5000);
  }
}
