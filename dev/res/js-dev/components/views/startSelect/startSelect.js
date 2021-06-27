import renderSelect from 'views/startSelect/renderSelect';

let selectHolder;

function findElements() {
  selectHolder = document.querySelector('.bearSelect');
}

export default function init() {
  findElements();
  renderSelect(selectHolder, 'bearSelectHolder');
}
