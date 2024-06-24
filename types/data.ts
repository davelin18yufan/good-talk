export type PnLChartData = {
  week: string;
  成交筆數: number;
  報酬率: number;
  獲利筆數: number;
}

export type PnLChartDataKeys = Exclude<keyof PnLChartData, "week"> 
