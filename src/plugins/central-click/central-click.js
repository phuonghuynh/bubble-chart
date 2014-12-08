/**
 * central-click.js
 * Copyright (c) 2014 Phuong Huynh & contributors
 *
 * Licensed under the MIT License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Phuong Huynh <phuonghqh@gmail.com>
 */
BubbleChart.define("central-click", function (options) {
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