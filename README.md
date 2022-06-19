# currencyFS
**How to run**
1. Install the node modules for the be at the main folder. 
2. Install the node modules for fhe be at the main/fe folder.
3. Set the API_Key for the be in the .env from (https://currencyscoop.com/) 
4. use "npm run dev" to start the fe and be.

BE port = 8080;
FE port = 3000;

API Endpoints

http://localhost:8080/query/list
- get the list of currencies info (currency name, currency code and country)


http://localhost:8080/query/currentRates/?
- get the latest list of rates for the base currency
parameters
base - the base currency code
symbols - what currencies to compare with (eg. symbols=USD,AUD )


http://localhost:8080/query/historicalRates/?
- get the rates for the base currency on that particular date
parameters
base - the base currency code
symbols - what currencies to compare with (eg. symbols=USD,AUD )
date - the date to query (eg date=2021-04-03)

use "npm test" to run the tests for the API endpoints




