window.chart = Highcharts.chart('container', {
  chart: {
    type: 'area'
  },
  title: {
    text: 'products-channel-service'
  },
  yAxis: {
    title: { text: 'ms' }
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      // lineColor: '#666666',
      // lineWidth: 1,
      // marker: {
      //   lineWidth: 1,
      //   lineColor: '#666666'
      // }
    }
  },
  series: [
    {
      name: 'get-ent',
      data: [
        208.3,
        200.4,
        150.2,
        54.9,
        354.2
      ]
    },
    {
      name: 'get-product',
      data: [
        308.3,
        300.4,
        150.2,
        154.9,
        254.2
      ]
    }
  ]
})
