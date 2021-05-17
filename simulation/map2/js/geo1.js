var grid_size = 35;
//each line plot points
var xaxis_starting_point = {number : 100, suffix:" "};
var yaxis_starting_point = {number : 100, suffix:" "};
var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

var paper = document.getElementById('paper');
var pctx = paper.getContext('2d');

var pencil = document.getElementById('paper');
var ptx = pencil.getContext('2d');

var canvas_width = canvas.width;
var canvas_height = canvas.height;

//no of vertical grid lines
var num_lines_x = Math.floor(canvas.height/grid_size);
//no of horizontal grid lines
var num_lines_y = Math.floor(canvas.width/grid_size);
//distance between lines
var xaxis_distance_gridlines = num_lines_x-1;
var yaxis_distance_gridlines = 1;
var t = 1,tx = 1,ty = 1,tpoint = 0,paperpoint=0,lpoint=1,jpts=0;
var ptsx =[];
var ptsy =[];
var vertices = [];
var spanclick=0;
var rclick=0;
var tl190 = 1,p190 = [],pt190 = [];tl210 = 1,p210 = [],pt210 = [];
var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;regionclick=0;
var x,y,str;

//---tooltip variable
var sp=false;

//line plotting pencil within paper canvas
var imgTag = new Image();
imgTag.src = "images/pencil1.png";

//---variables plotting line on paper stores line as pencil track points
var x;
var y;
var xx;
var yy;
var calcindex=0;


var mm,nn,ss,tt;
var pregion=0,qregion=0,qboundry=0,rregion=0,rboundry=0;

