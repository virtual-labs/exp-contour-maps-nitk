var grid_size = 35;
//each line plot points
var xaxis_starting_point = {number : 100, suffix:" "};
var yaxis_starting_point = {number : 100, suffix:" "};

var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

var canvas2 = document.getElementById('mycanvas2');
var ctx2 = canvas2.getContext('2d');

//-------------paper for line AB-----------
var paper = document.getElementById('paper');
var pctx = paper.getContext('2d');


//----------------paper for line CD-----------
var paper2 = document.getElementById('paper2');
var pctx2 = paper2.getContext('2d');

// //line plotting pencil within paper canvas
var imgTag = new Image();
imgTag.src = "images/pencil1.png";

// var pencil = document.getElementById('paper');
// var ptx = pencil.getContext('2d');

var canvas_width = canvas.width;
var canvas_height = canvas.height;

//no of vertical grid lines
var num_lines_x = Math.floor(canvas.height/grid_size);
//no of horizontal grid lines
var num_lines_y = Math.floor(canvas.width/grid_size);
//distance between lines
var xaxis_distance_gridlines = num_lines_x-1;
var yaxis_distance_gridlines = 1;
var t = 1,tx = 1,ty = 1,tpoint = 0,paperpointab=0,paperpointcd=0,lpoint=1,jpts=0,jpts1=0;
var ptsx =[];
var ptsy =[];
var vertices = [];
var spanclick=0;
var lin=0,tablesh=0;
var a1=0,b1=0,c1=0,d1=0,e1=0,f1=0,g1=0,h1=0,i1=0,j1=0,k1=0,l1=0,m1=0,n1=0,a2=0,b2=0,c2=0,d2=0,e2=0,f2=0,g2=0,h2=0;

// //---tooltip variable
var sp1=0,sp2=0;



// //---variables plotting line on paper stores line as pencil track points
var x;
var y;
var xx;
var yy;

// Prompt questions during simulation
var questions = {
	ans1:0,
	options:[],
	nextFunction:function(){},
	// setOptions:function(d1,d2,d3,d4){
		// questions.options = new Array(d1,d2,d3,d4);
	// },
	setOptions:function(d1,d2,d3,d4,d5){
		if(d5 == 0 && d4!=0)
			questions.options = new Array(d1,d2,d3,d4);
		else if(d4 == 0 && d5 == 0)
		{
			questions.options = new Array(d1,d2,d3);
		}
		else 
		{
			questions.options = new Array(d1,d2,d3,d4,d5);
		}
	},
	setAns:function(ans){
		if(simsubscreennum == 8){
			if(soilType == "Fine grained soil")
				questions.ans1 = 3;
			else if(soilType == "Sandy soil")
				questions.ans1 = 2;
		}
		else
		questions.ans1 = ans;
	},
	frameQuestions:function(qun){
		var myDiv  = document.getElementById("question-div");
		var myDiv1 = document.getElementById("divq");
		myDiv.style.visibility = "visible";
		if(simsubscreennum == 8)
			document.getElementById("divq").innerHTML = qun+""+soilType;
		else
			document.getElementById("divq").innerHTML = qun;
		//Create and append select list
		var selectList = document.createElement("select");
		selectList.setAttribute("id", "mySelect");
		selectList.setAttribute("autocomplete", "off");
		// selectList.setAttribute("onchange", "questions.setAnswer()");
		
		var button1 = document.createElement("input");
		button1.setAttribute("onclick","questions.setAnswer(this)");
		button1.setAttribute("type","button");
		button1.setAttribute("value","OK");
		
		// Appending the contents to the division
		myDiv1.appendChild(selectList);
		myDiv1.appendChild(button1);

	//Create and append the options
		for (var i = 0; i < questions.options.length; i++) {
			var opt = document.createElement("option");
			opt.setAttribute("value", questions.options[i]);
			opt.text = questions.options[i];
			selectList.appendChild(opt);
		}
	},
	setAnswer:function(ev){
		var x = document.getElementById("mySelect");
		var i = x.selectedIndex;
		if(i == 0)
		{
			var dispAns = document.createElement("p");
			dispAns.innerHTML = "You have not selected any value";
			document.getElementById("divq").appendChild(dispAns);		
			setTimeout(function(){
				dispAns.innerHTML = "";
			},200);
		}
		else if(i == questions.ans1)
		{
			ev.onclick = "";
			var dispAns = document.createElement("p");
			dispAns.innerHTML = "You are right<span class='boldClass'>&#128077;</span> ";
			document.getElementById("divq").appendChild(dispAns);		
			questions.callNextFunction();
		}
		else
		{
			ev.onclick = "";
			var dispAns = document.createElement("p");
			dispAns.innerHTML = "You are Wrong<span class='boldClass'>&#128078;</span><br>Answer is: "+x.options[questions.ans1].text;
			document.getElementById("divq").appendChild(dispAns);		
			questions.callNextFunction();
		}
	},
	setCallBack:function(cb){
		nextFunction = cb;
	},
	callNextFunction:function()
	{
		setTimeout(function()
		{
			// document.getElementById("question-div").innerHTML = "";
			document.getElementById("question-div").style.visibility = "hidden";
			nextFunction();
		},800);
	}
}

//To set the questions division
function generateQuestion(qObject,qn,op1,op2,op3,op4,op5,ansKey,fn,dleft,dright,dwidth,dheight)
{
	document.getElementById('question-div').style.left=dleft+"px";											
	document.getElementById('question-div').style.top=dright+"px";												
	document.getElementById('question-div').style.width=dwidth+"px";
	document.getElementById('question-div').style.height=dheight+"px";
	qObject.setOptions(op1,op2,op3,op4,op5);
	qObject.setAns(ansKey);
	qObject.frameQuestions(qn);	
	qObject.setCallBack(fn);	
}
 
 //-------When tabs changed to run the animation in background------------
 function smartTimer(func, interval){
    var last = new Date() - interval,
        now,
        numMissed;
    
    (function iterate(){
        func();
        now = +new Date();
        numMissed = Math.round((now - last) / interval) - 1;

        while (numMissed--) { func(); }

        last = +new Date();
        setTimeout(iterate, interval);
    })();
 }
 
 
 
 
//-------------------------------------initial x and y axis plot points---------------------------------------
ptsx.push({
	x:0,
	y:grid_size*xaxis_distance_gridlines
});
ptsx.push({
	x:canvas_width,
	y:grid_size*xaxis_distance_gridlines
});
ptsy.push({
	x:grid_size*yaxis_distance_gridlines,
	y:0
});
ptsy.push({
	x:grid_size*yaxis_distance_gridlines,
	y:canvas_height
});

