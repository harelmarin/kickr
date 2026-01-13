export interface Competition {
  id: string;
  name: string;
  logoUrl?: string;
  country?: string;
  externalId?: number;
  type?: 'LEAGUE' | 'CUP';
  standingsJson?: string;
}