var finalspan=0;
var ids;


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
		questions.ans1 = ans;
	},
	frameQuestions:function(qun){
		var myDiv  = document.getElementById("question-div");
		var myDiv1 = document.getElementById("divq");
		myDiv.style.visibility = "visible";
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
for(i=0;i<points.length;i++)
{
	vertices.push({
    x: points[i][0],
    y: points[i][1]
	});
}

var xpoints = calcWaypoints(ptsx);
var ypoints = calcWaypoints(ptsy);
var plotpoints = calcPlotpoints(vertices);
var linepoints = calcWaypoints(vertices);

function animatearrow(ids)
{
    if(document.getElementById(ids).style.visibility=="visible")
        document.getElementById(ids).style.visibility="hidden";
    else
        document.getElementById(ids).style.visibility="visible";
}

//stop blinking arrow
function myStopFunction(ids) 
{
    clearInterval(myInt);
   // document.getElementById('ids').style.visibility="hidden";
}

$(function()
{
	var isTouchSupported = 'ontouchstart' in window;
	var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
	var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
	var endEvent = isTouchSupported ? 'touchend' : 'mouseup';
	$('input').on('input', function() {
		this.value = this.value.match(/\d*(\.\d*)?/)[0];
	});
	$('input').on('change keydown',function()
	{
		$('input').next("span").remove();
		$('#chk').prop( "disabled", false );
	});
	$('#chk').click(function()
	{
		mm = $('#canp2').val();
		nn = $('#canp3').val();
		ss = $('#canp4').val();
		tt = $('#canp5').val();
		if( calcindex == 0 )
		{
			if(mm == 100 && nn == 200 && ss == 1 && tt == 0)
			{
				$('#chk').hide();
				$('#canp2,#canp3,#canp4,#canp5').prop( "disabled", true );
				document.getElementById('calculate').style.visibility="visible";
			}
			else
			{
				if( mm!=100)
					$('#canp2').after("<span>&#10008;</span>");
				if( nn!=200)
					$('#canp3').after("<span>&#10008;</span>");
				if( ss!=1)
					$('#canp4').after("<span>&#10008;</span>");
				if( tt!=0)
					$('#canp5').after("<span>&#10008;</span>");
				$('#chk').prop( "disabled", true );
			}
		}
		else if( calcindex == 1 )
		{
			if(mm == 200 && nn == 300 && ss == 1 && tt == 0)
			{
				$('#chk').hide();
				$('#canp2,#canp3,#canp4,#canp5').prop( "disabled", true );
				$('#calculate').show();
			}
			else
			{
				if( mm!=200)
					$('#canp2').after("<span>&#10008;</span>");
				if( nn!=300)
					$('#canp3').after("<span>&#10008;</span>");
				if( ss!=1)
					$('#canp4').after("<span>&#10008;</span>");
				if( tt!=0)
					$('#canp5').after("<span>&#10008;</span>");
				$('#chk').prop( "disabled", true );
			}
		}
		else if( calcindex == 2 )
		{
			if(mm == 400 && nn == 500 && ss == 1 && tt == 0)
			{
				$('#chk').hide();
				$('#canp2,#canp3,#canp4,#canp5').prop( "disabled", true );
				$('#calculate').show();
			}
			else
			{
				if( mm!=400)
					$('#canp2').after("<span>&#10008;</span>");
				if( nn!=500)
					$('#canp3').after("<span>&#10008;</span>");
				if( ss!=1)
					$('#canp4').after("<span>&#10008;</span>");
				if( tt!=0)
					$('#canp5').after("<span>&#10008;</span>");
				$('#chk').prop( "disabled", true );
			}
		}
	});
	$('#calculate').click(function()
	{
		if( calcindex == 0 )
		{
			$('#entry').hide();
			$('#calcresult').show();
			$('#sub').text("Index = ((200-100)/(1+1))*(0+1)+100");
			$('#res1').text("Index = 150");
			$('#res2').text("P = (0,150)");
			document.getElementById('calcresult').style.visibility="visible";
			document.getElementById('regions').style.visibility="visible";
			document.getElementById('c').style.visibility="visible";
			calcindex=1;
			setTimeout(function()
			{
				document.getElementById('canp0').innerHTML = "<strong>Select Q</strong>";
				document.getElementById('can71').src = "images/qf.png";
				$('#entry').show();
				$('#chk').show();
				$('#calculate').hide();
				document.getElementById("entry").reset();	
				$('#canp2,#canp3,#canp4,#canp5').prop( "disabled", false );				
				$('#calcresult').hide();
			},2500);
		}
		else if( calcindex == 1 )
		{
			$('#entry').hide();
			$('#calcresult').show();
			$('#sub').text("Index = ((300-200)/(1+1))*(0+1)+200");
			$('#res1').text("Index = 250");
			$('#res2').text("Q = (0,250)");
			document.getElementById('sl').style.visibility="visible";
			calcindex=2;
			setTimeout(function()
			{
				document.getElementById('canp0').innerHTML = "<strong>Select R</strong>";
				document.getElementById('can71').src = "images/rf.png";
				$('#entry').show();
				$('#chk').show();
				$('#calculate').hide();
				document.getElementById("entry").reset();	
				$('#canp2,#canp3,#canp4,#canp5').prop( "disabled", false);								
				$('#calcresult').hide();
			},2500);
		}
		else if( calcindex == 2 )
		{
			$('#entry').hide();
			$('#calcresult').show();
			$('#sub').text("Index = ((500-400)/(1+1))*(0+1)+400");
			$('#res1').text("Index = 450");
			$('#res2').text("R = (0,450)");
			document.getElementById('ss').style.visibility="visible";
			document.getElementById('lm').style.visibility="visible";
			setTimeout(function()
			{
				$('#can71').hide();
				$('#canp0').hide();
				$('#canp1').hide();
				$('#calcresult').hide();
				$('#regions').css('top','100px');
				document.getElementById('nextButton').style.visibility="visible";
			},2500);
		}
	});
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
	$('#legend').mouseover(function()
	{
		$('#legg').show();
	});
	$('#legend').mouseout(function()
	{
		$('#legg').hide();
	});
	 $('#simscreen').mousemove(function(event){
		 var xx = event.pageX;
		 var yy = event.pageY;
		 if(sp==true)
		 {
			 if(xx>=109 && xx<=115 && yy>=294 && yy<=300)
			 {
				$('#tooltip-span').text("a(100,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			 else if(xx>=144 && xx<=150 && yy>=330 && yy<=335)
			 {
				$('#tooltip-span').text("b(200,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=179 && xx<=185 && yy>=364 && yy<=370)
			 {
				$('#tooltip-span').text("c(300,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=214 && xx<=220 && yy>=399&& yy<=405)
			 {
				$('#tooltip-span').text("d(400,200)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=249&& xx<=255 && yy>=399 && yy<=405)
			 {
				$('#tooltip-span').text("e(500,200)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=284 && xx<=290 && yy>=364 && yy<=370)
			 {
				$('#tooltip-span').text("f(600,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=326 && xx<=333 && yy>=329 && yy<=335)
			 {
				$('#tooltip-span').text("g(720,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=360 && xx<=368 && yy>=294 && yy<=300)
			 {
				$('#tooltip-span').text("h(820,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=400 && xx<=406 && yy>=294 && yy<=300)
			 {
				$('#tooltip-span').text("i(930,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=431 && xx<=437 && yy>=329 && yy<=335)
			 {
				$('#tooltip-span').text("j(1020,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=470 && xx<=475 && yy>=364 && yy<=370)
			 {
				$('#tooltip-span').text("k(1130,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=508 && xx<=515 && yy>=364 && yy<=370)
			 {
				$('#tooltip-span').text("l(1240,300)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=547 && xx<=553 && yy>=329 && yy<=335)
			 {
				$('#tooltip-span').text("m(1350,400)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
				  visibility:'visible'
				});
			 }
			  else if(xx>=582 && xx<=589 && yy>=294 && yy<=300)
			 {
				$('#tooltip-span').text("n(1450,500)");    
				$('#tooltip-span').css({
				  position:'absolute',
				  top:event.pageY,
				  left:event.pageX+20,
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
	$('#pr').click(function()
	{
		myStopFunction(ids);
		$('#pr span').remove();
		if(regionclick==0)
		{
			drawpline();
		}
	});
	$('#sr').click(function()
	{
		myStopFunction(ids);
		$('#sr span').remove();
		if(regionclick==1)
		{
			drawqline();
		}
	});
	$('#ssr').click(function()
	{
		myStopFunction(ids);
		$('#ssr span').remove();
		if(regionclick==2)
		{
			drawrline();
		}
	});
	$('#lr').click(function()
	{
		myStopFunction(ids);
		$('#lr span').remove();
		if(regionclick==3)
		{
			regionclick=4;
			drawlimepattern();
			document.getElementById('lastmap').style.visibility="visible";
			sp=true;
		}
	});
	$('#lastmap').click(function()
	{
		if(finalspan == 0)
		{
			sp=false;
			$('#canvas-wrap').hide();
			$('#pr,#sr,#ssr,#lr').hide();
			document.getElementById('lmap').style.visibility="visible";
			$('#lastmap').css({'left':'610px','top':'100px'});
			$('#lastmap').text('View Graph');
			finalspan=1;
		}
		else if(finalspan == 1)
		{
			sp=true;
			$('#canvas-wrap').show();
			$('#pr,#sr,#ssr,#lr').show();
			document.getElementById('lmap').style.visibility="hidden";
			$('#lastmap').css({'left':'610px','top':'260px'});
			$('#lastmap').text('Contour Map');
			finalspan=0;
		}
	});
 });

//---------------calc for plotting point animations------------
function calcPlotpoints(vertices) {
    var ptpoints = [];
    for (var i = 0; i < vertices.length; i++) {
        //var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        //var dx = pt1.x - pt0.x;
        //var dy = pt1.y - pt0.y;
        // for (var j = 0; j < 100; j++) {
            // <!-- var x = pt0.x + dx * j / 100; -->
            // <!-- var y = pt0.y + dy * j / 100; -->
            ptpoints.push({
                x: pt1.x,
                y: pt1.y
            });
        }
    
    return (ptpoints);
}



// calc waypoints traveling along vertices(for line tracing)
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

//-------function for array formation--------------
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
		document.getElementById('nextButton').style.visibility="visibility";
		document.getElementById('cmap').style.visibility="visible";
		document.getElementById('cmap').innerHTML="Get Paper";
		document.getElementById('cmap').style = "position:absolute; left:660px; top:120px;font-family:verdana;font-size:14px;width:125px;height:35px;color:black;"
	}
	else if(simsubscreennum == 2)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('canvas-wrap').style.visibility="visible";	
		document.getElementById('paper').style.visibility="hidden";
		document.getElementById('xpoints').style.visibility="hidden";
		document.getElementById('fullmap').style.visibility="hidden";
		ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas		
		drawXaxis();
		drawYaxis();
		spanclick=3;
		// document.getElementById('cmap').style.visibility="visible";
		document.getElementById('mycanvas').style.border="solid 2px";
		// document.getElementById('cmap').innerHTML="Plot X-Axis";	
		var q1 = Object.create(questions);												
		generateQuestion(q1,"How many geological cross-sections are taken in this map?","","1","2","3","4",1,screen3Proceed,100,150,300,120);	
	}
	else if(simsubscreennum == 3)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('pointmap').style.visibility="visible";	
		document.getElementById('cmap').style.visibility="visible";	
		document.getElementById('cmap').innerHTML = "Define<br>Co-ordinates";	
		
	}
	else if(simsubscreennum == 4)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('cmap').innerHTML = "Plot Y'<br>&lt;X:1520 Y:0&gt;";
		spanclick=10;
	}
	else if(simsubscreennum == 5)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('xypoints').style.visibility="hidden";
		//document.getElementById('tunneltable').style.visibility="visible";
		document.getElementById('cmap').innerHTML = "Draw Tunnel at<br> Y=190,Y=210";
		spanclick=13;
	}
	else if(simsubscreennum == 6)
	{
		document.getElementById('nextButton').style.visibility="hidden";
		document.getElementById('tunneltable').style.visibility="hidden";
		document.getElementById('cmap').style.visibility="hidden";
		document.getElementById('canvas-wrap').style.visibility="hidden";
		document.getElementById('scale').style.visibility="hidden";
		document.getElementById('direct').style.visibility="hidden";
		document.getElementById('legend').style.visibility="hidden";
		document.getElementById('p1').style.visibility="visible";
		document.getElementById('ct1').style.visibility="visible";
		setTimeout(function()
		{
			document.getElementById('ct2').style.visibility="visible";	
		},1500);
		setTimeout(function()
		{
			document.getElementById('ct1').style.visibility="hidden";	
			document.getElementById('ct2').style.visibility="hidden";	
			document.getElementById('ct3').style.visibility="visible";	
		},2500);
		setTimeout(function()
		{
			document.getElementById('ct3').style.visibility="hidden";	
			document.getElementById('ct4').style.visibility="visible";	
			document.getElementById('p2').style.visibility="visible";	
		},4500);
		setTimeout(function()
		{
			document.getElementById('ct4').style.visibility="hidden";	
			document.getElementById('ct5').style.visibility="visible";	
			document.getElementById('p3').style.visibility="visible";	
		},7000);
		setTimeout(function()
		{	
			document.getElementById('p4').style.visibility="visible";	
		},8500);
		setTimeout(function()
		{	
			document.getElementById('p5').style.visibility="visible";	
			document.getElementById('nextButton').style.visibility="visible";	
		},9500);
			
	}
	else if(simsubscreennum == 7)
	{
		document.getElementById('ct5').style.visibility="hidden";
		document.getElementById('p1').style.visibility="hidden";
		document.getElementById('p2').style.visibility="hidden";
		document.getElementById('p3').style.visibility="hidden";
		document.getElementById('p4').style.visibility="hidden";
		document.getElementById('p5').style.visibility="hidden";
		document.getElementById('canvas-wrap').style.visibility="hidden";
		document.getElementById('nextButton').style.visibility="hidden";
	}
	else if(simsubscreennum == 8)
	{
		
		document.getElementById('canvas-wrap').style.visibility="visible";
		document.getElementById('scale').style.visibility="visible";
		document.getElementById('direct').style.visibility="visible";
		document.getElementById('legend').style.visibility="visible";
		ids=$('#s1').attr('id');
		myInt = setInterval(function(){ animatearrow(ids); }, 500);
		document.getElementById('regions').style.visibility="hidden";
		document.getElementById('c').style.visibility="hidden";
		document.getElementById('sl').style.visibility="hidden";
		document.getElementById('ss').style.visibility="hidden";
		document.getElementById('lm').style.visibility="hidden";
		document.getElementById('nextButton').style.visibility="hidden";
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
		document.getElementById('canvas-wrap').style.visibility="visible";
		document.getElementById('paper').style.visibility="visible";
		document.getElementById('cmap').style.visibility="hidden";
		$('#paper').animate(
							{
								height:'250'
							},
							800,
		
						function(){
			//$('#fullmap').css('clip', 'rect(0px, 600px, 180px, 0px)');
			document.getElementById('paper').width="528";
			document.getElementById('paper').height="250";
			document.getElementById('cmap').style.visibility="visible";
			$('#cmap').text("Mark Points");
			spanclick=1;
		  });
		  
      
    }
	
	else if(spanclick == 1)
	{
		pctx.clearRect(0,0,paper.width,paper.height);
		document.getElementById('xpoints').style.visibility="visible";
		$('#xpoints').show().find('tr').each(function (i,item){  
			var $row = $(item); 
			$row.hide();  
			$row.delay(i*500).fadeIn(500); 	
		});
		plotonpaper();
		document.getElementById('cmap').style.visibility="hidden";
		
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
		ctx.beginPath();
		ctx.moveTo(0,-grid_size*(600/100));
		joinPoints();
		spanclick=12;
		document.getElementById('cmap').style.visibility="visible";
	}
	else if(spanclick == 13)
	{
		spanclick=14;
		// document.getElementById('cmap').style.visibility="visible"
		// document.getElementById('nextButton').style.visibility="visible"
		t190();
		t210();
	}
}
// $('#cmap').click('one', function() {
	// if(spanclick == 0)
	// {
		// document.getElementById('paper').style.visibility="visible";
		// document.getElementById('cmap').style.visibility="hidden";
		// $('#paper').animate(
							// {
								// height:'250'
							// },
							// 800,
		
						// function(){
			// //$('#fullmap').css('clip', 'rect(0px, 600px, 180px, 0px)');
			// document.getElementById('paper').width="528";
			// document.getElementById('paper').height="250";
			// document.getElementById('cmap').style.visibility="visible";
			// $('#cmap').text("Mark Points");
			// spanclick=1;
		  // });
		  
      
    // }
	
	// else if(spanclick == 1)
	// {
		// pctx.clearRect(0,0,paper.width,paper.height);
		// document.getElementById('xpoints').style.visibility="visible";
		// $('#xpoints').show().find('tr').each(function (i,item){  
			// var $row = $(item); 
			// $row.hide();  
			// $row.delay(i*500).fadeIn(500); 	
		// });
		// plotonpaper();
		// document.getElementById('cmap').style.visibility="hidden";
		
		// //document.getElementById('nextButton').style.visibility="visible";
	// }
	// else if(spanclick == 3)
	// {
		// document.getElementById('cmap').style.visibility="hidden";
		// spanclick=4;
		// plotXaxis(xpoints);
	// }
	// else if(spanclick == 4)
	// {
		// document.getElementById('cmap').style.visibility="hidden";
		// plotYaxis(ypoints);
		// setTimeout(function()
		// {
			// ctx.translate(yaxis_distance_gridlines*grid_size,xaxis_distance_gridlines*grid_size);
			// drawtriangle();
			// spanclick=5;
		// },2600);
	// }
	// else if(spanclick == 5)
	// {
		// tickXaxis();
		// origin();
		// $('#cmap').text("Points on Y-Axis");
		// spanclick=6;
	// }
	// else if(spanclick == 6)
	// {
		// tickYaxis();
		// document.getElementById('cmap').style.visibility = "hidden";
		// document.getElementById('nextButton').style.visibility = "visible";
		// document.getElementById('scale').style.visibility = "visible";
		// document.getElementById('direct').style.visibility = "visible";
		// $('#cmap').css('height','35px');
		// spanclick=8;
	// }
	// else if(spanclick == 7)
	// {
		// namescale();
		// document.getElementById('cmap').style.visibility = "hidden";
		// document.getElementById('nextButton').style.visibility = "visible";
		// $('#cmap').css('height','35px');
		// spanclick=8;
	// }
	// else if(spanclick == 8)
	// {
		// showtable();
		// spanclick=9;
	// }
	// else if(spanclick == 10)
	// {
		// endLine();
		// $('#cmap').text("Join Points");
		// spanclick=11;
	// }
	// else if(spanclick == 11)
	// {
		// ctx.beginPath();
		// ctx.moveTo(0,-grid_size*(600/100));
		// joinPoints();
		// spanclick=12;
		// document.getElementById('cmap').style.visibility="visible";
	// }
	// else if(spanclick == 13)
	// {
		// spanclick=14;
		// // document.getElementById('cmap').style.visibility="visible"
		// // document.getElementById('nextButton').style.visibility="visible"
		// t190();
		// t210();
	// }
// });

// To hide the dialog
function hideDialog()
{
	document.getElementById('dialog-div').style.visibility="hidden";
	document.getElementById('cmap').style.visibility="hidden";
	document.getElementById('nextButton').style.visibility="visible";
	spanclick = 0;
}

//-------------plotting tunnel--------------
$('#t190').on('click',function()
{
	p190 = formArray(grid_size*(1525/100),-(grid_size*(190/100)),grid_size*(490/100),-(grid_size*(190/100)));
	pt190 = calcWaypoints(p190);
	tunnel190();
	
});
function t190()
{
	p190 = formArray(grid_size*(1525/100),-(grid_size*(190/100)),grid_size*(490/100),-(grid_size*(190/100)));
	pt190 = calcWaypoints(p190);
	tunnel190();
}
//----------------plotting tunnel190 axis animation-------------
function tunnel190()
{
	
 if (tl190 < pt190.length-1) {
        requestAnimationFrame(tunnel190);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
    ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle="black";
    ctx.moveTo(pt190[tl190 - 1].x, pt190[tl190 - 1].y);
    ctx.lineTo(pt190[tl190].x, pt190[tl190].y);
    ctx.stroke();
	ctx.closePath();
    // increment "t" to get the next waypoint
    tl190++;
}

function t210()
{
	p210 = formArray(grid_size*(1525/100),-(grid_size*(210/100)),grid_size*(500/100),-(grid_size*(210/100)));
	pt210 = calcWaypoints(p210);
	tunnel210();
	ctx.beginPath();
	ctx.fillStyle="blue";
	ctx.font = '10px Verdana';
	ctx.textAlign = 'start';
	ctx.fillText("Tunnel", grid_size*(920/100),-(grid_size*(192/100)));
	ctx.fill();
	ctx.closePath();
}

//--------------------plotting tunnel210------------
$('#t210').on('click',function()
{
	p210 = formArray(grid_size*(1525/100),-(grid_size*(210/100)),grid_size*(500/100),-(grid_size*(210/100)));
	pt210 = calcWaypoints(p210);
	tunnel210();
	ctx.beginPath();
	ctx.fillStyle="blue";
	ctx.font = '10px Verdana';
	ctx.textAlign = 'start';
	ctx.fillText("Tunnel", grid_size*(920/100),-(grid_size*(192/100)));
	ctx.fill();
	ctx.closePath();
	
});
//------------------plotting tunnel190 axis animation--------------
function tunnel210()
{
	
 if (tl210 < pt210.length-1) {
        requestAnimationFrame(tunnel210);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
    ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle="black";
    ctx.moveTo(pt210[tl210 - 1].x, pt210[tl210- 1].y);
    ctx.lineTo(pt210[tl210].x, pt210[tl210].y);
    ctx.stroke();
	ctx.closePath();
    // increment "t" to get the next waypoint
    tl210++;
	if(tl210 == pt210.length)
	{
		var q2 = Object.create(questions);												
		generateQuestion(q2,"A 20m depth tunnel is planned to divert the river water at an invert level (floor) at _______m.:","","200","160","140","120",1,nextButtonProceed,100,150,300,120);
		// document.getElementById('nextButton').style.visibility="visible";
	}
}
//-----animating line draw on paper------------
function drawpp()
	{
		pctx.moveTo(xx,yy);
		pctx.lineTo(xx,yy+2);
		//pctx.font="12px verdana";
		pctx.lineWidh="1";
		pctx.strokeStyle="blue";
		pctx.stroke();
		//pctx.fillText(markers[paperpoint],xx,190);
		//pctx.fill();
		yy += 1;
		if (yy<=15) requestAnimationFrame(drawpp) 
	}

//---marking animation with pencil---------
function animate() {
		  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		  ctx.drawImage(imgTag, x, y);                       // draw image at current position
		  y += 1;
		  if (y <=140) requestAnimationFrame(animate) 			  // loop
		}	
		
		
//-----------plot on paper-----------
function plotonpaper()
{
	if (paperpoint < 14) {
		setTimeout(function()
		{
			requestAnimationFrame(plotonpaper);
		},500);
    }
	if(paperpoint==14)
		{
		  document.getElementById('nextButton').style.visibility="visible";
		  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
		}
	pctx.beginPath();
	if(paperpoint == 0)
	{
			x = 88+(paperpoint*35);
			y = 120;
			xx = 35+(paperpoint*35);
			yy = 0;
			pctx.font="12px verdana";
			pctx.fillText(markers[paperpoint],30+(paperpoint*35),30);
			pctx.fill();
			drawpp();
			animate(x,y);
	}
	else if(paperpoint == 1)
	{
		x = 87+(paperpoint*35);
		y = 120;
		xx = 34+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],30+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpoint == 2)
	{
		x = 86+(paperpoint*35);
		y = 120;
		xx = 34+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],30+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpoint == 3)
	{
		x = 87+(paperpoint*35);
		y = 120;
		xx = 35+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],30+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);	
	}
	else if(paperpoint == 4)
	{
		x = 89+(paperpoint*35);
		y = 120;
		xx = 37+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],37+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 5)
	{
		x = 90+(paperpoint*35);
		y = 120;
		xx = 37+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],37+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 6)
	{
		x = 92+(paperpoint*35);
		y = 120;
		xx = 40+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],39+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 7)
	{
		x = 90+(paperpoint*35);
		y = 120;
		xx = 37+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],37+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 8)
	{
		x = 89+(paperpoint*35);
		y = 120;
		xx = 37+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],37+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 9)
	{
		x = 90+(paperpoint*35);
		y = 120;
		xx = 37+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],37+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 10)
	{
		x = 95+(paperpoint*35);
		y = 120;
		xx = 42+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],42+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 11)
	{
		x = 96+(paperpoint*35);
		y = 120;
		xx = 44+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],43+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 12)
	{
		x = 99+(paperpoint*35);
		y = 120;
		xx = 47+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],46+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	else if(paperpoint == 13)
	{
		x = 99+(paperpoint*35);
		y = 120;
		xx = 47+(paperpoint*35);
		yy = 0;
		pctx.font="12px verdana";
		pctx.fillText(markers[paperpoint],46+(paperpoint*35),30);
		pctx.fill();
		drawpp();
		animate(x,y);
	}
	paperpoint++;
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
    // increment "t" to get the next waypoint
    ty++;
}
function origin()
{
	//Name origin as 0
	ctx.beginPath();
	ctx.font = '10px Verdana';
	ctx.fillText("0",-10,15); 
	ctx.fill();
	ctx.closePath();
}
function tickXaxis()
{
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
	}	
	ctx.stroke();
	ctx.closePath();
}
function tickYaxis()
{
	//Positive Y-axis of graph is negative Y-axis of the canvas
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
	}
}
function drawtriangle()
{
	ctx.beginPath();
	ctx.strokeStyle="black";
	ctx.fillStyle="black";
	ctx.font = "20px Verdana Bold";
	ctx.fillText("Y",-(grid_size*(50/100)),-(grid_size*(960/100)));
	ctx.moveTo(0,-(grid_size*(1000/100)));
	ctx.lineTo(-(grid_size*(20/100)),-(grid_size*(970/100)));
	ctx.lineTo((grid_size*(20/100)),-(grid_size*(970/100)));
	ctx.lineTo(0,-(grid_size*(1010/100)));
	ctx.fillText("X",grid_size*(1580/100),-(grid_size*(-50/100)));
	ctx.moveTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx.lineTo(grid_size*(1580/100),-(grid_size*(20/100)));
	ctx.lineTo((grid_size*(1580/100)),-(grid_size*(-20/100)));
	ctx.lineTo(grid_size*(1620/100),-(grid_size*(0/100)));
	ctx.fill();
	ctx.closePath();
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
	document.getElementById('xypoints').style.visibility="visible";		
	$('#xypoints').show().find('tr').each(function (i,item){  
	  var $row = $(item); 
		$row.hide();  
		$row.delay(i*200).fadeIn(200); 	
	});
	document.getElementById('cmap').innerHTML="Click on Points<br> to plot";
	   
}

//plot points using table td
$('td').on('click',function()
{
	var rowid = $(this).attr('id');
	ctx.beginPath();
	ctx.fillStyle="#035c22";
	ctx.strokeStyle=" #043838";
	switch(rowid)
	{
		case 'a' : ctx.arc(grid_size*(points[0][0]/100), -grid_size*(points[0][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					//ctx.drawImage(imgTag,grid_size*(points[0][0]/100)-2, -(grid_size*(points[0][1]/100)+40));
					$('#a').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					a=1;
					break;
		case 'b' :	ctx.arc(grid_size*(points[1][0]/100), -grid_size*(points[1][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					//ctx.drawImage(imgTag,grid_size*(points[1][0]/100)-2, -(grid_size*(points[1][1]/100)+40));
					$('#b').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					b=1;
					break;
					
		case 'c' :	ctx.arc(grid_size*(points[2][0]/100), -grid_size*(points[2][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#c').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					c=1;
					break;
				   
		case 'd' :	
					ctx.arc(grid_size*(points[3][0]/100), -grid_size*(points[3][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#d').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					d=1;
					break;
					
		case 'e' :	ctx.arc(grid_size*(points[4][0]/100), -grid_size*(points[4][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#e').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					e=1;
					break;
					
		case 'f' :	ctx.arc(grid_size*(points[5][0]/100), -grid_size*(points[5][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#f').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					rclick++;
					f=1;
					break;
					
		case 'g' :	ctx.arc(grid_size*(points[6][0]/100), -grid_size*(points[6][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#g').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');					
					rclick++;
					g=1;
					break;
					
		case 'h' :	ctx.arc(grid_size*(points[7][0]/100), -grid_size*(points[7][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#h').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					h=1;
					break;
					
		case 'i' :	ctx.arc(grid_size*(points[8][0]/100), -grid_size*(points[8][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#i').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					i=1;
					break;
					
		case 'j' :	ctx.arc(grid_size*(points[9][0]/100), -grid_size*(points[9][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#j').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					j=1;
					break;
				
		case 'k' :	ctx.arc(grid_size*(points[10][0]/100), -grid_size*(points[10][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#k').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					k=1;
					break;
					
		case 'l' :	ctx.arc(grid_size*(points[11][0]/100), -grid_size*(points[11][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();	
					ctx.closePath();
					$('#l').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					l=1;
					break;
					
		case 'm' :	ctx.arc(grid_size*(points[12][0]/100), -grid_size*(points[12][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#m').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					m=1;
					break;
					
		case 'n' :	ctx.arc(grid_size*(points[13][0]/100), -grid_size*(points[13][1]/100),2,0,2*Math.PI,false);
					ctx.stroke();	
					ctx.fill();		
					ctx.closePath();
					$('#n').off('click');
					$(this).css('background','#fff');
					$(this).css('cursor','auto');
					rclick++;
					n=1;
					break;
					
	}
	if(a == 1 && b == 1 && c == 1 && d == 1 && e == 1 && f == 1 && g == 1 && h == 1 && i == 1 && j == 1 && k == 1 && l == 1 && m == 1 && n == 1)
	{
		document.getElementById('pointmap').style.visibility="hidden";
		document.getElementById('nextButton').style.visibility="visible";
	}
		
});





function endLine()
{
	//Endline Y';
	ctx.beginPath();
	ctx.lineWidth=2;
	ctx.font = "20px Verdana Bold";
	ctx.strokeStyle="#000000";
	ctx.fillStyle="#000000";
	ctx.moveTo(grid_size*(1525/100),-canvas_height);
	ctx.lineTo(grid_size*(1525/100),-(grid_size*(0/100)-(grid_size+15)));
	ctx.moveTo(grid_size*(1525/100),-(grid_size*(1000/100)));
	ctx.lineTo(grid_size*(1505/100),-(grid_size*(970/100)));
	ctx.lineTo((grid_size*(1545/100)),-(grid_size*(970/100)));
	ctx.lineTo(grid_size*(1525/100),-(grid_size*(1000/100)));
	ctx.fillText("Y'",grid_size*(1550/100),-(grid_size*(960/100)));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function jpoints(x,y)
{
	ctx.lineTo(x,y);
	ctx.stroke();
}

function joinPoints()
{
	if (jpts < points.length) {
		setTimeout(function()
		{
			requestAnimationFrame(joinPoints);
		},500);
    }
	if(jpts==points.length)
		{
			jpoints(grid_size*(1525/100),-grid_size*(600/100));
			ctx.closePath();
			document.getElementById('nextButton').style.visibility="visible";
		}
	//Join Points
	ctx.strokeStyle="maroon";
	ctx.lineWidth=1;
		if(jpts==4)
		{
			ctx.quadraticCurveTo(grid_size*((points[jpts][0]/100)-0.5),-grid_size*((points[jpts][1]/100)-0.5),grid_size*(points[jpts][0]/100),-grid_size*(points[jpts][1]/100));
		}
		if(jpts==8)
		{
			ctx.quadraticCurveTo(grid_size*((points[jpts][0]/100)-0.5),-grid_size*((points[jpts][1]/100)+0.5),grid_size*(points[jpts][0]/100),-grid_size*(points[jpts][1]/100));
		}
		if(jpts==11)
		{
			ctx.quadraticCurveTo(grid_size*((points[jpts][0]/100)-0.5),-grid_size*((points[jpts][1]/100)-0.5),grid_size*(points[jpts][0]/100),-grid_size*(points[jpts][1]/100));
		} 
		if(jpts == 0 || jpts == 1 || jpts == 2 || jpts == 3 || jpts == 5 || jpts == 6 || jpts == 7 || jpts == 9 || jpts == 10 || jpts == 12 || jpts == 13)
		{	
			jpoints(grid_size*(points[jpts][0]/100),-grid_size*(points[jpts ][1]/100));
		}
	jpts++;
}


function drawTunnel()
{
	//Tunnel creaton at points y=190 and 210
	ctx.beginPath();
	ctx.moveTo(grid_size*(1525/100),-(grid_size*(190/100)));
	ctx.lineTo(grid_size*(490/100),-(grid_size*(190/100)));
	ctx.fillStyle="blue";
	ctx.font = '10px Verdana';
	ctx.textAlign = 'start';
	ctx.fillText("Tunnel", grid_size*(920/100),-(grid_size*(192/100)));
	ctx.moveTo(grid_size*(1525/100),-(grid_size*(210/100)));
	ctx.lineTo(grid_size*(510/100),-(grid_size*(210/100)));
	ctx.stroke();
	ctx.closePath();
	//drawPatterns();
}
function dpline()
{
	ctx.lineTo(grid_size*(pregion/100),-(grid_size*(150/100)));
	ctx.lineWidth=1;
	ctx.strokeStyle="black";
	ctx.stroke();
	pregion +=25;
	if (pregion<=1525) 
		requestAnimationFrame(dpline)
	if(pregion>1525)
		{
			ctx.closePath();
			drawppattern();
			regionclick=1;
			document.getElementById('sr').style.visibility="visible";
			ids=$('#s2').attr('id');
			myInt = setInterval(function(){ animatearrow(ids); }, 500);
		}

}
function drawpline()
{
	ctx.beginPath();
	ctx.moveTo(0,-(grid_size*(150/100)));
	dpline();
}
function dqline()
{
	ctx.lineTo(grid_size*(qregion/100),-(grid_size*(250/100)));
	ctx.lineWidth=1;
	ctx.strokeStyle="black";
	ctx.stroke();
	qregion +=5;
	if (qregion<=355 && qboundry == 355) 
		requestAnimationFrame(dqline)
	if(qregion>355 && qboundry == 355)
		{
			ctx.closePath();   
			drawqline();
		}
	if (qregion<1525 && qboundry == 1525) 
		requestAnimationFrame(dqline)
	if(qregion>1525 && qboundry == 1525)
		{
			ctx.closePath();
			drawqpattern();
			persand();
			regionclick=2;
			document.getElementById('ssr').style.visibility="visible";
			ids=$('#s3').attr('id');
			myInt = setInterval(function(){ animatearrow(ids); }, 500);
		}
}

function drawqline()
{
	if(qregion == 0)
	{
		qregion=0;qboundry=355;
		ctx.beginPath();
		ctx.moveTo(0,-(grid_size*(250/100)));
		dqline();
	}
	if(qregion>355)
	{
		ctx.beginPath();
		ctx.moveTo(grid_size*(550/100),-(grid_size*(250/100)));
		qregion=550;qboundry = 1525;
		requestAnimationFrame(dqline)
	}
}
function drline()
{
	ctx.lineTo(grid_size*(rregion/100),-(grid_size*(450/100)));
	ctx.lineWidth=1;
	ctx.strokeStyle="black";
	ctx.stroke();
	rregion +=5;
	if (rregion<=150 && rboundry == 150) 
		requestAnimationFrame(drline)
	if(rregion>150 && rboundry == 150)
		{
			ctx.closePath();   
			drawrline();
		}
	if (rregion<975 && rboundry == 975) 
		requestAnimationFrame(drline)
	if(rregion>975 && rboundry == 975)
		{
			ctx.closePath();   
			drawrline();
		}
	if (rregion<1525 && rboundry == 1525) 
		requestAnimationFrame(drline)
	if(rregion>1525 && rboundry == 1525)
		{
			ctx.closePath();   
			drawrpattern();
			pershale();
			regionclick=3;
			document.getElementById('lr').style.visibility="visible";
			ids=$('#s4').attr('id');
			myInt = setInterval(function(){ animatearrow(ids); }, 500);
		}
}
function drawrline()
{
	if(rregion == 0)
	{
		rregion=0;rboundry=150;
		ctx.beginPath();
		ctx.moveTo(0,-(grid_size*(450/100)));
		drline();
	}
	if(rregion>150 && rboundry == 150)
	{
		ctx.beginPath();
		ctx.moveTo(grid_size*(770/100),-(grid_size*(450/100)));
		rregion=770;rboundry = 975;
		drline();
	}
	if(rregion>975 && rboundry == 975)
	{
		ctx.beginPath();
		ctx.moveTo(grid_size*(1400/100),-(grid_size*(450/100)));
		rregion=1400;rboundry = 1525;
		drline();
	}
}

function persand()
{
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.font = '10px Verdana';
	ctx.fillStyle="blue";
	ctx.strokeStyle="black";
	ctx.moveTo(grid_size*(350/100),-(grid_size*(250/100)-15));
	ctx.lineTo(grid_size*(350/100),-(grid_size*(250/100)+15));
	ctx.fillText("Sh|SSt",grid_size*(350/100)-20,-(grid_size*(250/100)+22));
	ctx.moveTo(grid_size*(550/100),-(grid_size*(250/100)-15));
	ctx.lineTo(grid_size*(550/100),-(grid_size*(250/100)+15));
	ctx.fillText("SSt|Sh",grid_size*(550/100)-20,-(grid_size*(250/100)+22));
	ctx.stroke();
	ctx.closePath();
}
function pershale()
{
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.font = '10px Verdana';
	ctx.fillStyle="blue";
	ctx.moveTo(grid_size*(150/100),-(grid_size*(450/100)-15));
	ctx.lineTo(grid_size*(150/100),-(grid_size*(450/100)+15));
	ctx.fillText("LSt|Sh",grid_size*(150/100),-(grid_size*(450/100)+20));
	ctx.moveTo(grid_size*(770/100),-(grid_size*(450/100)-15));
	ctx.lineTo(grid_size*(770/100),-(grid_size*(450/100)+15));
	ctx.fillText("Sh|LSt",grid_size*(770/100)-20,-(grid_size*(450/100)+22));
	ctx.moveTo(grid_size*(973/100),-(grid_size*(450/100)-15));
	ctx.lineTo(grid_size*(973/100),-(grid_size*(450/100)+15));
	ctx.fillText("LSt|Sh",grid_size*(973/100)-20,-(grid_size*(450/100)+22));
	ctx.moveTo(grid_size*(1404/100),-(grid_size*(450/100)-15));
	ctx.lineTo(grid_size*(1404/100),-(grid_size*(450/100)+15));
	ctx.fillText("Sh|LSt",grid_size*(1404/100)-20,-(grid_size*(450/100)+22));
	ctx.stroke();
	ctx.closePath();
}

function drawppattern()
{
	ctx.strokeStyle="#d68910";
	ctx.lineWidh=2;
	for(i=50;i<1500;i+=100)
	{
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(40/100),4,0,2*Math.PI,false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc((grid_size*(i/100)+20),-grid_size*(80/100),4,0,2*Math.PI,false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(120/100),4,0,2*Math.PI,false);
		ctx.stroke();
	}
	ctx.closePath();
}
function drawqpattern()
{
	ctx.lineWidh=2;
	ctx.strokeStyle="green";
	for(i=40;i<1500;i+=50)
	{
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(165/100),2,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
	}
	//2nd pattern , 2nd line
	for(i=60;i<400;i+=50)
	{
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(195/100),2,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
	}
	//2nd pattern , 3nd line
	for(i=40;i<350;i+=50)
	{
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(230/100),2,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
	}
	//2nd pattern,above tunnel
	for(i=560;i<1520;i+=50)
	{
		ctx.beginPath();
		ctx.arc(grid_size*(i/100),-grid_size*(230/100),2,0,2*Math.PI,false);
		ctx.stroke();
		ctx.closePath();
	}
}
function drawrpattern()
{
	ctx.lineWidh=2;
	ctx.fillStyle=" #0d0564";
	ctx.font = '10px Verdana';
	ctx.strokeStyle=" #0d0564";
	//1 line
	for(i=50;i<1520;i+=50)
	{
		if(i==350)
		{
			i=600;
		}
		ctx.beginPath();
		ctx.fillText("_",grid_size*(i/100),-grid_size*(270/100));
		ctx.stroke();
		ctx.closePath();
	}
	//2nd line
	for(i=30;i<1520;i+=50)
	{
		if(i==280)
		{
			i=650;
		}
		if(i==1150)
		{
			i=1250;
		}
		ctx.beginPath();
		ctx.fillText("_",grid_size*(i/100),-grid_size*(300/100));
		ctx.stroke();
		ctx.closePath();
	}
	//3rd line
	for(i=30;i<1520;i+=50)
	{
		if(i==230)
		{
			i=680;
		}
		if(i==1080)
		{
			i=1280;
		}
		ctx.beginPath();
		ctx.fillText("_",grid_size*(i/100),-grid_size*(340/100));
		ctx.stroke();
		ctx.closePath();
	}
	//4th line
	for(i=35;i<1520;i+=50)
	{
		if(i==235)
		{
			i=710;
		}
		if(i==1060)
		{
			i=1330;
		}
		ctx.beginPath();
		ctx.fillText("_",grid_size*(i/100),-grid_size*(380/100));
		ctx.stroke();
		ctx.closePath();
	}
	//5 line
	for(i=20;i<1520;i+=50)
	{
		if(i==220)
		{
			i=750;
		}
		if(i==1000)
		{
			i=1380;
		}
		ctx.beginPath();
		ctx.fillText("_",grid_size*(i/100),-grid_size*(420/100));
		ctx.stroke();
		ctx.closePath();
	}
}
function drawlimepattern()
{
	//4th pattern
	//1st line
	ctx.lineWidth=2;
	ctx.fillStyle="red";
	for(i=20;i<1520;i+=50)
	{
		if(i==120)
		{
			i=800;
		}
		if(i==950)
		{
			i=1430;
		}
		ctx.beginPath();
		ctx.fillText("+",grid_size*(i/100),-grid_size*(470/100));
		ctx.stroke();
		ctx.closePath();
	}
	//2nd line
	for(i=20;i<1520;i+=50)
	{
		if(i==120)
		{
			i=840;
		}
		if(i==940)
		{
			i=1450;
		}
		ctx.beginPath();
		ctx.fillText("+",grid_size*(i/100),-grid_size*(500/100));
		ctx.stroke();
		ctx.closePath();
	}
	//3rd line
	for(i=20;i<1520;i+=50)
	{
		if(i==70)
		{
			i=1500;
		}
		ctx.beginPath();
		ctx.fillText("+",grid_size*(i/100),-grid_size*(540/100));
		ctx.stroke();
		ctx.closePath();
	}
}


function nextButtonProceed()
{
	document.getElementById('nextButton').style.visibility="visible";
}



 
