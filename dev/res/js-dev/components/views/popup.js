import load from 'views/load';
import sendRequest from 'views/requests';
import { refusedCard, acceptCard } from 'views/filter';

const DATA_URL = 'https://private-9d5e37a-testassignment.apiary-mock.com/get-bears';
const DATA_URL_ACCEPT = 'https://private-9d5e37a-testassignment.apiary-mock.com/resolve-bear';
const DATA_URL_CANCEL = 'https://private-9d5e37a-testassignment.apiary-mock.com/reject-bear';

let popup;
let holder;
let cards;
let popupClose;
let main;
let header;
let footer;
let popupImage;
let popupName;
let popupType;
let popupSex;
let popupInfo;
let cardCancelButtons;
let cardAcceptButtons;
let filter;
let page;
let popupAcceptButton;
let popupCancelButton;
let activeCard;

function findElements() {
  popup = document.querySelector('.popup');
  popupClose = document.querySelector('.popupCloseButton');
  popupImage = document.querySelector('.popupImage');
  popupName = document.querySelector('.popupName');
  popupType = document.querySelector('.popupType');
  popupSex = document.querySelector('.popupSex');
  popupInfo = document.querySelector('.popupInfo');
  holder = document.querySelector('.cards');
  cards = [...holder.querySelectorAll('.cardOpen')];
  main = document.querySelector('.main');
  page = document.body;
  filter = document.querySelector('.filter');
  header = document.querySelector('header');
  footer = document.querySelector('.footer');
  cardCancelButtons = [...holder.querySelectorAll('.cancelButton')];
  cardAcceptButtons = [...holder.querySelectorAll('.acceptButton')];
  popupAcceptButton = document.querySelector('.popupAcceptButton');
  popupCancelButton = document.querySelector('.popupCancelButton');
}

function unBlurBackground() {
  main.style.filter = 'blur(0px)';
  header.style.filter = 'blur(0px)';
  footer.style.filter = 'blur(0px)';
}

function blurBackground() {
  main.style.filter = 'blur(30px)';
  header.style.filter = 'blur(30px)';
  footer.style.filter = 'blur(30px)';
}

function disactivateElement(element) {
  const object = element;
  object.style.pointerEvents = 'none';
}

function disactivateBackgroundElements() {
  cards.forEach(disactivateElement);
  cardCancelButtons.forEach(disactivateElement);
  cardAcceptButtons.forEach(disactivateElement);
  disactivateElement(filter);
}

function activateElement(element) {
  const object = element;
  object.style.pointerEvents = 'auto';
}

function activateElements() {
  cards.forEach(activateElement);
  cardCancelButtons.forEach(activateElement);
  cardAcceptButtons.forEach(activateElement);
  activateElement(filter);
}

function showPopup() {
  popup.classList.add('popup-is-active');
}

function stopScroll() {
  page.classList.add('page-is-stuck');
}

function startScroll() {
  page.classList.remove('page-is-stuck');
}

function onShowPopup() {
  showPopup();
  blurBackground();
  disactivateBackgroundElements();
  stopScroll();
}

function hidePopup() {
  popup.classList.remove('popup-is-active');
}

function restartClasses() {
  if (popup.classList.contains('popup-is-national')) {
    popup.classList.remove('popup-is-national');
  }
  if (popup.classList.contains('popup-is-filtered')) {
    popup.classList.remove('popup-is-filtered');
  }
}

function onClosePopup() {
  hidePopup();
  unBlurBackground();
  activateElements();
  startScroll();
  restartClasses();
}

function onError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function onAcceptSuccess(response) {
  if (response.indexOf('true') >= 0) {
    acceptCard(activeCard);
    onClosePopup();
  } else {
    alert('ошибка запроса');
  }
}

function onCancelSuccess(response) {
  if (response.indexOf('true') >= 0) {
    refusedCard(activeCard);
    onClosePopup();
  } else {
    alert('ошибка запроса');
  }
}

function onAcceptPopup() {
  const targetCard = activeCard.target.offsetParent;
  sendRequest(targetCard, DATA_URL_ACCEPT)
    .then(onAcceptSuccess)
    .catch(onError);
}

function onCancelPopup() {
  const targetCard = activeCard.target.offsetParent;
  sendRequest(targetCard, DATA_URL_CANCEL)
    .then(onCancelSuccess)
    .catch(onError);
}

function updatePopupInfo(data, target) {
  const targetId = parseInt(target.target.offsetParent.dataset.id, 10);
  const targetInfo = data.results.data[targetId - 1];
  const choosenCard = target.target.offsetParent;
  if (choosenCard.classList.contains('national')) {
    popup.classList.add('popup-is-national');
  }
  if (choosenCard.classList.contains('card-is-filtered')) {
    popup.classList.add('popup-is-filtered');
  }
  popupName.textContent = targetInfo.name;
  popupType.textContent = targetInfo.type;
  popupSex.textContent = targetInfo.gender;
  if (targetInfo.text) {
    popupInfo.textContent = targetInfo.text;
  } else {
    popupInfo.textContent = 'Информация отсутствует.';
  }
  popupImage.setAttribute('src', targetInfo.image_url);
}

function interactWithPopup(data, target) {
  activeCard = target;
  updatePopupInfo(data, target);
}

function onClickCard(event) {
  onShowPopup();
  load(DATA_URL)
    .then((data) => { interactWithPopup(data, event); });
}

function subscribeCard(card) {
  card.addEventListener('click', onClickCard);
}

function subscribe() {
  cards.forEach(subscribeCard);
  popupClose.addEventListener('click', onClosePopup);
  popupAcceptButton.addEventListener('click', onAcceptPopup);
  popupCancelButton.addEventListener('click', onCancelPopup);
}

export default function init() {
  findElements();
  subscribe();
}
