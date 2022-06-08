import React, { useEffect } from "react";


interface ContextMenuProps {
    setShowContextMenu: Function;
    contextMenuPosition: Array<number>;
    children?: React.ReactNode;
}

const ContextMenu = (props: ContextMenuProps) => {

    const handleOutsideClick = () => {
        props.setShowContextMenu(false);
    }

    useEffect(() => {
        const contextMenu = (document.getElementsByClassName("context-menu")[0] as HTMLDivElement);
        contextMenu.style.left = props.contextMenuPosition[0]+"px";
        contextMenu.style.top = props.contextMenuPosition[1]+"px";
    })

    return (
        <div className="shadowless-main" onClick={handleOutsideClick}>
            <div className="context-menu">
                {props.children}
            </div>
        </div>
    )
}

export default ContextMenu;
