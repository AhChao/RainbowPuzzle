let rainbowColor = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"];
let rainbowColorText = ["red","orange","yellow","green","blue","indigo","purple"];
let deck = [];//club,diamond,heart,spade
let handcard = [];
let fieldcard = {
	pile1:[],
	pile2:[],
	pile3:[]
}
let svgWidth = 200;
let svgHeight = 200;
let cardIndent = 30;
let handSvgBackground;
let fieldSvgBackground;
let count = 0;
let rowCount = 5;
let fieldSvg = d3.select("#field")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", 1200)       //设定宽度
    .attr("height", svgHeight)    //设定高度
    .attr("id", "fieldSvg"); 
let handSvg = d3.select("#hand")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", svgWidth)       //设定宽度
    .attr("height", svgHeight)    //设定高度
    .attr("id", "handSvg"); 
function init()
{
	handSvgBackground= d3.select("#handSvg")
    .append('rect')
    .attr({
    'height':svgHeight,
    'width':svgWidth,
    'fill':'#ffffff',
    'stroke':'#000000',
    'stroke-width':'10px',
    });
    fieldSvgBackground= d3.select("#fieldSvg")
    .append('rect')
    .attr({
    'height':fieldSvg.attr("height"),
    'width':fieldSvg.attr("width"),
    'fill':'#ffffff',
    'stroke':'#000000',
    'stroke-width':'10px',
    });
	
	getPowerSet(0,rainbowColor);	

	//洗牌
	for(let i=0;i<deck.length;i++)
	{
		let randomIndex = parseInt(Math.random()*count);
		let t = deck[i];
		deck[i] = deck[randomIndex];
		deck[randomIndex] = t;
	}
	console.log(deck);
	//send a card to player
	for(let i=0;i<10;i++) draw();
	console.log(handcard);
	printCard(handcard,handSvg,handSvgBackground,"#handSvg");
	drawToField();
	printCardTofield(fieldcard,fieldSvg,fieldSvgBackground,"#fieldSvg");
}

//判斷有無使用某元素的二元樹來生成冪集
function getPowerSet(i, listA) {  
	let listB = [];  
    function recurse(i, listA) {
        if(i > listA.length - 1){
            //输出当前Ｂ值，即幂集里的一个元素            
            if(listB.length>0)
            {
            	//存入全域牌組
            	deck[count]={
				 color:[],
				 num:count
				}
				deck[count].color=Object.assign({}, listB);//deep copy
            	count = count+1;
            }
        } else {
            var x = listA[i];
            listB.push(x);
            recurse(i+1, listA);//有x            
            listB.pop(x);
            recurse(i+1, listA);//沒x
        }
    }
    recurse(i, listA);
}

function draw()
{
	handcard.push(deck[0]);
	deck.shift();
}

function drawToField()
{
	fieldcard.pile1.push(deck[0]);
	deck.shift();
	fieldcard.pile2.push(deck[0]);
	deck.shift();
	fieldcard.pile3.push(deck[0]);
	deck.shift();
}

function printCard(cardContainer,svg,svgbackground,svgId)
{	
	var rectHeight = 150;
	var rectWidth = 100;
	var rectRadius = 20;
	var rectStroke;
	var rectX = 0+cardIndent;
	var rectY = 0+cardIndent;
	var beginX = rectX
	//顯示所有的牌
	for(var i = 0;i<cardContainer.length;i++)
	{		 
		if(i%rowCount==0&&i)
		{
			rectY = rectY+rectHeight+cardIndent;
			svg.attr("height", parseInt(svg.attr("height"))+parseInt(rectHeight)+parseInt(cardIndent));
			svgbackground.attr("height", parseInt(svgbackground.attr("height"))+parseInt(rectHeight)+parseInt(cardIndent));
			rectX = beginX;
		}
	    var rects= d3.select(svgId)
	    .append('rect')
	    .attr({
	    'height':rectHeight,
	    'width':rectWidth,
	    'x':rectX,
	    'y':rectY,
	    'rx':rectRadius,
	    'ry':rectRadius,
	    'fill':'#ffffff',
	    'stroke':'#000000',
	    'stroke-width':'5px',
	    'onclick':'alert()',
	    });	    
	    //var colors = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"]
	    var colorArr=[]; 
	    for( key in cardContainer[i].color)
	    {
	    	colorArr.push(cardContainer[i].color[key]);
	    }
	    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr,svgId);
	    rectX=rectX+cardIndent+rectWidth;
	    if(i<rowCount)
	    {
	    	svg.attr("width", parseInt(svg.attr("width"))+parseInt(rectWidth)+parseInt(cardIndent));
			svgbackground.attr("width", parseInt(svgbackground.attr("width"))+parseInt(rectWidth)+parseInt(cardIndent));
		}
	}
}
function rainbowInCard(x,y,h,w,colors,svgId)
{
	var indent = 20
	var width = w-indent*2;
	var height = h-indent*2;
	var x = x+indent
	var y = y+indent
	var totalColors = colors.length;	
    height=height/totalColors;
    for(var i=0;i<totalColors;i++)
	{
		d3.select(svgId)
	    .append('rect')
	    .attr({
	    'height':height,
	    'width':width,
	    'x':x,
	    'y':y,
	    'fill':colors[i]
	    });
	    y=y+height;
	}
}

function printCardTofield(cardContainer,svg,svgbackground,svgId)
{	
	var rectHeight = 150;
	var rectWidth = 100;
	var rectRadius = 20;
	var rectStroke;
	var rectX = 0+cardIndent;
	var rectY = 0+cardIndent;
	var beginX = rectX; 
	//顯示所有的牌
	var countPile = 0;
	for(pile in cardContainer)
	{		
		for(var i = 0;i<cardContainer[pile].length;i++)
		{		 
		    var rects= d3.select(svgId)
		    .append('rect')
		    .attr({
		    'height':rectHeight,
		    'width':rectWidth,
		    'x':rectX,
		    'y':rectY,
		    'rx':rectRadius,
		    'ry':rectRadius,
		    'fill':'#ffffff',
		    'stroke':'#000000',
		    'stroke-width':'5px',
		    'onclick':'alert()',
		    });	    
		    //var colors = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"]
		    var colorArr=[]; 
		    for( key in cardContainer[pile][0].color)
		    {
		    	colorArr.push(cardContainer[pile][0].color[key]);
		    }
		    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr,svgId);
		    rectX=rectX+cardIndent+rectWidth;
		}
		countPile++;
		rectX=parseInt(beginX)+(countPile)*3.5*rectWidth+parseInt(cardIndent);
	}
	
}

function alert()
{
	console.log("!!!!");
}

init();