import { Component } from '@angular/core';
import { Measurement } from 'src/models';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database"
import { map } from 'rxjs/operators';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private historyRef?: AngularFireList<Measurement>;
  public history?: Measurement[]
  public humidity?: ChartConfiguration<'line'>['data'];
  public ph?: ChartConfiguration<'line'>['data'];

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    // scales: {
    //   x: {
    //     type: 'time',
    //     time: {
    //       unit: 'day',
    //       displayFormats: {
    //         day: 'MMM D' // Specify the date format here
    //       },
    //     },
    //   },
      
    // },
  };
  public lineChartLegend = true;

  constructor(db: AngularFireDatabase) {
    this.historyRef = db.list<Measurement>("/measurements")
  }
  ngOnInit(): void {
    this.historyRef?.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const values: Measurement = c.payload.val() as Measurement
            return values
          });
        })
      )
      .subscribe((data) => {
        this.history = data;
        this.humidity = {
          labels: data.map((it) => it.date).slice(0, 150),
          datasets: [
            {
              data: data.map((it) => it.humidity).slice(0, 150) as number[],
              label: 'Humidity',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(0,255,0,0.3)'
            },


          ]
        }

        this.ph = {
          labels: data.map((it) => it.date).slice(0, 150),
          datasets: [
            {
              data: data.map((it) => it.ph).slice(0, 150) as number[],
              label: 'PH',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(5,90,5,0.3)'
            },


          ]
        }


      })
  }
}
