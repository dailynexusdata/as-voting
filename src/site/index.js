/**
 * @author alex
 * @since 8/25/2021
 */
import './styles.scss';

import { csv } from 'd3-fetch';
import { nest } from 'd3-collection';
import { shuffle } from 'lodash';

import facesBarChart from '../plots/facesBarChart';
import makeTotalVotes from '../plots/totalVotes';
import makeWinningVotes from '../plots/winningVotes';
import programChart from '../plots/programChart';
import makeFilledSeats from '../plots/filledSeats';

(async () => {
  const people = await csv('dist/data/people.csv', (d) => ({
    ...d,
    votes: +d.votes,
    space: +d.space,
    totalVotes: +d.totalVotes,
  }));

  const programs = (
    await csv('dist/data/programs.csv', (d) => ({
      ...d,
      no: +d.no,
      yes: +d.yes,
      pct: +d.yes / (+d.yes + +d.no),
    }))
  ).sort((a, b) => b.pct - a.pct);

  console.log(programs);

  const resize = () => {
    facesBarChart(
      people
        .filter((d) => d.position === 'On-Campus Senator')
        .sort((a, b) => a.votes - b.votes),
    );
    programChart(programs);
    // setTimeout(() => {
    //   console.log('next');
    //   facesBarChart(shuffle(people).slice(0, 7));
    // }, 5000);
    // organization(people.filter((d) => d.elected === 'yes'));
    makeTotalVotes(people);
    makeWinningVotes(people);
    makeFilledSeats(people);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
