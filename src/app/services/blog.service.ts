import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = 'https://backend-acompanamiento.onrender.com/api/posts';
  private baseUrl = 'https://backend-acompanamiento.onrender.com';

  posts = signal<Post[]>([]);
  private http = inject(HttpClient);

  constructor() {
    this.loadPosts();
  }

  loadPosts() {
    this.http.get<Post[]>(this.apiUrl).subscribe((posts) => {
      this.posts.set(posts);
    });
  }

  getPosts() {
    return this.posts;
  }

  addPost(postData: FormData) {
    this.http.post<Post>(this.apiUrl, postData).subscribe(() => {
      this.loadPosts();
    });
  }

  updatePost(id: string, postData: FormData) {
    this.http.put<Post>(`${this.apiUrl}/${id}`, postData).subscribe(() => {
      this.loadPosts();
    });
  }

  deletePost(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadPosts();
    });
  }
}
