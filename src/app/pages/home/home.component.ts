import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Testimonial, TestimonialService } from '../../services/testimonial.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private intervalId: any;
  testimonialService = inject(TestimonialService);

  newTestimonial = { name: '', text: '' };
  isSubmitting = false;
  submitMessage = '';

  services = [
    {
      title: 'Acompañamiento Profesional Hospitalario',
      description:
        'Asistencia especializada y compañía constante para tus seres queridos durante sus estancias hospitalarias, garantizando su bienestar y tu tranquilidad.',
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
      link: '/servicios',
    },
    {
      title: 'Acompañamiento Domiciliario',
      description:
        'Apoyo integral en el hogar, desde ayuda con las tareas diarias hasta compañía humana que combate la soledad y fomenta la autonomía.',
      image: 'assets/acompanamiento-domiciliario.jpg',
      link: '/sad-atencion-personal',
    },
    {
      title: 'Acompañamiento Urgente',
      description:
        'Respuesta rápida y flexible ante imprevistos. Estamos disponibles cuando surge una necesidad inesperada de cuidado y atención.',
      image: 'assets/acompanamiento-urgente.png',
      link: '/contacto',
    },
    {
      title: 'Acompañamiento de Ocio Saludable',
      description:
        'Promovemos el bienestar emocional a través de paseos, actividades culturales y sociales adaptadas, evitando el aislamiento.',
      image: 'assets/ocio-saludable.jpg',
      link: '/servicios',
    },
  ];

  testimonials = [
    {
      name: 'Carmen Ochoa Jordi',
      text: 'La profesionalidad unida a la gran humanidad de Mercedes ha sido para mí una ayuda y un apoyo imprescindible en la atención a mi marido. Eso solo lo puede hacer una buena persona además de su eficiencia. Muchas gracias.',
    },
    {
      name: 'Eugenia',
      text: 'Cuando se viven momentos difíciles se intenta pasarlos sin ayuda. Pero si te ofrece ayuda una persona que es Mercedes y la aceptas, descubres que es necesaria y esos momentos difíciles mejorando, tienes que dar las gracias.\nAntonio y Eugenia',
    },
    {
      name: 'Lucía',
      text: 'Solo puedo decir que recomiendo a Merche 100%. Es a la única persona que he confiado a mi bebé desde casi que nació. Súper profesional y tiene un cariño y un tacto con mi niño que de verdad me deja tranquila cuando le está cuidando. Muy cercana y ya es casi como de la familia.',
    },
    {
      name: 'Gloria',
      text: 'No doy más de 5 pirque no se puede.\nMe enfrentó sola a una cirugía un poco complicada y en el Hospital de Villalba encontré un flyer de A.S.\nMi primera experiencia fue ayer y no pudo ser mejor.\nMe acompañó Mercedes que pronto se hizo para mi más que una simple acompañante,se interesó de verdad y el trato fue inmejorable',
    },
    {
      name: 'Yolanda',
      text: 'Mi agradecimiento a Acompañamiento Sanitario, y en concreto a Mercedes.\nDurante mi estancia en el hospital, Mercedes demostró ser una magnífica profesional con amplia experiencia en su trabajo. En todo momento, se anticipó a los requerimientos que iba planteando el hospital, e incluso iba adelantándose a mis propias necesidades, transmitiéndome con ello una tranquilidad y una confianza plena en ella.\nEn la faceta humana, Mercedes me hizo sentir como si estuviera acompañada de mi mejor amiga o de uno de mis familiares. Su sola presencia, con su amabilidad, sencillez y cercanía lo dicen todo de ella.\nEspero no volver a verme en estas circunstancias en mucho tiempo, pero si lo volviera a necesitar, sin duda alguna volvería a recurrir a Acompañamiento Sanitario, por su excelente profesionalidad y su calidez humana.',
    },
    {
      name: 'Isabel Jiménez',
      text: 'Quiero dar las gracias a Mercedes,  por el magnífico trato que tuvo con mi madre de 87 años. Ha sido una experiencia muy buena, era la.primera vez que mi madre estuvo con una cuidadora.  Gracias nuevamente',
    },
    {
      name: 'Elena',
      text: 'Tranquilidad, cercanía, familiar y muy profesional',
    },
    {
      name: 'Pilar',
      text: 'Merche es totalmente maravillosa. Me faltan estrellas para valorarla. 100% tranquilidad con ella.',
    },
    {
      name: 'Dori',
      text: 'Muy recomendable, muy buen trato, seriedad, muy resolutivos, 10 de 10, muchas gracias por vuestra atención',
    },
    {
      name: 'Juan Luis',
      text: 'Atención muy buena recomendado todo lo que te dicen lo hacen pero para mejor',
    },
  ];
  ngOnInit() {
    this.startRotation();
    this.loadApprovedTestimonials();
  }

  loadApprovedTestimonials() {
    this.testimonialService.getApprovedTestimonials().subscribe({
      next: (data) => {
        // Merge hardcoded with database testimonials
        const dbTestimonials = data.map((t) => ({
          name: t.name,
          text: t.text,
        }));
        this.testimonials = [...this.testimonials, ...dbTestimonials];
      },
      error: (err) => {
        console.error('Error loading testimonials', err);
      },
    });
  }

  submitTestimonial() {
    if (!this.newTestimonial.name || !this.newTestimonial.text) {
      this.submitMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    this.testimonialService.createTestimonial(this.newTestimonial).subscribe({
      next: () => {
        this.submitMessage =
          '¡Gracias por compartir tu experiencia! Tu reseña está pendiente de aprobación.';
        this.newTestimonial = { name: '', text: '' };
        this.isSubmitting = false;
      },
      error: () => {
        this.submitMessage =
          'Hubo un error al enviar la reseña. Por favor, inténtalo de nuevo más tarde.';
        this.isSubmitting = false;
      },
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startRotation() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.currentSlide.update((v) => (v + 1) % this.services.length);
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startRotation();
  }
}
