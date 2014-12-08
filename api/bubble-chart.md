<a name="BubbleChart"></a>
#class: BubbleChart
**Members**

* [class: BubbleChart](#BubbleChart)
  * [new BubbleChart(options)](#new_BubbleChart)

<a name="new_BubbleChart"></a>
##new BubbleChart(options)
Bubble Chart implementation using `d3js.org`

**Params**

- options `object` - Settings of bubble chart  
  - plugins `Array.<object>` | `Array.<string>` - Array of plugin [microplugin](https://github.com/brianreavis/microplugin.js|microplugin)  
  - \[container=".bubbleChart"\] `string` - Jquery selector which will contain the chart  
  - size `number` - Size of the chart, in pixel  
  - \[viewBoxSize=options.size\] `number` - Size of the viewport of the chart, in pixel [ViewBoxAttribute](http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute)  
  - \[innerRadius=options.size/3\] `number` - Radius of the Inner Circle, in pixel  
  - \[outerRadius=options.size/2\] `number` - Radius of the Outer Circle, in pixel  
  - \[radiusMin=options.size/10\] `number` - Minimum radius, in pixel,  
  - \[radiusMax=(options.outerRadius - options.innerRadius)/2\] `number` - Maximum radius, in pixel  
  - \[intersectDelta=0\] `number` - Intersection between circles, in pixel  
  - \[intersectInc=options.intersectDelta\] `number` - Increment of options.intersectDelta, in pixel  
  - \[transitDuration=1000\] `number` - Duration of transition when do animations, in mili-seconds  
  - data `object` - Data information  
  - items `Array.<object>` - Array of items <br/> Example
   ```js
[{number: 179, label: "something"}, {number: 220, label: "everything"}]
   ```  
  - eval `function` - Function should return a number used to evaluate an item <br/> Example
   ```js
function(d){return d.number;}
   ```  
  - \[color=d3.scale.category20\] `function` - Function should return a string used to fill bubbles <br/>Example
   ```js
function(d){return "white";}
   ```  

**Example**  
- [test-bubble-chart](../test/test-bubble-chart.html)

