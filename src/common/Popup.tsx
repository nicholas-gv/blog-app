import React from "react";


interface PopupProps {
    setShowPopup: Function;
    children?: React.ReactNode;
}

const Popup = (props: PopupProps) => {

    const handleOutsideClick = () => {
        props.setShowPopup(false);
    }

    return (
        <div className="shadow-main" onClick={handleOutsideClick}>
            <div className="popup">
                {props.children}
            </div>
        </div>
    )
}

export default Popup;
