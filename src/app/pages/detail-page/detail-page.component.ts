import { Component, OnInit } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryStats } from 'src/app/core/models/CountryStats';
import { CountrySeries } from 'src/app/core/models/CountrySeries';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  public currentCountryStats$!: Observable<CountryStats>;
  public countryId!: Number;
  public countrySeries!: CountrySeries;
  public multi: CountrySeries[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //Si id de pays inexistant, rediriger vers not found
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.countryId = parseInt(this.route.snapshot.params['id']);
    this.olympicService.getOlympics().subscribe((olympics) => {
      const foundOlympic = olympics.find(
        (olympic) => olympic.id === this.countryId
      );
      if (!foundOlympic) {
        this.router.navigateByUrl('/');
        return;
      }
      this.countrySeries = this.olympicService.getCountrySeries(
        olympics,
        this.countryId
      );
      this.multi.push(this.countrySeries);
    });

    this.currentCountryStats$ = this.olympics$.pipe(
      map((olympics) =>
        this.olympicService.getCountryStats(olympics, this.countryId)
      )
    );
  }

  view: [number, number] = [700, 300];
  // options
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Number of Medals';
  timeline: boolean = true;
  colorSchemePC = 'cool';
}
