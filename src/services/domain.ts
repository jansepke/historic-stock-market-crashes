export interface IndexData {
  date: Date;
  price: number;
}

export interface Crash {
  startDate: Date;
  endDate: Date;
  startPrice: number;
  endPrice: number;
  daysDown: number;
  percent: number;
  daysDone: number;
  doneDate: Date | null;
  percentUp2: number;
  percentUp5: number;
}

export interface IndexRawData {
  date: string;
  price: string;
}
