import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-reservas-chart',
  templateUrl: './reservas-chart.component.html',
  styleUrls: ['./reservas-chart.component.css'],
})
export class ReservasChartComponent implements OnInit {
  constructor(
    private searchService: SearchService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService.obtenerDatosRestauranteToken().subscribe((resp: any) => {
      this.searchService.getAllRestaurantes().subscribe((resp1) => {
        const datos = resp1.restaurantes.map((restaurante: any) => {
          return [restaurante.vecesReservado, restaurante.nombre];
        });
        const sortedNumbers = datos.sort((a: any, b: any) => b[0] - a[0]);
        const topThree = sortedNumbers.slice(0, 3);
        this.barChartData.labels = [
          topThree[0][1],
          topThree[1][1],
          topThree[2][1],
          resp.restaurante.nombre + ' (Tú)',
        ];
        this.barChartData.datasets[0].data = [
          topThree[0][0],
          topThree[1][0],
          topThree[2][0],
          resp.restaurante.vecesReservado,
        ];
        this.chart?.update();
      });
    });
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: false,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Número de reservas', backgroundColor: 'green' },
    ],
  };
}
