/* global Promise */
/* eslint prefer-destructuring: 'off' */

import * as resize from 'utilities/resize';

function createClassName(className) {
  return className ? ` ${className}` : '';
}

function createBaseHTML(value, className, width) {
  return `
    <div class="js-selectHolder${createClassName(className)}" style="width: ${width}px;">
      <button class="js-selectToggle" type="button">${value}</button>
      <div class="js-selectOptions"></div>
    </div>
  `;
}

function insertBase(select, className) {
  const { options, offsetWidth } = select;
  const selectedIndex = select.selectedIndex >= 0 ? select.selectedIndex : 0;
  const value = options[selectedIndex].textContent;
  const html = createBaseHTML(value, className, offsetWidth);
  select.insertAdjacentHTML('afterend', html);
}

function hideNode(instance) {
  const { node, select } = instance;
  node.appendChild(select);
  select.classList.add('js-select-is-hidden');
}

function wrapSelect(object) {
  const instance = object;
  const { select, className } = instance;
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      insertBase(select, className);
      instance.node = select.nextElementSibling;
      hideNode(instance);
      resolve(instance);
    });
  });
}

function unsubscribeDocument(instance) {
  const { hideDropdown } = instance;
  document.removeEventListener('click', hideDropdown);
  document.removeEventListener('touchstart', hideDropdown);
}

function subscribeDocument(instance) {
  const { hideDropdown } = instance;
  document.addEventListener('click', hideDropdown);
  document.addEventListener('touchstart', hideDropdown);
}

function hideOptions(object) {
  const instance = object;
  const { node } = instance;
  instance.isActive = false;
  node.classList.remove('js-selectHolder-is-active');
  node.classList.add('js-selectHolder-is-inactive');
  unsubscribeDocument(instance);
}

function showOptions(object) {
  const instance = object;
  const { node } = instance;
  instance.isActive = true;
  node.classList.remove('js-selectHolder-is-inactive');
  node.classList.add('js-selectHolder-is-active');
  subscribeDocument(instance);
}

function toggleOptions(instance) {
  if (instance.isActive) hideOptions(instance);
  else showOptions(instance);
}

function findElements(object) {
  const instance = object;
  const { node, select } = instance;
  instance.toggle = node.children[0];
  instance.holder = node.children[1];
  instance.isActive = false;
  instance.options = select.options;
  instance.active = select.selectedIndex >= 0 ? select.selectedIndex : 0;
  return instance;
}

function reinitElements(object, index) {
  const instance = object;
  const { select } = instance;
  instance.active = index;
  select.selectedIndex = instance.active;
  instance.options = select.options;
  instance.toggle.textContent = instance.options[instance.active].textContent;
}

function onNodeClick(event) {
  event.stopPropagation();
}

function initEvents(object) {
  const instance = object;
  const { node, toggle } = instance;
  const showDropdown = (event) => {
    if (event) event.preventDefault();
    showOptions(instance);
  };
  const hideDropdown = (event) => {
    if (event) event.preventDefault();
    hideOptions(instance);
  };
  const toggleDropdown = (event) => {
    if (event) event.preventDefault();
    toggleOptions(instance);
  };
  instance.showDropdown = showDropdown;
  instance.hideDropdown = hideDropdown;
  instance.toggleDropdown = toggleDropdown;
  toggle.addEventListener('click', toggleDropdown);
  node.addEventListener('click', onNodeClick);
  node.addEventListener('touchstart', onNodeClick);
  return instance;
}

function restartSelect(instance, index) {
  reinitElements(instance, index);
  instance.render(instance);
}

function resizeSelect(measures, instance) {
  const { parentElement: holder } = instance.toggle;
  if (holder) {
    holder.style.width = `${instance.select.offsetWidth}px`;
  }
}

export default function init({ select, className, render, selected }) {
  const { dataset } = select;
  const instance = {
    select,
    className,
    render,
    dataset,
    active: selected || 0,
  };

  function onResize() {
    resize.add((measures) => { resizeSelect(measures, instance); }, false);
    return instance;
  }

  instance.restart = index => restartSelect(instance, index);
  return wrapSelect(instance)
    .then(findElements)
    .then(onResize)
    .then(initEvents)
    .then(render)
    .then(() => instance);
}
