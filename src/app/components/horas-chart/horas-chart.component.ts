import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-horas-chart',
  templateUrl: './horas-chart.component.html',
  styleUrls: ['./horas-chart.component.css'],
})
export class HorasChartComponent implements OnInit {
  constructor(private authService: AuthService) {}
  mostrarGrafico = false;

  ngOnInit(): void {
    this.authService.obtenerDatosRestauranteToken().subscribe((resp: any) => {
      const intervalos = resp.restaurante.reservas.map((reserva: any) => {
        let intervaloIzq = reserva.hora.slice(0, -2) + '00';
        let hora = parseInt(intervaloIzq.slice(0, 2)) + 1;
        if (hora === 24) {
          hora = 0;
        }
        let horaCadena = hora.toString();
        if (horaCadena.length < 2) {
          horaCadena = '0' + horaCadena;
        }

        let intervaloDer = horaCadena + intervaloIzq.slice(0 + 2);
        const intervaloCompleto = intervaloIzq + '-' + intervaloDer;
        return intervaloCompleto;
      });

      if (intervalos.length !== 0) {
        this.mostrarGrafico = true;
      }

      intervalos.sort((a: any, b: any) => {
        let aStartHour = parseInt(a.slice(0, 2));
        let bStartHour = parseInt(b.slice(0, 2));
        return aStartHour - bStartHour;
      });

      let counts = intervalos.reduce((acc: any, val: any) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

      let unique = intervalos.filter(
        (val: any, i: any) => intervalos.indexOf(val) === i
      );

      this.barChartData.labels = unique;
      this.barChartData.datasets[0].data = Object.values(counts);
      this.chart?.update();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
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
      {
        data: [],
        label: 'Número de reservas por horario',
        backgroundColor: 'purple',
      },
    ],
  };
}
