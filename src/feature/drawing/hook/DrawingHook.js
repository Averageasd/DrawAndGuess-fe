import {useContext} from "react";
import {AppContext} from "../../../context/AppProvider.jsx";
import {v4 as uuidv4} from "uuid";
import {useCreateShapeHook} from "./createShapeFactoryHook.js";

export function useDrawingHook() {
    const {
        selectedColor,
        setSelectedColor,
        lines,
        setLines,
        shapes,
        setShapes,
        eraser,
        setEraser,
        drawShapeMode,
        setDrawShapeMode,
        isDrawing
    } = useContext(AppContext);

    const {
        createShape
    } = useCreateShapeHook();

    function handleColorChange(color, event) {
        setSelectedColor(color.hex);
    }

    function chooseModeEraser() {
        if (eraser) {
            setEraser(null);
            return;
        }
        setEraser({...createShape({x: 0, y: 0}, {width: 20, height: 20}, 'white', 'rectangle')});
        if (isDrawing.current) {
            isDrawing.current = false;
        }
    }

    function handleMouseDown(e) {
        if (eraser) {
            return;
        }
        const id = uuidv4();
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, {id: id, color: selectedColor, shapeType: 'line', points: [pos.x, pos.y]}]);
    }

    function handleMouseMove(e) {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        if (eraser) {
            handleEraserMovement(point);
            return;
        }
        handleLineDrawing(point);

    }

    function handleEraserMovement(point) {
        console.log('using eraser');
        const curEraser = {...eraser, x: point.x, y: point.y};
        const curShapes = [...shapes];
        const curLines = [...lines];
        for (const shape of shapes) {
            if (handleEraserCollision(eraser, shape, shape.shapeType)) {
                if (curShapes.length > 0) {
                    const indexOfCollidedObject = curShapes.indexOf(shape);
                    curShapes.splice(indexOfCollidedObject, 1);
                }
            }
        }

        for (const line of lines) {
            if (handleEraserCollision(eraser, line, line.shapeType)) {
                if (curLines.length > 0) {
                    const indexOfCollidedObject = curLines.indexOf(line);
                    curLines.splice(indexOfCollidedObject, 1);
                }
            }
        }

        setShapes([...curShapes]);
        setLines([...curLines]);
        setEraser({...curEraser, x: point.x, y: point.y});
    }

    function handleEraserCollision(eraser, otherObj, shape) {
        if (shape === 'rectangle') {
            return handleRectCollision(eraser, otherObj);
        } else if (shape === 'line') {
            return handleLineCollision(eraser, otherObj);
        }
        return false;
    }

    function handleRectCollision(eraser, otherRect) {
        return eraser.x + eraser.width > otherRect.x
            && otherRect.x + otherRect.width > eraser.x
            && eraser.y + eraser.height > otherRect.y
            && eraser.y < otherRect.y + otherRect.height;
    }

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


    function handleLineDrawing(point) {
        if (!isDrawing.current) {
            return;
        }

        // get points of pointer

        const newLines = [...lines];
        let lastLine = newLines[newLines.length - 1];
        let newLastLinePoints = [...lastLine.points];
        if (newLastLinePoints.length === 2) {
            newLastLinePoints = newLastLinePoints.concat([point.x, point.y]);
        } else {
            newLastLinePoints[2] = point.x;
            newLastLinePoints[3] = point.y;
        }
        lastLine = {...lastLine, color: selectedColor, points: newLastLinePoints};
        newLines.splice(newLines.length - 1, 1, lastLine);
        setLines(newLines);
    }

    function handleMouseClick(e) {
        if (eraser) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setShapes([...shapes, {...createShape(point, {width: 30, height: 30}, selectedColor, 'rectangle')}]);
    }

    function handleMouseUp() {
        if (eraser) {
            return;
        }
        isDrawing.current = false;
    }

    function chooseShape(e) {
        console.log(e.target.textContent);
        setDrawShapeMode(e.target.textContent);
    }

    return {
        drawShapeMode,
        shapes,
        lines,
        selectedColor,
        eraser,
        setEraser,
        chooseModeEraser,
        handleColorChange,
        handleMouseDown,
        handleMouseMove,
        handleMouseClick,
        handleMouseUp,
        chooseShape,
    }
}