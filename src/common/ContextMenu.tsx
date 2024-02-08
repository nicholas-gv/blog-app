import { useState, useEffect, ReactNode } from "react";

interface ContextMenuProps<T extends HTMLElement> {
    targetRef: React.RefObject<T> | null;
    children: ReactNode
}

const ContextMenu = <T extends HTMLElement>(props: ContextMenuProps<T>) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [posX, setPosX] = useState(0)
    const [posY, setPosY] = useState(0)

    useEffect(() => {
        if (props.targetRef?.current) {
            props.targetRef.current.addEventListener("contextmenu", handleClick)
        }

        // Cleanup
        return () => {
            if (props.targetRef?.current) {
                props.targetRef.current.removeEventListener('contextmenu', handleClick);
            }
        };
    }, [props]);

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        setShowContextMenu(true);
        setPosX(e.clientX);
        setPosY(e.clientY);
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setShowContextMenu(false);
    };

    return (
        <>
        {showContextMenu && 
            <div
                className="shadowless-main"
                onClick={handleOutsideClick}
                onContextMenu={handleOutsideClick}>
                <div 
                    style={{top: `${posY+10}px`, left: `${posX}px`}}
                    className="context-menu">
                    {props.children}
                </div>
            </div>
        }
        </>
    );
};

export default ContextMenu;
