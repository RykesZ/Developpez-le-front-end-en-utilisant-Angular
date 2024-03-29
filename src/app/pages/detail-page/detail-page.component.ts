import { Component, OnInit } from '@angular/core';
import { Observable, of, map, tap, BehaviorSubject } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryStats } from 'src/app/core/models/CountryStats';
import { CountrySeries } from 'src/app/core/models/CountrySeries';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

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
  isSmallScreen = false;
  isMediumScreen = false;
  isLargeScreen = false;
  chartDimensions$: BehaviorSubject<[number, number]> = new BehaviorSubject<
    [number, number]
  >([700, 400]);
  view: [number, number] = [700, 400];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver
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

    this.breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XSmall,
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
      ])
      .subscribe((result: BreakpointState) => {
        if (
          result.breakpoints[Breakpoints.Small] ||
          result.breakpoints[Breakpoints.XSmall] ||
          result.breakpoints[Breakpoints.HandsetPortrait] ||
          result.breakpoints[Breakpoints.HandsetLandscape]
        ) {
          this.chartDimensions$.next([280, 200]);
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.chartDimensions$.next([525, 300]);
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.chartDimensions$.next([700, 500]);
        }
        this.updateScreenSizes(result);
      });

    this.chartDimensions$.subscribe((dimensions) => {
      this.view = dimensions; // Update viewPC when chartDimensions$ emits a new value
    });
  }

  private updateScreenSizes(result: BreakpointState): void {
    this.isSmallScreen =
      result.breakpoints[Breakpoints.Small] ||
      result.breakpoints[Breakpoints.XSmall] ||
      result.breakpoints[Breakpoints.HandsetPortrait] ||
      result.breakpoints[Breakpoints.HandsetLandscape];
    this.isMediumScreen = result.breakpoints[Breakpoints.Medium];
    this.isLargeScreen = result.breakpoints[Breakpoints.Large];
  }

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
