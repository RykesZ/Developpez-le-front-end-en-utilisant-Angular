import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ResultDistinctParticipationsAndCountries } from '../models/DistinctParticipationsAndCountries';
import { CountryStats } from '../models/CountryStats';
import { CountrySeries } from '../models/CountrySeries';

import { Olympic } from '../models/Olympic';
import { ChartDataTemplate } from '../models/ChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  // Charge les données initiales depuis l'URL spécifiée
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

  // Gère les erreurs lors du chargement initial des données
  private handleLoadError() {
    this.olympics$.next([]);
  }

  // Récupère les données des jeux olympiques passés sous forme d'observable
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  // Calcule le nombre total de médailles par pays
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

  // Calcule le nombre de participations distinctes et de pays distincts
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

  // Trouve un pays dans les données des jeux olympiques passés en fonction de son identifiant
  findCountry(data: Olympic[], id: Number): Olympic | undefined {
    return data.find((item) => item.id === id);
  }

  // Récupère les statistiques d'un pays en fonction de son identifiant
  getCountryStats(data: Olympic[], id: Number): CountryStats {
    try {
      const countryData = this.findCountry(data, id);
      if (!countryData || !id) {
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

  // Récupère les données de séries pour un pays en fonction de son identifiant
  getCountrySeries(data: Olympic[], id: Number): CountrySeries {
    try {
      const countryData = this.findCountry(data, id);
      if (!countryData || !id) {
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
