import Konva from "konva";
import {v4 as uuidv4} from "uuid";

export function useCreateShapeHook() {

    function createShape(pos, size, color, type) {
        let shape = {};
        const id = uuidv4();
        switch (type) {
            case 'rectangle':
                shape = new Konva.Rect({
                    x: pos.x,
                    y: pos.y,
                    fill: color,
                    width: size.width,
                    height: size.height,
                });
                return {...shape.attrs, id: id, color: color};
            case 'circle':
                shape = new Konva.Circle({
                    x: pos.x,
                    y: pos.y,
                    fill: color,
                    width: 30,
                    height: 30
                });
                return {...shape.attrs, id: id, color: color};
        }
    }

    return {createShape};
}