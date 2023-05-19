export interface IndexData {
  date: Date;
  price: number;
}

export interface TableData {
  startDate: Date;
  endDate: Date;
  startPrice: number;
  endPrice: number;
  daysDown: number;
  percent: number;
  daysDone: number;
  doneDate: Date;
}
