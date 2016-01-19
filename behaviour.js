// Sandwich Class Camp 2015 - Deuxieme session
//
// Par Kimberley POBA VANZI - Nafissa IRO OUSMANE - Jihane CHAWKI
// Master I - Développeur d'application (ETNA)

// Ajout des variables pour le canvas
var canvas;
var context;
var canvasWidth = 450;
var canvasHeight = 450;

// Ajout de la classe sauvegarde le repère (Carré)
var repere = {
  p1:[],
  p2:[],
  p3:[],
  p4:[],
  surface:function () {
    return Math.abs((((this.p1.x - this.p3.x) * (this.p2.y - this.p4.y)) - ((this.p2.x - this.p4.x) * (this.p1.y - this.p3.y))) / 2);
  }
}

// Ajout des variables nécessaire à la sauegarde des contours de la plaie
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var curColor = colorGreen;
var clickColor = new Array();

/* Ajout des variables pour les couleurs */
var fillBase = "rgba(241, 148, 111, 0.55)";
var fillPX = "rgba(200, 200, 100, 125)";
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorErase = "rgba(255, 255, 255, 0.10)";
var curColor = colorPurple;
var clickColor = new Array();

/* Ajout variables couleur */
var curSize = "normal";
var clickSize = new Array();
var editContour = false;
var editFill = false;

/* Ajout variables tool (crayon ou gomme) */
var clickTool = new Array();
var curTool = "crayon";

/* Image de fond */
var outlineImage = new Image();

// Autres variable
var curLoadResNum = 0;
var crayonTextureImage = new Image();
var totalLoadResources = 8;

var editRep = true;

var img = document.getElementById("lard");

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickSize.push(curSize);
  if(curTool == "eraser"){
    clickColor.push(curColor);
  }else{
    clickColor.push(curColor);
  }
}

function clearRepere () {
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickSize = new Array();
  clickColor = new Array();
  it = 1;
  curColor = colorPurple;
  curSize = "normal";
  clearCanvas();
}

function saveRepere () {
  editContour = true;
  document.getElementById("etape1").style.display = "none";
  document.getElementById("etape2").style.display = "inline";
  document.getElementById("menu_edit_repere").style.display = "none";
  document.getElementById("menu_edit_contour").style.display = "inline";
  clearC();
  it = 5;
  curColor = colorGreen;
  curSize = "small";
  drawRep();
}

function saveContour ()
{
  var pos;
  var deb = false;
  var fin = false;
  var min = -1;
  var max = -1;
  var nbPix = 0;
  var nbCm2 = 0
  var div = document.getElementById("coord");
  var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    for (var i=0; i< (context.canvas.width * 4); i +=4)
        {
          for (var j=0; j< (context.canvas.height * 4); j +=4) 
          {

            pos = (context.canvas.width * i) + j;
            if (is_green(imgData.data, pos))
            {
              if (!deb)
                deb = true;
              else
              {
                if (min != -1 && !fin)
                {
                  max = pos;
                  for (var x = min; x < max; x += 4)
                  {
                    nbPix++;
                    imgData.data[x + 0]= 100;
                    imgData.data[x + 1]= 100;
                    imgData.data[x + 2]= 100;
                    imgData.data[x + 3]= 125;
                  }
                  fin = true;
                  min = -1;
                }
              }
            }
            else
            {
              if (deb)
              {
                if (fin)
                {
                  deb = false;
                  fin = false;
                }
                else
                {
                  if (min == -1)
                    min = pos;
                }
              }
            }
          }
          deb = false;
          fin = false;
          min = -1;
        }

    context.putImageData(imgData, 0, 0);

    //On affiche le résultat
    var paraPx = document.createElement("p");
    paraPx.appendChild(document.createTextNode("Taille en pixel = " + nbPix));
    div.appendChild(paraPx);
    nbCm2 = (nbPix * 4) / repere.surface();
    var paraCm = document.createElement("p");
    paraCm.appendChild(document.createTextNode("Taille en cm2 = " + nbCm2));
    div.appendChild(paraCm);
}

function clearC()
{
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickSize = new Array();
  clickColor = new Array();
  clearCanvas();
  drawRep();
}

function clearContour()
{
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickSize = new Array();
  clickColor = new Array();
  it = 1;
  curColor = colorPurple;
  curSize = "normal";
  clearCanvas();
}

