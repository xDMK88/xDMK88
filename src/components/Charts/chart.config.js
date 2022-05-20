export const chartColors = {
  default: {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860',
    success: '#198754'
  }
}

export const generateEmptyDataSetNDaysAgo = (days = 7) => {
  const data = {}
  const now = new Date()
  for (let i = 0; i <= days; i++) {
    const iDay = new Date().setDate(now.getDate() - i)
    data[new Date(iDay).toDateString()] = 0
  }
  return data
}

export const fillDaysDataSet = arr => {
  const data = generateEmptyDataSetNDaysAgo()
  for (const item of arr) {
    const itemDate = new Date(item.creation_date).toDateString()
    if (itemDate in data) {
      data[itemDate] += 1
    }
  }
  return data
}

const datasetObject = (color, points) => {
  return {
    fill: true,
    borderColor: chartColors.default[color],
    borderWidth: 1,
    borderDash: [],
    borderDashOffset: 0.0,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: 'rgba(255,255,255,0)',
    pointHoverBackgroundColor: chartColors.default[color],
    pointBorderWidth: 20,
    pointHoverRadius: 4,
    pointHoverBorderWidth: 15,
    pointRadius: 3,
    data: points,
    tension: 0.2,
    cubicInterpolationMode: 'default'
  }
}

export const karmaChartData = (arr, color) => {
  const data = fillDaysDataSet(arr)
  const labels = Object.keys(data)
  for (let i = 0; i < labels.length; i++) {
    const splittedLabelValues = labels[i].split(' ')
    labels[i] = splittedLabelValues[0]
  }
  const points = Object.values(data)
  return {
    labels,
    datasets: [
      datasetObject(color, points)
    ]
  }
}

export const sampleChartData = (points = 7) => {
  const labels = []

  for (let i = 1; i <= points; i++) {
    labels.push(`0${i}`)
  }

  return {
    labels,
    datasets: [
      datasetObject('danger', points)
    ]
  }
}
