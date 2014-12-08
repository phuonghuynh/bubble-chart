/**
 * lines.js
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
BubbleChart.define("lines", function (options) {
  /*
   * @param
   *  options = {
   *    format: [ //n-th object is used to format n-th line
   *      {
   *        textField: #string, name of property will be used in function text(), @link
   *        classed: #object, @link
   *        style: #object, @link
   *        attr: #object, @link
   *      }
   *    ],
   *    centralFormat: [ //@see #format, but used to format central-bubble
   *    ]
   *  }
   * */

  var self = this;

  self.setup = (function () {
    var original = self.setup;
    return function () {
      var fn = original.apply(this, arguments);
      var node = self.getNodes();
      $.each(options.format, function (i, f) {
        node.append("text")
          .classed(f.classed)
          .style(f.style)
          .attr(f.attr)
          .text(function (d) {return d.item[f.textField];});
      });
      return fn;
    };
  })();

  self.reset = (function (node) {
    var original = self.reset;
    return function (node) {
      var fn = original.apply(this, arguments);
      $.each(options.format, function (i, f) {
        var tNode = d3.select(node.selectAll("text")[0][i]);
        tNode.classed(f.classed).text(function (d) {return d.item[f.textField];})
          .transition().duration(self.getOptions().transitDuration)
          .style(f.style)
          .attr(f.attr);
      });
      return fn;
    };
  })();

  self.moveToCentral = (function (node) {
    var original = self.moveToCentral;
    return function (node) {
      var fn = original.apply(this, arguments);
      $.each(options.centralFormat, function (i, f) {
        var tNode = d3.select(node.selectAll("text")[0][i]);
        tNode.transition().duration(self.getOptions().transitDuration)
          .style(f.style)
          .attr(f.attr);
        f.classed !== undefined && tNode.classed(f.classed);
        f.textField !== undefined && tNode.text(function (d) {return d.item[f.textField];});
      });
      return fn;
    };
  })();
});