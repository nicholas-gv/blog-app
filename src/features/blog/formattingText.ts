import { TextAreaRef } from "../../types/types";

// when a user selects some text and clicks on a formatting option, 
// this function wraps that text in an appropriate html tag.
export const wrapTextInHTMLTag = (
    typeOfFormat: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code',
    textareaElementRef: TextAreaRef
) => {
    const formats = {bold: 'b', italic: 'i', underline: 'ins', strikethrough: 'del', code: 'code'};
    const textarea = textareaElementRef.current;
    const textNotEmpty = textarea && textarea.selectionEnd !== textarea.selectionStart

    if (textNotEmpty) {
        const textareaValue = textarea.value;
        const precedingText = textareaValue.substring(0, textarea.selectionStart)
        const succedingText = textareaValue.substring(textarea.selectionEnd, textareaValue.length)

        const newTextareaValue =
            precedingText +
            `<${formats[typeOfFormat]}>${textareaValue.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            )}</${formats[typeOfFormat]}>` +
            succedingText;
        textareaElementRef.current.value = newTextareaValue;
    }
};
