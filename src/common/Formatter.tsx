import {type TextAreaRef} from "../types/types"
import { wrapTextInHTMLTag } from "../features/blog/formattingText"

interface FormatterProps {
    textareaRef: TextAreaRef
}

const Formatter = (props: FormatterProps) => {
    return (
        <>
        <button
            className="secondary-button"
            onClick={() => wrapTextInHTMLTag('bold', props.textareaRef)}>
            Bold
        </button>
        <button
            className="secondary-button"
            onClick={() => wrapTextInHTMLTag('italic', props.textareaRef)}>
            Italic
        </button>
        <button
            className="secondary-button"
            onClick={() => wrapTextInHTMLTag('underline', props.textareaRef)}>
            Underline
        </button>
        <button
            className="secondary-button"
            onClick={() => wrapTextInHTMLTag('strikethrough', props.textareaRef)}>
            Strikethrough
        </button>
        <button
            className="secondary-button"
            onClick={() => wrapTextInHTMLTag('code', props.textareaRef)}>
            Code
        </button>
        </>
    );
}

export default Formatter;