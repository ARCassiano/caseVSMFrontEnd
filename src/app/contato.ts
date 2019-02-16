import {Endereco} from './Endereco';

export class Contato {
    id: number;
    nome: string;
    cpf: string;
    data_nascimento: Date;
    email: string;
    telefone: string; 
    enderecos: Endereco[];
}