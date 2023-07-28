export const formatText = (typeOfFormat: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    const formats = {bold: 'b', italic: 'i', underline: 'ins', strikethrough: 'del', code: 'code'};
    const textarea = document.getElementById('new-content') as HTMLFormElement;

    if (textarea && (textarea.selectionEnd !== textarea.selectionStart)) {
        const textareaValue = textarea.value;
        const newTextareaValue =
            textareaValue.substring(0, textarea.selectionStart) +
            `<${formats[typeOfFormat]}>${textareaValue.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            )}</${formats[typeOfFormat]}>` +
            textareaValue.substring(textarea.selectionEnd, textareaValue.length);
        (document.getElementById('new-content') as HTMLFormElement).value = newTextareaValue;
    }
};
