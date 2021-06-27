export function onError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

export default function sendRequest(target, url) {
  return fetch(url, { method: 'POST', body: target.dataset.id })
    .then(results => results.text());
}
