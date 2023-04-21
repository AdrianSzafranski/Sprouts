export class CanvasView {

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        const parent = this.canvas.parentNode;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;

		this.context.lineWidth = 5;
    }

    drawDot(point, color, radius) {
		
		this.context.beginPath();
		this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
		this.context.fillStyle = "black";
		this.context.fill();
		this.context.closePath();

		this.context.beginPath();
		this.context.arc(point.x, point.y, radius-2, 0, Math.PI * 2);
		this.context.fillStyle = color;
		this.context.fill();
		this.context.closePath();

	}

	drawPath(startPoint, endPoint, color) {

		this.context.beginPath();
		this.context.moveTo(startPoint.x, startPoint.y);
		this.context.lineTo(endPoint.x, endPoint.y);
		this.context.strokeStyle = color;
		this.context.stroke();
	}

	getPixelColor(x, y) {

		var pixelData = this.context.getImageData(x, y, 1, 1).data;
		var rgb = [pixelData[0], pixelData[1], pixelData[2]];
		
		return rgb;
		
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawBackground(red, green, blue, opacity) {
		this.context.fillStyle = "rgba("+red+", "+green+", "+blue+", "+opacity+")";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

}