function clearCanvas()
{
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

var it = 1;
var blocked = 1;

$( document ).ready(function() {
  document.getElementById("etape1").style.display = "none";
  document.getElementById("etape2").style.display = "none";
});

$('#repere').mousedown(function ()
{
  document.getElementById("etape1").style.display = "inline";
  var canvasDiv = document.getElementById('canvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if (img.width > img.height)
    {
      document.getElementById("canvas").style.backgroundSize = "100% auto";
    }
    else
    {
      document.getElementById("canvas").style.backgroundSize = "auto 100%";
    }
    if(typeof G_vmlCanvasManager != 'undefined') {
      canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");

    // Load images
    // -----------
    //outlineImage.src = "images/bl.jpg";
    outlineImage.onload = function() { 
        resourceLoaded();
      };
    

    // Add mouse events
    // ----------------
    $('#canvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    

    if (it == 1) 
      {
        it++;
        repere.p1.x = mouseX;
        repere.p1.y = mouseY;
        redraw();
      }
    else if (it == 2) 
      {
        it++;
        repere.p2.x = mouseX;
        repere.p2.y = mouseY;
        redraw();
      }
    else if (it == 3) 
      {
        it++;
        repere.p3.x = mouseX;
        repere.p3.y = mouseY;
        redraw();
      }
    else if (it == 4)
      {
        it++;
        repere.p4.x = mouseX;
        repere.p4.y = mouseY;
        var div = document.getElementById("coord");
        node = document.createTextNode("val = " + repere.surface());
        para = document.createElement("p");
        para.appendChild(node);
        div.appendChild(para);
        curColor = colorGreen;
        curSize = "small";
        redraw();
        drawRep();
      }
    else
    {
      redraw();
      drawRep();
    }
    
    });

    $('#canvas').mousemove(function(e){
      if(paint && blocked == 0 && (editContour == true || editFill == true)){
        if(it > 4 && editContour == true)
          curSize = "small";
        if(it > 4 && editFill == true)
          curSize = "large";
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
        drawRep();
      }
    });

    $('#canvas').mouseup(function(e){
      if (blocked == 1 && it > 4)
        blocked = 0;
      paint = false;
    });

    $('#canvas').mouseleave(function(e){
        paint = false;
    });
    outlineImage.src = "images/bl.jpg";

    //On fait disparaitre le bouton de chargement Pour l'instant vu qu'on ne traite qu'une image à la fois
    document.getElementById("repere").style.display = "none";
    document.getElementById("menu_edit_repere").style.display = "inline";
});

function drawRep() 
{
  context.beginPath();              
  context.lineWidth = "1";
  context.strokeStyle = "rgba(241, 148, 111, 0.55)";
  context.moveTo(repere.p1.x, repere.p1.y);
  context.lineTo(repere.p2.x, repere.p2.y);
  context.lineTo(repere.p3.x, repere.p3.y);
  context.lineTo(repere.p4.x, repere.p4.y);
  context.fillStyle = "rgba(241, 148, 111, 0.55)";
  context.fill();
  context.stroke();
}      

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  clearCanvas();
  context.lineJoin = "round";
  var radius;
  for(var i=0; i < clickX.length; i++) {
    if(clickSize[i] == "small"){
      radius = 2;
    }else if(clickSize[i] == "normal"){
      radius = 5;
    }else if(clickSize[i] == "large"){
      radius = 10;
    }else if(clickSize[i] == "huge"){
      radius = 20;
    }else{
      alert("Error: Radius is zero for click " + i);
      radius = 0; 
    }  

    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.strokeStyle = clickColor[i];

     context.lineWidth = radius;
     context.stroke();
  }
  if(curTool == "crayon") {
    context.globalAlpha = 0.4;
    context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
  }
  context.globalAlpha = 1;
}

function is_green (tab, pos) 
{
  return (((tab[pos + 0] == 101) && 
                  (tab[pos + 1] == 155) && 
                 (tab[pos + 2] == 65) && 
                 (tab[pos + 3]== 255)));
}

function is_selected (tab, pos) 
{
  return (((tab[pos + 0] == 200) && 
                  (tab[pos + 1] == 200) && 
                 (tab[pos + 2] == 100) && 
                 (tab[pos + 3]== 125)));
}

function preview ()
{
  var pos;
  var deb = false;
  var fin = false;
  var min = -1;
  var max = -1;
  var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    for (var i=0; i< (context.canvas.width * 4); i +=4)
        {
          for (var j=0; j< (context.canvas.height * 4); j +=4) 
          {

            pos = (context.canvas.width * i) + j;
            if (is_green(imgData.data, pos))
            {
              if (!deb)
                deb = true;
              else
              {
                if (min != -1 && !fin)
                {
                  max = pos;
                  for (var x = min; x < max; x += 4)
                  {
                    imgData.data[x + 0]= 200;
                    imgData.data[x + 1]= 200;
                    imgData.data[x + 2]= 100;
                    imgData.data[x + 3]= 125;
                  }
                  fin = true;
                  min = -1;
                }
              }
            }
            else
            {
              if (deb)
              {
                if (fin)
                {
                  deb = false;
                  fin = false;
                }
                else
                {
                  if (min == -1)
                    min = pos;
                }
              }
            }
          }
          deb = false;
          fin = false;
          min = -1;
        }

    context.putImageData(imgData, 0, 0);
}

function resourceLoaded()
{
  if(++curLoadResNum >= totalLoadResources){
    redraw();
  }
}

function modifContour()
{
  editContour = true;
  editFill = false;
  curTool = "crayon";
  curSize = "small";
  curColor = colorGreen;
}