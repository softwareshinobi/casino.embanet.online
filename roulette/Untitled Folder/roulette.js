<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">
body {
	background: #B2D1E0;
}


.dash-segment:nth-child(1)
{
	position: relative !important;
	width: 200px !important;
	left: -60px;
	-webkit-transition: left 0.5s ease-out;
	-moz-transition: left 0.5s ease-out;
	-o-transition: left 0.5s ease-out;
}

.dash-segment:nth-child(3),
.dash-segment:nth-child(4)
{
	position: relative !important;
	left: -400px;
	-webkit-transition: left 0.5s ease-out;
	-moz-transition: left 0.5s ease-out;
	-o-transition: left 0.5s ease-out;
}
.dash-segment:nth-child(1):hover,
.dash-segment:nth-child(2):hover,
.dash-segment:nth-child(3):hover,
.dash-segment:nth-child(4):hover
{
	position: relative !important;
	left: 120px;
	-webkit-transition: left 0.5s ease-out;
	-moz-transition: left 0.5s ease-out;
	-o-transition: left 0.5s ease-out;
}

.segment-content {
	width:600px;
	font-size: 0.9em;
	color: white !important;
	padding: 3px 10px !important;
	margin: 2px;
	background-color: rgba(150,150,150,0.8);
	-moz-box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);
	-webkit-box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);
	box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
}

.segment-content h2 {
	position: relative !important;
	left: 500px;
	color: #DDD !important;
	background: none !important;
	font-size: 1.3em !important;
	font-weight: bold;
	text-shadow: 0px 0px 5px black;
}
#dash-help {
	height: 55px;
	-webkit-transition: height 0.5s ease-out 0.5s;
	-moz-transition: height 0.5s ease-out 0.5s;
	-o-transition: height 0.5s ease-out 0.5s;
	overflow: hidden !important;
}
#dash-help:hover {
	height: 600px !important;
	-webkit-transition: height 0.5s ease-out 0.5s;
	-moz-transition: height 0.5s ease-out 0.5s;
	-o-transition: height 0.5s ease-out 0.5s;
}

#game{
	border-collapse:collapse;
	width:400px;
	height:500px;
	position:absolute;
	top:25px;
	left:800px;
	text-align:center;
	border-color:#999;
	}

tr, td {
	text-align:center;
	font-family:Arial;
	text-shadow: 0px 0px 10px rgba(255,255,255,0.8);
}
</style>
</head>

<body>
<input type="button" value="spin" onclick="spin();" style="float: left;">
<canvas id="wheelcanvas" width="500" height="500"></canvas>
<script type="application/javascript">
  var colors = ["green", "black", "red", "black", "red",
               "black", "red", "black", "red", "black", "red", "black", "red",
               "black", "red", "black", "red", "black", "red", "green", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black"];
  var number = ["0", "28", "9", "26",
                     "30", "11", "7", "20",
                     "32", "17", "5", "22", "34", "15", "3", "24", "36", "13", "1", "00", "27", "10", "25", "29", "12", "8", "19", "31", "18", "6", "21", "33", "16", "4", "23", "35", "14", "2"];
  
  var startAngle = 0;
  var arc = Math.PI / 19;
  var spinTimeout = null;
  var answer;
  var total = 1000;
  
  var spinArcStart = 10;
  var spinTime = 0;
  var spinTimeTotal = 0;
  
  var ctx;
  
  function draw() {
    drawRouletteWheel();
  }
  
  function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
      var outsideRadius = 220;
      var textRadius = 180;
      var insideRadius = 150;
      
      ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,500,500);
      
      
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;
      
      ctx.font = 'bold 20px Arial';
      
      for(var i = 0; i < 38; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();
        
        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur    = 0;
        ctx.fillStyle = "#FFF";
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = number[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      } 
      
      //Arrow
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.fill();
    }
  }
  
  function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
  }
  
  function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
  }
  
  function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 60px Arial';
    var text = number[index];
	answer = text;
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
	checkwin();
    ctx.restore();
  }
  
  function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
  
  draw();
  
	function putmoney(obj)
	{
		if (obj.className != "in")
		{
			obj.bgColor = "gray" ;
			obj.className = "in" ;
			click += 1 ;
		}
		else
		{
			obj.bgColor = "#B2E0F0" ;
			obj.className = "" ;
			click -= 1 ;
		}
	}

	function checkwin()
	{
		if ( answer != 0 && answer != 00 )
		{
			for (var i = 1 ; i <= 36 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if (document.getElementById(i).innerHTML == answer)
					{
						total -= 10;
						total += 360;
					}
					else
						total -= 10;
				}
			}
			
			for (var i = 37 ; i <= 39 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if (i - 36 == answer%3 || answer%3 == 0)
					{
						total -= 10;
						total += 30;
					}
					else
						total -= 10;
				}
			}
			
			for (var i = 40 ; i <= 42 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if (answer <= i%39*12 && answer >= i%39*12-11)
					{
						total -= 10;
						total += 30;
					}
					else
						total -= 10;
				}
			}
			
			for (var i = 43 ; i <= 44 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if (answer <= i%42*18 && answer >= i%42*18-17)
					{
						total -= 10;
						total += 20;
					}
					else
						total -= 10;
				}
			}
			
			for (var i = 45 ; i <= 46 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if (answer%2 == i%2)
					{
						total -= 10;
						total += 20;
					}
					else
						total -= 10;
				}
			}
			
			for (var i = 47 ; i <= 47 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if(answer == 1 || answer == 3 || answer == 5 || answer == 7 || answer == 9 || answer == 12 || answer == 14 || answer == 16 || answer == 18 || answer == 19 || answer == 21 || answer == 23 || answer == 25 || answer == 27 || answer == 30 || answer == 32 || answer == 34 || answer == 36)
					{
						total -= 10;
						total += 20;
					}
					else
						total -= 10;
				}				
			}
		
			for (var i = 48 ; i <= 48 ; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					if(answer == 2 || answer == 4 || answer == 6 || answer == 8 || answer == 10 || answer == 11 || answer == 13 || answer == 15 || answer == 17 || answer == 20 || answer == 22 || answer == 24 || answer == 26 || answer == 28 || answer == 29 || answer == 31 || answer == 33 || answer == 35)
					{
						total -= 10;
						total += 20;
					}
					else
						total -= 10;
				}
			}
		}else
		{
			for ( var i = 0; i <= 48; i++)
			{
				if (document.getElementById(i).className == "in")
				{
					total -= 10;
				}
			}
		}
		document.getElementById("money").innerHTML = "You Have " + total + "$";
	}

  </script>
  <div class="dash-segment dash-segment-help">



