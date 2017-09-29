let rainbowColor = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#0066CC","#CA8EFF"];
let rainbowColorText = ["red","orange","yellow","green","blue","indigo","purple"];
let deck = [];//club,diamond,heart,spade
let handcard = [];
let fieldcard = [[],[],[]];
let pileColor = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
let viewColor = [0,0,0,0,0,0,0];
let svgWidth = 200;
let svgHeight = 200;
let cardIndent = 30;
let handSvgBackground;
let fieldSvgBackground;
let count = 0;
let rowCount = 5;
let chosenPile = -1;//被選中的牌堆
let rectHeight = 150;
let rectWidth = 100;
let rectRadius = 20;
let rectStroke;
let actions = 0;
let deckFinish = 0;
let actionsText;
let leftcardsText;
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
	leftcardsText = document.getElementById("leftcardsText")
	barGenerate("#topBar");
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
    //barGenerate("#butBar");
	
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
	if(!deck.length) alert("牌庫告罄，你輸了!\n[重新整理/F5 以開啟一場新遊戲]");
	handcard.push(deck[0]);
	deck.shift();
	leftcardsText.innerText = deck.length;
}
function drawBtn()
{
	handcard.push(deck[0]);
	deck.shift();
	leftcardsText.innerText = deck.length;
	actions++;
    actionsText.innerText = actions;
	printCard(handcard,handSvg,handSvgBackground,"#handSvg");
}

function drawToField()
{
	for(let i =0;i<3;i++)
	{
		fieldcard[i].push(deck[0]);
		for(colors in deck[0].color)
		{
			pileColor[i][rainbowColor.indexOf(deck[0].color[colors])]++;
		}
		deck.shift();
	}	
	leftcardsText.innerText = deck.length;
}

function drawToPile(chosenPileNo)
{
	fieldcard[chosenPileNo].push(deck[0]);
	for(colors in deck[0].color)
	{
		pileColor[chosenPileNo][rainbowColor.indexOf(deck[0].color[colors])]++;
	}
	deck.shift();
	leftcardsText.innerText = deck.length;
}

function printCard(cardContainer,svg,svgbackground,svgId)
{	
	if(handSvg)
	{
		d3.select("#handSvg").remove();
		handSvg = d3.select("#hand")     //选择文档中的body元素
	    .append("svg")          //添加一个svg元素
	    .attr("width", svgWidth)       //设定宽度
	    .attr("height", svgHeight)    //设定高度
	    .attr("id", "handSvg");
	    handSvgBackground= d3.select("#handSvg")
	    .append('rect')
	    .attr({
	    'height':svgHeight,
	    'width':svgWidth,
	    'fill':'#ffffff',
	    'stroke':'#000000',
	    'stroke-width':'10px',
	    });
	}
	svg=handSvg;
	svgbackground=handSvgBackground;
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
	    .append('g')
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
	    let fakeRects= group//d3.select(svgId)
	    .append('rect')
	    .attr({
	    'height':rectHeight,
	    'width':rectWidth,
	    'x':rectX,
	    'y':rectY,
	    'rx':rectRadius,
	    'ry':rectRadius,
	    'fill':'#FF0000',
	    'stroke':'#000000',
	    'stroke-width':'5px',
	    'opacity':'0',
	    'onclick':'cardClicked(this)',
	    });
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
	if(fieldSvg)
	{
		d3.select("#fieldSvg").remove();
		fieldSvg = d3.select("#field")     //选择文档中的body元素
	    .append("svg")          //添加一个svg元素
	    .attr("width", 1350)       //设定宽度
	    .attr("height", svgHeight)    //设定高度
	    .attr("id", "fieldSvg");
	    fieldSvgBackground= d3.select("#fieldSvg")
	    .append('rect')
	    .attr({
	    'height':fieldSvg.attr("height"),
	    'width':fieldSvg.attr("width"),
	    'fill':'#ffffff',
	    'stroke':'#000000',
	    'stroke-width':'10px',
	    });
	    if(chosenPile>=0)
	    {
		    let pileX = [20,450,850];
		    let redRectH=parseInt(cardIndent/2)+parseInt(rectHeight);
			let redRectW=4*rectWidth;
		    selectRect= d3.select("#fieldSvg")
			.append('rect')
			.attr({
			'id':"selectRect",
			'height':redRectH,
			'width':redRectW,
			'x':pileX[chosenPile],
			'y':20,
			'fill':'None',
			'stroke':'#FF0000',
			'stroke-width':'10px',
			});
		}
	}
	svg=fieldSvg;
	svgbackground=fieldSvgBackground;
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
		    'pileNo':pile,
		    });	    
		    //var colors = ["#FF5151","#FFAD86","#FFE66F","#93FF93","#84C1FF","#AAAAFF","#CA8EFF"]
		    var colorArr=[]; 
		    for( key in cardContainer[pile][i].color)
		    {
		    	colorArr.push(cardContainer[pile][i].color[key]);
		    }
		    rainbowInCard(rectX,rectY,rectHeight,rectWidth,colorArr,svgId,group);
		    let fakeRects= group//d3.select(svgId)
		    .append('rect')
		    .attr({
		    'height':rectHeight,
		    'width':rectWidth,
		    'x':rectX,
		    'y':rectY,
		    'rx':rectRadius,
		    'ry':rectRadius,
		    'fill':'#FF0000',
		    'stroke':'#000000',
		    'stroke-width':'5px',
		    'opacity':'0',
		    'onclick':'cardClicked(this)',
		    });
		    rectX=rectX+rectWidth*0.5;
		}
		countPile++;
		rectX=parseInt(beginX)+(countPile)*4*rectWidth+parseInt(cardIndent);
	}	
}

