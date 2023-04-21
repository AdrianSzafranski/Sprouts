import { Dot } from "../models/Dot.js";
import { Location } from "../models/Location.js";
import { Line } from "../models/Line.js";
import { CanvasBuffer } from "../models/CanvasBuffer.js";

export class CanvasController {

  constructor(dots, lines, canvasDrawingPathsView, canvasStaticDotsView, canvasStaticPathsView, canvasBackgroundView) {

    //list of dots displayed
    this.dots = dots.dots;
    //list of lines displayed
    this.lines = lines.lines;

    //used view 'CanvasView.js' objects
    this.canvDrawPathsView = canvasDrawingPathsView;
    this.canvStatDotsView = canvasStaticDotsView;
    this.canvStatPathsView = canvasStaticPathsView;
    this.canvBackgroundView = canvasBackgroundView;

    //display canvas of the 'CanvasView.js' view
    this.canvDrawPaths = this.canvDrawPathsView.canvas;
    this.canvStatDots = this.canvStatDotsView.canvas;
    this.canvStatPaths = this.canvStatPathsView.canvas;
    this.canvBackground = this.canvBackgroundView.canvas;

    //configuration settings
    this.dotRadius = 30;
    this.currentPlayer = 0;
    this.colors = [
      "#FFFF" + Math.round(Math.random() * (255)).toString(16).padStart(2, '0'),
      "#" + Math.round(Math.random() * (255)).toString(16).padStart(2, '0') + "FFFF",
    ]

    //sizes of each canvas
    this.width = this.canvStatDots.width;
    this.height = this.canvStatDots.height;

    //buffers storing coordinates of canvas objects
    //provide faster access than canvas colors
    this.bufferDrawnPaths = new CanvasBuffer(this.width, this.height);
    this.bufferCurrentPath = new CanvasBuffer(this.width, this.height);
    this.bufferDrawnDots = new CanvasBuffer(this.width, this.height);

    this.cameOutOfTheDot = false;
    this.currentline;
    this.newlines = new Line([], "blue");;
    this.connectingDots = [];
    this.isDrawing = false;

    this.isDrawingDot = false;
    this.postawioneKolo = false;
  }

  init() {

    //listening to mouse events, canvStatDots is the topmost canvas
    this.canvStatDots.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvStatDots.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvStatDots.addEventListener('mousemove', this.onMouseMove.bind(this));

    //clearing the canvas
    this.canvDrawPathsView.clear();
    this.canvStatDotsView.clear();
    this.canvStatPathsView.clear();
    this.canvBackgroundView.clear();

    //background drawing
    this.canvBackgroundView.drawBackground(195, 195, 195, 1);

    // set first two points
    this.dots.push(
      new Dot(
        new Location(
          Math.round(this.width / 2 - this.width * 0.15),
          Math.round(this.height / 2)),
        0,
        "green"));
    this.dots.push(
      new Dot(
        new Location(
          Math.round(this.width / 2 + this.width * 0.15),
          Math.round(this.height / 2)),
        0,
        "green"));

    // save to buffer and draw first two points
    this.dots.forEach(dot => {
      this.bufferDrawnDots.addCircleObject(dot.location.x, dot.location.y, this.dotRadius);
      this.canvStatDotsView.drawDot(dot.location, dot.color, this.dotRadius);
    });

  }

  onMouseDown(event) {

    // get current cursor coordinates
    var x = event.pageX - this.canvStatDots.offsetLeft;
    var y = event.pageY - this.canvStatDots.offsetTop;
    
    // clearing the settings, allowing a new line to be drawn
    this.cameOutOfTheDot = false;
    this.currentline = [];
    this.connectingDots = [];

    // after drawing the line, the user selects the location of the new dot by clicking the mouse
    // checking if this is the moment
    if (this.isDrawingDot) {

      var isLineClick = false;
      var coordinatesCenterLine;

      // checking if a line has been clicked, Search for the center of the line
      for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
          if (this.bufferCurrentPath.buffer[x + i][y + j] == 1) {
            coordinatesCenterLine = new Location(x + i, y + j);
            isLineClick = true;
            break;
          }
        }
      }

