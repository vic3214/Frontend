import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-restaurante',
  templateUrl: './dashboard-restaurante.component.html',
  styleUrls: ['./dashboard-restaurante.component.css'],
})
export class DashboardRestauranteComponent implements OnInit {
  editar: Boolean = false;
  reservas: Boolean = true;
  reservasRestaurante: any[] = [];
  restaurante: any = {};
  dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
    'Festivos',
  ];
  options = ['Entrante', 'Primero', 'Segundo', 'Postre', 'Bebida'];

  ngOnInit(): void {
    if (
      localStorage.getItem('token-restaurante') &&
      this.authService.validarRestauranteToken()
    ) {
      this.authService.obtenerDatosRestauranteToken().subscribe((res: any) => {
        this.restaurante = res.restaurante;
        this.reservasRestaurante = res.restaurante.reservas;
        console.log('reservas', this.reservasRestaurante);
      });
    }
  }

  get getPlatos() {
    return this.carta.get('platos') as FormArray;
  }

  get horarios(): FormArray {
    return this.horario.get('horario') as FormArray;
  }

  agregarHorario() {
    this.horarios.push(
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(null),
          this._formBuilder.control(null),
        ]),
      })
    );
  }

  agregarPlato() {
    const control = <FormArray>this.carta.controls['platos'];
    control.push(
      this._formBuilder.group({ nombrePlato: [], precio: [], tipo: [] })
    );
  }

  eliminarPlato(index: number) {
    const control = <FormArray>this.carta.controls['platos'];
    control.removeAt(index);
  }

  ubicacion: FormGroup = this._formBuilder.group({
    ciudad: [],
    calle: [],
    numero: [],
  });

  inicioSesion: FormGroup = this._formBuilder.group({
    nombre: [],
    correo: [],
    password: [],
  });

  carta: FormGroup = this._formBuilder.group({
    tematica: [],
    platos: this._formBuilder.array([
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
      }),
    ]),
  });

  horario: FormGroup = this._formBuilder.group({
    horario: this._formBuilder.array([
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(null),
          this._formBuilder.control(null),
        ]),
      }),
    ]),
  });

  get getRestaurante() {
    return this.restaurante;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder
  ) {}

  logout() {
    this.authService.logOutRestaurante();
    this.router.navigateByUrl('auth/loginRestaurante');
  }

  reservasVisibilidad() {
    this.editar = false;
    this.reservas = true;
  }
  editarDatos() {
    this.reservas = false;
    this.editar = true;
  }
}
