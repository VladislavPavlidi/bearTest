/* global Promise */

import sendRequest from 'views/requests';

const DATA_URL_ACCEPT = 'https://private-9d5e37a-testassignment.apiary-mock.com/resolve-bear';
const DATA_URL_CANCEL = 'https://private-9d5e37a-testassignment.apiary-mock.com/reject-bear';

let select;
let cards;
let cancelButtons;
let acceptButtons;
let holder;
let label;
let option;
let activeCard;

function findElements() {
  holder = document.querySelector('.cards');
  select = document.querySelector('.bearSelect');
  cards = [...holder.querySelectorAll('.card')];
  label = document.querySelector('.label');
  option = [...document.querySelectorAll('.bearOption')];
  cancelButtons = [...holder.querySelectorAll('.cancelButton')];
  acceptButtons = [...holder.querySelectorAll('.acceptButton')];
}

function showCard(card) {
  if (card.classList.contains('card-is-hidden')) {
    card.classList.remove('card-is-hidden');
  }
  if (!(card.classList.contains('card-is-active'))) {
    card.classList.add('card-is-active');
  }
}

function hideCard(card) {
  if (card.classList.contains('card-is-active')) {
    card.classList.remove('card-is-active');
  }
  if (!card.classList.contains('card-is-hidden')) {
    card.classList.add('card-is-hidden');
  }
}

function filterCard(card, key) {
  const cardValue = card.getAttribute('value');
  if (cardValue === key) {
    showCard(card);
  } else {
    hideCard(card);
  }
}

function filterNational(card) {
  if (!(card.classList.contains('card-is-hidden')) && card.classList.contains('national')) {
    showCard(card);
  } else {
    hideCard(card);
  }
}

function filterCards(key) {
  cards.forEach((card) => { filterCard(card, key); });
}

function onLabelClick() {
  const activeOptionIndex = select.selectedIndex;
  const activeOption = option[activeOptionIndex];
  const selectValue = activeOption.dataset.index;
  const labelValue = label.getAttribute('value');
  if (labelValue === '1') {
    label.setAttribute('value', '0');
    filterCards(selectValue);
  } else if (labelValue === '0') {
    label.setAttribute('value', '1');
    cards.forEach(filterNational);
  } else if (!(label.getAttribute('value'))) {
    label.setAttribute('value', '1');
    cards.forEach(filterNational);
  }
}

export function manageFilter(key) {
  const labelValue = label.getAttribute('value');
  const activeOptionIndex = select.selectedIndex;
  const activeOption = option[activeOptionIndex];
  const selectValue = activeOption.dataset.index;
  if (labelValue === '1') {
    filterCards(selectValue);
    cards.forEach(filterNational);
  } else {
    filterCards(key);
  }
}

export function refusedCard(target) {
  const card = target.target.offsetParent;
  card.setAttribute('value', '2');
  card.classList.add('card-is-filtered');
  hideCard(card);
}

export function acceptCard(target) {
  const card = target.target.offsetParent;
  card.setAttribute('value', '1');
  card.classList.add('card-is-filtered');
  hideCard(card);
}

function onAcceptSuccess() {
  acceptCard(activeCard);
}

function onCancelSuccess(response) {
  if (response.indexOf('true') >= 0) {
    refusedCard(activeCard);
  } else {
    // eslint-disable-next-line no-alert
    alert('ошибка запроса');
  }
}

function onError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function onCancelButton(target) {
  const targetCard = target.target.offsetParent;
  activeCard = target;
  sendRequest(targetCard, DATA_URL_CANCEL)
    .then(onCancelSuccess)
    .catch(onError);
}

function onAcceptCard(target) {
  const targetCard = target.target.offsetParent;
  activeCard = target;
  sendRequest(targetCard, DATA_URL_ACCEPT)
    .then(onAcceptSuccess)
    .catch(onError);
}

function onSelectChange(event) {
  manageFilter(event.target.value);
}

function subscribeAcceptButton(button) {
  button.addEventListener('click', onAcceptCard);
}

function subscribeCancelButton(button) {
  button.addEventListener('click', onCancelButton);
}

function subsribe() {
  select.addEventListener('change', onSelectChange);
  label.addEventListener('click', onLabelClick);
  cancelButtons.forEach(subscribeCancelButton);
  acceptButtons.forEach(subscribeAcceptButton);
}

export default function init() {
  findElements();
  subsribe();
  filterCards('0');
}
