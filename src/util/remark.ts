// @ts-ignore
import unified from 'unified';
// @ts-ignore
import remarkParse from 'remark-parse';

import {RollingMap} from '/util/collection';

const parser = unified().use(remarkParse);

const cache = new RollingMap<string, ReturnType<typeof parser.parse>>(10);

/**
 * Parse a markdown string to an ast using remark. Parse results are cached to
 * improve performance of sequential calls with the same markdown string.
 */
export function parseMarkdown(source: string) {
  if (cache.has(source)) {
    return cache.get(source);
  }

  const ast = parser.parse(source);

  cache.set(source, ast);

  return ast;
}

/**
 * Converts a parsed markdown ast to a plain string representation.
 * Returns a a string at least as long as targetLength if possible.
 */
export function astToText(node: any, targetLength: number): string {
  if (targetLength < 1) {
    return '';
  }

  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'inlineCode') {
    return `\`${node.value}\``;
  }

  if (node.type === 'code') {
    return `\n\n\`\`\`\n${node.value}\n\`\`\``;
  }

  if (node.type === 'image') {
    return `[${node.alt}]`;
  }

  if (node.children && node.children.length) {
    if (
      node.type === 'emphasis' ||
      node.type == 'strong' ||
      node.type === 'listItem' ||
      node.type === 'underline' ||
      node.type === 'link'
    ) {
      return astToText(node.children[0], targetLength);
    }

    if (
      node.type === 'heading' ||
      node.type === 'paragraph' ||
      node.type === 'list' ||
      node.type === 'blockquote' ||
      node.type === 'root'
    ) {
      let result = '';

      for (
        let i = 0;
        i < node.children.length && result.length < targetLength;
        i++
      ) {
        const childNode = node.children[i];
        const chunk = astToText(childNode, targetLength - result.length);

        if (chunk) {
          if (
            (node.type !== 'root' || i > 0) &&
            (childNode.type === 'heading' ||
              childNode.type === 'paragraph' ||
              childNode.type === 'list')
          ) {
            result += '\n\n';
          }

          if (node.type === 'list') {
            if (i > 0) {
              result += '\n';
            }
            result += node.ordered ? `${i + 1}. ` : `- `;
            result += chunk
              .replace(/(^\s+|\s+$)/g, '')
              .replace(/(\n+)/, node.ordered ? '$1   ' : '$1  ');
          } else {
            if (
              result &&
              !/\s$/.test(result) &&
              (chunk && !/^\s/.test(chunk))
            ) {
              result += ' ';
            }
            result += chunk;
          }
        }
      }

      return result;
    }
  }

  return '';
}

/**
 * Extracts the url and alt text of the first image node encountered in a
 * parsed markdown ast.
 */
export function astToImage(
  node: any,
): {url: string; alt: string | null} | void {
  if (node.type === 'image') {
    return node;
  }

  if (node.children && node.children.length) {
    for (let i = 0; i < node.children.length; i++) {
      const result = astToImage(node.children[i]);
      if (result) {
        return result;
      }
    }
  }
}
