// import AccordionGroup from './components/AccordionGroup';
import Accordion, { AccordionModelParam } from './components/Accordion';
import AccordionGroup from './components/AccordionGroup';

const accordions: AccordionModelParam[] = [
  {
    heading: {
      level: 'h3',
      textContent: 'Accordion 1',
    },
    panel: '<p>Test</p>',
    open: false,
  },
  {
    heading: {
      level: 'h3',
      textContent: 'Accordion 2',
    },
    panel: '<p>Test 2</p>',
    open: true,
  },
  {
    heading: {
      level: 'h3',
      textContent: 'Accordion 3',
    },
    panel: '<p>Test 3</p>',
    open: false,
  },
];

// accordions.forEach(a => new Accordion(a, ))

const accordionGroupRoot = document.getElementById('tilly-accordion');
// const accordionGroupRoot2 = document.getElementById('tilly-accordion-2');

if (!accordionGroupRoot) throw new Error('Cannot find accordion root element');
// if (!accordionGroupRoot2) throw new Error('Cannot find accordion root element');

// console.log(new Accordion(accordions[0], accordionGroupRoot));
new AccordionGroup(accordionGroupRoot, accordions);

// new AccordionGroup(accordionGroupRoot, accordions);
// new AccordionGroup(accordionGroupRoot2, accordions, {
//   multipleExpanded: true,
// });
