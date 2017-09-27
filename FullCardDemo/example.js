let rainbowColor = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"];
let rainbowColorText = ["red","orange","yellow","green","blue","indigo","purple"];
let deck = [];//club,diamond,heart,spade
let handcard = [];
let svgWidth = 1500;
let svgHeight = 400;
let cardIndent = 30;
let svgbackground;
let count = 0;
let svg = d3.select("body div")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", svgWidth)       //设定宽度
    .attr("height", svgHeight);    //设定高度
function init()
{
	svgbackground= d3.select('svg')
    .append('rect')
    .attr({
    'height':svgHeight,
    'width':svgWidth,
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
	draw();
	console.log(handcard);
	printCard(deck);
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

function printCard(cardContainer)
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
		if(i%11==0&&i)
		{
			rectY = rectY+rectHeight+cardIndent;
			svg.attr("height", parseInt(svg.attr("height"))+parseInt(rectHeight)+parseInt(cardIndent));
			svgbackground.attr("height", parseInt(svg.attr("height"))+parseInt(rectHeight)+parseInt(cardIndent));
			rectX = beginX;
		}
	    var rects= d3.select('svg')
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
	    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr);
	    rectX=rectX+cardIndent+rectWidth;
	}
}
function rainbowInCard(x,y,h,w,colors)
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
		d3.select('svg')
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

function alert()
{
	console.log("!!!!");
}

init();