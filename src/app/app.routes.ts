import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SadComponent } from './pages/sad/sad.component';
import { ServicesComponent } from './pages/services/services.component';
import { GiftCardsComponent } from './pages/gift-cards/gift-cards.component';
import { ServiceChecksComponent } from './pages/service-checks/service-checks.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AvisoLegalComponent } from './pages/aviso-legal/aviso-legal.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { PoliticaCookiesComponent } from './pages/politica-cookies/politica-cookies.component';
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent, title: 'Inicio' },
  { path: 'quienes-somos', component: AboutComponent, title: 'Quienes Somos' },
  { path: 'sad-atencion-personal', component: SadComponent, title: 'SAD - Atención Personal' },
  { path: 'servicios', component: ServicesComponent, title: 'Servicios' },
  { path: 'tarjetas-regalo', component: GiftCardsComponent, title: 'Tarjetas Regalo' },
  { path: 'cheques-servicio', component: ServiceChecksComponent, title: 'Cheques Servicio' },
  { path: 'blog', component: BlogComponent, title: 'Blog' },
  { path: 'contacto', component: ContactComponent, title: 'Contacto' },
  { path: 'admin', component: AdminComponent, title: 'Admin Blog' },
  { path: 'aviso-legal', component: AvisoLegalComponent, title: 'Aviso Legal' },
  {
    path: 'politica-privacidad',
    component: PoliticaPrivacidadComponent,
    title: 'Política de Privacidad',
  },
  {
    path: 'politica-cookies',
    component: PoliticaCookiesComponent,
    title: 'Política de Cookies',
  },
  { path: '**', redirectTo: 'inicio' },
];
