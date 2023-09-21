import React from "react"
import ReactApexChart from "react-apexcharts"
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor"

const PieChart = ({ dataColors, data }) => {
  const PieApexChartColors = getChartColorsArray(dataColors)
  const series = [
    Number(data.percent90),
    Number(data.percent80_to_90),
    Number(data.percent65_to_80),
    Number(data.percent55_to_65),
    Number(data.percent33_to_55),
    Number(data.percent0_to_33),
  ]
  const options = {
    // plotOptions: {
    //   pie: {
    //     startAngle: -90,
    //     endAngle: 90,
    //     offsetY: 10
    //   }
    // },
    chart: {
      width: 300,
      type: "pie",
    },
    series: [
      Number(data.percent90),
      Number(data.percent80_to_90),
      Number(data.percent65_to_80),
      Number(data.percent55_to_65),
      Number(data.percent33_to_55),
      Number(data.percent0_to_33),
    ],
    labels: [
      " Above 90 -  " + data.percent90 + "%",
      " Above 80 -  " + data.percent80_to_90 + "%",
      " Above 65 -  " + data.percent65_to_80 + "%",
      " Above 55 -  " + data.percent55_to_65 + "%",
      " Above 33 -  " + data.percent33_to_55 + "%",
      " Below 33 -  " + data.percent0_to_33 + "%",
    ],
    colors: PieApexChartColors,
    // colors: ["red", "blue", "green", "yellow", "skyblue", "orange"],
    legend: {
      show: true,
      position: "right",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  return (
    <ReactApexChart options={options} series={series} type="pie" height="300" />
  )
}

export default PieChart
