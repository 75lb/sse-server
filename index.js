const eventSource = new EventSource('http://localhost:9000')

window.chart = Highcharts.chart('container', {
  chart: {
    type: 'column',
    animation: false //{ duration: 100 }
  },
  title: {
    text: 'products-channel-service'
  },
  yAxis: {
    title: { text: 'ms' }
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      // marker: { enabled: false }
    }
  },
  series: [
    {
      name: 'get-ent',
      data: []
    },
    {
      name: 'get-product',
      data: []
    }
  ]
})

eventSource.addEventListener('getEntitlement', e => {
  const data = JSON.parse(e.data || 0)
  if (data) window.chart.series[0].addPoint(data / 1e6)
})
eventSource.addEventListener('getProductsDetails', e => {
  const data = JSON.parse(e.data || 0)
  if (data) window.chart.series[1].addPoint(data / 1e6)
})
