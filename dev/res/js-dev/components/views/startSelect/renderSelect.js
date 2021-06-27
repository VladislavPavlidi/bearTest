import select from 'select/select';
import { manageFilter } from 'views/filter';

let selectElement;
let optionActive;
let optionsList;
let optionValue;
let hideOptionsDropdown;

function isOption(target) {
  return target.classList.contains('bearOption') && !target.classList.contains('bearOption-is-active');
}

function shouldDropdown(target) {
  return target.classList.contains('bearOption');
}

function pickOption(index) {
  selectElement.selectedIndex = index;
  optionActive.classList.remove('bearOption-is-active');
  optionActive = optionsList[index];
  optionActive.classList.add('bearOption-is-active');
  optionValue.textContent = optionActive.textContent;
  manageFilter(index);
}

function onOptionsClick(event) {
  event.preventDefault();
  const { target } = event;
  if (isOption(target)) pickOption(target.dataset.index);
  if (shouldDropdown(target)) hideOptionsDropdown();
}

function initOptionEvents(node) {
  node.addEventListener('click', onOptionsClick);
}

function renderSelectDateActiveClass(index, active) {
  if (index !== active) return '';
  return ' bearOption-is-active';
}

function renderOption(html, option, index, active) {
  return `
    ${html}
    <button class="bearOption${renderSelectDateActiveClass(index, active)}" type="button" data-index="${index}">${option.textContent}</button>
  `;
}

function renderOptions(options, active) {
  return [].slice.call(options).reduce((html, option, index) => renderOption(html, option, index, active), '');
}

function renderSelect({ options, active, toggle, holder: node, hideDropdown }) {
  const html = renderOptions(options, active);
  const optionsHolder = node;
  optionsHolder.innerHTML = html;
  optionValue = toggle;
  hideOptionsDropdown = hideDropdown;
  optionsList = [].slice.call(optionsHolder.children);
  optionActive = optionsList[active];
  initOptionEvents(optionsHolder);
}

export default function init(element, className) {
  selectElement = element;
  select({ select: selectElement, className, render: renderSelect, selected: selectElement.selectedIndex });
}
