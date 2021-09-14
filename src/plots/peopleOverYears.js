/**
 * @file Shows how people's numbers have changed since previous elections
 */
import { select } from 'd3-selection';
import { nest } from 'd3-collection';
import { getPhotoUrl } from './utility';

const makeSinglePlot = (div) => {
  div.append('h1').text("Peron's Name");

  const size = {
    height: 250,
    width: 250,
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const svg = div
    .selectAll('svg')
    .data((d) => [d])
    .enter()
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);
};

/**
 *
 * @param {*} data - people.csv
 */
const makePlot = (data) => {
  const container = select('#labby-as-voting-people-over-years').attr(
    'class',
    'ucsb-as-voting',
  );

  // append div for each person into this: -- pass those div into the makeSinglePlot function
  const plotArea = container
    .append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap');

  const multiPeople = nest()
    .key((d) => d.name)
    .entries(data)
    .filter((d) => d.values.length > 1);

  const plotDivs = plotArea
    .selectAll('div')
    .data(multiPeople)
    .enter()
    .append('div');
  makeSinglePlot(plotDivs);
  // these are the people you want to make plots of
  // filter out `data` to get all of the other people for the same position, quarter, year
  console.log(multiPeople);
};

export default makePlot;
