#Index

**Classes**

* [class: BubbleChart](#BubbleChart)
  * [new BubbleChart(settings)](#new_BubbleChart)

**Typedefs**

* [type: settings](#settings)
* [type: data](#data)
 
<a name="BubbleChart"></a>
#class: BubbleChart
**Members**

* [class: BubbleChart](#BubbleChart)
  * [new BubbleChart(settings)](#new_BubbleChart)

<a name="new_BubbleChart"></a>
##new BubbleChart(settings)
Bubble Chart implementation using `d3js.org`

**Params**

- settings <code>[settings](#settings)</code> - Settings of bubble chart  

**Example**  
- [test-bubble-chart](../test/test-bubble-chart.html)

<a name="settings"></a>
#type: settings
Settings of bubble chart

**Params**

- plugins `Array.<object>` | `Array.<string>` - Array of plugin [microplugin](https://github.com/brianreavis/microplugin.js|microplugin)  
- \[container=".bubbleChart"\] `string` - Jquery selector which will contain the chart  
- size `number` - Size of the chart, in pixel  
- \[viewBoxSize=size\] `number` - Size of the viewport of the chart, in pixel [ViewBoxAttribute](http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute)  
- \[innerRadius=size/3\] `number` - Radius of the Inner Circle, in pixel  
- \[outerRadius=size/2\] `number` - Radius of the Outer Circle, in pixel  
- \[radiusMin=size/10\] `number` - Minimum radius, in pixel  
- \[radiusMax=(outerRadius  innerRadius)/2\] `number` - Maximum radius, in pixel  
- \[intersectDelta=0\] `number` - Intersection between circles, in pixel  
- \[intersectInc=intersectDelta\] `number` - Increment of settings.intersectDelta, in pixel  
- \[transitDuration=1000\] `number` - Duration of transition when do animations, in mili-seconds  
- data <code>[data](#data)</code> - Data information  

**Type**: `object`  
<a name="data"></a>
#type: data
Data information

**Params**

- items `Array.<object>` - Array of items <br/> ex:
```js
data.items = [{number: 179, label: "something"}, {number: 220, label: "everything"}]
```  
- eval `function` - Function should return a number used to evaluate an item <br/> ex:
```js
data.eval = function(d){
  return d.number;
}
```  
- \[color=d3.scale.category20\] `function` - Function should return a string used to fill bubbles <br/>ex:
```js
data.color = function(d){
  return "white";
}
```  

**Type**: `object`  
