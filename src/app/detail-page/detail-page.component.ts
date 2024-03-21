import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryStats, CountrySeries } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
})
export class DetailPageComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  public currentCountryStats!: CountryStats;
  public countryName!: string;
  public countrySeries!: CountrySeries;
  public multi: CountrySeries[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //Si nom de pays inexistant, rediriger vers not found
  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
    this.olympicService.getOlympics().subscribe((olympics) => {
      this.currentCountryStats = this.olympicService.getCountryStats(
        olympics,
        this.countryName
      );
      this.countrySeries = this.olympicService.getCountrySeries(
        olympics,
        this.countryName
      );
      this.multi.push(this.countrySeries);
    });
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

  onClick(): void {
    this.router.navigateByUrl('');
  }
}
