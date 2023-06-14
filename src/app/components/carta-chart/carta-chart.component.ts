import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carta-chart',
  templateUrl: './carta-chart.component.html',
  styleUrls: ['./carta-chart.component.css'],
})
export class CartaChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  datos: any = [];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.obtenerDatosRestauranteToken().subscribe((resp) => {
      const datosRestaurante = resp.restaurante.carta;
      this.datos = [
        datosRestaurante.entrantes.length,
        datosRestaurante.primerosPlatos.length,
        datosRestaurante.segundosPlatos.length,
        datosRestaurante.postres.length,
        datosRestaurante.bebidas.length,
      ];
      this.radarChartData.datasets[0].data = this.datos;
      this.chart?.update();
    });
  }

  // Radar
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'white',
        },
      },
    },
  };
  public radarChartLabels: string[] = [
    'Entrantes',
    'Primeros Platos',
    'Segundos Platos',
    'Postres',
    'Bebidas',
  ];

  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        data: [],
        label: 'Número de platos',
      },
    ],
  };
  public radarChartType: ChartType = 'radar';
}
