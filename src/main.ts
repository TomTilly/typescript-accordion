import AccordionGroup from './components/AccordionGroup';

const accordions = [
  {
    header: 'Header 1',
    panel: '<p>Test</p>',
  },
  {
    header: 'Header 2',
    panel: '<p>Test 2</p>',
  },
  {
    header: 'Header 3',
    panel: '<p>Test 3</p>',
  },
];

// const accordionGroupRoot = document.getElementById('tilly-accordion');
const accordionGroupRoot2 = document.getElementById('tilly-accordion-2');

// if (!accordionGroupRoot) throw new Error('Cannot find accordion root element');
if (!accordionGroupRoot2) throw new Error('Cannot find accordion root element');

// new AccordionGroup(accordionGroupRoot, accordions);
new AccordionGroup(accordionGroupRoot2, accordions, {
  multipleExpanded: true,
});
