export class Dot {

    constructor(location, numberOfConections, color) {
        this.location = location;
        this.numberOfConections = numberOfConections;
        this.color = color;
    }

    isContainPointAndHasFreeConnection(x, y, radius) {

        if(Math.sqrt(
            Math.pow(this.location.x - x, 2) + 
            Math.pow(this.location.y - y, 2)) <= radius &&
            this.numberOfConections < 3) {
                return true;
        }

        return false;
    } 

}