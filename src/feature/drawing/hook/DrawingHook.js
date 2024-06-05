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
        setLines([...lines, {id: id, color: selectedColor, points: [pos.x, pos.y]}]);
    }

    function handleMouseMove(e) {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        if (eraser) {
            console.log('using eraser');
            setEraser({...eraser, x: point.x, y: point.y});
            return;
        }
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }

        // get points of pointer

        const newLines = [...lines];
        let lastLine = newLines[newLines.length - 1];
        let newLastLinePoints = [...lastLine.points].concat([point.x, point.y]);
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