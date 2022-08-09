import store from '@/store/index';

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
      && store.getters['auth/isLoggedIn']
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
          switchFocusMode();
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
  store.getters.isItemFormInSidebar
    ? store.dispatch('_openSidebar', 'item')
    : store.dispatch('_setModalNameToShow', 'itemModal');
}

function createNewList() {
  store.dispatch('_setModalNameToShow', 'listModal');
}

function editCurrentList() {
  if (store.getters.currentListObj) {
    store.dispatch('_setListForEditting', store.getters.currentListObj);
    store.dispatch('_setModalNameToShow', 'listModal');
  }
}

function randomizeList() {
  store.dispatch('_setSorting', 'shuffled');
  store.dispatch('_switchShuffleTrigger');
}

function switchFocusMode() {
  store.dispatch('_switchFocusMode');
}

function exitFocusMode() {
  if (store.getters.isFocusOnList) {
    store.dispatch('_switchFocusMode');
  }
}

function switchSidebarMode() {
  store.getters.isSidebarOpen
    ? store.dispatch('_closeSidebar')
    : store.dispatch('_openSidebar', store.getters.sidebarMode || 'lists');
}
