import parse from 'html-react-parser';
import {HTMLReactParserOptions, Element, domToReact} from 'html-react-parser';

export const parseHTML = (unparsedText: string) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (
                domNode instanceof Element &&
                domNode.attribs &&
                domNode.tagName !== 'b' &&
                domNode.tagName !== 'i' &&
                domNode.tagName !== 'ins' &&
                domNode.tagName !== 'code' &&
                domNode.tagName !== 'del'
            ) {
                return <>{domToReact(domNode.children, options)}</>;
            }
        },
    };
    return parse(unparsedText, options);
}

