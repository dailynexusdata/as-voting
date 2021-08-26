/**
 * @author alex
 * @since 8/25/2021
 */
import './styles.scss';

import { csv } from 'd3-fetch';
import { nest } from 'd3-collection';

import facesBarChart from '../plots/facesBarChart';

(async () => {
  const peopleS2021 = await csv('dist/data/people.csv', (d) => ({
    ...d, votes: +d.votes, space: +d.space, totalVotes: +d.totalVotes,
  }));

  const nested = nest()
    .key((d) => d.position)
    .entries(peopleS2021);

  const programsS2021 = await csv('dist/data/programs.csv');

  const resize = () => {
    facesBarChart(peopleS2021.slice(0, 5));
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
