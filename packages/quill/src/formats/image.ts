import { EmbedBlot } from 'parchment';
import { sanitize } from './link.js';

const ATTRIBUTES = ['alt', 'height', 'width'];

class Image extends EmbedBlot {
  static blotName = 'image';
  static tagName = 'IMG';

  static create(value: string | { src: string; alt?: string; width?: string; height?: string; id?: string }) {
    const node = super.create() as HTMLImageElement;
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    } else {
      node.setAttribute('src', this.sanitize(value.src));
      if (value.alt) {
        node.setAttribute('alt', value.alt);
      }
      if (value.width) {
        node.setAttribute('width', value.width);
      }
      if (value.height) {
        node.setAttribute('height', value.height);
      }
      if (value.id) {
        node.setAttribute('data-id', value.id);
      }
    }
    return node;
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {},
    );
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url: string) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode: Element) {
    return domNode.getAttribute('src');
  }

  domNode: HTMLImageElement;

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Image;
