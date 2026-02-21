import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  blogService = inject(BlogService);
  posts = this.blogService.getPosts(); // Signal
}
