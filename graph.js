const url = 'https://global-warming.org/api/temperature-api'

function getEveryNth(arr, nth) {
    const result = [];

    for (let i = 0; i < arr.length; i += nth) {
        result.push(arr[i]);
    }

    return result;
};

function daysDiff(date1, date2) {
    let timeDiff = date2.getTime() - date1.getTime();

    return Math.floor(timeDiff / (1000 * 3600 * 24));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let months = [0.04, 0.13, 0.21, 0.29, 0.38, 0.46, 0.54, 0.63, 0.71, 0.79, 0.88, 0.96]

let width, height, gradient;
function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        gradient.addColorStop(0, "#2D2D2D");
        gradient.addColorStop(1, "#D54A31");
    }

    return gradient;
}

fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        let years = []
        for (let year = 1880; year < 2041; year++) {
            months.forEach(month => years.push(year + month))
        }
        let temps = data.result.map(obj => obj.station)
        years = getEveryNth(years, 25)
        temps = getEveryNth(temps, 25)

        let ctx = document.getElementById("chart");

        let globalTempChart = new Chart(ctx, {
            type: 'line',
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            },
            data: {
                labels: years,
                datasets: [
                    {
                        data: temps,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4,
                        borderColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) {
                                // This case happens on initial chart load
                                return;
                            }
                            return getGradient(ctx, chartArea);
                        },
                        pointStyle: "none",
                    }
                ]
            }
        });

        let today = new Date();
        let twentyforty = new Date("January 01, 2040")
        let twentythirty = new Date("January 01, 2030")

        let c2value = document.getElementById('c2-value');
        c2value.innerHTML = numberWithCommas(daysDiff(today, twentythirty)) + " days "

        let c1value = document.getElementById('c1-value');
        c1value.innerHTML = numberWithCommas(daysDiff(today, twentyforty)) + " days "

    });
