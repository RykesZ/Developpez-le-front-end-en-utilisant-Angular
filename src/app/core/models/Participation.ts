// TODO: create here a typescript interface for a participation
/*
example of participation:
{
    id: 1,
    year: 2012,
    city: "Londres",
    medalsCount: 28,
    athleteCount: 372
}
*/
import { ChartDataTemplate } from './ChartData';

export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

export interface ResultDistinctParticipationsAndCountries {
  distinctParticipations: number;
  distinctCountries: number;
}

export interface CountryStats {
  countryFullName: string;
  participations: number;
  totalMedalsCount: number;
  totalAthleteCount: number;
}

export interface CountrySeries {
  name: string;
  series: ChartDataTemplate[];
}
