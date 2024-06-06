export function useHandleCircleCollisionHook() {
    function handleCircleCollision(eraser, circle) {
        const circleX = circle.x;
        const circleY = circle.y;
        let closestXPosToEraser = circle.x;
        let closestYPosToEraser = circle.y;

        // circle is to the right of eraser
        if (circle.x > eraser.x + eraser.width) {
            closestXPosToEraser = eraser.x + eraser.width;
        }

        // circle is to the left of eraser
        else if (circle.x < eraser.x) {
            closestXPosToEraser = eraser.x;
        }

        // circle is at bottom of eraser
        if (circle.y > eraser.y + eraser.height) {
            closestYPosToEraser = eraser.y + eraser.height;
        }

        // circle is at top of eraser
        else if (circle.y < eraser.y) {
            closestYPosToEraser = eraser.y;
        }

        // if none of these cases is true, then either circle is inside rectangle or rectangle is inside circle.
        const distFromCenterToEdge = Math.sqrt(Math.pow((closestXPosToEraser - circleX), 2) + Math.pow((closestYPosToEraser - circleY), 2));
        return distFromCenterToEdge <= circle.radius;
    }

    return {
        handleCircleCollision,
    }
}