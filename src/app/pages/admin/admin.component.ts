import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { ContactService } from '../../services/contact.service';
import { TestimonialService } from '../../services/testimonial.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  blogService = inject(BlogService);
  contactService = inject(ContactService);
  testimonialService = inject(TestimonialService);

  isLoggedIn = false;
  loginData = {
    username: '',
    password: '',
  };

  isSubmitting = false;

  testimonials: any[] = [];

  constructor() {
    // Check if user was already logged in during this session
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
      this.isLoggedIn = true;
      this.loadTestimonials();
    }
  }

  loadTestimonials() {
    this.testimonialService.getAllTestimonials().subscribe({
      next: (data) => (this.testimonials = data),
      error: (err) => console.error('Error loading testimonials', err),
    });
  }

  toggleTestimonialApproval(id: string) {
    this.testimonialService.toggleApproval(id).subscribe({
      next: () => this.loadTestimonials(),
      error: (err) => console.error('Error toggling approval', err),
    });
  }

  deleteTestimonial(id: string) {
    if (confirm('¿Seguro que quieres borrar esta reseña de forma permanente?')) {
      this.testimonialService.deleteTestimonial(id).subscribe({
        next: () => this.loadTestimonials(),
        error: (err) => console.error('Error deleting testimonial', err),
      });
    }
  }

  login() {
    if (
      this.loginData.username === 'admin' &&
      this.loginData.password === 'acompanamientoadmin321'
    ) {
      this.isLoggedIn = true;
      sessionStorage.setItem('isAdminLoggedIn', 'true');
    } else {
      alert('Credenciales incorrectas');
    }
  }

  logout() {
    this.isLoggedIn = false;
    sessionStorage.removeItem('isAdminLoggedIn');
  }

  newPost = {
    title: '',
    content: '',
    imageUrl: '',
    excerpt: '',
  };

  editingPostId: string | null = null;
  imageFile: File | null = null;

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPost.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  editPost(post: any) {
    this.editingPostId = post.id;
    this.newPost = {
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      excerpt: post.excerpt,
    };
    this.imageFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingPostId = null;
    this.newPost = {
      title: '',
      content: '',
      imageUrl: '',
      excerpt: '',
    };
    this.imageFile = null;
  }

  savePost() {
    if (
      !this.newPost.title ||
      !this.newPost.content ||
      (!this.newPost.imageUrl && !this.imageFile)
    ) {
      alert('Por favor completa el título, el contenido y añade una imagen.');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.editingPostId) {
      this.blogService.updatePost(this.editingPostId, formData).subscribe({
        next: () => {
          alert('Publicación actualizada con éxito!');
          this.isSubmitting = false;
          this.cancelEdit();
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al actualizar la publicación. Revisa la consola.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.blogService.addPost(formData).subscribe({
        next: () => {
          alert('Publicación creada con éxito!');
          this.isSubmitting = false;
          this.cancelEdit();
        },
        error: (err: any) => {
          console.error(err);
          alert(
            'Error al crear la publicación. Verifica tu conexión y configuración de base de datos.',
          );
          this.isSubmitting = false;
        },
      });
    }
  }
}