//-------------------------------point plot array---------------------
// for(i=0;i<points.length;i++)
// {
	// vertices.push({
    // x: points[i][0],
    // y: points[i][1]
	// });
// }

var xpoints = calcWaypoints(ptsx);
var ypoints = calcWaypoints(ptsy);

	$('#scale').mouseover(function()
	{
		$('#scinff').show();
	});
	$('#scale').mouseout(function()
	{
		$('#scinff').hide();
	});
	$('#direct').mouseover(function()
	{
		$('#direction').show();
	});
	$('#direct').mouseout(function()
	{
		$('#direction').hide();
	});
	$('#step81').click(function()
	{
		$('#resultContainer').empty();
		document.getElementById('scale').style.visibility="hidden";
		document.getElementById('direct').style.visibility="hidden";
		document.getElementById('mycanvas').style.visibility="hidden";
		document.getElementById('mycanvas2').style.visibility="hidden";
		$('#resultContainer').html('<img id="ctmap" style="position: absolute; left: 55px; top: 120px;" src="images/ctrmap.png"/>');
	});
	$('#step82').click(function()
	{
		$('#resultContainer').empty();
		document.getElementById('mycanvas2').style.visibility="hidden";
		document.getElementById('mycanvas').style.visibility="visible";
		document.getElementById('scale').style.visibility="visible";
		document.getElementById('direct').style.visibility="visible";
		$('#mycanvas').css({'left':'125px','top':'160px'});
		$('#scale').css({'left':'590px','top':'170px'});
		$('#direct').css({'left':'590px','top':'210px'});
		$('#scinff').css({'left':'460px','top':'170px'});
		$('#direction').css({'left':'500px','top':'170px'});
		
	});
	$('#step83').click(function()
	{
		$('#resultContainer').empty();
		document.getElementById('mycanvas').style.visibility="hidden";
		document.getElementById('mycanvas2').style.visibility="visible";
		document.getElementById('scale').style.visibility="visible";
		document.getElementById('direct').style.visibility="visible";
		$('#mycanvas2').css({'left':'125px','top':'160px'});
		$('#scale').css({'left':'590px','top':'170px'});
		$('#direct').css({'left':'590px','top':'210px'});
		$('#scinff').css({'left':'460px','top':'170px'});
		$('#direction').css({'left':'500px','top':'170px'});
	});
	
	 $('#mycanvas').mousemove(function(event){
		 var xx = event.pageX;
		 var yy = event.pageY;
		 if(sp1==1)
		 {
			 $('#tooltip-span').text(xx+" "+yy);    
			 if(xx>=177 && xx<=181 && yy>=404 && yy<=408)
			 {
				$('#tooltip-span').text("a(50,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			 else if(xx>=215 && xx<=219 && yy>=370&& yy<=374)
			 {
				$('#tooltip-span').text("b(160,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=243 && xx<=247 && yy>=335 && yy<=339)
			 {
				$('#tooltip-span').text("c(240,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=282&& xx<=286 && yy>=300&& yy<=304)
			 {
				$('#tooltip-span').text("d(350,600)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX-90,
				  visibility:'visible'
				});
			 }
			  else if(xx>=341&& xx<=345 && yy>=300 && yy<=304)
			 {
				$('#tooltip-span').text("e(520,600)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=376 && xx<=400 && yy>=335 && yy<=339)
			 {
				$('#tooltip-span').text("f(620,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=412 && xx<=416 && yy>=370 && yy<=374)
			 {
				$('#tooltip-span').text("g(720,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=453 && xx<=457&& yy>=404&& yy<=408)
			 {
				$('#tooltip-span').text("h(840,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX-90,
				  visibility:'visible'
				});
			 }
			  else if(xx>=485 && xx<=489 && yy>=404&& yy<=408)
			 {
				$('#tooltip-span').text("i(930,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=523 && xx<=527 && yy>=370 && yy<=374)
			 {
				$('#tooltip-span').text("j(1040,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=555 && xx<=559 && yy>=335 && yy<=339)
			 {
				$('#tooltip-span').text("k(1130,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX-90,
				  visibility:'visible'
				});
			 }
			  else if(xx>=600 && xx<=604 && yy>=335 && yy<=339)
			 {
				$('#tooltip-span').text("l(1260,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=632 && xx<=636 && yy>=370 && yy<=374)
			 {
				$('#tooltip-span').text("m(1350,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX-90,
				  visibility:'visible'
				});
			 }
			  else if(xx>=674 && xx<=678 && yy>=404 && yy<=408)
			 {
				$('#tooltip-span').text("n(1470,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX-90,
				  visibility:'visible'
				});
			 }
			 else
			 {
				 $('#tooltip-span').css({
					visibility:'hidden'
				});
			 }
		 }
    });
	
	
	$('#mycanvas2').mousemove(function(event){
		 var xx = event.pageX;
		 var yy = event.pageY;
		 if(sp2==1)
		 {
			 if(xx>=177 && xx<=181 && yy>=440 && yy<=444)
			 {
				$('#tooltip-span').text("a(50,200)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			 else if(xx>=212 && xx<=216 && yy>=405&& yy<=409)
			 {
				$('#tooltip-span').text("b(150,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=250 && xx<=254 && yy>=370 && yy<=374)
			 {
				$('#tooltip-span').text("c(260,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=285&& xx<=289 && yy>=335&& yy<=339)
			 {
				$('#tooltip-span').text("d(360,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=362&& xx<=366 && yy>=335 && yy<=339)
			 {
				$('#tooltip-span').text("e(580,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=450 && xx<=454 && yy>=370 && yy<=374)
			 {
				$('#tooltip-span').text("f(830,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=555 && xx<=559 && yy>=405 && yy<=409)
			 {
				$('#tooltip-span').text("g(1130,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			  else if(xx>=632 && xx<=636&& yy>=440&& yy<=444)
			 {
				$('#tooltip-span').text("h(1350,200)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY-10,
				  left:event.pageX+10,
				  visibility:'visible'
				});
			 }
			 else
			 {
				 $('#tooltip-span').css({
					visibility:'hidden'
				});
			 }
		 }
    });

// // calc waypoints traveling along vertices(for line tracing)
function calcWaypoints(vertices) {
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
		var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < 100; j++) {
            var x = pt0.x + dx * j / 100;
            var y = pt0.y + dy * j / 100;
            waypoints.push({
                x:x,
                y:y
            });
        }
    }
    return (waypoints);
}

// //-------function for array formation--------------
function formArray(x1,y1,x2,y2)
{
	var farray = [];
	farray.push({
		x:x1,
		y:y1
	});
	farray.push({
		x:x2,
		y:y2
	});
	return (farray);
}
//-------------function navnext------------
function navNext()
{

     for (temp = 0; temp <=7; temp++) 
     { 
         document.getElementById ('canvas'+temp).style.visibility="hidden";
     }
     simsubscreennum+=1;
     document.getElementById('canvas'+(simsubscreennum)).style.visibility="visible";

     document.getElementById('nextButton').style.visibility="hidden";
     magic();
}

//---------function magic starts here-----------
function magic()
{
	if(simsubscreennum == 1)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('canvas-wrap-1').style.visibility="visible";
		document.getElementById('cmap').innerHTML="Get Paper";
		setTimeout(function()
		{
			$('#cover').animate({
									left:'35px',
									top:'120px'
								},500,
								function(){
								document.getElementById('fullmap').style.visibility="hidden";
								document.getElementById('ctr1').style.visibility="visible";
								document.getElementById('line1').style.visibility="visible";
								});
		},1500);
		setTimeout(function()
		{
			$('#cover').animate({
				left:'35px',
				top:'310px'
			},500,
			function(){
			document.getElementById('fullmap').style.visibility="hidden";
			document.getElementById('ctr2').style.visibility="visible";
			document.getElementById('line2').style.visibility="visible";
			});
		},3000);
		setTimeout(function()
		{
			document.getElementById('fullmap').style.visibility="visible";
			document.getElementById('ctr1').style.visibility="hidden";
			document.getElementById('ctr2').style.visibility="hidden";
			document.getElementById('cover').style.visibility="hidden";
			document.getElementById('nextButton').style.visibility="visible";
		},4500);
	}
	else if(simsubscreennum == 2)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('fullmap').style.visibility="hidden";
		document.getElementById('line').style.visibility="hidden";
		document.getElementById('line1').style.visibility="hidden";
		document.getElementById('line2').style.visibility="hidden";
		document.getElementById('cmap').style.visibility="visible";
		
	}
	else if(simsubscreennum == 3)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('ln2').style.visibility="hidden";
		document.getElementById('abplot').style.visibility="hidden";
		document.getElementById('cdplot').style.visibility="hidden";
		document.getElementById('map2').style.visibility="hidden";
		document.getElementById('cdpoints').style.visibility="hidden";	
		ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas		
		drawXaxis();
		drawYaxis();
		spanclick=3;
		document.getElementById('mycanvas').style.visibility="visible";
		document.getElementById('mycanvas').style.border="solid 2px";
		document.getElementById('mycanvas2').style.border="solid 2px";
		var q1 = Object.create(questions);												
		generateQuestion(q1,"How many geological cross-sections are taken in this map?","","1","2","3","4",2,screen3Proceed,100,150,300,120);	
		
	}
	else if(simsubscreennum == 4)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('abpic').style.visibility="visible";
		document.getElementById('cmap').style.visibility="visible";	
		document.getElementById('cmap').innerHTML = "Define<br>Co-ordinates";	
		ctx.beginPath();
		ctx.lineWidh = 4;
		ctx.font = '20px Verdana';
		ctx.fillText("Geographical Profile along AB",30,-295); 
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
	}
	else if(simsubscreennum == 5)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('cmap').innerHTML = "Plot Y'<br>&lt;X:1550 Y:0&gt;";
		spanclick=10;
	}
	else if(simsubscreennum == 6)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('abtable').style.visibility="hidden";
		document.getElementById('mycanvas').style.visibility="hidden";
		document.getElementById('mycanvas2').style.visibility="visible";
		document.getElementById('cdpic').style.visibility="visible";
		document.getElementById('cmap').style.visibility="visible";	
		document.getElementById('cmap').innerHTML = "Define<br>Co-ordinates";
		tablesh = 1;
		spanclick=8;
		ctx2.beginPath();
		ctx2.lineWidh = 4;
		ctx2.font = '20px Verdana';
		ctx2.fillText("Geographical Profile along CD",30,-295); 
		ctx2.fill();
		ctx2.stroke();
		ctx2.closePath();
			
	}
	else if(simsubscreennum == 7)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('cmap').innerHTML = "Plot Y'<br>&lt;X:1550 Y:0&gt;";
		spanclick=10;
	}
	else if(simsubscreennum == 8)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('mycanvas2').style.visibility="hidden";
		document.getElementById('cmap').style.visibility="hidden";
		document.getElementById('scale').style.visibility="hidden";
		document.getElementById('direct').style.visibility="hidden";
		document.getElementById('cdtable').style.visibility="hidden";
		sp1=1;
		sp2=1;
	}
}

function screen3Proceed()
{
	document.getElementById('cmap').style.visibility = "visible";
	document.getElementById('cmap').innerHTML="Plot X-Axis";	
}





//------------------spanclick------------------
function spanToDraw()
{
	if(spanclick == 0)
	{
		if(lin == 0)
		{
			document.getElementById('paper').style.visibility="visible";
			document.getElementById('cmap').style.visibility="hidden";
			$('#paper').animate(
								{
									height:'200'
								},
								800,
			
							function(){
				//$('#fullmap').css('clip', 'rect(0px, 600px, 180px, 0px)');
				document.getElementById('paper').width="522";
				document.getElementById('paper').height="200";
				document.getElementById('cmap').style.visibility="visible";
				$('#cmap').text("Mark Points");
				spanclick=1;
			  });
		}
		else if(lin == 1)
		{
			document.getElementById('paper2').style.visibility="visible";
			document.getElementById('cmap').style.visibility="hidden";
			$('#paper2').animate(
								{
									height:'100'
								},
								800,
			
							function(){
				//$('#fullmap').css('clip', 'rect(0px, 600px, 180px, 0px)');
				document.getElementById('paper2').width="522";
				document.getElementById('paper2').height="100";
				document.getElementById('cmap').style.visibility="visible";
				$('#cmap').text("Mark Points");
				spanclick=1;
			  });
		}
		  
      
    }
	
	else if(spanclick == 1)
	{
		pctx.clearRect(0,0,paper.width,paper.height);
		// document.getElementById('xpoints').style.visibility="visible";
		// $('#xpoints').show().find('tr').each(function (i,item){  
			// var $row = $(item); 
			// $row.hide();  
			// $row.delay(i*500).fadeIn(500); 	
		// });
		if(lin == 0)
		{
			document.getElementById('abpoints').style.visibility="visible";
			$('#abpoints').show().find('tr').each(function (i,item){  
			var $row = $(item); 
			$row.hide();  
			$row.delay(i*500).fadeIn(500); 	
		});
			plotonpaperab();
		}
		else if(lin == 1)
		{
			document.getElementById('cdpoints').style.visibility="visible";
			$('#cdpoints').show().find('tr').each(function (i,item){  
			var $row = $(item); 
			$row.hide();  
			$row.delay(i*500).fadeIn(500); 	
		});
			plotonpapercd();
		}
		
		
		//document.getElementById('nextButton').style.visibility="visible";
	}
	else if(spanclick == 3)
	{
		document.getElementById('cmap').style.visibility="hidden";
		spanclick=4;
		plotXaxis(xpoints);
	}
	else if(spanclick == 4)
	{
		document.getElementById('cmap').style.visibility="hidden";
		plotYaxis(ypoints);
		setTimeout(function()
		{
			ctx.translate(yaxis_distance_gridlines*grid_size,xaxis_distance_gridlines*grid_size);
			ctx2.translate(yaxis_distance_gridlines*grid_size,xaxis_distance_gridlines*grid_size);
			drawtriangle();
			spanclick=5;
		},2600);
	}
	else if(spanclick == 5)
	{
		tickXaxis();
		origin();
		$('#cmap').text("Points on Y-Axis");
		spanclick=6;
	}
	else if(spanclick == 6)
	{
		tickYaxis();
		document.getElementById('cmap').style.visibility = "hidden";
		document.getElementById('nextButton').style.visibility = "visible";
		document.getElementById('scale').style.visibility = "visible";
		document.getElementById('direct').style.visibility = "visible";
		$('#cmap').css('height','35px');
		spanclick=8;
	}
	else if(spanclick == 7)
	{
		namescale();
		document.getElementById('cmap').style.visibility = "hidden";
		document.getElementById('nextButton').style.visibility = "visible";
		$('#cmap').css('height','35px');
		spanclick=8;
	}
	else if(spanclick == 8)
	{
		showtable();
		spanclick=9;
	}
	else if(spanclick == 10)
	{
		endLine();
		$('#cmap').text("Join Points");
		spanclick=11;
	}
	else if(spanclick == 11)
	{
		if(tablesh == 0)
		{
			ctx.beginPath();
			ctx.moveTo(0,-grid_size*(200/100));
			joinPointsab();
			spanclick=12;
			document.getElementById('cmap').style.visibility="visible";
		}
		else if(tablesh == 1)
		{
			ctx2.beginPath();
			ctx2.moveTo(0,-grid_size*(100/100));
			joinPointscd();
			spanclick=12;
			document.getElementById('cmap').style.visibility="visible";
		}	
	}
}

// To hide the dialog
function hideDialog()
{
	document.getElementById('dialog-div').style.visibility="hidden";
	document.getElementById('cmap').style.visibility="hidden";
	document.getElementById('nextButton').style.visibility="visible";
	spanclick = 0;
}
//-----animating line draw on paper------------
function drawpp()
	{
		if(lin == 0)
		{
			pctx.moveTo(xx,yy);
			pctx.lineTo(xx,yy+2);
			//pctx.font="12px verdana";
			pctx.lineWidh="1";
			pctx.strokeStyle="blue";
			pctx.stroke();
			//pctx.fillText(markersab[paperpointab],xx,190);
			//pctx.fill();
			yy += 1;
			if (yy<=15) requestAnimationFrame(drawpp) 
		}
		else if(lin ==1)
		{
			pctx.moveTo(xx,yy);
			pctx.lineTo(xx,yy+2);
			//pctx.font="12px verdana";
			pctx.lineWidh="1";
			pctx.strokeStyle="red";
			pctx.stroke();
			//pctx.fillText(markersab[paperpointab],xx,190);
			//pctx.fill();
			yy += 1;
			if (yy<=15) requestAnimationFrame(drawpp) 
		}
	}
	
	
//-----animating line draw on paper2------------
function drawpp2()
	{
		if(lin == 0)
		{
			pctx2.moveTo(xx,yy);
			pctx2.lineTo(xx,yy+2);
			//pctx2.font="12px verdana";
			pctx2.lineWidh="1";
			pctx2.strokeStyle="blue";
			pctx2.stroke();
			//pctx2.fillText(markersab[paperpointab],xx,190);
			//pctx2.fill();
			yy += 1;
			if (yy<=15) requestAnimationFrame(drawpp) 
		}
		else if(lin ==1)
		{
			pctx2.moveTo(xx,yy);
			pctx2.lineTo(xx,yy+2);
			//pctx2.font="12px verdana";
			pctx2.lineWidh="1";
			pctx2.strokeStyle="red";
			pctx2.stroke();
			//pctx2.fillText(markersab[paperpointab],xx,190);
			//pctx2.fill();
			yy += 1;
			if (yy<=15) requestAnimationFrame(drawpp2) 
		}
	}	

//---marking animation with pencil---------
function animate() {
		if(lin == 0)
		{
		  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		  ctx.drawImage(imgTag, x, y);                       // draw image at current position
		  y += 1;
		  if (y <=100) requestAnimationFrame(animate) 			  // loop
		}	
		else if(lin == 1)
		{
		  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		  ctx.drawImage(imgTag, x, y);                       // draw image at current position
		  y += 1;
		  if (y <=285) requestAnimationFrame(animate) 			  // loop
		}	
}
		
		
//-----------plot on paper for AB line-----------
function plotonpaperab()
{
	document.getElementById('cmap').style.visibility="hidden";
	if (paperpointab < 14) {
		setTimeout(function()
		{
			requestAnimationFrame(plotonpaperab);
		},500);
    }
	if(paperpointab==14)
		{
			spanclick=0;
			lin=1;
			setTimeout(function()
			{
				document.getElementById('abpoints').style.visibility="hidden";
				document.getElementById('paper').style.visibility="hidden";
				document.getElementById('abplot').style.visibility="visible";
				document.getElementById('cmap').style.visibility="visible";
				$('#cmap').text("Get Paper");
				$('#ln2').html("<b>For CD:</b>");
			},1500);
			ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		}
	pctx.beginPath();
	if(paperpointab == 0)
	{
			x = 86+(paperpointab*35);
			y = 90;
			xx = 19+(paperpointab*35);
			yy = 0;
			pctx.font="12px verdana";
			pctx.fillText(markersab[paperpointab],18+(paperpointab*35),30);
			pctx.fill();
			drawpp();
			animate(x,y);
	}
	else if(paperpointab == 1)
	{
		x = 87+(paperpointab*35);
		y = 90;
		xx = 20+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],19+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpointab == 2)
	{
		x = 80+(paperpointab*35);
		y = 90;
		xx = 13+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],12+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpointab == 3)
	{
		x = 79+(paperpointab*35);
		y = 90;
		xx = 13+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],9+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpointab == 4)
	{
		x =102+(paperpointab*35);
		y = 90;
		xx = 37+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],35+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 5)
	{
		x = 102+(paperpointab*35);
		y = 90;
		xx = 37+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],37+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 6)
	{
		x = 100+(paperpointab*35);
		y = 90;
		xx = 36	+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],34+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 7)
	{
		x = 104+(paperpointab*35);
		y = 90;
		xx = 37+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],35+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 8)
	{
		x = 102+(paperpointab*35);
		y = 90;
		xx = 36+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],36+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 9)
	{
		x = 104+(paperpointab*35);
		y = 90;
		xx = 37+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],37+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 10)
	{
		x = 100+(paperpointab*35);
		y = 90;
		xx = 34+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],34+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 11)
	{
		x = 109+(paperpointab*35);
		y = 90;
		xx = 42+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],41+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 12)
	{
		x = 103+(paperpointab*35);
		y = 90;
		xx = 38+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],38+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpointab == 13)
	{
		x = 109+(paperpointab*35);
		y = 90;
		xx = 45+(paperpointab*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markersab[paperpointab],45+(paperpointab*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	paperpointab++;
}




		
//-----------plot on paper for CD line-----------
function plotonpapercd()
{
	document.getElementById('cmap').style.visibility="hidden";
	if (paperpointcd < 8) {
		setTimeout(function()
		{
			requestAnimationFrame(plotonpapercd);
		},500);
    }
	if(paperpointcd==8)
		{
			spanclick=2;
			// lin=1;
			setTimeout(function()
			{
				document.getElementById('paper2').style.visibility="hidden";
				document.getElementById('cdplot').style.visibility="visible";
				document.getElementById('nextButton').style.visibility="visible";
			},1500);
			ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		}
	pctx2.beginPath();
	if(paperpointcd == 0)
	{
			x = 81+(paperpointcd*35);
			y = 275;
			xx = 16+(paperpointcd*35);
			yy = 0;
			pctx2.font="12px verdana";
			pctx2.fillText(markerscd[paperpointcd],15+(paperpointcd*35),30);
			pctx2.fill();
			drawpp2();
			animate(x,y);
	}
	else if(paperpointcd == 1)
	{
		x = 83+(paperpointcd*35);
		y = 275;
		xx = 16+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],15+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);	
	}
	else if(paperpointcd == 2)
	{
		x = 85+(paperpointcd*35);
		y = 275;
		xx = 18+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],17+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);	
	}
	else if(paperpointcd == 3)
	{
		x = 82+(paperpointcd*35);
		y = 275;
		xx = 16+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],14+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);	
	}
	else if(paperpointcd == 4)
	{
		x =120+(paperpointcd*35);
		y = 275;
		xx = 55+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],52+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);
	}
	else if(paperpointcd == 5)
	{
		x = 170+(paperpointcd*35);
		y = 275;
		xx = 105+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],105+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);
	}
	else if(paperpointcd == 6)
	{
		x = 230+(paperpointcd*35);
		y = 275;
		xx = 163+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],163+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);
	}
	else if(paperpointcd == 7)
	{
		x = 277+(paperpointcd*35);
		y = 275;
		xx = 212+(paperpointcd*35);
		yy = 0;
		pctx2.font="12px verdana";
		pctx2.fillText(markerscd[paperpointcd],210+(paperpointcd*35),30);
		pctx2.fill();
		drawpp2();
		animate(x,y);
	
	}
	paperpointcd++;
}



