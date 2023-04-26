export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public fechaNacimiento: Date,
    public password?: string,
    public fotografia?: string,
    public listaRestaurantesFavoritos?: string,
    public listaOpiniones?: string,
    public id?: string
  ) {}
}
