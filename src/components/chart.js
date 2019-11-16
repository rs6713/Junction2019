
import React, { Component } from 'react';
import { render } from 'react-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';


class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Sustainability comparison'
                },
                xAxis: {
                    categories: ['Building #1', 'Building #2', 'Building #3', 'Building #4', 'Building #5']
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Energy Consumption'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: ( // theme
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color
                            ) || 'gray'
                        }
                    }
                },
                series: [{
                    name: 'Electricity',
                    data: [5, 3, 4, 7, 2]
                }, {
                    name: 'Water',
                    data: [2, 2, 3, 2, 1]
                }, {
                    name: 'Heating',
                    data: [3, 4, 4, 2, 5]
                }]
            },
            hoverData: null
        };
    }

    setHoverData = (e) => {
        // The chart is not updated because `chartOptions` has not changed.
        this.setState({ hoverData: e.target.category })
    }

    updateSeries = () => {
        // The chart is updated only with new options.
        this.setState({
            chartOptions: {
                series: [
                    { data: [Math.random() * 5, 2, 1] }
                ]
            }
        });
    }

    render() {
        const { chartOptions, hoverData } = this.state;

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
        )
    }
}


export default Chart;


