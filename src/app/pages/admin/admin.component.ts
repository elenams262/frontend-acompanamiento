import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { ContactService } from '../../services/contact.service';

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

  isLoggedIn = false;
  loginData = {
    username: '',
    password: '',
  };

  login() {
    if (
      this.loginData.username === 'admin' &&
      this.loginData.password === 'acompanamientoadmin321'
    ) {
      this.isLoggedIn = true;
    } else {
      alert('Credenciales incorrectas');
    }
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

    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.editingPostId) {
      this.blogService.updatePost(this.editingPostId, formData);
      alert('Publicación actualizada con éxito!');
    } else {
      this.blogService.addPost(formData);
      alert('Publicación creada con éxito!');
    }

    // Reset form
    this.cancelEdit();
  }
}
