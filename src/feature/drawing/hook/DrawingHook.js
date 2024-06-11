import {useContext} from "react";
import {AppContext} from "../../../context/AppProvider.jsx";
import {v4 as uuidv4} from "uuid";
import {useCreateShapeHook} from "./createShapeFactoryHook.js";
import {useHandleRectCollisionHook} from "./handleRectCollisionHook.js";
import {useHandleLineCollisionHook} from "./handleLineCollisionHook.js";
import {useHandleCircleCollisionHook} from "./handleCircleCollisionHook.js";

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
        isDrawing,
        canCreateShape,
        isDraggingCanvas,
        setIsDraggingCanvas,
        isErasing,
    } = useContext(AppContext);
    const {createShape} = useCreateShapeHook();
    const {handleRectCollision} = useHandleRectCollisionHook();
    const {handleLineCollision} = useHandleLineCollisionHook();
    const {handleCircleCollision} = useHandleCircleCollisionHook();

    function keydownListener(e) {
        if (e.keyCode === 32) {
            removeInCompleteLines();
            setIsDraggingCanvas(true);
        }

    }

    function keyupListener(e) {
        setIsDraggingCanvas(false);
    }

    function handleColorChange(color, event) {
        setSelectedColor(color.hex);
    }

    function chooseModeEraser() {
        if (eraser) {
            setEraser(null);
            return;
        }
        isErasing.current = true;
        isDrawing.current = false;
        canCreateShape.current = false;
    }

    function canUseEraser() {
        return isErasing.current;
    }

    function canDrawLine() {
        return drawShapeMode && drawShapeMode === 'line';
    }

    function canDrawShape() {
        return drawShapeMode && canCreateShape.current;
    }

    function handleMouseDown(e) {
        if (isDraggingCanvas) {
            removeInCompleteLines();
            return;
        }

        if (canUseEraser() || !canDrawLine()) {
            return;
        }
        const id = uuidv4();
        isDrawing.current = true;
        const pos = e.target.getStage().getRelativePointerPosition();
        setLines([...lines, {
            id: id,
            color: selectedColor,
            shapeType: 'line',
            isLineEditing: true,
            points: [pos.x, pos.y]
        }]);
    }

    function handleMouseMove(e) {
        const stage = e.target.getStage();
        const point = stage.getRelativePointerPosition();
        if (isDraggingCanvas) {
            removeInCompleteLines();
            setEraser(null);
            return;
        }
        if (canUseEraser()) {
            if (!eraser) {
                setEraser({...createShape(point, {width: 20, height: 20}, 'white', 'rectangle')});
            } else {
                setEraser({...eraser, point: {x: point.x, y: point.y}});
            }
            handleEraserMovement(point);
            return;
        }
        handleLineDrawing(point);

    }

    function handleEraserMovement(point) {
        if (!eraser) {
            return;
        }
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
        } else if (shape === 'circle') {
            return handleCircleCollision(eraser, otherObj);
        }
        return false;
    }

    function handleLineDrawing(point) {
        if (isDraggingCanvas) {
            removeInCompleteLines();
            return;
        }
        if (!isDrawing.current) {
            return;
        }
        if (lines.length === 0) {
            return;
        }
        const newLines = [...lines];
        let lastLine = newLines[newLines.length - 1];
        let newLastLinePoints = [...lastLine.points];
        if (newLastLinePoints.length === 2) {
            newLastLinePoints = newLastLinePoints.concat([point.x, point.y]);
        } else if (newLastLinePoints.length === 4) {
            if (lastLine.isLineEditing) {
                newLastLinePoints[2] = point.x;
                newLastLinePoints[3] = point.y;
            }

        }
        lastLine = {...lastLine, color: selectedColor, points: newLastLinePoints};
        newLines.splice(newLines.length - 1, 1, lastLine);
        setLines(newLines);
    }

    function handleMouseClick(e) {
        if (isDraggingCanvas) {
            removeInCompleteLines();
            return;
        }

        if (canUseEraser() || !canDrawShape()) {
            return;
        }

        // clicked on an object, do nothing
        // if click on empty area in stage, draw
        if (e.target !== e.target.getStage()) {
            return;
        }


        const stage = e.target.getStage();
        const point = stage.getRelativePointerPosition();
        if (canCreateShape.current === true) {
            handleCreateObject(point);
        }
    }

    function handleCreateObject(point) {
        setShapes([...shapes, {
            ...createShape(point, {
                width: 30,
                height: 30,
                radius: 15
            }, selectedColor, drawShapeMode)
        }]);
    }

    function handleMouseUp() {
        removeInCompleteLines();
        isDrawing.current = false;
    }

    function chooseShape(e) {
        removeInCompleteLines();
        if (e.target.textContent !== 'line') {
            isDrawing.current = false;
            canCreateShape.current = true;
        } else {
            isDrawing.current = true;
            canCreateShape.current = false;
        }
        setEraser(null);
        isErasing.current = false;
        setDrawShapeMode(e.target.textContent);
    }

    function removeInCompleteLines() {
        const newLines = [...lines];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.points.length === 2) {
                const indexOfIncompleteLine = newLines.indexOf(line);
                newLines.splice(indexOfIncompleteLine, 1);
            } else if (line.isLineEditing) {
                const indexOfEditedLine = newLines.indexOf(line);
                newLines[indexOfEditedLine] = {...line, points: [...line.points], isLineEditing: false};
            }
        }
        setLines([...newLines]);
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
        canCreateShape,
        keydownListener,
        keyupListener,
        isDraggingCanvas,
    }
}