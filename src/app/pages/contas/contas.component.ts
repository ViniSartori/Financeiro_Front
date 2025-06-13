import { Component, OnInit } from '@angular/core';
import { ContaService } from '../../service/conta.service'; // Importar o serviço
import { ContaDto } from '../../models/ContaDto'; // Definindo o modelo Conta
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Conta } from '../../models/Conta';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ContasComponent implements OnInit {
  conta: ContaDto = {
    id: 0,
    banco: '',
    agencia: '',
    numeroConta: '',
    ativo: true,
  };
  contas: ContaDto[] = [];
  message: string | null = null;
  editIndex: number | null = null;

  constructor(private contaService: ContaService, private cdr:ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.getContas();
  }

  navegarParaMovimentacoes(): void {
    this.router.navigate(['']);
  }

  onSubmit(): void {
    this.contaService.addConta(this.conta).subscribe((response) => {
      this.message = 'Conta cadastrada com sucesso!';
      this.getContas(); // Atualiza a lista de contas
      this.resetForm();
    });
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.conta = {
      id: 0,
      banco: '',
      agencia: '',
      numeroConta: '',
      ativo: true,
    };
    this.message = null;
  }

  getContas(): void {
    this.contaService.getAllContas().subscribe(
      (contas) => {
        this.contas = contas;
        console.log(this.contas);
        this.cdr.detectChanges(); // Atualiza manualmente o template
      },
      (error) => {
        console.error('Erro ao carregar contas:', error);
      });
  }

  onEdit(index: number) {
    this.editIndex = index;
  }

  editConta(index: number): void {
    const contaEditada = this.contas[index]; 
    this.contaService.editConta(contaEditada).subscribe(
      (response) => {
        this.message = 'Conta atualizada com sucesso!';
        setTimeout(() => (this.message = null), 3000); // Oculta a mensagem após 3 segundos
        this.editIndex = null; 
      },
      (error) => {
        console.error('Erro ao atualizar conta:', error);
        this.message = 'Erro ao atualizar conta.';
      }
    );
  }
  

  onCancelEdit() {
    // Recarregue os dados da conta original do backend, se necessário
    this.editIndex = null;
  }
}

