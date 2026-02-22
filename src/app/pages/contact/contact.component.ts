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
        this.isSubmitting = false;
        this.submitSuccess = true;
        form.resetForm();
        this.formData.privacyPolicy = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error submitting form', error);
        this.isSubmitting = false;
        this.submitError = true;
      },
    });
  }
}
