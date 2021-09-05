import * as Plot from '@observablehq/plot';
import { select } from 'd3-selection';

const makePlot = (data) => {
  const container = select('#plot-test-2')
    .attr('class', 'ucsb-as-voting')
    .style('font-size', '10pt');

  container.selectAll('*').remove();

  const plotData = data
    .sort((a, b) => {
      if (a.position === b.position) {
        return b.votes - a.votes;
      }
      return b.totalVotes - a.totalVotes;
    })
    .filter((d) => d.elected === 'yes')
    .map((d, j) => ({ ...d, j }));

  console.log(plotData);
  document.getElementById('plot-test-2').appendChild(
    Plot.plot({
      width: Math.min(window.innerWidth - 60, 600),
      marginLeft: 180,
      marginRight: 30,
      y: {
        label: null,
        line: null,
        tickFormat: (d) => plotData[d].name,
      },
      x: {
        line: true,
        label: 'Votes →',
      },
      marks: [
        Plot.barX(plotData, {
          x: (d) => d.votes + 5,
          y: 'j',
          textAnchor: 'start',
          fill: 'position',
        }),
        Plot.text(plotData, {
          x: (d) => d.votes + 40,
          y: 'j',
          text: 'votes',
          textAnchor: 'start',
          fill: 'position',
        }),
      ],
    }),
  );
};

export default makePlot;
