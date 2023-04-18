import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
})
export class RestauranteComponent implements OnInit {
  id: string = '';
  restaurante: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.searchService.getRestaurantePorId(this.id).subscribe((res: any) => {
      this.restaurante = res.restaurante;
      console.log('Restaurante cargado:', res.restaurante);
    });
  }

  comentarioGroup: FormGroup = this._formBuilder.group({
    comentario: '',
  });

  addComentario() {
    const comentario = this.comentarioGroup.get('comentario')!.value;
    console.log(comentario);
    this.restaurante.comentarios.push(comentario);
    this.comentarioGroup.get('comentario')!.reset();
    //TODO: Guardar en base de datos
  }

  // TODO: Hacer reservas
}
