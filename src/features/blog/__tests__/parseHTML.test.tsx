import { render } from '@testing-library/react';
import { parseHTML } from '../parseHTML';
import { ReactElement } from 'react';
import '@testing-library/jest-dom'; 

describe('parseHTML', () => {
  it('should parse HTML correctly with custom options', () => {
    const inputHTML = '<div><b>Bold Text</b> <i>Italic Text</i></div>';

    const parsedResult = parseHTML(inputHTML);

    // Ensure that the parsed result is a React element
    const parsedElement: ReactElement = parsedResult as ReactElement;

    const { container } = render(parsedElement);

    // Make assertions about the rendered content
    // Replace the following assertions with your actual expectations
    expect(container.firstChild).toBeInTheDocument(); // Check if there is a rendered element
    expect(container.firstChild).toHaveTextContent('Bold Text'); // Check the content
    expect(container.lastChild).toHaveTextContent('Italic Text'); // Check the content

    // You can add more specific assertions based on your actual use case
    // For example, check if specific elements or classes are present in the parsed result
    expect(container.querySelector('b')).toBeInTheDocument();
    expect(container.querySelector('i')).toBeInTheDocument();
  });

  // Add more test cases as needed
});
