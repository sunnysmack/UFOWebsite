export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AlienResponse {
  slogan: string;
  rationale: string;
}

export interface ThreatAnomaly {
  object: string;
  designation: string;
  threatLevel: 'LOW' | 'MODERATE' | 'CRITICAL' | 'EXISTENTIAL';
  description: string;
}

export interface ThreatAnalysisResponse {
  sectorStatus: string;
  anomalies: ThreatAnomaly[];
}
