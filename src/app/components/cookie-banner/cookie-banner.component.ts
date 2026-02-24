import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent implements OnInit {
  isVisible = false;
  showConfig = false;

  // Solo hay 1 tipo de cookie por defecto (técnica), pero por si alguna vez añadimos otras,
  // dejamos el molde preparado.
  preferences = {
    analytics: false,
    marketing: false,
  };

  ngOnInit() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.isVisible = true;
    }
  }

  acceptAll() {
    this.preferences.analytics = true;
    this.preferences.marketing = true;
    this.saveToStorage('accepted');
  }

  rejectAll() {
    this.preferences.analytics = false;
    this.preferences.marketing = false;
    this.saveToStorage('rejected');
  }

  saveConfig() {
    this.saveToStorage('configured');
  }

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }

  private saveToStorage(status: string) {
    localStorage.setItem('cookieConsent', status);
    localStorage.setItem('cookiePreferences', JSON.stringify(this.preferences));
    this.isVisible = false;
  }
}
