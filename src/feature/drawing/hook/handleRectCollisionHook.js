export function useHandleRectCollisionHook() {

    function handleRectCollision(eraser, otherRect) {
        return eraser.x + eraser.width > otherRect.x
            && otherRect.x + otherRect.width > eraser.x
            && eraser.y + eraser.height > otherRect.y
            && eraser.y < otherRect.y + otherRect.height;
    }

    return {
        handleRectCollision,
    }
}