//flow of drawing profile view graph
function drawXaxis()
{
	//drawing X-axis and horizontal grid lines
	for(var i=0;i<=num_lines_x;i++)
	{
		ctx.beginPath();
		ctx.lineWidth = 1;
		// if(i == xaxis_distance_gridlines)
		// { 
			// ctx.lineWidth = 2;
			// ctx.strokeStyle = "#000000";
		// }		else
			ctx.strokeStyle ='pink';	
		if(i == num_lines_x){
			ctx.moveTo(0,grid_size*i);
			ctx.lineTo(canvas_width,grid_size*i);
		}
		else{
			ctx.moveTo(0, grid_size*i+0.5);
        	ctx.lineTo(canvas_width, grid_size*i+0.5);
   		}
   	 	ctx.stroke();
	}
	for(var i=0;i<=num_lines_x;i++)
	{
		ctx2.beginPath();
		ctx2.lineWidth = 1;
		// if(i == xaxis_distance_gridlines)
		// { 
			// ctx.lineWidth = 2;
			// ctx.strokeStyle = "#000000";
		// }		else
			ctx2.strokeStyle ='pink';	
		if(i == num_lines_x){
			ctx2.moveTo(0,grid_size*i);
			ctx2.lineTo(canvas_width,grid_size*i);
		}
		else{
			ctx2.moveTo(0, grid_size*i+0.5);
        	ctx2.lineTo(canvas_width, grid_size*i+0.5);
   		}
   	 	ctx2.stroke();
	}
}
function drawYaxis()
{
	for(i=0; i<=num_lines_y; i++) {
		ctx.beginPath();
		ctx.lineWidth = 1;
		
		// If line represents Y-axis draw in different color
		// if(i == yaxis_distance_gridlines)
		// { 
			// ctx.lineWidth = 2;
			// ctx.strokeStyle = "#000000";
		// }
		// else
			ctx.strokeStyle = "pink";
		
		if(i == num_lines_y) { 
			ctx.moveTo(grid_size*i, 0);
			ctx.lineTo(grid_size*i, canvas_height);
		}
		else {
			ctx.moveTo(grid_size*i+0.5, 0);
			ctx.lineTo(grid_size*i+0.5, canvas_height);
		}
	ctx.stroke();
	}
	for(i=0; i<=num_lines_y; i++) {
		ctx2.beginPath();
		ctx2.lineWidth = 1;
		
		// If line represents Y-axis draw in different color
		// if(i == yaxis_distance_gridlines)
		// { 
			// ctx.lineWidth = 2;
			// ctx.strokeStyle = "#000000";
		// }
		// else
			ctx2.strokeStyle = "pink";
		
		if(i == num_lines_y) { 
			ctx2.moveTo(grid_size*i, 0);
			ctx2.lineTo(grid_size*i, canvas_height);
		}
		else {
			ctx2.moveTo(grid_size*i+0.5, 0);
			ctx2.lineTo(grid_size*i+0.5, canvas_height);
		}
	ctx2.stroke();
	}
}
//plotting x axis animation
function plotXaxis()
{
	
 if (tx < xpoints.length - 1) {
        requestAnimationFrame(plotXaxis);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
	 if (tx == xpoints.length-1) {
		document.getElementById('cmap').style.visibility="visible"  
		document.getElementById('cmap').innerHTML="Plot Y-Axis";	
		}
    ctx.beginPath();
	ctx.lineWidth=2;
	ctx.strokeStyle="black";
    ctx.moveTo(xpoints[tx - 1].x, xpoints[tx - 1].y);
    ctx.lineTo(xpoints[tx].x, xpoints[tx].y);
    ctx.stroke();
	ctx.closePath();
	
	//------for Ab line canvas 1----------
	ctx2.beginPath();
	ctx2.lineWidth=2;
	ctx2.strokeStyle="black";
    ctx2.moveTo(xpoints[tx - 1].x, xpoints[tx - 1].y);
    ctx2.lineTo(xpoints[tx].x, xpoints[tx].y);
    ctx2.stroke();
	ctx2.closePath();
    // increment "t" to get the next waypoint
    tx++;
}
//plotting y axis animation
function plotYaxis()
{
	
 if (ty < ypoints.length - 1) {
        requestAnimationFrame(plotYaxis);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
    ctx.beginPath();
	ctx.lineWidth=2;
	ctx.strokeStyle="black";
    ctx.moveTo(ypoints[ty - 1].x, ypoints[ty - 1].y);
    ctx.lineTo(ypoints[ty].x, ypoints[ty].y);
    ctx.stroke();
	ctx.closePath();
	
	//-------------for cd line canvas2------------
	ctx2.beginPath();
	ctx2.lineWidth=2;
	ctx2.strokeStyle="black";
    ctx2.moveTo(ypoints[ty - 1].x, ypoints[ty - 1].y);
    ctx2.lineTo(ypoints[ty].x, ypoints[ty].y);
    ctx2.stroke();
	ctx2.closePath();
    // increment "t" to get the next waypoint
    ty++;
}
function origin()
{
	//Name origin as 0 for AB line
	ctx.beginPath();
	ctx.font = '10px Verdana';
	ctx.fillText("0",-10,15); 
	ctx.fill();
	ctx.closePath();
	
	//For CD line-------
	ctx2.beginPath();
	ctx2.font = '10px Verdana';
	ctx2.fillText("0",-10,15); 
	ctx2.fill();
	ctx2.closePath();
}
function tickXaxis()
{
	
	//----for AB line----------
	for(i=1; i<(num_lines_x+5); i++) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";

		// Draw a tick mark 6px long (-3 to 3)
		ctx.moveTo(grid_size*i+0.5, -3);
		ctx.lineTo(grid_size*i+0.5, 3);
		ctx.stroke();
		
		// Text value at that point
		ctx.font = '10px Verdana';
		ctx.textAlign = 'start';
		ctx.fillText(yaxis_starting_point.number*i + xaxis_starting_point.suffix, grid_size*i, 15);
		ctx.stroke();
		ctx.closePath();
	}	
	
		//----for CD line----------

	for(i=1; i<(num_lines_x+5); i++) {
		ctx2.beginPath();
		ctx2.lineWidth = 2;
		ctx2.strokeStyle = "black";

		// Draw a tick mark 6px long (-3 to 3)
		ctx2.moveTo(grid_size*i+0.5, -3);
		ctx2.lineTo(grid_size*i+0.5, 3);
		ctx2.stroke();

		// Text value at that point
		ctx2.font = '10px Verdana';
		ctx2.textAlign = 'start';
		ctx2.fillText(yaxis_starting_point.number*i + xaxis_starting_point.suffix, grid_size*i, 15);
		ctx2.stroke();
		ctx2.closePath();
	}
	
}
function tickYaxis()
{
	//Positive Y-axis of graph is negative Y-axis of the canvas
	//------------for AB line----------
	for(i=1; i<(num_lines_y); i++) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";

		// Draw a tick mark 6px long (-3 to 3)
		ctx.moveTo(-3, -grid_size*i+0.5);
		ctx.lineTo(3, -grid_size*i+0.5);
		ctx.stroke();

		// Text value at that point
		ctx.font = '10px Verdana';
		ctx.textAlign = 'start';
		ctx.fillText(xaxis_starting_point.number*i + xaxis_starting_point.suffix, -30,-grid_size*i);
		ctx.stroke();
		ctx.closePath();
	}
	
	//-----for CD line------
	for(i=1; i<(num_lines_y); i++) {
		ctx2.beginPath();
		ctx2.lineWidth = 2;
		ctx2.strokeStyle = "black";

		// Draw a tick mark 6px long (-3 to 3)
		ctx2.moveTo(-3, -grid_size*i+0.5);
		ctx2.lineTo(3, -grid_size*i+0.5);
		ctx2.stroke();

		// Text value at that point
		ctx2.font = '10px Verdana';
		ctx2.textAlign = 'start';
		ctx2.fillText(xaxis_starting_point.number*i + xaxis_starting_point.suffix, -30,-grid_size*i);
		ctx2.stroke();
		ctx2.closePath();
	}
}
function drawtriangle()
{
	//-----------for AB line ------------
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.fillStyle="black";
	ctx.font = "20px Verdana Bold";
	ctx.fillText("Y",-(grid_size*(50/100)),-(grid_size*(960/100)));
	ctx.moveTo(0,-(grid_size*(1000/100)));
	ctx.lineTo(-(grid_size*(20/100)),-(grid_size*(970/100)));
	ctx.lineTo((grid_size*(20/100)),-(grid_size*(970/100)));
	ctx.lineTo(0,-(grid_size*(1000/100)));
	ctx.fillText("X",grid_size*(1580/100),-(grid_size*(-50/100)));
	ctx.moveTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx.lineTo(grid_size*(1580/100),-(grid_size*(20/100)));
	ctx.lineTo((grid_size*(1580/100)),-(grid_size*(-20/100)));
	ctx.lineTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx.fill();
	ctx.closePath();
	
	//------------for CD line------------
	ctx2.beginPath();
	ctx2.strokeStyle="black";
	ctx2.fillStyle="black";
	ctx2.font = "20px Verdana Bold";
	ctx2.fillText("Y",-(grid_size*(50/100)),-(grid_size*(960/100)));
	ctx2.moveTo(0,-(grid_size*(1000/100)));
	ctx2.lineTo(-(grid_size*(20/100)),-(grid_size*(970/100)));
	ctx2.lineTo((grid_size*(20/100)),-(grid_size*(970/100)));
	ctx2.lineTo(0,-(grid_size*(1000/100)));
	ctx2.fillText("X",grid_size*(1580/100),-(grid_size*(-50/100)));
	ctx2.moveTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx2.lineTo(grid_size*(1580/100),-(grid_size*(20/100)));
	ctx2.lineTo((grid_size*(1580/100)),-(grid_size*(-20/100)));
	ctx2.lineTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx2.fill();
	ctx2.closePath();
	document.getElementById('cmap').style.visibility ="visible";
	document.getElementById('cmap').innerHTML ="Points on X-Axis";
}
function namescale()
{
	//Name origin as 0
	ctx.beginPath();
	ctx.font = '14px Verdana';
	ctx.fillText("Scale",350,-300); 
	ctx.fillText("X-Axis:1cm=100m",350,-280); 
	ctx.fillText("Y-Axis:1cm=100m",350,-260); 
	ctx.fill();
	ctx.closePath();
}

