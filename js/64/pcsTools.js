function getElement(selector) {
  return document.querySelector(selector);
}

function setCss(element, property, value) {
  element.style[property] = value;
}

function getCss(element, property) {
  if (!element) return undefined;
  return getComputedStyle(element)[property];
}

function on(element, eventType, callback) {
  if (!element) return;
  element.addEventListener(eventType, callback);
}

function click(element, callback) {
  on(element, 'click', callback);
}

function hide(element) {
  if (!element) return;
  element.style.display = 'none';
}

function show(element) {
  if (!element) return;
  element.style.display = 'inline-block';
}

function sparkle(element, duration = 3000, speed = 250) {
  if (!element) return;
  const colors = ['red', 'blue', 'green', 'yellow'];
  let i = 0;

  const interval = setInterval(() => {
    element.style.color = colors[i % colors.length];
    i++;
  }, speed);

  setTimeout(() => {
    clearInterval(interval);
    element.style.color = ''; // restore default
  }, duration);
}

export default function (selector) {
  const element = getElement(selector);

  return {
    css: function (property, value) {
      if (arguments.length < 2) {
        return getCss(element, property);
      } else {
        setCss(element, property, value);
      }
    },
    on: (eventType, callback) => on(element, eventType, callback),
    click: (callback) => click(element, callback),
    hide: () => hide(element),
    show: () => show(element),
    sparkle: (duration, speed) => sparkle(element, duration, speed)
  };
}