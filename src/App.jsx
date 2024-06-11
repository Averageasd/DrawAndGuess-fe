import './index.css'
import {CompactPicker} from "react-color";
import {Circle, Line, Rect, Stage} from "react-konva";
import {Layer} from "react-konva";
import {useDrawingHook} from "./feature/drawing/hook/DrawingHook.js";
import {useState} from "react";

function App() {

    const {
        selectedColor,
        shapes,
        lines,
        eraser,
        setEraser,
        chooseModeEraser,
        handleColorChange,
        handleMouseDown,
        handleMouseMove,
        handleMouseClick,
        handleMouseUp,
        chooseShape,
        keydownListener,
        keyupListener,
        isDraggingCanvas,
    } = useDrawingHook();

    const [canvasState, setCanvasState] = useState({x: 0, y: 0});

    return (
        <section>
            <div className="flex items-start gap-2">
                <CompactPicker
                    color={selectedColor}
                    onChangeComplete={handleColorChange}
                />

                <button
                    onClick={(e) => {
                        chooseModeEraser();
                    }}
                >eraser
                </button>

                <button
                    onClick={(e) => {
                        chooseShape(e);
                    }}
                >line
                </button>
                <button
                    onClick={(e) => {
                        chooseShape(e);
                    }}
                >rectangle
                </button>
                <button onClick={(e) => {
                    chooseShape(e);
                }}>circle
                </button>
            </div>

            <div tabIndex={1} onKeyDown={keydownListener} onKeyUp={keyupListener}>
                <Stage
                    listening={true}
                    x={canvasState.x}
                    y={canvasState.y}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    onClick={handleMouseClick}
                    draggable={isDraggingCanvas}
                    onDragEnd={isDraggingCanvas ? (e) => {
                        setCanvasState({
                            ...canvasState,
                            x: e.target.x(),
                            y: e.target.y(),
                        });
                    } : undefined}
                >
                    <Layer>
                        {lines.map((line) => (
                            <Line
                                key={line.id}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={12}
                                tension={0.5}
                                lineCap="butt"
                                lineJoin="butt"
                                globalCompositeOperation={'source-over'}
                            />
                        ))}

                        {eraser &&
                            <Rect key={"eraser"} x={eraser.x} y={eraser.y} width={eraser.width} height={eraser.height}
                                  fill={eraser.color}></Rect>}

                        {shapes.map((shape) => {
                            if (shape.shapeType === 'rectangle') {
                                return (
                                    <Rect
                                        key={shape.id}
                                        x={shape.x}
                                        y={shape.y}
                                        width={shape.width}
                                        height={shape.height}
                                        fill={shape.color}
                                    >
                                    </Rect>
                                )
                            } else if (shape.shapeType === 'circle') {
                                return <Circle
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    radius={shape.radius}
                                    fill={shape.color}
                                >
                                </Circle>
                            }


                        })}

                    </Layer>
                </Stage>
            </div>
        </section>


    )
}

export default App
