/* global Promise */

import filter from 'views/filter';
import load from 'views/load';
import popup from 'views/popup';
import renderCards from 'views/renderCards';

const DATA_URL = 'https://private-9d5e37a-testassignment.apiary-mock.com/get-bears';

function startCards(data) {
  renderCards(data);
  filter();
  popup();
}

function loadCards() {
  return new Promise((resolve) => {
    load(DATA_URL)
      .then((data) => {
        startCards(data);
      })
      .then(resolve);
  });
}

export default function init() {
  loadCards();
}
