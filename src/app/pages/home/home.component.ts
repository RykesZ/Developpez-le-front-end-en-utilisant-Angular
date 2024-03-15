import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {
  CountryData,
  ChartDataTemplate,
  ResultDistinctParticipationsAndCountries,
} from 'src/app/core/models/Participation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<CountryData[]>;
  public medalsPerCountry!: ChartDataTemplate[];
  public numberOfParticipationsAndCountries!: ResultDistinctParticipationsAndCountries;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((olympics) => {
      this.medalsPerCountry =
        this.olympicService.calculateCumulativeMedals(olympics);
      this.numberOfParticipationsAndCountries =
        this.olympicService.calculateDistinctCounts(olympics);
    });
  }

  viewPC: [number, number] = [700, 400];
  animationPC = true;
  labelsPC = true;
  colorSchemePC = 'cool';
  doughnut = false;

  onSelect(data: string): void {
    this.router.navigateByUrl(
      `details/${JSON.parse(JSON.stringify(data))
        .name.toLowerCase()
        .split(' ')
        .join('')}`
    );
  }
}
