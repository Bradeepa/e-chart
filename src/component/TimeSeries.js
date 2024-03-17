import React from "react";
import Papa from 'papaparse';
import { useState, useEffect } from 'react';
import gemini_BTCUSD from './GEMINI_BTCUSD.csv';
import LineChart from "./LineChart";
import BarChart from "./BarChart";

function TimeSeries() {
  const [columnData, setcolumnData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState([]);
  const [chartSelection, setChartSelection] = useState('')
  const [x_AxisdateForLine, setX_axisdatedForLine] = useState([])
  const [x_AxisdateForBar, setX_axisdatedForBar] = useState([]);
  const [y_AxisDataForBar, setY_AxisDataForBar] = useState([])
  let columnName = 'Open'
  const filteredMonthArr = [];


 
  const sortByDate = arr => {
    const sorter = (a, b) => {
      return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }
    arr.sort(sorter);
  };
  const fetchParseData = async() =>{
  const response = await fetch(gemini_BTCUSD);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true
      }).data;
      return parsedData;
    }
  useEffect(() => {
    const fetchData = async () => {
    const  parsedData = await fetchParseData()
      sortByDate(parsedData)
      const defaultOpenChartDatas = parsedData.map((item) => {
        return item.Open;
      })
      const xAxisData = parsedData.map((item) => {
        return item.Date
      })
      const xAxisDataForBar = parsedData.map((item) => {
        const covertingDate = new Date(item.Date);
        const covertingDateToMonth = filteredMonthArr.push(covertingDate.toLocaleString('default', { month: 'short', year: 'numeric'
      } ));
      })
      // combination of month and year (Eg: Jan 2020 )
      const filteringMonths = new Set(filteredMonthArr);
      let monthsToArray = Array.from(filteringMonths.values());
      setX_axisdatedForLine(xAxisData)
      setSelectedColumn(defaultOpenChartDatas)
      setcolumnData(parsedData);
      setX_axisdatedForBar(monthsToArray)
      console.log("chart", parsedData);
    };
    fetchData();
  }, []);

  const columnNames = ["Open", "High", "Low", "Close", "Volume"]
  const changeTimeSeries = (e, chartSelection) => {
    const targetValue = e.target.value;
    columnName = e.target.value;
    if (chartSelection === 'lineChart' || chartSelection === '') {
      const displayChartData = columnData.map((item) => {
        return item[targetValue]
      })
      setSelectedColumn(displayChartData)
    }
    else {
      showBarchart()
    }

  }
  const showLinechart = (e) => {
    setChartSelection('lineChart')
  }
  const showBarchart = () => {
    let totalValue = Array(12).fill(0);
    let count = Array(12).fill(0);
    columnData.forEach(entry => {
      let [month] = entry.Date.split('/');
      let monthIndex = parseInt(month) - 1;
      totalValue[monthIndex] += parseFloat(entry[columnName]);
      count[monthIndex]++;
    }
    )
    let averageMonthlyValue = totalValue.map((item, index) => {
      return totalValue[index] === 0 ? 0 : item / count[index]
    })
    setY_AxisDataForBar(averageMonthlyValue)
    console.log(averageMonthlyValue)
    setChartSelection('BarChart')
  }
  return (
    <div className="time-seriesChart">
      <h2 className="timeSheet-series">Time Series Data Visualization</h2>
      <div className="row dropdownContainer" >
        <div className="dropDown-column  col-10" >
          <select name="columnNames" id="columnNames" onChange={(e) => changeTimeSeries(e, chartSelection)}>
            {columnNames.map((item) => {
              return (<option value={item} style={{ fontWeight: "bold" }}>{item}</option>)
            })
            }
          </select>
        </div>
        <div className="col-2 ">
          <div className="btn-group btn-group-lg" role="group">
            <button type="button" className={`btn btn-info btn-lg  ${(chartSelection === '' || chartSelection === 'lineChart') ? "active" : ''}`} onClick={showLinechart} >Line</button>
            <button type="button" className={`btn btn-info btn-lg  ${(chartSelection === 'BarChart') ? "active" : ''}`} onClick={showBarchart}>Bar</button>
          </div>
        </div>
      </div>
      {chartSelection === '' || chartSelection === 'lineChart' ?
        <LineChart lineoption={selectedColumn} xAxisDataForLine={x_AxisdateForLine} /> :
        <BarChart baroption={y_AxisDataForBar} xAxisDataForBar={x_AxisdateForBar} />
      }
    </div>
  );
}
export default React.memo(TimeSeries);