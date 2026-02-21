import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gift-cards.component.html',
  styleUrl: './gift-cards.component.scss',
})
export class GiftCardsComponent {}
