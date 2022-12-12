export const formatText = (
    typeOfFormat: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'br'
) => {
    const formats = {bold: 'b', italic: 'i', underline: 'ins', strikethrough: 'del', code: 'code', br: 'br'};
    const textarea = document.getElementById('new-content') as HTMLFormElement;

    if (textarea) {
        const textareaStartSelection = textarea.selectionStart;
        const textareaEndSelection = textarea.selectionEnd;
        const textareaValue = textarea.value;

        if (textareaEndSelection !== textareaStartSelection) {
            const newTextareaValue =
                textareaValue.substring(0, textareaStartSelection) +
                `<${formats[typeOfFormat]}>${textareaValue.substring(
                    textareaStartSelection,
                    textareaEndSelection
                )}</${formats[typeOfFormat]}>` +
                textareaValue.substring(textareaEndSelection, textareaValue.length);
            (document.getElementById('new-content') as HTMLFormElement).value = newTextareaValue;
        } else if (typeOfFormat === 'br') {
            const newTextareaValue =
                textareaValue.substring(0, textareaStartSelection) +
                `<${formats[typeOfFormat]}/>` +
                textareaValue.substring(textareaEndSelection, textareaValue.length);
            (document.getElementById('new-content') as HTMLFormElement).value = newTextareaValue;
        }
    }
};
