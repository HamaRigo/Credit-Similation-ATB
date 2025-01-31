import React from "react";
import {Card} from "antd";
import Chart from "react-apexcharts";

const SalesChart = ({data}) => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    legend: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 2,
      },
    },
    colors: ["#b8c0c6", "#911212", "#0e6fba"],
    xaxis: {
      categories: data?.map(item => item.month.substring(0, 3)),
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
              borderRadius: 7,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "2023",
      data: [5, 10, 30, 10, 15, 5, 10, 30, 10, 15, 20, 30],
    },
    {
      name: "2024",
      data: [8, 5, 35, 30, 20, 25, 10, 25, 20, 10, 20, 40],
    },
    {
      name: "2025",
      data: data?.map(item => item.count),
    },
  ];

  return (
      <Card title="Comptes Summary - Yearly Report">
        <Chart options={options} series={series} type="bar" height="379" />
      </Card>
  );
};

export default SalesChart;
