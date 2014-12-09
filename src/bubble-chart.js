(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['microplugin'], factory);
  }
  else if (typeof exports === 'object') {
    module.exports = factory(require('microplugin'));
  }
  else {
    root.BubbleChart = factory(root.MicroPlugin);
  }
}(this, function (MicroPlugin) {
  var options = {};
  var pi2 = Math.PI * 2;
  /**
   * Bubble Chart implementation using {@link d3js.org|d3js}
   *
   * @class BubbleChart
   * @example
   *  - [test-bubble-chart](../test/test-bubble-chart.html)
   *
   * @param {settings} settings - Settings of bubble chart
   */
  d3.svg.BubbleChart = function (settings) {
    var self = this;
    var defaultViewBoxSize = settings.size;
    var defaultInnerRadius = settings.size / 3;
    var defaultOuterRadius = settings.size / 2;
    var defaultRadiusMin = settings.size / 10;

    $.extend(options, {
      plugins: [],
      container: ".bubbleChart",
      viewBoxSize: defaultViewBoxSize,
      innerRadius: defaultInnerRadius,
      outerRadius: defaultOuterRadius,
      radiusMin: defaultRadiusMin,
      intersectDelta: 0,
      transitDuration: 1000
    }, settings);

    $.extend(options, {
      radiusMax: (options.outerRadius - options.innerRadius) / 2,
      intersectInc: options.intersectDelta
    }, settings);

    self.initializePlugins(options.plugins);

    self.setup();
    self.registerClickEvent(self.getNodes());
    self.moveToCentral(d3.select(".node"));
  };

  var innerRadius;
  var outerRadius;
  var centralPoint;
  var intervalMax;
  var values, valueMax, circlePositions;
  var items;
  var svg;
  var centralNode;
  var clickedNode;

  $.extend(d3.svg.BubbleChart.prototype, {
    getClickedNode: function () {
      return clickedNode;
    },

    getCentralNode: function () {
      return centralNode;
    },

    getOptions: function () {
      return options;
    },

    randomCirclesPositions: function (delta) {
      var self = this;
      var circles = [];
      var interval = 0;
      while (circles.length < items.length && ++interval < intervalMax) {
        var val = values[circles.length];
        var rad = Math.max((val * options.radiusMax) / valueMax, options.radiusMin);
        var dist = innerRadius + rad + Math.random() * (outerRadius - innerRadius - rad * 2);
        var angle = Math.random() * pi2;
        var cx = centralPoint + dist * Math.cos(angle);
        var cy = centralPoint + dist * Math.sin(angle);

        var hit = false;
        $.each(circles, function (i, circle) {
          var dx = circle.cx - cx;
          var dy = circle.cy - cy;
          var r = circle.r + rad;
          if (dx * dx + dy * dy < Math.pow(r - delta, 2)) {
            hit = true;
            return false;
          }
        });
        if (!hit) {
          circles.push({cx: cx, cy: cy, r: rad, item: items[circles.length]});
        }
      }
      if (circles.length < items.length) {
        if (delta === options.radiusMin) {
          throw {
            message: "Not enough space for all bubble. Please change the options.",
            options: options
          }
        }
        return self.randomCirclesPositions(delta + options.intersectInc);
      }
      return circles.shuffle();
    },

    getValues: function () {
      var values = [];
      $.each(items, function (i, item) {values.push(options.data.eval(item));});
      return values;
    },

    setup: function () {
      var self = this;

      innerRadius = options.innerRadius;
      outerRadius = options.outerRadius;
      centralPoint = options.size / 2;
      intervalMax = options.size * options.size;
      values, valueMax, circlePositions;
      items = options.data.items;

      values = self.getValues();
      valueMax = values.max();

      svg = d3.select(options.container).append("svg")
        .attr({preserveAspectRatio: "xMidYMid", width: options.size, height: options.size, class: "bubbleChart"})
        .attr("viewBox", function (d) {return ["0 0", options.viewBoxSize, options.viewBoxSize].join(" ")});

      circlePositions = self.randomCirclesPositions(options.intersectDelta);

      var node = svg.selectAll(".node")
        .data(circlePositions)
        .enter().append("g")
        .attr("class", function (d) {return ["node", options.data.classed(d.item)].join(" ");});

      var fnColor = d3.scale.category20();
      node.append("circle")
        .attr({r: function (d) {return d.r;}, cx: function (d) {return d.cx;}, cy: function (d) {return d.cy;}})
        .style("fill", function (d) {
          return options.data.color !== undefined ? options.data.color(d.item) : fnColor(d.item.text);
        })
        .attr("opacity", "0.8");
      node.sort(function (a, b) {return options.data.eval(b.item) - options.data.eval(a.item);});
    },

    getCirclePositions: function () {
      return circlePositions;
    },

    moveToCentral: function (node) {
      var toCentralPoint = d3.svg.transform()
        .translate(function (d) {
          var cx = node.select('circle').attr("cx");
          var dx = centralPoint - d.cx;
          var dy = centralPoint - d.cy;
          return [dx, dy];
        });
      centralNode = node;
      centralNode.classed({active: true})
        .transition().duration(options.transitDuration)
        .attr('transform', toCentralPoint)
        .select("circle")
        .attr('r', function (d) {return options.innerRadius;});
    },

    moveToReflection: function (node, swapped) {
      var toReflectionPoint = d3.svg.transform()
        .translate(function (d) {
          var dx = 2 * (centralPoint - d.cx);
          var dy = 2 * (centralPoint - d.cy);
          return [dx, dy];
        });

      node.transition()
        .duration(options.transitDuration)
        .delay(function (d, i) {return i * 10;})
        .attr('transform', swapped ? "" : toReflectionPoint)
        .select("circle")
        .attr('r', function (d) {return d.r;});
    },

    reset: function (node) {
      node.classed({active: false});
    },

    registerClickEvent: function (node) {
      var self = this;
      var swapped = false;
      node.style("cursor", "pointer").on("click", function (d) {
        clickedNode = d3.select(this);
        self.reset(centralNode);
        self.moveToCentral(clickedNode);
        self.moveToReflection(svg.selectAll(".node:not(.active)"), swapped);
        swapped = !swapped;
      });
    },

    getNodes: function () {
      return svg.selectAll(".node");
    },

    get: function () {
      return svg;
    }
  });

  MicroPlugin.mixin(d3.svg.BubbleChart);

  return d3.svg.BubbleChart;
}));
/**
 * Settings of bubble chart
 *
 * @typedef {object} settings
 *
 * @param {(object[]|string[])} plugins - Array of plugin [microplugin](https://github.com/brianreavis/microplugin.js|microplugin)
 * @param {string} [container=".bubbleChart"] - Jquery selector which will contain the chart
 * @param {number} size - Size of the chart, in pixel
 * @param {number} [viewBoxSize=size] - Size of the viewport of the chart, in pixel [ViewBoxAttribute](http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute)
 * @param {number} [innerRadius=size/3] - Radius of the Inner Circle, in pixel
 * @param {number} [outerRadius=size/2] - Radius of the Outer Circle, in pixel
 * @param {number} [radiusMin=size/10] - Minimum radius, in pixel,
 * @param {number} [radiusMax=(outerRadius  innerRadius)/2] - Maximum radius, in pixel
 * @param {number} [intersectDelta=0] - Intersection between circles, in pixel
 * @param {number} [intersectInc=intersectDelta] - Increment of settings.intersectDelta, in pixel
 * @param {number} [transitDuration=1000] - Duration of transition when do animations, in mili-seconds
 * @param {data} data - Data information
 */
/**
 * Data information
 *
 * @typedef {object} data
 * @property {object[]} items - Array of items <br/> Example
 *  ```js
 *  [{number: 179, label: "something"}, {number: 220, label: "everything"}]
 *  ```
 * @property {function} eval - Function should return a number used to evaluate an item <br/> Example
 * ```js
 * function(d){return d.number;}
 * ```
 * @property {function} [color=d3.scale.category20] - Function should return a string used to fill bubbles <br/>Example
 * ```js
 * function(d){return "white";}
 * ```
 */