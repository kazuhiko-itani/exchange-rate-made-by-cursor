export interface ExchangeRateData {
  date: string;
  bitcoin: number;
  dollar: number;
}

export interface SimulationResult {
  jpyAmount: number;
}

export interface SimulationError {
  error: string;
}
