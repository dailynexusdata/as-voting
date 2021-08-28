/**
 * @author alex
 * @since 8/25/2021
 */
import './styles.scss';

import { csv } from 'd3-fetch';
import { nest } from 'd3-collection';
import { shuffle } from 'lodash';

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
    facesBarChart(
      peopleS2021
        .filter((d) => d.position === 'On-Campus Senator')
        .sort((a, b) => a.votes - b.votes),
    );
    // setTimeout(() => {
    //   console.log('next');
    //   facesBarChart(shuffle(peopleS2021).slice(0, 7));
    // }, 5000);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
