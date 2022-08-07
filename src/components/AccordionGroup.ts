import Accordion, { AccordionModelParam } from './Accordion';
import './AccordionGroup.scss';

// TODO: Emit Custom Events
// TODO: Fix weird default ids

interface AccordionGroupOptions {
  multipleExpanded: boolean;
  preventAllCollapsed: boolean;
  prefix: string;
}

export default class AccordionGroup {
  private static count = 1;
  private root: HTMLElement;
  private options: AccordionGroupOptions;
  private accordions: Accordion[];
  private id: string;
  private test = 'test';

  constructor(
    root: HTMLElement,
    accordions: AccordionModelParam[],
    options?: Partial<AccordionGroupOptions>
  ) {
    // ===========
    // Set options
    // ===========
    const defaultOptions: AccordionGroupOptions = {
      multipleExpanded: false,
      preventAllCollapsed: false,
      prefix: 'accordion-group',
    };

    // If supplied, blend user options with default options. Otherwise, use defaults
    if (typeof options !== undefined) {
      this.options = { ...defaultOptions, ...options };
    } else {
      this.options = defaultOptions;
    }

    // ===========
    // Bind methods
    // ===========
    this.handleClick = this.handleClick.bind(this);

    // ===========
    // Set default properties
    // ===========
    this.root = root;
    this.id = `${this.options.prefix}-${AccordionGroup.count}`;
    this.accordions = accordions.map(
      (a) =>
        new Accordion(
          a,
          root,
          { prefix: this.id, animationSpeed: 1000 },
          this.handleClick
        )
    );

    AccordionGroup.count++;
  }

  getOpenPanels(): string[] {
    return this.accordions.filter((a) => a.model.open).map((a) => a.model.id);
  }

  handleClick(clickedId: string) {
    const isAnimating = this.accordions.some((a) => a.model.isAnimating);
    if (isAnimating) return;
    const openPanels = this.getOpenPanels();
    const numOpen = openPanels.length;
    // Default case (one panel open at a time, all can be collapsed)
    for (const accordion of this.accordions) {
      const { id } = accordion.model;
      if (clickedId === id) {
        if (openPanels.includes(id)) {
          accordion.setState('open', false);
        } else {
          // If it's closed, open it
          accordion.setState('open', true);
        }
      } else {
        if (accordion.model.open === true) accordion.setState('open', false);
      }
    }
  }
}
