/**
 * @file How voting numbers for different positions changed since last year
 * @author Bella
 */
import { select } from 'd3-selection';
import { nest } from 'd3-collection';

/**
 * @param {*} data - people.csv
 *
 * @author Bella
 *
 * @since 9/6/2021
 */
const makeTable = (data) => {
  const container = select('#labby-as-voting-position-votes-chart').attr(
    'class',
    'ucsb-as-voting',
  );

  const nestedData = nest()
    .key((d) => d.position)
    .key((d) => `${d.quarter} ${d.year}`)
    .entries(data.filter((d) => d.quarter === 'spring'));

  // each row should be the position
  // two columns for the year

  console.log(nestedData);
};

export default makeTable;