      // if the current line is clicked
      if (isLineClick) {

        // create new dot
        const dot = new Dot(
          new Location(coordinatesCenterLine.x, coordinatesCenterLine.y),
          2,
          this.colors[this.currentPlayer]);

        this.dots.push(dot);

        // draw new dot
        this.bufferDrawnDots.addCircleObject(dot.location.x, dot.location.y, this.dotRadius);
        this.canvStatDotsView.drawDot(
          dot.location,
          dot.color,
          this.dotRadius);

        // clear canvas with current line
        this.canvDrawPathsView.clear();

        // clearing the buffer with current line
        this.bufferCurrentPath = new CanvasBuffer(this.width, this.height);

        // change of turn to the next player
        if(this.currentPlayer == 0) {
          this.currentPlayer = 1;
        } else {
          this.currentPlayer = 0;
        }
       
        this.isDrawingDot = false;
      }
    // if the dot is clicked 
    } else if (this.bufferDrawnDots.buffer[x][y] == 1) {
      
      // finding which dot was clicked on and checking if it has free connections
      for (var i = 0; i < this.dots.length; i++) {
       
        if (this.dots[i].isContainPointAndHasFreeConnection(x, y, this.dotRadius)) {

          //saving the index of the dot that was clicked on
          this.connectingDots[0] = i;

          this.isDrawing = true;
          break;

        }
      }

    }
  }

  onMouseUp(event) {

    // having at least two line points
    if (this.currentline.length > 1) {

      // get current cursor coordinates
      var x = event.pageX - this.canvStatDots.offsetLeft;
      var y = event.pageY - this.canvStatDots.offsetTop;
     
      // if the dot is clicked
      if (this.bufferDrawnDots.buffer[x][y] == 1) {

        // number of points of the line drawn
        var lineLen = this.currentline.length;
      
        // finding which dot was clicked on and checking if it has free connections
        for (var i = 0; i < this.dots.length; i++) {
          if (this.dots[i].isContainPointAndHasFreeConnection(this.currentline[lineLen-1].x, this.currentline[lineLen-1].y, this.dotRadius)) {
            
            //saving the index of the dot that was clicked on
            this.connectingDots[1] = i;
            
            break;
          } 
        }

        // there are two saved dots (there is a start dot and an end dot) and
        // (either the clicked dots(start and end dots) are different from each other or 
        // (if they are the same) the dot has only one used connection)
        if (this.connectingDots.length == 2 && 
          (this.connectingDots[0] != this.connectingDots[1] ||
          this.dots[this.connectingDots[0]].numberOfConections < 2)) {

          // update the number of dot connections
          this.dots[this.connectingDots[0]].numberOfConections += 1;
          this.dots[this.connectingDots[1]].numberOfConections += 1;

          // add the current line to the line list
          this.lines.push(this.currentline);

          // drawing the current line in the canvas with drawn lines and 
          // saving it to the drawn lines buffer
          for (var i = 0; i < this.currentline.length - 1; i++) {
            this.bufferDrawnPaths.addLineObject(
              this.currentline[i],
              this.currentline[i + 1]
            );

            this.canvStatPathsView.drawLine(
              this.currentline,
              this.colors[this.currentPlayer]);
          }

          // setting an option informing that the next step is the process of determining a new dot
          this.isDrawingDot = true;

        } else {
          // clear canvas with current line
          this.canvDrawPathsView.clear();
        }

      } else {
        // clear canvas with current line
        this.canvDrawPathsView.clear();
      }

    
    }
    this.isDrawing = false;
  }

  onMouseMove(event) { 

    // if the left mouse button is pressed and a line has been drawn
    if (event.buttons === 1 && this.isDrawing) {

      // get current cursor coordinates
      var x = event.pageX - this.canvStatDots.offsetLeft;
      var y = event.pageY - this.canvStatDots.offsetTop;

      // if you don't have left the area of the starting dot
      if (!this.cameOutOfTheDot) {

        //if you have left the area of the starting dot
        if(this.bufferDrawnDots.buffer[x][y] == 0) {
          this.cameOutOfTheDot = true;
        } else {
          // the first point of the line, before leaving the area of the starting dot
          this.currentline[0] = new Location(x, y);
        }
   
      } // if you have left the area of the starting dot, moving the mouse between dots, over the background
      else {

        // if the final dot is reached
        if(this.bufferDrawnDots.buffer[x][y] == 1) {
          // stop drawing lines
          this.isDrawing = false;

          // saving the last point of the line
          this.currentline.push(new Location(x, y));

          // number of points of the line drawn
          var lineLen = this.currentline.length;

          // determination of new coordinates of the last point - 
          // shortening the last path of the line consisting of the last two points,
          // so that the line does not overlap the end dot
          var xy = this.bufferDrawnDots.shortenLineCoveringDot(
            this.currentline[lineLen - 1],
            this.currentline[lineLen - 2]);

          // save the new coordinates of the last point
          this.currentline[lineLen - 1].x = xy[0];
          this.currentline[lineLen - 1].y = xy[1];

        }
        // having at least two line points and
        // checking if the latest drawn line segment collide with another line
        else if(this.currentline.length > 1 &&
          this.bufferDrawnPaths.searchObjectBetweenPoints(this.currentline[this.currentline.length - 1],
            new Location(x, y))) {

            // stop drawing lines
            this.isDrawing = false;
            // clear canvas with current line
            this.canvDrawPathsView.clear();
            // clearing the buffor with current line
            this.bufferCurrentPath = new CanvasBuffer(this.width, this.height);
            // clearing the list with the points of the current line
            this.currentline = []
        }
        // if a new segment is drawn on the background, without collision
        else {
          // add new coordinates to the current line
          this.currentline.push(new Location(x, y));

            // having at least two line points
            if (this.currentline.length > 1) {
  
              // having two line points
              if (this.currentline.length == 2) {
                // determination of new coordinates of the start point - 
                // shortening the first path of the line consisting of the first two points,
                // so that the line does not overlap the start dot
                var xy = this.bufferDrawnDots.shortenLineCoveringDot(
                  this.currentline[0],
                  this.currentline[1]);
  
                this.currentline[0].x = xy[0];
                this.currentline[0].y = xy[1];
  
                // draw first part of the current line
                this.canvDrawPathsView.drawStartPath(
                  this.currentline[this.currentline.length - 1],
                  this.currentline[this.currentline.length - 2],
                  "#434354",
                );
              } else {
                // draw another part of the current line
                this.canvDrawPathsView.drawAnotherPath(
                  this.currentline[this.currentline.length - 1],
                  "#434354",
                );
              }
  
              // save a new part of the current line to the buffer
              this.bufferCurrentPath.addLineObject(
                this.currentline[this.currentline.length - 1],
                this.currentline[this.currentline.length - 2]);
            }
        }
      }
    }
  }
}