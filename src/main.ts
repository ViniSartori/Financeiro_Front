import { bootstrapApplication } from '@angular/platform-browser';
import  { AppComponent} from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { FormatDatePipe } from './app/pipes/format-date.pipe';
import { provideAppInitializer } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Adicione o HttpClient aqui
    provideRouter(routes), // Rotas, caso necessário
    FormatDatePipe,
  ],
}).catch((err) => console.error(err));

