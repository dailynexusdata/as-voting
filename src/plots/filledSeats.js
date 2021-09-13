/**
 * Which seats were filled / unopposed / who lost
 *
 * @author Bella
 * @author Alex
 */
import { select } from 'd3-selection';
import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';
import { max, range } from 'd3-array';

import { image } from 'd3-fetch';
import { getPhotoUrl } from './utility';

/**
 * Nested Sort with max number items per key
 *
 * @param {Array<{[key]: string}>} data Array of objects with at least the key
 * @param {string} key - name of key to nest on
 * @param {number} maxNest  - max number items per group
 * @returns {Array<key: string, values: Array<{[key]: object}>>} d3 nest format
 */
const nestedLimit = (data, key, maxNest) => {
  const output = {};

  const addElement = (d, i) => {
    const k = d[key] + (i > 0 ? i : '');
    const dat = { ...d, i };
    if (Object.keys(output).includes(k)) {
      if (output[k].length < maxNest) {
        output[k].push(dat);
      }
      else {
        addElement(d, i + 1);
      }
    }
    else {
      output[k] = [dat];
    }
  };

  data.forEach((d) => {
    addElement(d, 0);
  });

  return Object.entries(output).map(([k, values]) => ({ key: k, values }));
};

/**
 * Creates svg, bars
 *
 * @param {*} data - array of people objects
 *
 * @author alex
 * @author bella
 * @todo labels + arrows @see {@link https://github.com/dailynexusdata/kcsb-covid/blob/main/plots/droupouts.js}
 * line 182-193 creates the traingle, lines 194-206 is the line with triangle attached
 * MAKE SURE TO USE A MORE DESCRIPTIVE ID
 * and output: @see {@link https://dailynexusdata.github.io/kcsb-covid/ gh pages} the first chart with arrows
 * @todo lines between categories @see {@link http://www.d3noob.org/2013/01/making-dashed-line-in-d3js.html dashed line}
 *
 * @since 8/30/2021
 */
