import { Component, OnInit } from '@angular/core';
import { Observable, of, map, filter, BehaviorSubject } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ResultDistinctParticipationsAndCountries } from 'src/app/core/models/DistinctParticipationsAndCountries';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { ChartDataTemplate } from 'src/app/core/models/ChartData';
import { Participation } from 'src/app/core/models/Participation';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  medalsPerCountry$!: Observable<ChartDataTemplate[]>;
  numberOfParticipationsAndCountries$!: Observable<ResultDistinctParticipationsAndCountries>;
  isSmallScreen = false;
  isMediumScreen = false;
  isLargeScreen = false;
  chartDimensions$: BehaviorSubject<[number, number]> = new BehaviorSubject<
    [number, number]
  >([700, 400]);
  viewPC: [number, number] = [700, 400];
  isDataAvailable = false;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics: Olympic[]) => {
      if (olympics.length > 0) {
        this.isDataAvailable = true;
      }
    });
    this.medalsPerCountry$ = this.olympics$.pipe(
      map((olympics) => {
        return olympics !== undefined
          ? [...olympics].map((olympic) => {
              return {
                id: olympic.id,
                name: olympic.country,
                value: olympic.participations.reduce(
                  (acc: number, curr: Participation) => {
                    return acc + curr.medalsCount;
                  },
                  0
                ),
                extra: { id: olympic.id },
              };
            })
          : [];
      })
    );

    this.numberOfParticipationsAndCountries$ = this.olympics$.pipe(
      filter((olympics) => olympics !== undefined),
      map((olympics) => this.olympicService.calculateDistinctCounts(olympics))
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
      this.viewPC = dimensions; // Update viewPC when chartDimensions$ emits a new value
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

  animationPC = true;
  labelsPC = true;
  colorSchemePC = 'cool';
  doughnut = false;

  onSelect(event: any): void {
    const id: number = event.extra.id;
    this.router.navigateByUrl(`details/${id}`);
  }
}
