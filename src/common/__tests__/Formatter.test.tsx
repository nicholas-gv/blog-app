import { render, screen, fireEvent } from '@testing-library/react';
import Formatter from '../Formatter';
import { wrapTextInHTMLTag } from '../../features/blog/formattingText';

jest.mock('../../features/blog/formattingText', () => ({
  wrapTextInHTMLTag: jest.fn(),
}));

describe('Formatter', () => {
  it('calls wrapTextInHTMLTag with correct arguments on button click', () => {
    const textareaRefMock = { current: document.createElement('textarea') };

    render(<Formatter textareaRef={textareaRefMock} />);

    const boldButton = screen.getByText('Bold');
    const italicButton = screen.getByText('Italic');
    const underlineButton = screen.getByText('Underline');
    const strikethroughButton = screen.getByText('Strikethrough');
    const codeButton = screen.getByText('Code');

    fireEvent.click(boldButton);
    fireEvent.click(italicButton);
    fireEvent.click(underlineButton);
    fireEvent.click(strikethroughButton);
    fireEvent.click(codeButton);

    // Check if wrapTextInHTMLTag was called with the correct arguments
    expect(wrapTextInHTMLTag).toHaveBeenCalledWith('bold', textareaRefMock);
    expect(wrapTextInHTMLTag).toHaveBeenCalledWith('italic', textareaRefMock);
    expect(wrapTextInHTMLTag).toHaveBeenCalledWith('underline', textareaRefMock);
    expect(wrapTextInHTMLTag).toHaveBeenCalledWith('strikethrough', textareaRefMock);
    expect(wrapTextInHTMLTag).toHaveBeenCalledWith('code', textareaRefMock);

    expect(wrapTextInHTMLTag).toHaveBeenCalledTimes(5);
  });
});