const makePlot = (data) => {
  const container = select('#ucsb-as-voting-filled-seats').attr(
    'class',
    'ucsb-as-voting',
  );
  container.selectAll('*').remove();

  /**
   * Parameters -- tie to window.innerWidth ?
   */
  const imageSize = 50;
  const maxPeopleLine = 5;
  const catOrder = [
    'President',
    'External Vice President - Statewide Affairs',
    'Student Advocate',
    'On-Campus Senator',
    'Off-Campus Senator',
    'Collegiate Senator - Letters & Science',
    'Collegiate Senator - Engineering',
    'Collegiate Senator - Creative Studies',
    'Transfer Senator',
    'Off-Campus University Owned',
    'International Senator',
  ];
  // const catOrder = [
  //   'President',
  //   'External Vice President - Statewide Affairs',
  //   'Student Advocate',
  //   'Collegiate Senator - Letters & Science',
  //   'Off-Campus Senator',
  //   'On-Campus Senator',
  //   'Transfer Senator',
  //   'Off-Campus University Owned',
  //   'International Senator',
  //   'Collegiate Senator - Engineering',
  //   'Collegiate Senator - Creative Studies',
  // ];

  // data nesting with a max number of items per nest
  // be CAREFUL about the sort to make sure the __1 and __2
  // combe after the main categories
  const nested = nestedLimit(
    data.sort((a, b) => b.votes - a.votes),
    'position',
    maxPeopleLine,
  ).sort((a, b) => {
    const ai = catOrder.indexOf(a.key.replace(/\d/g, ''));
    const bi = catOrder.indexOf(b.key.replace(/\d/g, ''));

    // if category not in the list make it after
    if (ai === -1) {
      if (bi === -1) {
        return a.key < b.key ? -1 : 1;
      }
      return 1;
    }
    if (bi === -1) {
      return -1;
    }

    // same base value -- sort on number
    if (ai === bi) {
      // same base value and number
      if (a.key === b.key) {
        return b.votes - a.votes;
      }
      return a.key < b.key ? -1 : 1;
    }

    // sort by array
    return ai - bi;
  });

  /**
   * Container Setup:
   */
  const size = {
    height: 1500,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 25,
    right: 55,
    bottom: 10,
    left: 10,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  /*
    Scales:
    */
  // Y scale is used to find the position of each category
  // only need to use for the translate
  const y = scaleBand()
    .domain(nested.map((d) => d.key))
    .range([margin.top, size.height - margin.bottom]);

  // z scale is relative within the category
  const z = scaleLinear().range([0, y.bandwidth()]);

  // could simplify domain to [0, maxPeopleLine]
  // but this makes sure its always filled
  const x = scalePoint()
    .domain(
      range(
        0,
        max(nested, (d) => {
          const sp = Math.max(d.values.length, d.values[0].space);
          return Math.min(sp, maxPeopleLine);
        }),
        1,
      ),
    )
    .range([margin.left, size.width - margin.right]);

  /**
   * Colors
   */
  const circleColors = {
    won: 'grey',
    lost: 'red',
  };

  // we should just be able to sort on votes --- but this makes sure
  // sorts people first by elected or not, then by number votes
  const sortPeople = (arr) => arr.sort((a, b) => {
    if (a.elected === 'no') {
      return 1;
    }
    if (b.elected === 'yes') {
      return b.votes - a.votes;
    }
    return 1;
  });

  const positions = svg
    .selectAll('.positions')
    .data(nested)
    .join('g')
    .attr('class', 'positions')
    .attr('transform', (d) => `translate(0, ${y(d.key)})`);

  positions
    .append('g')
    .selectAll('.backdrops')
    .data((d) => {
      const newVals = [...d.values];
      const { space } = d.values[0];
      while (
        newVals.length + newVals[0].i * maxPeopleLine < space
        && newVals.length !== maxPeopleLine
      ) {
        newVals.push({ space, i: 0 });
      }
      return sortPeople(newVals);
    })
    .enter()
    .append('circle')
    .attr('r', imageSize / 2 + 4)
    .attr('cx', (_, i) => x(i) + imageSize / 2)
    .attr('cy', z(0) + imageSize / 2)
    .attr('fill', (d, i) => {
      //   if (d.writeIn === 'yes') {
      //     return circleColors.writeIn;
      //   }
      const linePos = d.i * maxPeopleLine + i;
      return linePos >= d.space ? circleColors.lost : circleColors.won;
    });

  const faces = positions
    .append('g')
    .selectAll('.portraits')
    .data((d) => sortPeople(d.values))
    .enter()
    .append('g')
    .attr('fill-opacity', 0);

  faces
    .append('foreignObject')
    .attr('x', (_, i) => x(i))
    .attr('y', z(0))
    .attr('width', imageSize)
    .attr('height', imageSize)
    .append('xhtml:img')
    .attr('width', imageSize)
    .attr('height', imageSize)
    .attr('src', (d) => getPhotoUrl(d))
    .style('border-radius', '50%')
    .on('mouseenter', function () {
      const g = select(this).nodes()[0].parentNode.parentNode;
      select(g).attr('fill-opacity', 1);
    })
    .on('mouseleave', function () {
      const g = select(this).nodes()[0].parentNode.parentNode;
      select(g).attr('fill-opacity', 0);
    });

  faces
    .append('text')
    .text((d) => d.name)
    .attr('x', (_, i) => {
      if (i === 0) {
        return x(i) - 5;
      }
      if (i === maxPeopleLine - 1) {
        return x(i) + imageSize + 5;
      }
      return x(i) + imageSize / 2;
    })
    .attr('y', z(0) + imageSize + 8)
    .attr('text-anchor', (_, i) => {
      if (i === 0) {
        return 'start';
      }
      if (i === maxPeopleLine - 1) {
        return 'end';
      }
      return 'middle';
    })
    .attr('alignment-baseline', 'hanging')
    .style('pointer-events', 'none');

  /**
   * filter out start of categories
   */
  const positionBorders = positions.filter((d) => !d.key.match(/\d$/));

  // position text so it doesnt overlap with other things
  // make this based off of imageSize?
  positionBorders
    .append('text')
    .text((d) => d.key)
    .attr('x', 0)
    .attr('y', z(0) - imageSize / 4);

  positionBorders
    .append('line')
    .attr('class', 'laby-as-voting-filledseats-dashed-lines')
    .style('stroke-dasharray', '3,3')
    .attr('x1', x(0))
    .attr('y1', z(0) - imageSize / 2 - 5)
    .attr('x2', size.width)
    .attr('y2', z(0) - imageSize / 2 - 5)
    .attr('stroke', 'black');
  // filter out the first one category from positionBorders
  // and make a dashed horizontal line across

  // make arrows with labels for
  // * unapposed (1) --- maybe the engineering guy?
  // * lost -- maybe the transfer senator?
  // * unfilled seat (1) --- do it in the top right

  svg
    .append('path')
    .attr('id', 'laby-as-voting-filledseats-triangle1')
    .attr('d', 'M 0 0 10 0 5 10')
    .attr('refX', 10)
    .attr('refY', 10)
    .attr('transform', `translate(${x(4) + imageSize / 2 - 5}, 345)`);

  svg
    .append('path')
    .attr(
      'd',
      `M ${x(4) + imageSize / 2} 345 Q ${x(4) + imageSize / 2} 300, ${x(
        4,
      )} 290`,
    )
    .attr('stroke-width', 3)
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .attr('marker-start', 'url(#laby-as-voting-filledseats-triangle1)');

  svg
    .append('path')
    .attr('id', 'laby-as-voting-filledseats-triangle2')
    .attr('d', 'M 0 5 10 0 10 10')
    .attr('refX', 10)
    .attr('refY', 10)
    .attr('transform', `translate(${x(1) + imageSize + 5}, 1285)`);

  svg
    .append('path')
    .attr(
      'd',
      `M ${x(1) + imageSize + 10} 1291 Q ${x(2)} 1285, ${x(2) + 10} 1235`,
    )
    .attr('stroke-width', 3)
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .attr('marker-start', 'url(#laby-as-voting-filledseats-triangle2)');

  svg
    .append('path')
    .attr('id', 'laby-as-voting-filledseats-triangle3')
    .attr('d', 'M 0 5 10 0 10 10')
    .attr('refX', 10)
    .attr('refY', 10)
    .attr('transform', `translate(${x(0) + imageSize + 5}, 945)`);

  svg
    .append('path')
    .attr(
      'd',
      `M ${x(0) + imageSize + 10} 950 Q ${x(0) + imageSize * 2} 950, ${x(
        1,
      )} 960`,
    )
    .attr('stroke-width', 3)
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .attr('marker-start', 'url(#laby-as-voting-filledseats-triangle1)');
};

export default makePlot;
