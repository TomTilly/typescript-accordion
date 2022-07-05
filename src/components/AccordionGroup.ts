import './AccordionGroup.scss';

interface Accordion {
  header: string;
  panel: string;
}

interface AccordionGroupState {
  isAnimating: boolean;
  activePanels: number[]; // uses index of panels
}

interface AccordionGroupOptions {
  multipleExpanded: boolean;
  preventAllCollapsed: boolean;
  prefix: string;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
  defaultOpen: number[];
}

interface Attribute {
  name: string;
  value: string;
}

//TODO - Emit Custom Events

/**
 * Represents a group of accordions
 */
class AccordionGroup {
  private static count = 1;
  private state: AccordionGroupState;
  private id: string; // Used to distinguish between multiple accordions
  private root: HTMLElement; // Root of Accordion
  private options: AccordionGroupOptions;
  private accordions: Accordion[];
  private headerEls!: HTMLElement[];

  constructor(
    root: HTMLElement,
    accordions: Accordion[],
    options?: Partial<AccordionGroupOptions>
  ) {
    // ===========
    // Set options
    // ===========
    const defaultOptions: AccordionGroupOptions = {
      multipleExpanded: false,
      preventAllCollapsed: false,
      prefix: 'accordion-group',
      headingLevel: 3,
      defaultOpen: [0],
    };

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
    this.accordions = accordions;
    this.state = {
      isAnimating: false,
      activePanels: this.options.defaultOpen,
    };

    this.initView();
  }

  private render() {
    const { activePanels } = this.state;

    for (let i = 0; i < this.headerEls.length; i++) {
      this.headerEls[i].setAttribute(
        'aria-expanded',
        activePanels.includes(i).toString()
      );
    }
  }

  private setActivePanels(panelIndex: number) {
    const { preventAllCollapsed, multipleExpanded } = this.options;

    // If id is part of activePanels...
    if (this.state.activePanels.includes(panelIndex)) {
      // If id is only element of activePanels...
      if (this.state.activePanels.length === 1) {
        // Don't remove panelIndex from activePanels if preventAllCollapsed is true
        if (preventAllCollapsed) return;
        // Otherwise, remove it
        this.state.activePanels = [];
      } else {
        // If index isn't only element of activePanels, remove it
        this.state.activePanels = this.state.activePanels.filter(
          (index) => index !== panelIndex
        );
      }
    } else {
      // If index is not part of activePanels, add it (and remove any other activePanels
      // if multipleExpanded option is set to false)
      if (multipleExpanded) {
        this.state.activePanels.push(panelIndex);
      } else {
        this.state.activePanels = [panelIndex];
      }
    }
  }

  private handleClick(event: MouseEvent): void {
    // Get id of header clicked, which corresponds with panel to potentialy open/close
    const trigger = <HTMLButtonElement>event.currentTarget;
    const substring = 'trigger-';
    // Trigger elements have an id of `${groupId}__trigger-{index + 1}`
    // If we find the number after "trigger-" and subtract 1
    // from it, we'll have the index of the element to use
    // in this.state.activePanels
    const triggerIndex =
      parseInt(
        trigger.id.slice(trigger.id.indexOf(substring) + substring.length)
      ) - 1;

    this.setActivePanels(triggerIndex);
    this.render();
  }

  private initView(): void {
    const { id: groupId, accordions, root } = this;
    const { activePanels } = this.state;
    const { headingLevel } = this.options;

    root.className = 'accordion-group';

    const accordionEls: [HTMLHeadingElement, HTMLDivElement][] = accordions.map(
      (item, i) => {
        // ======
        // Create Header element
        // ======
        const header = document.createElement(`h${headingLevel}`);
        const triggerId = `${groupId}__trigger-${i + 1}`;
        const panelId = `${groupId}__panel-${i + 1}`;
        const headerAttributes: Attribute[] = [
          {
            name: 'type',
            value: 'button',
          },
          {
            name: 'aria-expanded',
            value: activePanels.includes(i).toString(),
          },
          {
            name: 'class',
            value: 'accordion-group__trigger',
          },
          {
            name: 'aria-controls',
            value: panelId,
          },
          {
            name: 'id',
            value: triggerId,
          },
        ];
        const headerAttrString = headerAttributes
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(' ');
        header.innerHTML = `<button ${headerAttrString}>${item.header}</button>`;

        // ======
        // Create Panel element
        // ======
        const panel = document.createElement('div');
        const panelAttributes: Attribute[] = [
          {
            name: 'id',
            value: panelId,
          },
          {
            name: 'role',
            value: 'region',
          },
          {
            name: 'aria-labelledby',
            value: triggerId,
          },
          {
            name: 'class',
            value: 'accordion-group__panel',
          },
        ];

        for (const attr of panelAttributes) {
          panel.setAttribute(attr.name, attr.value);
        }
        panel.innerHTML = item.panel;

        return [header, panel];
      }
    );

    for (const els of accordionEls) {
      const [header, panel] = els;
      root.appendChild(header);
      root.appendChild(panel);

      // safe to assert as HTMLButtonElement because the button was just created above
      const trigger = header.firstElementChild as HTMLButtonElement;

      trigger.addEventListener('click', this.handleClick);
    }

    this.headerEls = Array.from(
      root.querySelectorAll('.accordion-group__trigger')
    );

    return;
  }
}

export default AccordionGroup;
