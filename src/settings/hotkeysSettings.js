import store from '@/store';
import { sidebarModesForViews } from '@/store/config';
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
      !event.target.closest('input')
      && !event.target.closest('textarea')
      && store.getters['settings/isUsingHotkeys']
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
  if (store.getters['lists/isUserOwnsCurrentList']) {
    store.dispatch('items/_addNewItemPlaceholder');

    store.getters['settings/isItemFormInSidebar']
      ? store.dispatch('sidebar/_openSidebar', 'item')
      : store.commit('setModalNameToShow', 'itemModal');
  }
}

function createNewList() {
  if (store.getters['auth/isLoggedIn']) {
    store.commit('setModalNameToShow', 'listModal');
  }
}

function editCurrentList() {
  const currentListObj = store.getters['lists/currentListObj'];
  const isUserOwnsCurrentList = store.getters['lists/isUserOwnsCurrentList'];

  if (currentListObj && isUserOwnsCurrentList) {
    store.dispatch('lists/_setListForEditting', currentListObj);
    store.commit('setModalNameToShow', 'listModal');
  }
}

function randomizeList() {
  if (router.currentRoute._value.name === 'list') {
    store.dispatch('visualization/_setSorting', 'shuffled');
    store.commit('visualization/toggleShuffleTrigger');
  }
}

function toggleFocusMode() {
  store.dispatch('settings/_toggleFocusMode');
}

function exitFocusMode() {
  if (store.getters['settings/isFocusOnList']) {
    store.dispatch('settings/_toggleFocusMode');
  }
}

function switchSidebarMode() {
  let mode = ''; 
  
  if (store.getters['auth/isLoggedIn']) {
    mode = store.getters['sidebar/sidebarMode'] || sidebarModesForViews.loggedInView.default;
  } else {
    mode = sidebarModesForViews.listPublicView.default;
  }
 
  store.getters['sidebar/isSidebarOpen']
    ? store.dispatch('sidebar/_closeSidebar')
    : store.dispatch('sidebar/_openSidebar', mode);
}
