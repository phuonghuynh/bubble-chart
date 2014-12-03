/**
 * bubble-chart.js (v0.1)
 * Copyright (c) 2014 Phuong Huynh & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Phuong Huynh <phuonghqh@gmail.com>
 */
(function () {
  /**
   *
   * @param
   *  options = {
   *    container: #jquery selector which contains the chart, default is ".bubbleChart"
   *    *size: #number in pixel, size of the chart
   *    viewBoxSize: #number in pixel, equals to #size if undefined, @see http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
   *    innerRadius: #number in pixel, radius of the Inner Circle, equals to #size/3 if undefined,
   *    outerRadius: #number in pixel, radius of the Outer Circle, equals to #size/2 if undefined
   *    radiusMin: #number in pixel, minimum radius, equals to #size/10 if undefined
   *    radiusMax: #number in pixel, maximum radius, equals to (#ring.outerRadius - #ring.innerRadius)/2 if undefined
   *    intersectDelta: #number in pixel, intersection between circles, default is 0,
   *    intersectInc: #number in pixel, increment of delta, default is #delta,
   *    transitDuration: #number in mili-seconds, default is 1000ms = 1s
   *    *dataFormat: {
   *      *normalTextLines: #array of svg text attributes/style/classes use to style rendering labels, @see http://www.w3.org/TR/SVG/text.html#TextElement
   *        @ex: [
   *                { **line #1
   *                  attrs: {dy: "40px", dx: "0px"},
   *                  classed: {active: true, blue: false}
   *                  style: {"fill" : "white", "font-family", "roboto,arial"},
   *                  prop: #string, value of #data.prop, @ex: "number"
   *                },
   *                { **line #2
   *                  attrs: {dy: "70px", dx: "0px"},
   *                  classed: {active: true, blue: false},
   *                  style: {"fill" : "white", "font-family", "roboto,arial"},
   *                  prop: #string, value of #data.prop, @ex: "label"
   *                }
   *             ],
   *      *centerTextLines: @see #normalTextLines, use to format text in the center bubble
   *    },
   *    *data: {
   *      items: #array of items will be drawn, @ex: [{number: 179, label: "something"}, {number: 220, label: "everything"}],
   *      eval: function(item) {return #number} , return #number which is used to evaluate item(@param item) between others,
   *      classed: function(item) {return class #string represent item(@param item)},
   *      color: function(item){return color of circle by given item(@param item)}, default is d3.scale.category20
   *    }
   *  }
   *
   *
   *  "*" required fields
   **/
  d3.bubbleChart = function (opts) {
    var defaultViewBoxSize = opts.size;
    var defaultInnerRadius = opts.size / 3;
    var defaultOuterRadius = opts.size / 2;
    var defaultRadiusMin = opts.size / 10;
    var pi2 = Math.PI * 2;

    var options = {};
    $.extend(options, {
      container: ".bubbleChart",
      viewBoxSize: defaultViewBoxSize,
      innerRadius: defaultInnerRadius,
      outerRadius: defaultOuterRadius,
      radiusMin: defaultRadiusMin,
      intersectDelta: 0,
      transitDuration: 1000
    }, opts);

    $.extend(options, {
      radiusMax: (options.outerRadius - options.innerRadius) / 2,
      intersectInc: options.intersectDelta
    }, opts);

    //if (typeof options.data.color !== "function") {
    //  options.data.color = d3.scale.category20();
    //}

    var innerRadius = options.innerRadius;
    var outerRadius = options.outerRadius;
    var centerPoint = opts.size / 2;
    var intervalMax = opts.size * opts.size;
    var values, valueMax, circlePositions;
    var items = options.data.items;

    var $$ = {
      getValues: function () {
        var values = [];
        $.each(items, function (i, item) {values.push(options.data.eval(item));});
        return values;
      },

      randomCirclesPositions: function (delta) {
        var circles = [];
        var interval = 0;
        while (circles.length < items.length && ++interval < intervalMax) {
          var val = values[circles.length];
          var rad = Math.max((val * options.radiusMax) / valueMax, options.radiusMin);
          var dist = innerRadius + rad + Math.random() * (outerRadius - innerRadius - rad * 2);
          var angle = Math.random() * pi2;
          var cx = centerPoint + dist * Math.cos(angle);
          var cy = centerPoint + dist * Math.sin(angle);

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
          return $$.randomCirclesPositions(delta + options.intersectInc);
        }
        return circles;
      },

      moveToCenter: function (node) {
        var toCenterPoint = d3.svg.transform()
          .translate(function (d) {
            var cx = node.select('circle').attr("cx");
            var dx = centerPoint - d.cx;
            var dy = centerPoint - d.cy;
            return [dx, dy];
          });

        node.classed({active: true})
          .transition().duration(options.transitDuration)
          .attr('transform', toCenterPoint)
          .select("circle")
          .attr('r', function (d) {return options.innerRadius;});
      },

      moveToReflection: function (node, swapped) {
        var toReflectionPoint = d3.svg.transform()
          .translate(function (d) {
            var dx = 2 * (centerPoint - d.cx);
            var dy = 2 * (centerPoint - d.cy);
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
        //node.selectAll("text.clickMe").remove();

        //node.selectAll("text.termCount").transition().duration(1000)
        //  .style("font-size", function (d) { return d.termCount.fontSize + "px";});
        //
        //node.selectAll("text.termLabel").transition().duration(1000)
        //  .attr("dy", function (d) {return d.termLabel.dy;})
        //  .style("font-size", function (d) { return d.termLabel.fontSize + "px";});
      },

      onClick: function (node) {
        var swapped = false;
        node.style("cursor", "pointer").on("click", function (d) {
          var d3Node = d3.select(this);
          $$.reset(BubbleChart.getNodes());
          $$.moveToCenter(d3Node);
          $$.moveToReflection(BubbleChart.selectAll(".node:not(.active)"), swapped);
          swapped = !swapped;
        });
      }
    }

    values = $$.getValues();
    valueMax = values.max();

    var BubbleChart = d3.select(options.container).append("svg")
      .attr({preserveAspectRatio: "xMidYMid", width: options.size, height: options.size, class: "bubbleChart"})
      .attr("viewBox", function (d) {return ["0 0", options.viewBoxSize, options.viewBoxSize].join(" ")});

    circlePositions = $$.randomCirclesPositions(options.intersectDelta);

    $.extend(BubbleChart, {

      getNodes: function () {
        return this.selectAll(".node");
      },

      getCircles: function () {
        return this.selectAll("circle");
      }
    });

    var node = BubbleChart.getNodes()
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

    $$.onClick(node);
    return BubbleChart;
  }
})();