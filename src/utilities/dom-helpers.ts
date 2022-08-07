// To set a boolean attribute, assign the value of a property to an empty string
export type Attributes = Record<string, string>;

export default function setAttributes(
  el: Element,
  attributes: Attributes
): void {
  Object.keys(attributes).forEach((attr) => {
    el.setAttribute(attr, attributes[attr]);
  });
}
