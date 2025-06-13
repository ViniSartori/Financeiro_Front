import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimentacao } from '../models/Movimentacao';
import { MovimentacaoEditar } from '../models/MovimentacaoEditar';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/Response';
import { Saldos } from '../models/Saldos';


@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private apiUrlMov = environment.UrlApiMov;

  private apiUrlSaldos = environment.UrlApiSaldos;

  constructor(private http: HttpClient) {}

  getMovimentacoesPorConta(numeroConta: number, mes: number, ano: number): Observable<Movimentacao[]> {
    return this.http.get<ApiResponse<Movimentacao[]>>(
      `${this.apiUrlMov}/MovimentacaoId?movimentacoesNumeroConta=${numeroConta}&mes=${mes}&ano=${ano}`
    ).pipe(map((response) => response.dados));
  }
 

// Método para salvar a movimentação
 salvarMovimentacao(movimentacao: Partial<Movimentacao>): Observable<ApiResponse<Movimentacao>> {
  return this.http.post<ApiResponse<Movimentacao>>(`${this.apiUrlMov}/cadastrar`, movimentacao);
}

editarMovimentacao(mov: MovimentacaoEditar): Observable<ApiResponse<MovimentacaoEditar>> {
  return this.http.put<ApiResponse<MovimentacaoEditar>>(`${this.apiUrlMov}/editar`, mov);
}


excluirMovimentacao(Id: number): Observable<any> {
  return this.http.delete(`${this.apiUrlMov}/remover?Id=${Id}`);
}

getSaldos(numeroConta: number, mes: number, ano: number): Observable<Saldos> {
  return this.http.get<Saldos>(
    `${this.apiUrlSaldos}?numeroConta=${numeroConta}&ano=${ano}&mes=${mes}`
  )
}
}