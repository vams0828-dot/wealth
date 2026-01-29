
export interface FinancialData {
  currentSavings: number;
  annualIncome: number;
  annualExpenses: number;
  investmentReturn: number;
  inflationRate: number;
  fireMultiplier: number;
  manualFireTarget: number; // Added for explicit goal setting
}

export interface CalculationResult {
  fireTarget: number;
  yearsToFire: number;
  daysToFire: number;
  yearlyData: ChartDataPoint[];
  canReachFire: boolean;
}

export interface ChartDataPoint {
  year: number;
  assets: number;
  target: number;
}
