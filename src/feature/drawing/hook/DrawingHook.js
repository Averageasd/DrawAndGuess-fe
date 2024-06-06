import {useContext} from "react";
import {AppContext} from "../../../context/AppProvider.jsx";
import {v4 as uuidv4} from "uuid";
import {useCreateShapeHook} from "./createShapeFactoryHook.js";
import {useHandleRectCollisionHook} from "./handleRectCollisionHook.js";
import {useHandleLineCollisionHook} from "./handleLineCollisionHook.js";

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

    const {createShape} = useCreateShapeHook();

    const {handleRectCollision} = useHandleRectCollisionHook();

    const {handleLineCollision} = useHandleLineCollisionHook();

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

    function canUseEraser() {
        return eraser !== null;
    }

    function canDrawLine() {
        return drawShapeMode && drawShapeMode === 'line';
    }

    function canDrawShape() {
        return drawShapeMode && drawShapeMode === 'circle' || drawShapeMode === 'rectangle';
    }

    function handleMouseDown(e) {
        if (canUseEraser() || !canDrawLine()) {
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
        if (canUseEraser()) {
            handleEraserMovement(point);
            return;
        }
        handleLineDrawing(point);

    }

    function handleEraserMovement(point) {
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

    function handleLineDrawing(point) {
        if (!isDrawing.current) {
            return;
        }
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
        if (canUseEraser() || !canDrawShape()) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setShapes([...shapes, {
            ...createShape(point, {
                width: 30,
                height: 30,
                radius: 15
            }, selectedColor, drawShapeMode)
        }]);
    }

    function handleMouseUp() {
        if (canUseEraser()) {
            return;
        }
        isDrawing.current = false;
    }

    function chooseShape(e) {
        isDrawing.current = false;
        setEraser(null);
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