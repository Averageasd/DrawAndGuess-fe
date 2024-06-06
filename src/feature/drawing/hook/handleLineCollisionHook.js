export function useHandleLineCollisionHook(){
    function handleLineCollision(eraser, line) {
        const eraserTop = {
            x1: eraser.x,
            y1: eraser.y,
            x2: eraser.x + eraser.width,
            y2: eraser.y
        };
        const eraserLeft = {
            x1: eraser.x,
            y1: eraser.y,
            x2: eraser.x,
            y2: eraser.y + eraser.height
        };
        const eraserBottom = {
            x1: eraser.x,
            y1: eraser.y + eraser.height,
            x2: eraser.x + eraser.width,
            y2: eraser.y + eraser.height
        };
        const eraserRight = {
            x1: eraser.x + eraser.width,
            y1: eraser.y,
            x2: eraser.x + eraser.width,
            y2: eraser.y + eraser.height
        };

        const linePoints = {
            x3: line.points[0],
            y3: line.points[1],
            x4: line.points[line.points.length - 2],
            y4: line.points[line.points.length - 1],
        }

        return lineCollisionHelper(eraserTop, linePoints)
            || lineCollisionHelper(eraserBottom, linePoints)
            || lineCollisionHelper(eraserLeft, linePoints)
            || lineCollisionHelper(eraserRight, linePoints);
    }

    function lineCollisionHelper(eraserLine, line) {

        const {x1, y1, x2, y2} = eraserLine;
        const {x3, y3, x4, y4} = line;
        const unknownA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const unknownB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return unknownA >= 0 && unknownA <= 1 && unknownB >= 0 && unknownB <= 1;
    }

    return {
        handleLineCollision,
    }
}