export class CanvasBuffer {

    constructor(width, height) {
        this.buffer = new Array(width).fill(0).map(() => new Array(height).fill(0));
    }

    searchObjectBetweenPoints(startPoint, endPoint) {

        let dx = Math.abs(endPoint.x - startPoint.x);
        let dy = Math.abs(endPoint.y - startPoint.y);
        let sx = (startPoint.x < endPoint.x) ? 1 : -1;
        let sy = (startPoint.y < endPoint.y) ? 1 : -1;
        let err = dx - dy;
        let x = startPoint.x;
        let y = startPoint.y;
      
        while(true) {
          if(this.buffer[x][y] == 1) {
              return true;
            }
          
          if(x === endPoint.x && y === endPoint.y) break;
          let e2 = 2 * err;
          if(e2 > -dy) { err -= dy; x += sx; }
          if(e2 < dx) { err += dx; y += sy; }
        }
      
        return false;
      }

      addLineObject(startPoint, endPoint) {

        let dx = Math.abs(endPoint.x - startPoint.x);
        let dy = Math.abs(endPoint.y - startPoint.y);
        let sx = (startPoint.x < endPoint.x) ? 1 : -1;
        let sy = (startPoint.y < endPoint.y) ? 1 : -1;
        let err = dx - dy;
        let x = startPoint.x;
        let y = startPoint.y;
      
        while(true) {
          this.buffer[x][y] = 1;
      
          if(x === endPoint.x && y === endPoint.y) break;
    
          let e2 = 2 * err;
          if(e2 > -dy) { err -= dy; x += sx; }
          if(e2 < dx) { err += dx; y += sy; }
    
        }
      }

      addCircleObject(x, y, radius) {
        
        var startX = x - radius;
        var startY = y - radius;
       
        var endX = x + radius;
        var endY = y + radius;
      
        for (var i = startX; i < endX; i++) {
        
          for (var j = startY; j < endY; j++) {
            
            const distance = Math.sqrt((i - x) ** 2 + (j - y) ** 2); // calculate the distance between point (i, j) and point (centerX, centerY)
            if (distance <= radius) { // if the point (i, j) is in a circle with a radius around the point (centerX, centerY), set the value to 1
              this.buffer[i][j] = 1;
             
            }
          }
        }
      }

      shortenLineCoveringDot(startPoint, endPoint) {

        var xy = [startPoint.x, startPoint.y]
        
        let dx = Math.abs(endPoint.x - startPoint.x);
        let dy = Math.abs(endPoint.y - startPoint.y);
        let sx = (startPoint.x < endPoint.x) ? 1 : -1;
        let sy = (startPoint.y < endPoint.y) ? 1 : -1;
        let err = dx - dy;
        let x = startPoint.x;
        let y = startPoint.y;

        while(true) {
          if(this.buffer[x][y] == 1) {
            return [x,y];
          }
      
          if(x === endPoint.x && y === endPoint.y) break;
          let e2 = 2 * err;
          if(e2 > -dy) { err -= dy; x += sx; }
          if(e2 < dx) { err += dx; y += sy; }
        }
      
        return xy;
      }
}