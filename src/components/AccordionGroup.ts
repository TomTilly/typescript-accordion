import animate from '../utilities/animate';
import './AccordionGroup.scss';

const ANIMATION_SPEED = 200; // milliseconds

interface Accordion {
  header: string;
  panel: string;
}

interface AccordionGroupState {
  isAnimating: boolean;
  activePanels: number[]; // uses index of panels,
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
  value?: string;
}

function setAttributes(el: Element, attributes: Attribute[]) {
  for (const attr of attributes) {
    el.setAttribute(attr.name, attr.value ?? '');
  }
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
  private triggers: { id: number; el: HTMLElement }[] = [];
  private panels: { id: number; el: HTMLElement }[] = [];
  private prevActive: number[] = [];

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
    this.accordions = accordions;
    this.state = {
      isAnimating: false,
      activePanels: this.options.defaultOpen,
    };

    this.initView();
  }

  private render(): void {
    const { activePanels } = this.state;

    const panelsToClose: number[] = this.getPanelsToClose(
      activePanels,
      this.prevActive
    );
    const panelsToOpen: number[] = this.getPanelsToOpen(
      activePanels,
      this.prevActive
    );

    console.log({ panelsToClose, panelsToOpen });
    panelsToClose.forEach((id) => {
      const panel = this.panels.find((panel) => panel.id === id)?.el;
      const trigger = this.triggers.find((header) => header.id === id)?.el;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      else throw new Error("Couldn't find trigger");

      if (panel) {
        this.animatePanel(panel, false).catch((error) => console.log(error));
        panel.classList.add('accordion-group__panel--hide');
      } else throw new Error("Couldn't find panel to close");
    });
    panelsToOpen.forEach((id) => {
      const panel = this.panels.find((panel) => panel.id === id)?.el;
      const trigger = this.triggers.find((header) => header.id === id)?.el;
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      else throw new Error("Couldn't find trigger");

      if (panel) {
        this.animatePanel(panel, true).catch((error) => console.log(error));
        panel.classList.remove('accordion-group__panel--hide');
      } else throw new Error("Couldn't find panel to open");
    });
  }

  private async animatePanel(
    panel: HTMLElement,
    shouldOpen: boolean
  ): Promise<void> {
    const fullHeight = panel.scrollHeight;

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
      panel.style.height = `${newHeight}px`;
      panel.style.opacity = `${newOpacity}`;
    }, ANIMATION_SPEED);
    this.state.isAnimating = true;
    if (shouldOpen) {
      panel.style.height = 'auto';
    }
  }

  /**
   * Returns ids (indexes) of panels to close
   */
  private getPanelsToClose(active: number[], prevActive: number[]): number[] {
    // Find numbers that are in prevActive, but not activePanels
    return prevActive.filter((panel) => {
      return !active.includes(panel);
    });
  }

  /**
   * Returns ids (indexes) of panels to open
   */
  private getPanelsToOpen(active: number[], prevActive: number[]): number[] {
    // Find numbers that are in activePanels, but not prevActive
    return active.filter((panel) => {
      return !prevActive.includes(panel);
    });
  }

  private setActivePanels(panelIndex: number) {
    const { preventAllCollapsed, multipleExpanded } = this.options;
    const { activePanels } = this.state;
    this.prevActive = this.state.activePanels;

    // If id is part of activePanels...
    if (activePanels.includes(panelIndex)) {
      // If id is only element of activePanels...
      if (activePanels.length === 1) {
        // Don't remove panelIndex from activePanels if preventAllCollapsed is true
        if (preventAllCollapsed) return;
        // Otherwise, remove it
        this.state.activePanels = [];
      } else {
        // If index isn't only element of activePanels, remove it
        this.state.activePanels = activePanels.filter(
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
    console.log(this.prevActive, this.state.activePanels);
  }

  private handleClick(triggerIndex: number): void {
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
            value: `accordion-group__trigger`,
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
        const button = document.createElement('button');
        setAttributes(button, headerAttributes);
        button.textContent = item.header;
        header.appendChild(button);
        this.triggers.push({ id: i, el: button });

        // ======
        // Create Panel element
        // ======
        const panel = document.createElement('div');
        const classNameArray = ['accordion-group__panel'];
        if (!activePanels.includes(i))
          classNameArray.push('accordion-group__panel--hide');
        const className = classNameArray.join(' ');
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
            value: className,
          },
        ];

        setAttributes(panel, panelAttributes);

        // Create inner container for Panel
        const innerContainer = document.createElement('div');
        innerContainer.className = 'accordion-group__panel-inner';
        innerContainer.innerHTML = item.panel;
        panel.appendChild(innerContainer);
        this.panels.push({ id: i, el: panel });

        return [header, panel];
      }
    );

    for (const [i, els] of accordionEls.entries()) {
      const [header, panel] = els;
      root.appendChild(header);
      root.appendChild(panel);

      const trigger = header.firstElementChild;
      if (trigger instanceof HTMLButtonElement) {
        trigger.addEventListener('click', () => this.handleClick(i));
      } else {
        throw new Error('Panel trigger should be a button.');
      }
    }
    return;
  }
}

export default AccordionGroup;
