'use strict';

const median = (values) => {
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) { return values[half]; }
  return (values[half - 1] + values[half]) / 2.0;
};

/**
 * Represents an individual component object of an item.
 */
class Component {
  /**
   * Represents an individual component object of an item.
   * @param {json} data the component data to parse into a component
   * @param {Array<Ojbect>} items objects with data for ducats
   * @constructor
   */
  constructor(data, items) {
    /**
     * Name of the component, display value
     * @type {string}
     */
    this.name = data.name.replace(/(pc|ps4|xb1|switch)/ig, '');

    /**
     * Supply for the component
     * @type {number}
     */
    this.supply = data.supply;

    /**
     * Demand for the component
     * @type {number}
     */
    this.demand = data.demand;

    /**
     * Average prices for the component
     * @type {Object}
     * @property {number} avg     - average value
     * @property {number} median  - median value
     * @property {number} minimum - minimum value
     * @property {number} maximum - maximum value
     */
    const p = data.prices;
    this.prices = {
      buying: p.buying.current,
      selling: p.selling.current,
      avg: (p.buying.current.avg + p.selling.current.avg) / 2,
      median: median([p.buying.current.median, p.selling.current.median]),
      minimum: Math.min(p.buying.current.min, p.selling.current.max),
      maximum: Math.max(p.buying.current.max, p.selling.current.max),
    };
    this.ducats = (items.filter(item => item.name === data.name)[0] || { ducats: 0 }).ducats;
    this.type = 'nexus-v2';
  }

  /**
   * The components's string representation
   * @returns {string}
   */
  toString() {
    return `\u221F${this.padName(this.name)} | average: ${(this.prices.avg && !isNaN(this.prices.avg) ? `${String(parseFloat(this.prices.avg).toFixed(2))}p` : '0p')}`;
  }

  /**
   * Pad the left side of a string so that all componets
   * have the same string length before the pipe
   * @param {string} locationString the location string to pad
   * @returns {string} the padded location string
   */
  padName(locationString) {
    let stringRet;
    if (locationString.length < 10) {
      stringRet = this.padName(`${locationString} `);
    } else {
      stringRet = locationString;
    }
    return stringRet;
  }
}

module.exports = Component;
