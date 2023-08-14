import React, {useEffect, useRef} from 'react';

interface ContextMenuProps {
    setShowContextMenu: Function;
    contextMenuPosition: Array<number>;
    children?: React.ReactNode;
}

const ContextMenu = (props: ContextMenuProps) => {
    const contextMenuRef = useRef<HTMLDivElement>(null)

    const handleOutsideClick = () => {
        props.setShowContextMenu(false);
    };

    useEffect(() => {
        if (contextMenuRef.current !== null) {
            contextMenuRef.current.style.left = props.contextMenuPosition[0] + 'px';
            contextMenuRef.current.style.top = props.contextMenuPosition[1] + 'px';
        }
    });

    return (
        <div
            className="shadowless-main"
            onClick={handleOutsideClick}>
            <div ref={contextMenuRef} className="context-menu">{props.children}</div>
        </div>
    );
};

export default ContextMenu;
