const PHONE_THRESHOLD = 720;
const NARROW_THRESHOLD = 768;
const AVERAGE_THRESHOLD = 980;
const WIDE_THRESHOLD = 1700;

const tasks = [];

const measurements = {};
const cached = {};

let prev;

let content;
let measurer;

let animationWindowFrame;

function shouldRun() {
  return Object.keys(measurements).some(key => measurements[key] !== cached[key]);
}

function cacheWindow() {
  cached.width = measurements.width;
  cached.innerWidth = measurements.innerWidth;
  cached.innerHeight = measurements.innerHeight;
  cached.height = measurements.height;
  cached.ratio = measurements.ratio;
  cached.scroll = measurements.scroll;
  cached.isPhone = measurements.isPhone;
  cached.isNarrow = measurements.isNarrow;
  cached.isAverage = measurements.isAverage;
  cached.isWide = measurements.isWide;
  cached.isWindowResized = measurements.isWindowResized;
}

function cachePage() {
  cached.page = measurements.page;
}

function cache() {
  cacheWindow();
  cachePage();
}

function measureWindow() {
  const { innerWidth, innerHeight } = window;
  const { clientWidth, clientHeight } = document.body;
  measurements.width = clientWidth;
  measurements.height = innerHeight;
  measurements.pageHeight = clientHeight;
  measurements.innerWidth = innerWidth;
  measurements.innerHeight = innerHeight;
  measurements.ratio = innerWidth / innerHeight;
  measurements.scroll = innerWidth - content.clientWidth;
  measurements.isPhone = innerWidth <= PHONE_THRESHOLD;
  measurements.isNarrow = innerWidth <= NARROW_THRESHOLD;
  measurements.isAverage = innerWidth >= NARROW_THRESHOLD && innerWidth < AVERAGE_THRESHOLD;
  measurements.isWide = !measurements.isAverage && innerWidth >= WIDE_THRESHOLD;
  measurements.isWindowResized = prev.width !== measurements.width || prev.height !== measurements.height;
}

function measurePage() {
  measurements.page = measurer.clientHeight;
}

function savePrev() {
  prev = { ...measurements };
}

function updateScrollVariable() {
  content.style.setProperty('--scrollbar-width', `${measurements.scroll}px`);
}

function measure() {
  savePrev();
  measureWindow();
  updateScrollVariable();
  measurePage();
}

function findMeasurer() {
  measurer = content.querySelector('.measurer');
}

function findElements() {
  content = document.body;
  findMeasurer();
}

function runTask(task) {
  if (measurements) task(measurements);
}

function runTasks() {
  tasks.forEach(runTask);
}

function goWindow() {
  measure();
  if (shouldRun()) {
    runTasks();
    cache();
  }
}

function onWindowResize() {
  if (tasks.length) {
    cancelAnimationFrame(animationWindowFrame);
    animationWindowFrame = requestAnimationFrame(goWindow);
  }
}

function onMessage(event) {
  if (event.data === 'resize') onWindowResize();
}

function susbscribe() {
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('message', onMessage);
}

export function reset() {
  findMeasurer();
  measurePage();
}

export function request() {
  console.log('im hre');
  return measurements;
}

export function requestPrev() {
  return prev;
}

export function add(task, shouldRunStart = true) {
  tasks.push(task);
  if (shouldRunStart) runTask(task);
}

export function remove(task) {
  const index = tasks.indexOf(task);
  if (index >= 0) tasks.splice(index, 1);
}

export function initResize() {
  findElements();
  susbscribe();
  measure();
  savePrev();
  cache();
  if (measurements.isNarrow) {
    [...document.querySelectorAll('animate')].forEach((item) => {
      item.remove();
    });
  }
}
