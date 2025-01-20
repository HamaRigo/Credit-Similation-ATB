import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import React from "react";

const SalesChart = () => {
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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
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
      data: [20, 40, 50, 30, 40, 50, 30, 30, 40],
    },
    {
      name: "2024",
      data: [10, 20, 40, 60, 20, 40, 60, 60, 20],
    },
    {
      name: "2025",
      data: [25, 15],
    },
  ];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Comptes Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Comptes Report
        </CardSubtitle>
        <Chart options={options} series={series} type="bar" height="379" />
      </CardBody>
    </Card>
  );
};

export default SalesChart;
