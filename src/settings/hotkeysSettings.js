import store from '@/store';
import { router } from '@/router';

const pressedKeys = new Set();

document.addEventListener('keydown', event => {
  pressedKeys.add(event.code);
});

export function initHotkeys() {
  document.addEventListener('keyup', event => {
    const key = event.code;

    if (
      !event.target.closest('input[type=text]')
      && !event.target.closest('textarea')
      && key === 'Escape'
    ) {
      exitFocusMode();
    }

    if (
      !event.target.closest('input[type=text]')
      && !event.target.closest('textarea')
      && store.getters.settings.isUsingHotkeys
      && pressedKeys.size === 1
    ) {
      switch (key) {
        case 'KeyI':
          createNewItem();
          break;
        case 'KeyL':
          createNewList();
          break;
        case 'KeyE':
          editCurrentList();
          break;
        case 'KeyR':
          randomizeList();
          break;
        case 'KeyF':
          toggleFocusMode();
          break;
        case 'KeyS':
          switchSidebarMode();
          break;
        default:
      }
    }

    pressedKeys.delete(key);
  });
}

function createNewItem() {
  if (store.getters.isUserOwnsCurrentList) {
    store.getters.isItemFormInSidebar
      ? store.dispatch('_openSidebar', 'item')
      : store.dispatch('_setModalNameToShow', 'itemModal');
  }
}

function createNewList() {
  if (store.getters['auth/isLoggedIn']) {
    store.dispatch('_setModalNameToShow', 'listModal');
  }
}

function editCurrentList() {
  if (store.getters.currentListObj && store.getters.isUserOwnsCurrentList) {
    store.dispatch('_setListForEditting', store.getters.currentListObj);
    store.dispatch('_setModalNameToShow', 'listModal');
  }
}

function randomizeList() {
  if (router.currentRoute._value.name === 'list') {
    store.dispatch('_setSorting', 'shuffled');
    store.dispatch('_toggleShuffleTrigger');
  }
}

function toggleFocusMode() {
  store.dispatch('_toggleFocusMode');
}

function exitFocusMode() {
  if (store.getters.isFocusOnList) {
    store.dispatch('_toggleFocusMode');
  }
}

function switchSidebarMode() {
  let mode = ''; 
  
  if (store.getters['auth/isLoggedIn']) {
    mode = store.getters.sidebarMode || 'lists';
  } else {
    mode = router.currentRoute._value.name === 'auth' ? 'sign in' : 'settings';
  }
 
  store.getters.isSidebarOpen
    ? store.dispatch('_closeSidebar')
    : store.dispatch('_openSidebar', mode);
}