```html
<div class="segment-content">
  <div id="dash-help">
    <h2>Help</h2>
    <h3>Betting Methods</h3>
    <h4>Color:</h4>
    <p>You can bet on whether the winning number is red or black.  Payout is 1:1.</p>
    <h4>Odd/Even:</h4>
    <p>You can bet on whether the winning number is odd or even. Payout is 1:1.</p>
    <h4>1-18, 19-36:</h4>
    <p>You can bet on whether the winning number is in the lower half (1-18) or upper half (19-36). Payout is 1:1.</p>
    <h4>Dozen Bet:</h4>
    <p>You can bet on whether the winning number falls within the first, second, or third dozen of numbers. Payout is 1:2.
       1st 12 (1-12), 2nd 12 (13-24), 3rd 12 (25-36)</p>
    <h4>Column Bet:</h4>
    <p>You can bet on whether the winning number is in the first, second, or third column. Payout is 1:2.<br>
       2 to 1 (1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34)<br>
       2 to 1 (2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35)<br>
       2 to 1 (3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36)</p>
    <h4>Straight Bet:</h4>
    <p>Bet on a single number. Payout is 1:35. This is a single number bet, and because the probability of winning is the lowest, the payout is the highest.</p>
  </div>
</div>
```

 </div>
  <div id="game">
	<table bgcolor="white" width="400" height="500">
	<tr>
	<td id=1 onclick="putmoney(this)">1</td><td id=2 onclick="putmoney(this)">2</td><td id=3 onclick="putmoney(this)">3</td><td id=40 onclick="putmoney(this)" rowspan = "4">1st 12</td><td id=43 onclick="putmoney(this)" rowspan = "2">1 to 18</td>
	</tr>
	<tr>
	<td id=4 onclick="putmoney(this)">4</td><td id=5 onclick="putmoney(this)">5</td><td id=6 onclick="putmoney(this)">6</td>
	</tr>
	<tr>
	<td id=7 onclick="putmoney(this)">7</td><td id=8 onclick="putmoney(this)">8</td><td id=9 onclick="putmoney(this)">9</td><td id=46 onclick="putmoney(this)" rowspan = "2">EVEN</td>
	</tr>
	<tr>
	<td id=10 onclick="putmoney(this)">10</td><td id=11 onclick="putmoney(this)">11</td><td id=12 onclick="putmoney(this)">12</td>
	</tr>
	<tr>
	<td id=13 onclick="putmoney(this)">13</td><td id=14 onclick="putmoney(this)">14</td><td id=15 onclick="putmoney(this)">15</td><td id=41 onclick="putmoney(this)" rowspan = "4">2nd 12</td><td id=47 onclick="putmoney(this)" rowspan = "2">RED</td>
	</tr>
	<tr>
	<td id=16 onclick="putmoney(this)">16</td><td id=17 onclick="putmoney(this)">17</td><td id=18 onclick="putmoney(this)">18</td>
	</tr>
	<tr>
	<td id=19 onclick="putmoney(this)">19</td><td id=20 onclick="putmoney(this)">20</td><td id=21 onclick="putmoney(this)">21</td><td id=48 onclick="putmoney(this)" rowspan = "2">BLACK</td>
	</tr>
	<tr>
	<td id=22 onclick="putmoney(this)">22</td><td id=23 onclick="putmoney(this)">23</td><td id=24 onclick="putmoney(this)">24</td>
	</tr>
	<tr>
	<td id=25 onclick="putmoney(this)">25</td><td id=26 onclick="putmoney(this)">26</td><td id=27 onclick="putmoney(this)">27</td><td id=42 onclick="putmoney(this)" rowspan = "4">3rd 12</td><td id=45 onclick="putmoney(this)" rowspan = "2">ODD</td>
	</tr>
	<tr>
	<td id=28 onclick="putmoney(this)">28</td><td id=29 onclick="putmoney(this)">29</td><td id=30 onclick="putmoney(this)">30</td>
	</tr>
	<tr>
	<td id=31 onclick="putmoney(this)">31</td><td id=32 onclick="putmoney(this)">32</td><td id=33 onclick="putmoney(this)">33</td><td id=44 onclick="putmoney(this)" rowspan = "2">19 to 36</td>
	</tr>
	<tr>
	<td id=34 onclick="putmoney(this)">34</td><td id=35 onclick="putmoney(this)">35</td><td id=36 onclick="putmoney(this)">36</td>
	</tr>
	<tr>
	<td id=37 onclick="putmoney(this)">2 to 1</td><td id=38 onclick="putmoney(this)">2 to 1</td><td id=39 onclick="putmoney(this)">2 to 1</td><td id="money" colspan = "2">You Have 1000$</td>
	</tr>
	<table>
  </div>


  </body>
  </html>
