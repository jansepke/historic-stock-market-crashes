# Historic Stock Market Crashes

Analyze historic stock market crashes for different popular indices (MSCI World, ACWI). Filter crashes with adjustable maximum drawdown. Support buy and hold strategy. Access it here: [historic-stock-market-crashes.jansepke.de](https://historic-stock-market-crashes.jansepke.de)

![Screenshot](https://github.com/jansepke/historic-stock-market-crashes/raw/master/data-sources/screenshot.png)

## Credits

This project was inspired by a blog post about the Corona Crisis and the Stock Market (https://www.gerd-kommer-invest.de/corona-crash/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Start the project with

```bash
./do run
```

## Todo

- refactor Calculator.calculateTableData
- add bonds
- add mixed portfolios
- run index update once per day
- show index data start date
- add chart zooming (change start end date)
- allow merging data of multiple indices
- add tabular datasets for search engines (https://developers.google.com/search/docs/data-types/dataset#tabular)
- move data to S3 bucket
- select rows not hover

## License

[MIT](https://choosealicense.com/licenses/mit/)
