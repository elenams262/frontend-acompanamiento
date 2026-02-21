import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-checks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-checks.component.html',
  styleUrl: './service-checks.component.scss',
})
export class ServiceChecksComponent {}
