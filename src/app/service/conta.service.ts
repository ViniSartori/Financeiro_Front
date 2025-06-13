import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContaDto } from '../models/ContaDto';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/Response';


@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private apiUrl = environment.UrlApi // URL da API

  constructor(private http: HttpClient) {}

  getAllContas(): Observable<ContaDto[]> {
    return this.http.get<ApiResponse<ContaDto[]>>(this.apiUrl).pipe(
      map((response) => response.dados) // Extrai o array de contas do campo 'dados'
    );
  }

  addConta(conta: ContaDto): Observable<ContaDto> {
    return this.http.post<ContaDto>(this.apiUrl, conta);
  }

  editConta(conta: ContaDto): Observable<ApiResponse<ContaDto>> {
    return this.http.put<ApiResponse<ContaDto>>(`${this.apiUrl}/${conta.id}`, conta);
  }
  
}