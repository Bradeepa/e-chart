import React from "react";
import ReactECharts from 'echarts-for-react';

function LineChart(props) {
  
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataZoom: [
      { type: "slider", orient: "horizontal", filterMode: "none" },
      { type: "inside", orient: "horizontal", filterMode: "none" }
    ],
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      data: props.xAxisDataForLine
    },
    yAxis: {
      type: 'value'

    },
    series: [
      {
        data: props.lineoption,
        type: 'line',
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
    <div className="line-chart">
      <ReactECharts option={options} />
    </div>
  );
}

export default React.memo(LineChart);