import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  CountryData,
  ChartDataTemplate,
  ResultDistinctParticipationsAndCountries,
  CountryStats,
  CountrySeries,
} from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<CountryData[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<CountryData[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<CountryData[]> {
    return this.olympics$.asObservable();
  }

  calculateCumulativeMedals(data: CountryData[]): ChartDataTemplate[] {
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
    data: CountryData[]
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

  findCountry(
    data: CountryData[],
    countryName: string
  ): CountryData | undefined {
    return data.find(
      (item) => item.country.toLowerCase().split(' ').join('') === countryName
    );
  }

  //A améliorer pour que la méthode utilise getOlympics() plutôt que de recevoir la donnée en paramètre
  getCountryStats(data: CountryData[], countryName: string): CountryStats {
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

  getCountrySeries(data: CountryData[], countryName: string): CountrySeries {
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
