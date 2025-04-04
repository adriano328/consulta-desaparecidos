import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../../shared/interface/pessoa.interface';
import { CardModule } from 'primeng/card';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SexoEnum } from '../../shared/enum/sexoEnum';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PessoasService } from '../../shared/service/pessoas.service';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { StatusEnum } from '../../shared/enum/statusEnum';
import { Router } from '@angular/router';
import { NavegacaoUtils } from '../../shared/util/redireciona';
import { MessageService } from '../../shared/service/message.service';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-listagem-desaparecidos',
  standalone: true,
  imports: [CardModule, NgFor, NgIf, PaginatorModule, IconFieldModule, InputTextModule,
    ReactiveFormsModule, InputIconModule, CommonModule, ButtonModule, HttpClientModule, DropdownModule],
  providers: [PessoasService],
  templateUrl: './listagem-desaparecidos.component.html',
  styleUrl: './listagem-desaparecidos.component.scss'
})
export class ListagemDesaparecidosComponent implements OnInit {

  pessoas: Pessoa[] = [];
  first: number = 0;
  rows: number = 10;
  sexo = SexoEnum;
  status = StatusEnum;
  form!: FormGroup;
  totalElements!: number;

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.consultarPessoas();
    });
    this.consultarPessoas()
  }

  constructor(
    private formBuilder: FormBuilder,
    private pessoasService: PessoasService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      nome: [''],
      sexo: [''],
      idadeMinima: [''],
      idadeMaxima: [''],
      status: ['']
    })
  }

  consultarPessoas(event?: PaginatorState) {
    this.pessoasService.carregaPessoas(this.form.value.nome, this.form.value.idadeMinima, this.form.value.idadeMaxima, this.form.value.sexo, this.form.value.status, event?.page ? event?.page : 0, event?.rows ? event?.rows : 10).subscribe({
      next: (res) => {
        this.pessoas = res.content;
        this.totalElements = res.totalElements;
      },
      error: (e) => {
        this.messageService.error(e?.error?.detail)
      }
    })
  }

  limpar() {
    this.form.patchValue({
      nome: '', sexo: '', idadeMinima: '',
      idadeMaxima: '', status: ''
    });
    this.consultarPessoas()
  }

  redireciona(individuo: number) {
    NavegacaoUtils.redireciona(this.router, 'detalhamento-desaparecido', individuo);
  }
}
