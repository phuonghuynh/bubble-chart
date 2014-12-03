$(document).ready(function () {
  var bubbleChart = new d3.bubbleChart({
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    dataFormat: {
      normalTextLines: [
        {}
      ],
      centerTextLines: [
        {}
      ]
    },
    data: {
      items: [
        {text: "Java", count: "236"},
        {text: ".Net", count: "382"},
        {text: "Php", count: "170"},
        {text: "Ruby", count: "123"},
        {text: "D", count: "12"},
        {text: "Python", count: "170"},
        {text: "C/C++", count: "382"},
        {text: "Pascal", count: "10"},
        {text: "A very very very long text", count: "170"},
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    }
  });

});