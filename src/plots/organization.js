/**
 * Organizational Hierarchy of elected officials
 *
 * @author alex
 *
 */
import { select } from 'd3-selection';
import { nest } from 'd3-collection';

import { getPhotoUrl } from './utility';
/**
 * @param {*} data - Elected Senators / AS Reps
 *
 * @author alex
 *
 * @since 8/28/2021
 */
const makePlot = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = select('#ucsb-as-voting-org')
    .attr('class', 'ucsb-as-voting');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('My title');

  /*
    Start Plot:
  */

  const nested = nest().key((d) => d.position).entries(data);

  const positions = container.selectAll('positions')
    .data(nested)
    .enter()
    .append('div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('align-items', 'center');

  positions.append('h1').text((d) => d.key);

  const people = positions
    .append('div')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('padding', '10px')
    .style('flex-wrap', 'wrap')
    .selectAll('people')
    .data((d) => d.values)
    .enter()
    .append('div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('align-items', 'center');

  people
    .append('img')
    .attr('src', (d) => getPhotoUrl(d))
    .attr('width', '100px')
    .attr('height', '100px')
    .style('border-radius', '50%');

  people.append('p').text((d) => d.name);
};

export default makePlot;
