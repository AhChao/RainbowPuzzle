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
let chosenPile = 0;//被選中的牌堆
let rectHeight = 150;
let rectWidth = 100;
let rectRadius = 20;
let rectStroke;
let actions = 0;
let actionsText;
let selectRect;
let fieldSvg = d3.select("#field")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", 1350)       //设定宽度
    .attr("height", svgHeight)    //设定高度
    .attr("id", "fieldSvg"); 
let handSvg = d3.select("#hand")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", svgWidth)       //设定宽度
    .attr("height", svgHeight)    //设定高度
    .attr("id", "handSvg"); 
function init()
{
	actionsText = document.getElementById("actionsText")
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
	
	//生牌後洗牌
	getPowerSet(0,rainbowColor);
	for(let i=0;i<deck.length;i++)
	{
		let randomIndex = parseInt(Math.random()*count);
		let t = deck[i];
		deck[i] = deck[randomIndex];
		deck[randomIndex] = t;
	}
	//發牌給玩家
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
function drawBtn()
{
	handcard.push(deck[0]);
	deck.shift();
	actions++;
    actionsText.innerText = actions;
	printCard(handcard,handSvg,handSvgBackground,"#handSvg");
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
	var rectX = 0+cardIndent;
	var rectY = 0+cardIndent;
	var beginX = rectX
	//顯示所有的牌
	for(var i = 0;i<cardContainer.length;i++)
	{		 
		if(i%rowCount==0&&i)
		{
			//svg.attr("height",1000);
			//svgbackground.attr("height",1000);
			svg.attr("height", (parseInt(rectHeight)+parseInt(cardIndent))*parseInt(cardContainer.length/rowCount+1)+parseInt(cardIndent));
			svgbackground.attr("height", (parseInt(rectHeight)+parseInt(cardIndent))*parseInt((cardContainer.length-1)/rowCount+1)+parseInt(cardIndent));
			rectX = beginX;
			rectY = rectY+rectHeight+cardIndent;			
		}
		var group = d3.select(svgId)
	    .append('g');
	    var rects= group//d3.select(svgId)
	    .append('rect');
	    rects.attr({
	    'height':rectHeight,
	    'width':rectWidth,
	    'x':rectX,
	    'y':rectY,
	    'rx':rectRadius,
	    'ry':rectRadius,
	    'fill':'#ffffff',
	    'stroke':'#000000',
	    'stroke-width':'5px',
	    'onclick':'cardClicked(this)',
	    });	    
	    //var colors = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"]
	    var colorArr=[]; 
	    for( key in cardContainer[i].color)
	    {
	    	colorArr.push(cardContainer[i].color[key]);
	    }
	    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr,svgId,group);
	    rectX=rectX+cardIndent+rectWidth;
	    if(i<rowCount&&init)
	    {
	    	svg.attr("width", (parseInt(rectWidth)+parseInt(cardIndent))*parseInt(rowCount)+parseInt(cardIndent));
			svgbackground.attr("width", (parseInt(rectWidth)+parseInt(cardIndent))*parseInt(rowCount)+parseInt(cardIndent));
		}
	}
}
function rainbowInCard(x,y,h,w,colors,svgId,group)
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
		group
		//d3.select(svgId)
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
	var rectX = 0+cardIndent;
	var rectY = 0+cardIndent;
	var beginX = rectX; 
	//顯示所有的牌
	var countPile = 0;
	for(pile in cardContainer)
	{		
		for(var i = 0;i<cardContainer[pile].length;i++)
		{		 
		    var group = d3.select(svgId)
	    	.append('g');
	    	var rects= group
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
		    'onclick':'cardClicked(this)',
		    });	    
		    //var colors = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"]
		    var colorArr=[]; 
		    for( key in cardContainer[pile][i].color)
		    {
		    	colorArr.push(cardContainer[pile][i].color[key]);
		    }
		    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr,svgId,group);
		    rectX=rectX+rectWidth*0.5;
		}
		countPile++;
		rectX=parseInt(beginX)+(countPile)*4*rectWidth+parseInt(cardIndent);
	}	
}

function cardClicked(card)
{
	actions++;
	actionsText.innerText = actions;
	let x = card.getAttribute('x');
	let y = card.getAttribute('y');
	let cardindex;
	if(String(card.parentNode.parentNode.id)=="handSvg")//點擊手牌
	{
		console.log(chosenPile);
		if(chosenPile>0)
		{
			cardIndex = (x-cardIndent)/(rectWidth+cardIndent)+(y-cardIndent)/(rectHeight+cardIndent)*rowCount;
			let tempcard = handcard[cardIndex];
			handcard.splice(cardIndex,1);
			card.parentNode.parentNode.removeChild(card.parentNode);//移除手牌
			if(chosenPile == 1)
				fieldcard.pile1.push(tempcard);
			else if(chosenPile == 2)
				fieldcard.pile2.push(tempcard);
			else if(chosenPile == 3)
				fieldcard.pile3.push(tempcard);
			handSvg.selectAll("g").remove()
			printCard(handcard,handSvg,handSvgBackground,"#handSvg");
			printCardTofield(fieldcard,fieldSvg,fieldSvgBackground,"#fieldSvg");
		}
	}  
	else if(String(card.parentNode.parentNode.id)=="fieldSvg")//點擊場面牌
	{
		//to do : 畫紅框改變選擇的牌堆
		selectPile(x,y);
	}  
}
function selectPile(clickedX,clickedY)
{
	let pileIndex = (clickedX-cardIndent)/rectWidth;	
	if(pileIndex<4) pileIndex = 0;
	else if(pileIndex<8) pileIndex = 1;
	else pileIndex = 2;
	chosenPile = pileIndex+1;
	let rightIndentExist = 0;
	if( pileIndex>0 ) rightIndentExist = 1;
	let x = (parseInt(pileIndex))*4*rectWidth+parseInt(cardIndent)+cardIndent*rightIndentExist;
	let redRectH=parseInt(cardIndent/2)+parseInt(rectHeight);
	let redRectW=4*rectWidth;
	if( selectRect )
	{
		let tempRect = document.getElementById("selectRect");
		tempRect.parentNode.removeChild(tempRect);
	} 
	selectRect= d3.select("#fieldSvg")
		.append('rect')
		.attr({
		'id':"selectRect",
		'height':redRectH,
		'width':redRectW,
		'x':parseInt(x)-parseInt(cardIndent/3),
		'y':parseInt(clickedY)-parseInt(cardIndent/3),
		'fill':'None',
		'stroke':'#FF0000',
		'stroke-width':'10px',
	});
}
init();