// table show()
function showtable()
{
	if( tablesh == 0 )
	{
		document.getElementById('abtable').style.visibility="visible";		
		$('#abtable').show().find('tr').each(function (i,item){  
		  var $row = $(item); 
			$row.hide();  
			$row.delay(i*200).fadeIn(200); 	
		});
		document.getElementById('cmap').innerHTML="Click on Points<br> to plot";
	}
	else if( tablesh == 1 )
	{
		document.getElementById('cdtable').style.visibility="visible";		
		$('#cdtable').show().find('tr').each(function (i,item){  
		  var $row = $(item); 
			$row.hide();  
			$row.delay(i*200).fadeIn(200); 	
		});
		document.getElementById('cmap').innerHTML="Click on Points<br> to plot";
	}
	   
}

//plot points using abtable td
$('#abtable td').on('click',function()
{
	var rowid = $(this).attr('id');
	ctx.beginPath();
	ctx.fillStyle="#035c22";
	ctx.strokeStyle=" #043838";
	switch(rowid)
	{
		case 'a1' : ctx.arc(grid_size*(pointsab[0][0]/100), -grid_size*(pointsab[0][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					//ctx.drawImage(imgTag,grid_size*(pointsab[0][0]/100)-2, -(grid_size*(pointsab[0][1]/100)+40));
					$('#a1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					a1=1;
					break;
		case 'b1' :	ctx.arc(grid_size*(pointsab[1][0]/100), -grid_size*(pointsab[1][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					//ctx.drawImage(imgTag,grid_size*(pointsab[1][0]/100)-2, -(grid_size*(pointsab[1][1]/100)+40));
					$('#b1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					b1=1;
					break;
					
		case 'c1' :	ctx.arc(grid_size*(pointsab[2][0]/100), -grid_size*(pointsab[2][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#c1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					c1=1;
					break;
				   
		case 'd1' :	
					ctx.arc(grid_size*(pointsab[3][0]/100), -grid_size*(pointsab[3][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#d1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					d1=1;
					break;
					
		case 'e1' :	ctx.arc(grid_size*(pointsab[4][0]/100), -grid_size*(pointsab[4][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#e1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					e1=1;
					break;
					
		case 'f1' :	ctx.arc(grid_size*(pointsab[5][0]/100), -grid_size*(pointsab[5][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#f1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					f1=1;
					break;
					
		case 'g1' :	ctx.arc(grid_size*(pointsab[6][0]/100), -grid_size*(pointsab[6][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#g1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					g1=1;
					break;
					
		case 'h1' :	ctx.arc(grid_size*(pointsab[7][0]/100), -grid_size*(pointsab[7][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#h1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					h1=1;
					break;
					
		case 'i1' :	ctx.arc(grid_size*(pointsab[8][0]/100), -grid_size*(pointsab[8][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#i1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					i1=1;
					break;
					
		case 'j1' :	ctx.arc(grid_size*(pointsab[9][0]/100), -grid_size*(pointsab[9][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#j1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					j1=1;
					break;
				
		case 'k1' :	ctx.arc(grid_size*(pointsab[10][0]/100), -grid_size*(pointsab[10][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#k1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					k1=1;
					break;
					
		case 'l1' :	ctx.arc(grid_size*(pointsab[11][0]/100), -grid_size*(pointsab[11][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#l1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					l1=1;
					break;
					
		case 'm1' :	ctx.arc(grid_size*(pointsab[12][0]/100), -grid_size*(pointsab[12][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#m1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					m1=1;
					break;
					
		case 'n1' :	ctx.arc(grid_size*(pointsab[13][0]/100), -grid_size*(pointsab[13][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#n1').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					n1=1;
					break;
					
	}
	if(a1 == 1 && b1 == 1 && c1 == 1 && d1 == 1 && e1 == 1 && f1 == 1 && g1 == 1 && h1 == 1 && i1 == 1 && j1 == 1 && k1 == 1 && l1 == 1 && m1 == 1 && n1 == 1)
	{
		document.getElementById('abpic').style.visibility="hidden";
		document.getElementById('nextButton').style.visibility="visible";
	}
		
});

//plot points using abtable td
$('#cdtable td').on('click',function()
{
	var rowidd = $(this).attr('id');
	ctx2.beginPath();
	ctx2.fillStyle="#035c22";
	ctx2.strokeStyle=" #043838";
	switch(rowidd)
	{
		case 'a2' : ctx2.arc(grid_size*(pointscd[0][0]/100), -grid_size*(pointscd[0][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();	
					ctx2.closePath();
					//ctx2.drawImage(imgTag,grid_size*(pointscd[0][0]/100)-2, -(grid_size*(pointscd[0][1]/100)+40));
					$('#a2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					a2=1;
					break;
		case 'b2' :	ctx2.arc(grid_size*(pointscd[1][0]/100), -grid_size*(pointscd[1][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					//ctx2.drawImage(imgTag,grid_size*(pointscd[1][0]/100)-2, -(grid_size*(pointscd[1][1]/100)+40));
					$('#b2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					b2=1;
					break;
					
		case 'c2' :	ctx2.arc(grid_size*(pointscd[2][0]/100), -grid_size*(pointscd[2][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();	
					ctx2.closePath();
					$('#c2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					c2=1;
					break;
				   
		case 'd2' :	
					ctx2.arc(grid_size*(pointscd[3][0]/100), -grid_size*(pointscd[3][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					$('#d2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					d2=1;
					break;
					
		case 'e2' :	ctx2.arc(grid_size*(pointscd[4][0]/100), -grid_size*(pointscd[4][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					$('#e2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					e2=1;
					break;
					
		case 'f2' :	ctx2.arc(grid_size*(pointscd[5][0]/100), -grid_size*(pointscd[5][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					$('#f2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					f2=1;
					break;
					
		case 'g2' :	ctx2.arc(grid_size*(pointscd[6][0]/100), -grid_size*(pointscd[6][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					$('#g2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					g2=1;
					break;
					
		case 'h2' :	ctx2.arc(grid_size*(pointscd[7][0]/100), -grid_size*(pointscd[7][1]/100),2,0,2*Math.PI,false);
					ctx2.stroke();	
					ctx2.fill();		
					ctx2.closePath();
					$('#h2').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					h2=1;
					break;
		
	}
	if(a2 == 1 && b2 == 1 && c2 == 1 && d2 == 1 && e2 == 1 && f2 == 1 && g2 == 1 && h2 == 1 )
	{
		document.getElementById('cdpic').style.visibility="hidden";
		document.getElementById('nextButton').style.visibility="visible";
	}
		
});



function endLine()
{
	//Endline Y';
	if(tablesh == 0)
	{
		ctx.beginPath();
		ctx.lineWidth=2;
		ctx.font = "20px Verdana Bold";
		ctx.strokeStyle="#000000";
		ctx.fillStyle="#000000";
		ctx.moveTo(grid_size*(1550/100),-canvas_height);
		ctx.lineTo(grid_size*(1550/100),-(grid_size*(0/100)-(grid_size+15)));
		ctx.moveTo(grid_size*(1550/100),-(grid_size*(1000/100)));
		ctx.lineTo(grid_size*(1530/100),-(grid_size*(970/100)));
		ctx.lineTo((grid_size*(1570/100)),-(grid_size*(970/100)));
		ctx.lineTo(grid_size*(1550/100),-(grid_size*(1000/100)));
		ctx.fillText("Y'",grid_size*(1575/100),-(grid_size*(960/100)));
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
	else if(tablesh == 1)
	{
		ctx2.beginPath();
		ctx2.lineWidth=2;
		ctx2.font = "20px Verdana Bold";
		ctx2.strokeStyle="#000000";
		ctx2.fillStyle="#000000";
		ctx2.moveTo(grid_size*(1550/100),-canvas_height);
		ctx2.lineTo(grid_size*(1550/100),-(grid_size*(0/100)-(grid_size+15)));
		ctx2.moveTo(grid_size*(1550/100),-(grid_size*(1000/100)));
		ctx2.lineTo(grid_size*(1530/100),-(grid_size*(970/100)));
		ctx2.lineTo((grid_size*(1570/100)),-(grid_size*(970/100)));
		ctx2.lineTo(grid_size*(1550/100),-(grid_size*(1000/100)));
		ctx2.fillText("Y'",grid_size*(1575/100),-(grid_size*(960/100)));
		ctx2.fill();
		ctx2.stroke();
	}
}

function jpoints(x,y)
{
	if(tablesh == 0)
	{
		ctx.lineTo(x,y);
		ctx.stroke();
	}
	else if(tablesh == 1)
	{
		ctx2.lineTo(x,y);
		ctx2.stroke();
	}
}

function joinPointsab()
{
	if (jpts < pointsab.length) {
		setTimeout(function()
		{
			requestAnimationFrame(joinPointsab);
		},500);
    }
	if(jpts==pointsab.length)
		{
			jpoints(grid_size*(1550/100),-grid_size*(200/100));
			ctx.closePath();
			var q2 = Object.create(questions);												
			generateQuestion(q2,"How many dotted lines are identified along line AB:","","20","16","14","12",3,nextButtonProceed,100,150,300,120);	
		}
	//Join Points
	ctx.strokeStyle="maroon";
	ctx.lineWidth=1;
		if(jpts==4)
		{
			ctx.quadraticCurveTo(grid_size*((pointsab[jpts][0]/100)-0.75),-grid_size*((pointsab[jpts][1]/100)+0.75),grid_size*(pointsab[jpts][0]/100),-grid_size*(pointsab[jpts][1]/100));
		}
		if(jpts==8)
		{
			ctx.quadraticCurveTo(grid_size*((pointsab[jpts][0]/100)-0.5),-grid_size*((pointsab[jpts][1]/100)-0.5),grid_size*(pointsab[jpts][0]/100),-grid_size*(pointsab[jpts][1]/100));
		}
		if(jpts==11)
		{
			ctx.quadraticCurveTo(grid_size*((pointsab[jpts][0]/100)-0.55),-grid_size*((pointsab[jpts][1]/100)+0.55),grid_size*(pointsab[jpts][0]/100),-grid_size*(pointsab[jpts][1]/100));
		} 
		if(jpts == 0 || jpts == 1|| jpts == 2 || jpts == 3 || jpts == 5 || jpts == 6 || jpts == 7 || jpts == 9 || jpts == 10 || jpts == 12 || jpts == 13)
		{	
			jpoints(grid_size*(pointsab[jpts][0]/100),-grid_size*(pointsab[jpts ][1]/100));
		}
	jpts++;
}

function joinPointscd()
{
	if (jpts1 < pointscd.length) {
		setTimeout(function()
		{
			requestAnimationFrame(joinPointscd);
		},500);
    }
	if(jpts1==pointscd.length)
		{
			jpoints(grid_size*(1550/100),-grid_size*(100/100));
			ctx2.closePath();
				document.getElementById('nextButton').style.visibility="visible";
			}
	//Join Points
	ctx2.strokeStyle="maroon";
	ctx2.lineWidth=1;
		if(jpts1==4)
		{
			ctx2.quadraticCurveTo(grid_size*((pointscd[jpts1][0]/100)-1.25),-grid_size*((pointscd[jpts1][1]/100)+0.75),grid_size*(pointscd[jpts1][0]/100),-grid_size*(pointscd[jpts1][1]/100));
		}
		if(jpts1 == 0 || jpts1 == 1|| jpts1 == 2 || jpts1 == 3 || jpts1 == 5 || jpts1 == 6 || jpts1 == 7 )
		{	
			jpoints(grid_size*(pointscd[jpts1][0]/100),-grid_size*(pointscd[jpts1][1]/100));
		}
	jpts1++;
}

function nextButtonProceed()
{
	document.getElementById('nextButton').style.visibility="visible";
}


 
