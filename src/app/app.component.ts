import { Component } from '@angular/core';
import { Measurement } from 'src/models';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database"
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  private historyRef?: AngularFireList<Measurement>;
  public values : string[] = ["humidity","lightRadiation","temperature","gazPresence","ph"]
  public history?: Measurement[]
  public humidity?: ChartConfiguration<'line'>['data'];
  public lightRadiation?: ChartConfiguration<'line'>['data']
  public temperature?: ChartConfiguration<'line'>['data']
  public gazPresence?: ChartConfiguration<'line'>['data']
  public ph?: ChartConfiguration<'line'>['data'];
  public activeIndex:number = 0;

  private humidityThreshold = 2000
  private lightRadiationThreshold = 20
  private temperatureThreshold = 30
  private gazThreshold = 0
  private phThreshold = 12

  public humidityAltert : boolean = false
  public lightRadiationAltert : boolean = false
  public temperatureAltert : boolean = false
  public gazAltert : boolean = false
  public phAltert : boolean = false

  //
  

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
    const path = "mesures-final/history"
    this.historyRef = db.list<Measurement>(path)
  }

  formatDate = (dt: Date) => moment(dt).format("MMM D HH:mm");

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
        let len = data.length
        this.history = data;
        this.humidity = {
          labels: data.map((it) => it.date).slice(len - 50).map(this.formatDate),
          datasets: [
            {
              data: data.map((it) => it.humidity).slice(len - 50) as number[],
              label: 'Humidity',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(0,255,0,0.3)'
            },


          ]
        }

        this.lightRadiation = {
          labels: data.map((it) => it.date).slice(len - 50).map(this.formatDate),
          datasets: [
            {
              data: data.map((it) => it.lightRadiation).slice(len - 50) as number[],
              label: 'Light Radiation',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(5,80,0,0.3)'
            },


          ]
        }


        this.temperature = {
          labels: data.map((it) => it.date).slice(len - 50).map(this.formatDate),
          datasets: [
            {
              data: data.map((it) => it.temperature).slice(len - 50) as number[],
              label: 'Temperature',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(5,90,5,0.3)'
            },


          ]
        }

        this.gazPresence = {
          labels: data.map((it) => it.date).slice(len - 50).map(this.formatDate),
          datasets: [
            {
              data: data.map((it) => it.gazDetected).slice(len - 50) as number[],
              label: 'Gaz Presence',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(5,90,5,0.3)'
            },


          ]
        }

        this.ph = {
          labels: data.map((it) => it.date).slice(len - 50).map(this.formatDate),
          datasets: [
            {
              data: data.map((it) => it.ph).slice(len - 50) as number[],
              label: 'PH',
              fill: true,
              tension: 0.5,
              borderColor: 'black',
              backgroundColor: 'rgba(5,90,5,0.3)'
            },


          ]
        }

        if(data[data.length-1].humidity< this.humidityThreshold){
          this.humidityAltert=true
        }else{
          this.humidityAltert=false

        }

        if(data[data.length-1].lightRadiation< this.lightRadiationThreshold){
          this.lightRadiationAltert=true
        }else{
          this.lightRadiationAltert=false

        }

        if(data[data.length-1].temperature> this.temperatureThreshold){
          this.temperatureAltert=true
        }else{
          this.temperatureAltert=false

        }

        if(data[data.length-1].gazDetected> this.gazThreshold){
          this.gazAltert=true
        }else{
          this.gazAltert=false

        }

        if(data[data.length-1].ph> this.phThreshold){
          this.phAltert=true
        }else{
          this.phAltert=false

        }


      })
  }
}


// let date = new Date("2023-10-05T10:38:18.125Z")
// let i = 299;

// const simulateSend = () => {


//   date.setMinutes(date.getMinutes() + (i * 5))
//   const data = {
//     i: {
//       "date": date,
//       "humidity": (Math.round((Math.random() * 20))),
//       "lightRadiation": (Math.round((Math.random() * 30))),
//       "nitrateContent": (Math.round((Math.random() * 20))),
//       "ph": (Math.round((Math.random() * 14))),
//       "potassiumContent": (Math.round((Math.random() * 16))),
//       "saltContent": (Math.round((Math.random() * 15)))
//     }
//   };


//   const requestConfig = {
//     method: 'PATCH',
//     url: 'https://smart-plant-fbfdb-default-rtdb.europe-west1.firebasedatabase.app/test.json',
//     headers: {
//       'Content-Type': 'application/json',
//       // Add any other headers if needed
//     },
//     body: {
//       mode: 'raw',
//       raw: JSON.stringify(data) // Replace with your request payload
//     }
//   };

//   pm.sendRequest(requestConfig, function (error, response) {
//     if (error) {
//       console.error('Error:', error);
//     } else {
//       console.log('Response:', response.text());
//     }
//   });
// }

// setInterval(simulateSend, 300000);