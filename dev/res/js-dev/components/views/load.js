/* global Promise */

const CACHE = {};

export default function load(url) {
  if (CACHE[url]) return Promise.resolve(CACHE[url]);
  return fetch(url)
    .then(response => response.json())
    .then((data) => {
      CACHE[url] = data;
      return data;
    });
}