function cardClicked(card)
{		
	let x = card.getAttribute('x');
	let y = card.getAttribute('y');
	let cardindex;
	if(String(card.parentNode.parentNode.id)=="handSvg")//點擊手牌
	{		
		let punishment = 0;
		let fullColor=0;
		if(chosenPile>=0)
		{			
			cardIndex = (x-cardIndent)/(rectWidth+cardIndent)+(y-cardIndent)/(rectHeight+cardIndent)*rowCount;
			let tempcard = handcard[cardIndex];			
			if(chosenPile >= 0)//有選牌堆
			{
				fieldcard[chosenPile].push(tempcard);
				//打出卡時 判斷消去與懲罰打出重複顏色
				//deck[0].color 是牌堆中的第一張的顏色集合								
				for(colors in tempcard.color)
				{
					if(pileColor[chosenPile][rainbowColor.indexOf(tempcard.color[colors])]>0)
						punishment++;
					pileColor[chosenPile][rainbowColor.indexOf(tempcard.color[colors])]++;
				}	
				for(colors in pileColor[chosenPile])
				{
					if(pileColor[chosenPile][colors]>0)
						fullColor++;
				}			
				console.log("p : "+ punishment);
				console.log("f : "+ fullColor);
				colorHint();
				if(fullColor>=7)
				{
					console.log("Clear Pile : "+chosenPile);
					deckFinish++;
					deckFinishText.innerText = deckFinish;
					//滿足顏色清場面牌
					pileColor[chosenPile]=[0,0,0,0,0,0,0];
					fieldcard[chosenPile]=[];
					drawToPile(chosenPile);
					chosenPile=-1;
					colorHint("init");
				}					
			}
			//移除手牌
			handcard.splice(cardIndex,1);
			card.parentNode.parentNode.removeChild(card.parentNode);
			if(handcard.length==0) alert("恭喜你！ You won the Game!\n你共用了 "+actions+"次行動完成這次遊戲！\n[重新整理/F5 以開啟一場新遊戲]");
			for(let i =0;i<parseInt(punishment/2);i++) draw();//懲罰
			//重畫
			handSvg.selectAll("g").remove()
			printCard(handcard,handSvg,handSvgBackground,"#handSvg");
			printCardTofield(fieldcard,fieldSvg,fieldSvgBackground,"#fieldSvg");
			actions++;
			actionsText.innerText = actions;
		}
	}  
	else if(String(card.parentNode.parentNode.id)=="fieldSvg")//點擊場面牌
	{
		//to do : 畫紅框改變選擇的牌堆
		selectPile(x,y);
		colorHint();
	}  
}
function selectPile(clickedX,clickedY)
{
	let pileIndex = (clickedX-cardIndent)/rectWidth;	
	if(pileIndex<4) pileIndex = 0;
	else if(pileIndex<8) pileIndex = 1;
	else pileIndex = 2;
	chosenPile = pileIndex;
	let rightIndentExist = 0;
	if( pileIndex>0 ) rightIndentExist = 1;
	let x = (parseInt(pileIndex))*4*rectWidth+parseInt(cardIndent)+cardIndent*rightIndentExist;
	let redRectH=parseInt(cardIndent/2)+parseInt(rectHeight);
	let redRectW=4*rectWidth;
	if( document.getElementById("selectRect") )
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
	//todo
	if(chosenPile>-1)
	{
		viewColor = pileColor[chosenPile];
	}	
}

