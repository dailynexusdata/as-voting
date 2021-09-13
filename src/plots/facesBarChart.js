/**
 * @file Shows Election Results with senator faces
 * @author alex
 * @author bella
 */

import { select, selectAll } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { max } from 'd3-array';
import 'd3-transition';
import { getPhotoUrl } from './utility';

/**
 * Creates svg, bars
 *
 * @param {*} data - array of people objects
 * @param {*} container - d3 selected div to append svg to
 *
 * @author alex
 * @done make photos into circles
 * @todo transitions for new data
 *
 * @author bella
 * @todo add bars with color
 * @todo add person name
 * @todo add hover over number of votes at end of bar
 *
 * @see {@link https://dailynexusdata.github.io/barchartExample Daily Nexus Bar Chart Example Guide}
 * @since 8/27/2021
 */
const makePlot = (data, container) => {
  /*
    Container Setup:
  */
  const size = {
    height: 80 * data.length + 30,
    width: Math.min(
      600,
      select(container.node().parentNode).style('width').slice(0, -2),
    ),
  };

  // height and width of images
  const imageSize = 50;

  const margin = {
    top: 15,
    right: 20 + imageSize / 2,
    bottom: 30,
    left: 10 + imageSize / 2,
  };

  const resizeDuration = 1000;

  const svg = container
    .selectAll('#ucsb-as-voting-faces-container')
    .data([size])
    .join('svg')
    .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
    .attr('id', 'ucsb-as-voting-faces-container')
    .attr('width', (d) => d.width);

  svg
    .transition()
    .duration(resizeDuration)
    .attr('height', (d) => d.height);

  /*
    Create Scales:
  */
  const x = scaleLinear()
    .domain([0, Math.ceil(max(data, (d) => d.votes) / 50) * 50])
    .range([margin.left, size.width - margin.right]);

  const y = scaleBand()
    .domain(data.map((d) => d.name))
    .range([size.height - margin.bottom, margin.top]);

  /*
    Start Plot:
  */
  const barColors = {
    yes: 'green',
    no: 'red',
  };

  const bars = svg.selectAll('bars').data(data).join('g');

  // bar chart
  // -- color based on .elected

  // name text on top of bars

  // put images at end of bars
  bars
    .append('rect')
    .attr('x', x(0))
    .attr('y', (d) => y(d.name))
    .attr('width', (d) => x(d.votes) - imageSize + 10)
    .attr('height', imageSize)
    .attr('fill', (d) => barColors[d.elected]);

  bars
    .on('mouseenter', (event, d) => {
      svg
        .append('text')
        .text(d.votes)
        .attr('x', d.votes < 25 ? x(d.votes) + 75 : x(d.votes) - 35)
        .attr('y', y(d.name) + 5 + imageSize / 2)
        .attr('class', 'hover-over-text')
        .style('pointer-events', 'none')
        .attr('text-anchor', 'end')
        .attr('fill', d.votes < 25 ? 'black' : 'white');
    })
    .on('mouseleave', () => {
      selectAll('.hover-over-text').remove();
    });

  bars
    .append('foreignObject')
    .attr('x', (d) => (d.votes < 25 ? x(d.votes) : x(d.votes) - 30))
    .attr('y', (d) => y(d.name))
    .attr('width', imageSize)
    .attr('height', imageSize)
    .append('xhtml:img')
    .attr('width', imageSize)
    .attr('height', imageSize)
    .attr('src', (d) => getPhotoUrl(d))
    .style('border-radius', '50%');

  bars
    .append('text')
    .text((d) => d.name)
    .attr('x', x(0))
    .attr('y', (d) => y(d.name) - 3)
    .attr('text-anchor', 'start')
    .attr('font-size', '11pt');

  /*
     x-axis
    */
  svg
    .selectAll('.ucsb-as-voting-faces-xaxis')
    .data([size])
    .join('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('class', 'ucsb-as-voting-faces-xaxis')
    .transition()
    .duration(resizeDuration)
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(axisBottom().scale(x));
};

/**
 * Entry point
 *
 * @param {*} data array of senator people objects
 *
 * @author alex
 * @todo data bind title
 *
 * @since 8/27/2021
 */
const setupPlot = (data) => {
  // The class is necessary to apply styling
  const container = select('#ucsb-as-voting-faces');

  // runs only first time
  if (container.selectAll('*').nodes().length === 0) {
    container.attr('class', 'ucsb-as-voting');

    container.append('h1').text('My title');
  }

  makePlot(data, container);
};

export default setupPlot;
