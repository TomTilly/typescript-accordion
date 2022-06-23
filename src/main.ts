import AccordionGroup from './components/AccordionGroup';

const accordions = [
  {
    header: 'Header 1',
    panel: '<h1>Test</h1>',
  },
  {
    header: 'Header 2',
    panel: '<h1>Test 2</h1>',
  },
  {
    header: 'Header 3',
    panel: '<h1>Test 3</h1>',
  },
];

const accordionGroupRoot = document.getElementById('tilly-accordion');
const accordionGroupRoot2 = document.getElementById('tilly-accordion-2');

if (!accordionGroupRoot) throw new Error('Cannot find accordion root element');
if (!accordionGroupRoot2) throw new Error('Cannot find accordion root element');

new AccordionGroup(accordionGroupRoot, accordions);
new AccordionGroup(accordionGroupRoot2, accordions, { multipleExpanded: true });
