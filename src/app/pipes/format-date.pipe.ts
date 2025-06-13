import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})

@Injectable({ providedIn: 'root' })
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
      const dia = String(parsedDate.getDate()).padStart(2, '0');
      const mes = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const ano = parsedDate.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // Tenta reconhecer formatos conhecidos
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/); // ISO YYYY-MM-DD
    const customMatch = value.match(/(\d{2})T\d{2}:\d{2}:\d{2}\/(\d{2})\/(\d{4})/); // "03T00:00:00/02/2025"

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }

    if (customMatch) {
      const [, day, month, year] = customMatch;
      return `${day}/${month}/${year}`;
    }

    return value; // Retorna como está se não reconhecer o formato
  }
}

