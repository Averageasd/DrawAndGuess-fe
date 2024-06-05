import './index.css'
import {CompactPicker} from "react-color";
import {Line, Rect, Stage} from "react-konva";
import {Layer} from "react-konva";
import {useDrawingHook} from "./feature/drawing/hook/DrawingHook.js";

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
    } = useDrawingHook();

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
                <button>circle</button>
            </div>

            <div>
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    onClick={handleMouseClick}
                >
                    <Layer>
                        {lines.map((line) => (
                            <Line
                                key={line.id}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={12}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={'source-over'}
                            />
                        ))}

                        {eraser &&
                            <Rect key={"eraser"} x={eraser.x} y={eraser.y} width={eraser.width} height={eraser.height}
                                  fill={eraser.color}></Rect>}

                        {shapes.map((shape) => {
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

                        })}

                    </Layer>
                </Stage>
            </div>
        </section>


    )
}

export default App
