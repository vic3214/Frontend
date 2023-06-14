import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComentarioAnnotatedComponent } from 'src/app/auth/pages/home/home.component';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';
import { DialogOverviewExampleDialog } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-restaurante',
  templateUrl: './dashboard-restaurante.component.html',
  styleUrls: ['./dashboard-restaurante.component.css'],
})
export class DashboardRestauranteComponent implements OnInit {
  editar: Boolean = false;
  reservas: Boolean = true;
  graficas: Boolean = false;
  reservasRestaurante: any[] = [];
  copiaReservas: any[] = [];
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
  imageSrc: any[] = [];
  showImage: boolean[] = [];
  placeholder: string[] = [];
  ordenado = [
    'Más comensales',
    'Menos comensales',
    'Fecha más lejana',
    'Fecha más próxima',
    'Hora y fecha más próxima',
    'Hora y fecha más lejana',
  ];
  estados = ['No Cancelada', 'Cancelada'];
  busquedaForm: FormGroup = this._formBuilder.group({
    fechaAntes: [],
    fechaDespues: [],
    horaAntes: [],
    horaDespues: [],
    comensalesMin: [],
    comensalesMax: [],
    ordenado: [],
    estado: [],
  });

  horario: FormGroup = this._formBuilder.group({
    horario: this._formBuilder.array([
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(''),
          this._formBuilder.control(''),
        ]),
      }),
    ]),
  });

  carta: FormGroup = this._formBuilder.group({
    tematica: [],
    platos: this._formBuilder.array([
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
        fotografiaPlato: ['', this.checkFileSize()],
      }),
    ]),
  });

  checkFileSize(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('fotografiaPlato')?.value.length > 0
        ? { fileSize: true }
        : null;
    };
  }

  hide: boolean = true;
  hideRepetida: boolean = true;
  imagenUrl: any = '';

  ngOnInit(): void {
    if (
      localStorage.getItem('token-restaurante') &&
      this.authService.validarRestauranteToken()
    ) {
      this.authService
        .obtenerDatosRestauranteToken()
        .subscribe(async (res: any) => {
          this.restaurante = res.restaurante;
          this.reservasRestaurante = res.restaurante.reservas;
          this.copiaReservas = res.restaurante.reservas;
          if (
            this.restaurante.fotografia !== undefined &&
            this.restaurante.fotografia !== ''
          ) {
            this.authService
              .recuperarImagen(this.restaurante.fotografia)
              .then((resp) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  this.imagenUrl = e.target!.result;
                };
                reader.readAsDataURL(resp);
              });
          }

          let horarios: any[] = [];

          for (let i = 0; i < this.restaurante.horario.length; i++) {
            const formBuilder = this._formBuilder.group({
              dias: this._formBuilder.control(this.restaurante.horario[i].dias),
              horas: this._formBuilder.array([
                this._formBuilder.control(this.restaurante.horario[i].horas[0]),
                this._formBuilder.control(this.restaurante.horario[i].horas[1]),
              ]),
            });
            horarios.push(formBuilder);
          }

          this.horario = this._formBuilder.group({
            horario: this._formBuilder.array(horarios),
          });

          let platos: any[] = [];

          const categorias = [
            this.restaurante.carta.bebidas,
            this.restaurante.carta.entrantes,
            this.restaurante.carta.primerosPlatos,
            this.restaurante.carta.segundosPlatos,
            this.restaurante.carta.postres,
          ];

          for (let categoria of categorias) {
            for (let i = 0; i < categoria.length; i++) {
              let imagen: any;
              this.showImage.push(false);

              if (
                categoria[i].fotografiaPlato !== undefined &&
                categoria[i].fotografiaPlato !== null &&
                categoria[i].fotografiaPlato !== ''
              ) {
                this.placeholder.push('ImagenPrecargada.jpg');

                await this.authService
                  .recuperarImagen(categoria[i].fotografiaPlato)
                  .then((resp) => {
                    if (resp.size !== 24) {
                      const file = new File(
                        [resp],
                        `imagenPrecargada${i}.jpg`,
                        {
                          type: 'image/jpeg',
                        }
                      );
                      const blob = new Blob([file], { type: file.type });
                      resp = blob;
                    }

                    const reader = new FileReader();
                    reader.onload = (e) => {
                      imagen = e.target!.result;
                      this.imageSrc.push(imagen);
                    };
                    reader.readAsDataURL(resp);
                  });
              } else {
                imagen = 'assets/default-plato.jpg';
                this.imageSrc.push(imagen);
              }

              const formCarta = this._formBuilder.group({
                nombrePlato: this._formBuilder.control(
                  categoria[i].nombrePlato
                ),
                precio: this._formBuilder.control(categoria[i].precio),
                tipo: this._formBuilder.control(categoria[i].tipo),
                fotografiaPlato: this._formBuilder.control(
                  categoria[i].fotografiaPlato
                ),
              });
              platos.push(formCarta);
            }
          }

          this.carta = this._formBuilder.group({
            tematica: [this.restaurante.tematica],
            platos: this._formBuilder.array(platos),
          });
        });
    } else if (!this.authService.validarRestauranteToken()) {
      this.router.navigateByUrl('auth/loginRestaurante');
    }
  }
  get getPlatos() {
    return this.carta.get('platos') as FormArray;
  }

  get horarios(): FormArray {
    return this.horario.get('horario') as FormArray;
  }

  get email() {
    return this.inicioSesion.get('email');
  }

  get password() {
    return this.inicioSesion.get('password');
  }

  aplicarFiltros() {
    const filteredResults = this.reservasRestaurante.filter((reserva) => {
      const date1 = new Date('1970-01-01T' + reserva.hora + ':00Z');
      const date2 = new Date(
        '1970-01-01T' + this.busquedaForm.controls['horaAntes'].value + ':00Z'
      );
      const date3 = new Date(
        '1970-01-01T' + this.busquedaForm.controls['horaDespues'].value + ':00Z'
      );

      const date = new Date(reserva.fecha);

      return (
        (this.busquedaForm.controls['fechaAntes'].value === null ||
          this.compareDates(
            date,
            this.busquedaForm.controls['fechaAntes'].value
          ) <= 0) &&
        (this.busquedaForm.controls['fechaDespues'].value === null ||
          this.compareDates(
            date,
            this.busquedaForm.controls['fechaDespues'].value
          ) > 0) &&
        (this.busquedaForm.controls['horaAntes'].value === null ||
          date1 < date2) &&
        (this.busquedaForm.controls['horaDespues'].value === null ||
          date1 > date3) &&
        (this.busquedaForm.controls['comensalesMin'].value === null ||
          reserva.personas >=
            this.busquedaForm.controls['comensalesMin'].value) &&
        (this.busquedaForm.controls['comensalesMax'].value === null ||
          reserva.personas <=
            this.busquedaForm.controls['comensalesMax'].value) &&
        (this.busquedaForm.controls['estado'].value === null ||
          reserva.estado === this.compruebaCancelada())
      );
    });

    const ordenElegido = this.busquedaForm.controls['ordenado'].value;

    if (ordenElegido === 'Hora y fecha más lejana') {
      filteredResults.sort((a: any, b: any) => {
        const fechaA: any = new Date(a.fecha);
        fechaA.setHours(a.hora.slice(0, 2), a.hora.slice(-2));
        console.log(fechaA);
        const fechaB: any = new Date(b.fecha);
        fechaA.setHours(b.hora.slice(0, 2), b.hora.slice(-2));
        console.log(fechaA);
        return fechaB - fechaA;
      });
    }

    if (ordenElegido === 'Hora y fecha más próxima') {
      filteredResults.sort((a: any, b: any) => {
        const fechaA: any = new Date(a.fecha);
        fechaA.setHours(a.hora.slice(0, 2), a.hora.slice(-2));
        console.log(fechaA);
        const fechaB: any = new Date(b.fecha);
        fechaA.setHours(b.hora.slice(0, 2), b.hora.slice(-2));
        console.log(fechaA);
        return fechaA - fechaB;
      });
    }

    if (ordenElegido === 'Fecha más lejana') {
      filteredResults.sort((a: any, b: any) => {
        const fechaA: any = new Date(a.fecha);
        const fechaB: any = new Date(b.fecha);
        return fechaB - fechaA;
      });
    }

    if (ordenElegido === 'Fecha más próxima') {
      filteredResults.sort((a: any, b: any) => {
        const fechaA: any = new Date(a.fecha);
        const fechaB: any = new Date(b.fecha);
        return fechaA - fechaB;
      });
    }

    if (ordenElegido === 'Más comensales') {
      filteredResults.sort((a: any, b: any) => {
        return b.personas - a.personas;
      });
    }

    if (ordenElegido === 'Menos comensales') {
      filteredResults.sort((a: any, b: any) => {
        return a.personas - b.personas;
      });
    }

    this.reservasRestaurante = filteredResults;
  }

  quitarFiltros() {
    this.reservasRestaurante = this.copiaReservas;
    this.busquedaForm.reset();
  }

  compareDates(date1: Date, date2: Date) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    if (year1 < year2) {
      return -1;
    } else if (year1 > year2) {
      return 1;
    }

    const month1 = date1.getMonth();
    const month2 = date2.getMonth();

    if (month1 < month2) {
      return -1;
    } else if (month1 > month2) {
      return 1;
    }

    const day1 = date1.getUTCDate();
    const day2 = date2.getUTCDate();

    if (day1 < day2) {
      return -1;
    } else if (day1 > day2) {
      return 1;
    }

    return 0;
  }

  compruebaCancelada() {
    if (this.busquedaForm.controls['estado'].value === 'Cancelada') {
      return true;
    }
    return false;
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
    this.placeholder.push('Fotografia del Plato (JPG)');
    this.showImage.push(false);
    const control = <FormArray>this.carta.controls['platos'];
    control.push(
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
        fotografiaPlato: [],
      })
    );
  }

  eliminarPlato(index: number) {
    const control = <FormArray>this.carta.controls['platos'];
    control.removeAt(index);
    this.imageSrc.splice(index, 1);
    this.showImage.slice(index, 1);
  }

  inicioSesion: FormGroup = this._formBuilder.group({
    email: [''],
    password: [''],
    passwordRepetida: [''],
  });

  get getRestaurante() {
    return this.restaurante;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private searchService: SearchService
  ) {}

  logout() {
    this.authService.logOutRestaurante();
    this.router.navigateByUrl('auth/loginRestaurante');
  }

  reservasVisibilidad() {
    this.editar = false;
    this.reservas = true;
    this.graficas = false;
  }
  editarDatos() {
    this.reservas = false;
    this.editar = true;
    this.graficas = false;
  }

  mostrarGraficas() {
    this.reservas = false;
    this.editar = false;
    this.graficas = true;
  }

  eliminarHorario(index: number) {
    const control = <FormArray>this.horario.controls['horario'];
    control.removeAt(index);
  }

  cambiarInicioSesion() {
    if (
      this.inicioSesion.valid &&
      this.inicioSesion.controls['password'].value ===
        this.inicioSesion.controls['passwordRepetida'].value
    ) {
      this.restaurante.email = this.inicioSesion.controls['email'].value;
      this.restaurante.password = this.inicioSesion.controls['password'].value;

      this.authService
        .cambiaPasswordRestaurante(this.restaurante)
        .subscribe((resp) => {
          if (resp.ok) {
            this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
              duration: 3 * 500,
              panelClass: ['snackBar'],
              data: {
                mensaje: 'Datos editados correctamente',
              },
            });
          } else {
            this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
              duration: 3 * 500,
              panelClass: ['snackBar'],
              data: {
                mensaje: resp.msg,
              },
            });
          }
        });
    } else if (
      this.inicioSesion.controls['password'].value !==
      this.inicioSesion.controls['passwordRepetida'].value
    ) {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: 'Las contraseñas no son iguales',
        },
      });
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  editarHorario() {
    if (this.horario.valid) {
      this.restaurante.horario = this.horario.controls['horario'].value;
      this.authService
        .editarRestaurante(this.restaurante)
        .subscribe((resp) => {});
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  async guardarCarta() {
    if (this.carta.valid) {
      const bodyCarta = await this.authService.construyeCarta(this.carta);
      this.restaurante.carta = bodyCarta;

      this.authService
        .editarRestaurante(this.restaurante)
        .subscribe((resp) => {});
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  eliminaCuenta() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de que quieres eliminar tu cuenta?' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.authService
          .eliminarRestaurante(this.restaurante)
          .subscribe((resp) => {});
        localStorage.removeItem('token-restaurante');
        this.router.navigateByUrl('auth/loginRestaurante');
      }
    });
  }

  checkValue(i: number) {
    const fotografiaPlatoValue = this.carta.get([
      'platos',
      i,
      'fotografiaPlato',
    ])!.value;

    if (fotografiaPlatoValue === null) {
      return false;
    }
    return true;
  }

  cancelarReserva(i: number) {
    this.restaurante.reservas[i].estado = true;
    this.searchService
      .getUsuarioPorId(this.restaurante.reservas[i].uidUsuario)
      .subscribe((resp: any) => {
        for (let j = 0; j < resp.usuario.reservas.length; j++) {
          if (
            resp.usuario.reservas[j].uidReserva ===
            this.restaurante.reservas[i]._id
          ) {
            resp.usuario.reservas[j].estado = true;
          }
        }
        this.authService.editaUsuario(resp.usuario).subscribe((resp) => {
          this.authService
            .editarRestaurante(this.restaurante)
            .subscribe((resp) => {});
        });
      });
  }

  eliminarReserva(i: number) {
    this.restaurante.reservas.splice(i, 1);
    this.authService
      .editarRestaurante(this.restaurante)
      .subscribe((resp) => {});
  }

  onFileChange(event: any, index: number) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc[index] = reader.result as string;
      };
    }
  }

  uploadFile(e: any, i: number) {
    const maxSize = 80000;
    if (e.srcElement.files[0] && e.srcElement.files[0].size <= maxSize) {
      const platosArray = this.carta.get('platos') as FormArray;
      platosArray.at(i).get('fotografiaPlato')!.setValue(e.srcElement.files[0]);

      const file = new File(
        [e.srcElement.files[0]],
        `imagenPrecargada${i}.jpg`,
        { type: 'image/jpeg' }
      );
      const blob = new Blob([file], { type: file.type });

      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.imageSrc[i]) {
          this.imageSrc[i] = e!.target!.result;
        } else {
          this.imageSrc.push(e!.target!.result);
        }
      };
      reader.readAsDataURL(blob);
    } else {
      //TODO: Aviso de archivo pesado
      console.log('Archivo muy pesado');
    }
  }
}
