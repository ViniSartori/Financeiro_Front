export interface ApiResponse<T> {
    mensagem: string;
    status: boolean;
    dados: T;
}
