import {RefObject} from 'react';

type TextAreaRef = RefObject<HTMLTextAreaElement>;

// when a user selects some text and clicks on a formatting option, 
// this function adds the appropriate html tag to that text.
export const formatText = (
    typeOfFormat: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code',
    textareaElementRef: TextAreaRef
) => {
    const formats = {bold: 'b', italic: 'i', underline: 'ins', strikethrough: 'del', code: 'code'};
    const textarea = textareaElementRef.current;

    if (textarea && textarea.selectionEnd !== textarea.selectionStart) {
        const textareaValue = textarea.value;
        const newTextareaValue =
            textareaValue.substring(0, textarea.selectionStart) +
            `<${formats[typeOfFormat]}>${textareaValue.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            )}</${formats[typeOfFormat]}>` +
            textareaValue.substring(textarea.selectionEnd, textareaValue.length);
        textareaElementRef.current.value = newTextareaValue;
    }
};
