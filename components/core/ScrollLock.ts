let isLocked = false;

function preventScroll(e: Event) {
  if (isLocked) {
    e.preventDefault();
  }
}

export function lockScroll() {
  if (isLocked) return;
  isLocked = true;

  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeyScroll, false);
}

export function unlockScroll() {
  isLocked = false;

  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
  window.removeEventListener('keydown', preventKeyScroll);
}

function preventKeyScroll(e: KeyboardEvent) {
  const keys = [
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    ' ',
  ];

  if (keys.includes(e.key)) {
    e.preventDefault();
  }
}
