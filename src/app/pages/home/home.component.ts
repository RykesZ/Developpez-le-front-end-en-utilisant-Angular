import { Component, OnInit } from '@angular/core';
import { Observable, of, map, filter } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ResultDistinctParticipationsAndCountries } from 'src/app/core/models/DistinctParticipationsAndCountries';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { ChartDataTemplate } from 'src/app/core/models/ChartData';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  medalsPerCountry$!: Observable<ChartDataTemplate[]>;
  numberOfParticipationsAndCountries$!: Observable<ResultDistinctParticipationsAndCountries>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
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
  }

  viewPC: [number, number] = [700, 400];
  animationPC = true;
  labelsPC = true;
  colorSchemePC = 'cool';
  doughnut = false;

  onSelect(event: any): void {
    const id: number = event.extra.id;
    this.router.navigateByUrl(`details/${id}`);
  }
}
