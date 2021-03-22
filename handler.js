'use strict';
const fetch = require("node-fetch");

const BanxicoURL = `${process.env.BANXICO_URL}/SieAPIRest/service/v1/series/SF18561,SF57750,SF57766,SF57816,SF57822,SF57860,SF57794,SF57782,SF57874,SF57750,SF57870,SF57772,SF57790,SF57878,SF57888,SF57920,SF57872/datos/oportuno?token=${process.env.BANXICO_TOKEN}`

module.exports.getCurrencies = async (event) => {
  const response = await getData()

  return SuccessJsonResponse({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      response: response
    });
};

module.exports.getCurrenciesAsCSV = async (event) => {
  const response = await getData()

  return CSVResponse(transformData(response));
};

const getData = async () => {
  const response = await fetch(BanxicoURL)
  if(!response.ok){
    console.log("Error getting banxico data: ", response.message)
    return []
  }

  const data = await response.json();
  if(data && data.bmx && data.bmx.series && data.bmx.series.length > 0){
    return data.bmx.series.map((serie) => [serie.idSerie, serie.datos[0].dato])
  }
  console.log("No series defined: ", data)
  return []
}

const transformData = (data) => {
  let result = ""
  data.forEach(element => {
    result += `${element[0]},${element[1]}\n`
  });

  return result
}

const SuccessJsonResponse = (object) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      object,
      null,
      2
    ),
  };
}
const CSVResponse = (object) => {
  return {
    headers: { "Content-Type": "text/csv" },
    statusCode: 200,
    body: object
  };
}

const ErrorResponse = (statusCode, object) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(
      object,
      null,
      2
    ),
  };
}
