import xIcon from '../assets/x-icon.svg'


interface ErrorMessageProps {
    children?: string;
}

const ErrorMessage = (props: ErrorMessageProps) => {

    return (
        <div className="error-message-container">
            <img src={xIcon} width="20"></img>
            <div className="error-message">{props.children}</div>
        </div>
    )
}

export default ErrorMessage;
