import { Component, isStandalone, LOCALE_ID, OnInit, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { ContaService } from '../../service/conta.service';
import { Movimentacao } from '../../models/Movimentacao';
import { ContaDto } from '../../models/ContaDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { Saldos } from '../../models/Saldos';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr)

@Component({
  selector: 'app-movimentacoes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './movimentacoes.component.html',
  styleUrl: './movimentacoes.component.css',
  providers: [DatePipe, FormatDatePipe, {provide: LOCALE_ID, useValue: 'pt'}],
})
export class CashFlowComponent implements OnInit {
  contas: ContaDto[] = [];
  movimentacoes: Movimentacao[] = [];
  numeroContaSelecionada: number | null = null;
  mesSelecionado: number = new Date().getMonth() + 1; // Mês atual
  anoSelecionado: number = new Date().getFullYear();  // Ano atual
  saldos: Saldos | null = null;
 
  

  novaMovimentacao: Partial<Movimentacao> = {
    data: '',
    historico: '',
    valor: 0,
  };

  meses = [...Array(12)].map((_, i) => ({
    nome: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
    valor: i + 1,
  }));

  anos = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  repetir: number = 1;
  repeticaoMeses = Array.from({ length: 12 }, (_, i) => i + 1);
  message: string | null = null;

  constructor(
    private contaService: ContaService,
    private movimentacaoService: MovimentacaoService,
    private datePipe: DatePipe,
    private router: Router,
    private formatDatePipe: FormatDatePipe,
  ) {}

  
  ngOnInit(): void {
    this.carregarContas();
  }

  navegarParaCadastroConta(): void {
    this.router.navigate(['/conta']);
  }

  carregarContas(): void {
    this.contaService.getAllContas().subscribe({
      next: (contas) => (this.contas = contas),
      error: (error) => console.error('Erro ao carregar contas:', error),
    });
  }

  onContaChange(): void {
    this.carregarMovimentacoes();
    this.carregarSaldos();
    if (!this.carregarMovimentacoes.length) {
      this.movimentacoes = [];
    }
  }

  onFiltroChange(): void {
    this.carregarMovimentacoes();
    this.carregarSaldos();
  }

  carregarMovimentacoes(): void {
    if (this.numeroContaSelecionada) {
      this.movimentacaoService
        .getMovimentacoesPorConta(this.numeroContaSelecionada, this.mesSelecionado, this.anoSelecionado)
        .subscribe({
          next: (movimentacoes) => {
            this.movimentacoes = movimentacoes.map((mov) => ({
              ...mov,
              data: this.formatDatePipe.transform(mov.data),
              conferido: mov.conferido === true, // Converte qualquer valor truthy (1, true) para true
              editandoCampo: undefined,
            }));
            console.log('📦 Movimentações carregadas:', this.movimentacoes);

          },
          error: (error) => console.error('Erro ao carregar movimentações:', error),
        });
    } else {
      this.movimentacoes = [];
    }
  }
  
  salvarMovimentacao(): void {
    if (!this.numeroContaSelecionada || !this.novaMovimentacao.data) return;

    const formattedDate = this.datePipe.transform(this.novaMovimentacao.data, 'yyyy-MM-dd');
    if (!formattedDate) return;

    const novasDatas = this.calcularNovasDatas(formattedDate, this.repetir);
    let movimentacoesSalvas = 0;

    novasDatas.forEach((data) => {
      const novaMov = { ...this.novaMovimentacao, data, numeroConta: this.numeroContaSelecionada?.toString() };

      this.movimentacaoService.salvarMovimentacao(novaMov).subscribe({
        next: (response) => {
          if (response.status) {
            movimentacoesSalvas++;
            if (movimentacoesSalvas === novasDatas.length) this.carregarMovimentacoes();
          } else {
            console.error('Erro ao salvar movimentação:', response.mensagem);
          }
          this.carregarSaldos();
        },
        error: (error) => console.error('Erro ao salvar movimentação:', error),
      });
    });
        
        this.message = 'Movimentações salvas com sucesso!';
        this.novaMovimentacao = { data: '', historico: '', valor: 0 };
      }
     
  calcularNovasDatas(data: string, repetir: number): string[] {
    const [ano, mes, dia] = data.split('-').map(Number);
    let novaData = new Date(ano, mes - 1, dia);  // Meses em JS começam do zero
  
    // Array para armazenar todas as novas datas
    let novasDatas: string[] = [];
  
    // Adiciona a primeira data sem alterações
    novasDatas.push(novaData.toISOString().split('T')[0]);
  
    // Cria as novas datas de acordo com o valor de 'repetir'
    for (let i = 1; i < repetir; i++) {
      novaData.setMonth(novaData.getMonth() + 1);  // Adiciona 1 mês
      novasDatas.push(novaData.toISOString().split('T')[0]);
    }
  
    return novasDatas; // Retorna um array com todas as datas calculadas
  }

 
  excluirMovimentacao(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;

    this.movimentacaoService.excluirMovimentacao(id).subscribe({
      next: () => {
        this.movimentacoes = this.movimentacoes.filter((mov) => mov.id !== id);
        this.carregarSaldos();
      },
      error: (error) => console.error('Erro ao excluir movimentação:', error),
    });
  }


  editarCampo(mov: any, campo: string): void {
    // Define qual campo está sendo editado
    mov.editandoCampo = campo;
  }
  
  salvarEdicao(mov: any): void {
    if (!mov) {
      console.error('❌ Erro: Objeto mov undefined', mov);
      return;
    }

    let dataConvertida: Date | null;

    // Verifica se a data já está no formato 'yyyy-MM-dd'
    if (mov.data.includes('-')) {
        dataConvertida = new Date(mov.data); // Já está no formato correto
    } else {
        dataConvertida = this.converterData(mov.data); // Converter se estiver no formato 'dd/MM/yyyy'
    }

    if (!dataConvertida) {
      console.error('❌ Erro ao converter a data:', mov.data);
      return;
    }

    // Formatar a data corretamente para o backend
    const datePipe = new DatePipe('en-US');
    const formattedDate = dataConvertida.toISOString().split('T')[0]; // Garante yyyy-MM-dd

    // Criar um novo objeto garantindo que a data esteja no formato correto
    const movFormatado = { ...mov, data: formattedDate };

    console.log('📤 Enviando para API:', movFormatado);

    this.movimentacaoService.editarMovimentacao(movFormatado).subscribe(
      (response) => {
        console.log('✅ Movimentação atualizada com sucesso!', response);

        this.carregarMovimentacoes();
        this.carregarSaldos();
        Object.assign(mov, response.dados);
        mov.editandoCampo = null;
      },
      (error) => {
        console.error('❌ Erro ao editar movimentação:', error);
        console.log('🛠️ Erros detalhados:', error.error.errors);
      }
    );
}

  
  // Função para converter string no formato dd/MM/yyyy para Date
 converterData(dataStr: string): Date | null {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        const dia = partes[0].padStart(2, '0');  // Garante dois dígitos
        const mes = partes[1].padStart(2, '0');  // Garante dois dígitos
        const ano = partes[2];

        // Criar uma string ISO yyyy-MM-dd e converter para Date sem fuso horário
        const dataISO = `${ano}-${mes}-${dia}T00:00:00.000Z`; // Mantendo 12:00 para evitar mudanças
        return new Date(dataISO);
    }
    return null;
}

carregarSaldos(): void {
  if (this.numeroContaSelecionada) {
    this.movimentacaoService
      .getSaldos(this.numeroContaSelecionada, this.mesSelecionado, this.anoSelecionado)
      .subscribe({
        next: (saldos) => {
          this.saldos  = {
            ...saldos,
            data: this.formatDatePipe.transform(saldos.data)};
          console.log('📊 Saldos carregados:', this.saldos);
        },
        error: (error) => console.error('Erro ao carregar saldos:', error),
      });
    }
  }
}

  
