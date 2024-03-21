import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ResultDistinctParticipationsAndCountries,
  CountryStats,
  CountrySeries,
} from '../models/Participation';
import { Olympic } from '../models/Olympic';
import { ChartDataTemplate } from '../models/ChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap({
        next: (value) => this.olympics$.next(value),
        error: (error) => {
          // Log error
          console.error(error);
          // Handle error
          this.handleLoadError();
        },
      }),
      catchError((error) => {
        // Log error
        console.error(error);
        // Handle error
        this.handleLoadError();
        // Return an empty observable to continue the error stream
        return of([]);
      })
    );
  }

  private handleLoadError() {
    this.olympics$.next([]);
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  calculateCumulativeMedals(data: Olympic[]): ChartDataTemplate[] {
    const result: ChartDataTemplate[] = [];

    data.forEach((countryData) => {
      let cumulativeMedals = 0;

      countryData.participations.forEach((participation) => {
        cumulativeMedals += participation.medalsCount;
      });

      result.push({
        name: countryData.country,
        value: cumulativeMedals,
      });
    });

    return result;
  }

  calculateDistinctCounts(
    data: Olympic[]
  ): ResultDistinctParticipationsAndCountries {
    const distinctParticipations = new Set<number>();
    const distinctCountries = new Set<string>();

    data.forEach((country) => {
      country.participations.forEach((participation) => {
        distinctParticipations.add(participation.id);
      });

      distinctCountries.add(country.country);
    });

    return {
      distinctParticipations: distinctParticipations.size,
      distinctCountries: distinctCountries.size,
    };
  }

  findCountry(data: Olympic[], countryName: string): Olympic | undefined {
    return data.find(
      (item) => item.country.toLowerCase().split(' ').join('') === countryName
    );
  }

  //A améliorer pour que la méthode utilise getOlympics() plutôt que de recevoir la donnée en paramètre
  getCountryStats(data: Olympic[], countryName: string): CountryStats {
    try {
      const countryData = this.findCountry(data, countryName);
      console.log(countryData);
      console.log(countryName);
      if (!countryData || !countryName) {
        throw new Error('Missing parameter to get country stats.');
      }

      const participations = countryData.participations.length;
      const totalMedalsCount = countryData.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );
      const totalAthleteCount = countryData.participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );

      return {
        countryFullName: countryData.country,
        participations: participations,
        totalMedalsCount: totalMedalsCount,
        totalAthleteCount: totalAthleteCount,
      };
    } catch (error) {
      throw error;
    }
  }

  getCountrySeries(data: Olympic[], countryName: string): CountrySeries {
    try {
      const countryData = this.findCountry(data, countryName);
      if (!countryData || !countryName) {
        throw new Error('Missing parameter to get country series.');
      }
      const series: ChartDataTemplate[] = [];
      countryData.participations.forEach((participation) => {
        series.push({
          name: participation.year.toString(),
          value: participation.medalsCount,
        });
      });

      return { name: countryData.country, series };
    } catch (error) {
      throw error;
    }
  }
}
