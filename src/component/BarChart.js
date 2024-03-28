import React from "react";
import ReactECharts from 'echarts-for-react';

function BarChart(props) {
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 1000,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      
      tooltip: {
        trigger: 'axis'
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    grid: {
      left: '12%',
      bottom: '10%'
       },
    xAxis: {
      data: props.xAxisDataForBar
    },
    yAxis: {
      type: 'value'

    },
    series: [
      {
        data: props.baroption,
        type: 'bar',
        smooth: true,
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333'
          },

        }
      },

    ]
  };
  return (
    <div className="bar-chart">
      <ReactECharts option={options} />
    </div>
  );
}

export default React.memo(BarChart);
