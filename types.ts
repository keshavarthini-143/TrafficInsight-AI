
export enum CongestionLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface TrafficAnalysis {
  location: string;
  lat: number;
  lng: number;
  congestionLevel: CongestionLevel;
  roadColor: 'green' | 'orange' | 'red';
  confidence: string;
  message: string;
  explanation: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}
