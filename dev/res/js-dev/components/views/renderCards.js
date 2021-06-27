let section;

function findElements() {
  section = document.querySelector('.cards');
}

function createWrap(holder, tagClass, tagName, elementValue) {
  const tag = tagName;
  const newTag = document.createElement(tag);
  holder.appendChild(newTag);
  newTag.className = tagClass;
  newTag.textContent = elementValue;
}

function createImage(holder, tagClass, tagName, link) {
  const tag = tagName;
  const newTag = document.createElement(tag);
  const image = document.createElement('img');
  image.setAttribute('src', link);
  newTag.appendChild(image);
  image.classList.add('cardImage');
  holder.appendChild(newTag);
  newTag.className = tagClass;
}

function createButton(holder, tagClass, tagName, buttonValue) {
  const tag = tagName;
  const newTag = document.createElement(tag);
  holder.appendChild(newTag);
  newTag.className = tagClass;
  newTag.setAttribute('type', 'button');
  newTag.textContent = buttonValue;
}

function renderCard(data) {
  const card = document.createElement('article');
  card.className = 'card';
  createWrap(card, 'cardName', 'h2', data.name);
  createImage(card, 'cardImageHolder', 'div', data.image_url);
  createWrap(card, 'cardType', 'div', data.type);
  createWrap(card, 'cardSex', 'div', data.gender);
  createButton(card, 'cancelButton', 'button', 'Отклонить');
  createButton(card, 'acceptButton', 'button', 'Принять');
  createWrap(card, 'cardOpen', 'div');
  section.appendChild(card);
  card.setAttribute('value', '0');
  card.dataset.id = data.id;
  if (data.in_reserve) {
    card.classList.add('national');
  }
}

function renderCards(data) {
  const bearInfo = data.results.data;
  bearInfo.forEach(renderCard);
}

export default function init(data) {
  findElements();
  renderCards(data);
}
