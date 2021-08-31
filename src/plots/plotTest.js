import * as Plot from '@observablehq/plot';
import { select } from 'd3-selection';

const makePlot = (data) => {
  const container = select('#plot-test').attr('class', 'ucsb-as-voting');

  const plotData = data
    .sort((a, b) => {
      if (a.position === b.position) {
        return b.votes - a.votes;
      }
      return b.totalVotes - a.totalVotes;
    })
    .map((d, i) => ({ ...d, i })); // .filter((d) => d.position === 'On-Campus Senator');
  console.log(plotData);
  document.getElementById('plot-test').appendChild(
    Plot.plot({
      width: Math.min(window.innerWidth - 60, 600),
      marginLeft: 350,
      marginRight: 0,
      y: {
        label: null,
        line: null,
      },
      x: {
        line: true,
        label: 'Votes →',
      },
      marks: [
        Plot.barX(plotData, {
          x: 'votes',
          y: 'position',
          fill: 'position', // (d) => d.votes < 100,
          fillOpacity: (d) => (d.elected === 'yes' ? 1 : 0.3),
          sort: {
            y: { valuel: 'i' },
          },
        }),
        // Plot.barX(plotData, {
        //   ...Plot.groupY(
        //     { x: 'sum' },
        //     {
        //       x: 'votes',
        //       y: 'position',
        //     },
        //   ),
        // }),
        // Plot.ruleX([0]),
        // Plot.text(plotData, {
        //   x: (d) => d.votes + 5,
        //   y: 'name',
        //   text: 'votes',
        //   textAnchor: 'start',
        // }),
      ],
    }),
  );
};

export default makePlot;
