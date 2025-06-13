export interface Movimentacao {
    id: number;
    numeroConta: string;
    data: string;
    historico: string;
    valor: number;
    conferido: boolean;

     // Adicionamos essa propriedade para controle interno no frontend
    editandoCampo?: string;
  }