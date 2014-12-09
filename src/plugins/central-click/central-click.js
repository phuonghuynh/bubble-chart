/**
 * central-click.js
 */
d3.svg.BubbleChart.define("central-click", function (options) {
  var self = this;

  self.reset = (function (node) {
    var original = self.reset;
    return function (node) {
      var fn = original.apply(this, arguments);
      node.select("text.central-click").remove();
      return fn;
    };
  })();

  self.moveToCentral = (function (node) {
    var original = self.moveToCentral;
    return function (node) {
      var fn = original.apply(this, arguments);
      node.append("text").classed({"central-click": true})
        .attr(options.attr)
        .style(options.style)
        .attr("x", function (d) {return d.cx;})
        .attr("y", function (d) {return d.cy;})
        .text(options.text)
        .style("opacity", 0).transition().duration(self.getOptions().transitDuration).style("opacity", "0.8");
      return fn;
    };
  })();

  //self.onClick = (function () {
  //  var original = self.onClick;
  //  return function () {
  //    var fn = original.apply(this, arguments);
  //    var node = self.getClickedNode();
  //    if (node.selectAll("text.central-click")[0].length === 1) {
  //      return options.centralClick.apply(this, arguments);
  //    }
  //    return fn;
  //  };
  //})();
});