import animate from '../utilities/animate';
import setAttributes, { Attributes } from '../utilities/dom-helpers';
import './Accordion.scss';

// TODO: Switch to only including data that changes in state?

const ANIMATION_SPEED = 200; // milliseconds

interface AccordionModel {
  heading: {
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    textContent: string;
  };
  panel: string;
  open: boolean;
  id: string;
  isAnimating: boolean;
}

interface AccordionOptions {
  animationSpeed: number;
  prefix: string;
}

export type AccordionModelParam = Omit<AccordionModel, 'isAnimating' | 'id'>;

class Accordion {
  public model: AccordionModel;
  private buttonEl!: HTMLButtonElement;
  private panelEl!: HTMLDivElement;
  private options: AccordionOptions;
  private root: HTMLElement;
  private static count = 1;
  private test = 'test';

  constructor(
    model: AccordionModelParam,
    root: HTMLElement,
    options?: Partial<AccordionOptions>,
    onClick?: (id: string) => void
  ) {
    // ===========
    // Set options
    // ===========
    const defaultOptions: AccordionOptions = {
      animationSpeed: ANIMATION_SPEED,
      prefix: 'accordion',
    };

    // If supplied, blend user options with default options. Otherwise, use defaults
    if (typeof options !== undefined) {
      this.options = { ...defaultOptions, ...options };
    } else {
      this.options = defaultOptions;
    }
    this.model = {
      ...model,
      isAnimating: false,
      id: `${this.options.prefix}-${Accordion.count.toString()}`,
    };
    root.classList.add('accordion');
    this.root = root;

    this.init(onClick);

    Accordion.count++;
  }

  init(onClick: ((id: string) => void) | undefined) {
    const { heading, panel, open, id } = this.model;
    const buttonId = `${id}-button`;
    const panelId = `${id}-panel`;

    // Create heading element
    const headingEl = document.createElement(heading.level);

    // Create button for opening/closing accordion
    const buttonEl = document.createElement('button');
    const buttonAttributes: Attributes = {
      class: 'accordion__button',
      type: 'button',
      'aria-expanded': open.toString(),
      'aria-controls': panelId,
      id: buttonId,
    };
    setAttributes(buttonEl, buttonAttributes);
    buttonEl.textContent = heading.textContent;
    this.buttonEl = buttonEl;

    // Create panel element
    const panelEl = document.createElement('div');
    const panelAttributes: Attributes = {
      class: 'accordion__panel',
      id: panelId,
      role: 'region',
      'aria-labelledby': buttonId,
    };
    if (!open) panelAttributes.class += ' accordion__panel--hide';
    setAttributes(panelEl, panelAttributes);
    this.panelEl = panelEl;

    // Create panel inner container
    const panelInnerEl = document.createElement('div');
    panelInnerEl.classList.add('accordion__panel-inner');
    panelInnerEl.innerHTML = panel;

    // Set event listener to open/close panel
    buttonEl.addEventListener('click', () => {
      if (onClick) {
        onClick(id);
      } else {
        this.setState('open', !this.model.open);
      }
    });

    // Assemble elements together and put on the page
    headingEl.appendChild(buttonEl);
    panelEl.appendChild(panelInnerEl);
    this.root.appendChild(headingEl);
    this.root.appendChild(panelEl);
  }

  setState<Prop extends keyof AccordionModel>(
    propToUpdate: Prop,
    val: AccordionModel[Prop]
  ) {
    this.model[propToUpdate] = val;
    this.render();
  }

  render() {
    const { open, isAnimating } = this.model;

    if (isAnimating) return;

    this.buttonEl.setAttribute('aria-expanded', open.toString());
    this.animatePanel()
      .then(() => {
        this.panelEl.removeAttribute('style');
        this.panelEl.classList.toggle('accordion__panel--hide', !open);
      })
      .catch((err) => console.log(err));
  }

  private async animatePanel(): Promise<void> {
    const { panelEl } = this;
    const fullHeight = panelEl.scrollHeight;
    const shouldOpen = this.model.open;

    this.model.isAnimating = true;

    await animate((progress) => {
      let newHeight: number;
      let newOpacity: number;
      if (shouldOpen) {
        newHeight = progress * fullHeight;
        newOpacity = progress * 1;
      } else {
        newHeight = (1 - progress) * fullHeight;
        newOpacity = (1 - progress) * 1;
      }
      panelEl.style.height = `${newHeight}px`;
      panelEl.style.opacity = `${newOpacity}`;
    }, this.options.animationSpeed);

    this.model.isAnimating = false;
  }
}

export default Accordion;
