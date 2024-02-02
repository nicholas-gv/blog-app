import React, { useEffect, useState } from 'react';

interface PopupProps<T extends HTMLElement> {
    targetRef: React.RefObject<T>;
    children?: React.ReactNode;
}

const Popup = <T extends HTMLElement>(props: PopupProps<T>) => {
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        if (props.targetRef?.current) {
            props.targetRef.current.addEventListener("click", handleClick)
        }

        // Cleanup
        return () => {
            if (props.targetRef?.current) {
                props.targetRef.current.removeEventListener('click', handleClick);
            }
        };
    }, [props]);

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        setShowPopup(true);
    }

    const handleOutsideClick = () => {
        setShowPopup(false)
    };

    return (
        <>
            {showPopup && 
                <div
                    className="shadow-main"
                    onClick={handleOutsideClick}>
                    <div className="popup">{props.children}</div>
                </div>
            }
        </>
    );
};

export default Popup;
