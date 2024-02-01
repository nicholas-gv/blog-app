import {wrapTextInHTMLTag} from '../../features/blog/formattingText';
import {TextAreaRef} from '../../types/types';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';

class MockRefObject<T> {
    current: T | null = null;
}

describe('wrapTextInHTMLTag', () => {
    it('wraps selected text in HTML tags', () => {
        const textareaRef: TextAreaRef = new MockRefObject<HTMLTextAreaElement>();

        const {container} = render(
            <textarea
                ref={textareaRef}
                defaultValue="Hello World"
            />
        );

        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

        act(() => {
            textarea.setSelectionRange(0, 5);
        });

        wrapTextInHTMLTag('bold', textareaRef);

        expect(textarea.value).toBe('<b>Hello</b> World');
    });

    it('does not modify the text if no selection is made', () => {
        const textareaRef: TextAreaRef = new MockRefObject<HTMLTextAreaElement>();

        const {container} = render(
            <textarea
                ref={textareaRef}
                defaultValue="Hello World"
            />
        );

        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

        wrapTextInHTMLTag('bold', textareaRef);

        expect(textarea.value).toBe('Hello World');
    });
});
