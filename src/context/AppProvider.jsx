import {createContext, useRef, useState} from "react";

export const AppContext = createContext({});

export function AppProvider({children}) {

    const [selectedColor, setSelectedColor] = useState('white');
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [drawShapeMode, setDrawShapeMode] = useState('line');
    const isDrawing = useRef(false);
    const [eraser, setEraser] = useState(null);


    return (
        <AppContext.Provider
            value={{
                eraser: eraser,
                setEraser: setEraser,
                selectedColor: selectedColor,
                setSelectedColor: setSelectedColor,
                lines: lines,
                setLines: setLines,
                shapes: shapes,
                setShapes: setShapes,
                drawShapeMode: drawShapeMode,
                setDrawShapeMode: setDrawShapeMode,
                isDrawing: isDrawing,
            }}>
            {children}
        </AppContext.Provider>
    )
}