function barGenerate(targetSvg)
{
	let svgIdTag = targetSvg+"Id";
	let svgId = svgIdTag.slice(1);	
	console.log(svgId);
	let tempSvg = d3.select(targetSvg)     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", 1350)       //设定宽度
    .attr("height", 50)    //设定高度    
    .attr("id", svgId); 
	
	let x=0;
	let y=0;
	let totalWidth = 1350//colorBar.attr('width');
	let width = totalWidth/rainbowColor.length;
	let height = 50;//colorBar.attr('height');
	for(let i=0;i<rainbowColor.length;i++)
	{
		d3.select(svgIdTag)
		.append('rect')
		.attr({
			'x':x,
			'y':y,
		'height':height,
   		'width':width,
   		"opacity":1,
    	'fill':rainbowColor[i],
    	//'stroke':'#000000',
    	//'stroke-width':'10px',
		});
		x=x+width;
	}
	let colorBar = d3.select(svgIdTag)
		.append('rect')
		.attr({
			'x':0,
			'y':0,
			'id':"colorBar",
		'height':50,
   		'width':1350,
    	'fill':'None',
    	'stroke':'#000000',
    	'stroke-width':'10px',
	});
}

function colorHint(command)
{
	let x=0;
	let y=0;
	let totalWidth = 1350//colorBar.attr('width');
	let width = totalWidth/rainbowColor.length;
	let height = 50;//colorBar.attr('height');
	let opacityValue = 1;	
	if(document.getElementById("hintLayer"))
	{
		d3.select("#hintLayer").remove();
	}
	if(command!="init")
	{
		d3.select("#topBarId")
		.append('g')
		.attr({
		'id':"hintLayer"
		});

		for(let i=0;i<rainbowColor.length;i++)
		{
			opacityValue = 0.8;
			if(viewColor[i]>0)
				opacityValue=0;

			d3.select("#hintLayer")
			.append('rect')
			.attr({
				'x':x,
				'y':y,
			'height':height,
	   		'width':width,
	   		"opacity":opacityValue,
	    	'fill':"#FFFFFF",
			});
			x=x+width;
		}
		d3.select("#hintLayer")
		.append('rect')
		.attr({
			'x':0,
			'y':0,
			'id':"colorBar",
		'height':50,
   		'width':1350,
    	'fill':'None',
    	'stroke':'#000000',
    	'stroke-width':'10px',
		});
	}
}
	
function displayPic()
{
	d3.select("#body")
	.append("img")
	.attr('x',0)
	.attr('y',0)
	.attr('width', 1000)
	.attr('height', 1000)
	.attr("src","../Source/cover.png")
	.attr("class","uplayer")
}

function svgBlick()
{
	d3.select("#handSvg")
	.append("rect")
	.attr('x',0)
	.attr('y',0)
	.attr('width', 1000)
	.attr('height', 1000)
	.attr('fill','#FF0000')
	.attr("animate","attributeType=\"XML\" attributeName=\"fill\" values=\"#800;#f00;#800;#800\" dur=\"0.8s\" repeatCount=\"indefinite\"");
}
init();