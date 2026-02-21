import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sad.component.html',
  styleUrl: './sad.component.scss',
})
export class SadComponent {}
