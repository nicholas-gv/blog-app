import { useState, useEffect, ReactNode, useRef } from "react";

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
    }, [props.targetRef]);

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        setShowContextMenu(true);
        setPosX(e.pageX);
        setPosY(e.pageY);
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
