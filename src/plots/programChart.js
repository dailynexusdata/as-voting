/**
 * Reaffirmation pct of as programs
 *
 * @author Alex
 *
 */
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';

/**
 * @param {*} data - programs.csv
 *
 * @author Alex
 *
 * @since 8/28/2021
 */
const makePlot = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = select('#ucsb-as-voting-program-reaffirm').attr(
    'class',
    'ucsb-as-voting',
  );

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('My title');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  /*
    Create Table:
  */
  const reaffirmColors = {
    reaffirmed: 'green',
  };

  const pctColors = scaleLinear()
    .domain([0, 0.5, 1])
    .range(['red', 'white', 'green']);

  container
    .append('table')
    .style('border-collapse', 'collapse')
    .style('width', `${size.width}px`)
    .selectAll('programs')
    .data(data)
    .enter()
    .append('tr')
    .selectAll('rows')
    .data((d) => Object.entries({ program: d.program, pct: d.pct }))
    .enter()
    .append('td')
    .style('text-align', (d) => {
      if (d[0] === 'pct') {
        return 'center';
      }
      return 'left';
    })
    .text((d) => {
      if (d[0] === 'pct') {
        return format('.2f')(Math.round(d[1] * 10000) / 100);
      }
      return d[1];
    })
    .style('background-color', (d) => {
      if (d[0] === 'pct') {
        return `${pctColors(d[1]).slice(0, -1)}, 0.75)`;
      }
      return '#FFFFFFFF';
    });
};

export default makePlot;
