import { CanvasView } from "./views/CanvasView.js";
import { CanvasController } from "./controllers/CanvasController.js";

import { Dots } from "./models/Dots.js";
import { Lines } from "./models/Lines.js";

var dots = new Dots();
var lines = new Lines();
var canvasDrawingPathsView = new CanvasView(document.getElementById('myCanvasDrawingPaths'));
var canvasStaticDotsView = new CanvasView(document.getElementById('myCanvasStaticDots'));
var canvasStaticPathsView = new CanvasView(document.getElementById('myCanvasStaticPaths'));
var canvasBackgroundView = new CanvasView(document.getElementById('myCanvasBackground'));

var controller = new CanvasController(
    dots,
    lines,
    canvasDrawingPathsView,
    canvasStaticDotsView,
    canvasStaticPathsView,
    canvasBackgroundView
    );

controller.init();