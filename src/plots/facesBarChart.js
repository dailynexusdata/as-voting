/**
 * Shows Election Results with senator faces
 *
 * @author alex
 * @author bella
 */
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';

/**
 * Get Senator Image url
 *
 * @param {{ name: string }} person Person object with a name key
 */
const getPhotoUrl = (person) => {
  const name = person.name.toLowerCase().replaceAll(' ', '_');
  return `dist/photos/${name}.jpg`;
};

/**
 * @param {*} data - array of people objects
 *
 * @author alex
 * @todo make photos into circles
 *
 * @author bella
 * @todo add bars with color
 * @todo add person name
 * @todo align put image centered at the end of the bar
 * @todo add hover over number of votes at end of bar
 *
 * @see {@link https://dailynexusdata.github.io/barchartExample Daily Nexus Bar Chart Example Guide}
 * @since 8/25/2021
 */
const makePlot = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = select('#ucsb-as-voting-faces')
    .attr('class', 'ucsb-as-voting');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('My title');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  /*
    Create Scales:
  */

  const x = scaleLinear()
    .domain(data[0].totalVotes)
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

  console.log(data);
  // bar chart
  // -- color based on .elected

  // name text on top of bars

  // put images at end of bars --- I'll make them into circles later I think
  bars
    .append('image')
    .attr('xlink:href', (d) => getPhotoUrl(d))
    .attr('x', 100)
    .attr('y', (d) => y(d.name))
    .attr('width', 50)
    .attr('height', 50);

  /*
     x-axis
    */
  svg
    .append('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(axisBottom().scale(x));
};

export default makePlot;
