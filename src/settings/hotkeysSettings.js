import store from '@/store/index';
import { shuffleArray } from '@/utils/utils';

export const initHotkeys = function initHotkeys() {
  document.addEventListener('keyup', event => {
    const key = event.code;

    if (!event.target.closest('input[type=text]') && !event.target.closest('textarea')) {
      switch (key) {
        case 'KeyI':
          createNewItem();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          switchEdittingItem(key);
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
        case 'Escape':
          exitFocusMode();
          break;
        case 'KeyS':
          switchSidebarMode();
          break;
      }
    }
  });
};

function createNewItem() {
  store.getters.isItemFormInSidebar
    ? store.dispatch('_openSidebar', 'item')
    : store.dispatch('_setmodalNameToShow', 'itemModal');
}

function switchEdittingItem(key) {
  if (store.getters.edittingItemObj
    && store.getters.isItemFormInSidebar
    && !['cloud', 'stars'].includes(store.getters.mode)) {
    const list = store.getters.sorting === 'shuffled'
      ? store.getters.shuffledList
      : store.getters.filteredList;
    const currentItemIndex = list.findIndex(item => item === store.getters.edittingItemObj);

    if (key === 'ArrowUp' && list[currentItemIndex - 1]) {
      store.dispatch('_setItemForEditting', list[currentItemIndex - 1]);
    } else if (key === 'ArrowDown' && list[currentItemIndex + 1]) {
      store.dispatch('_setItemForEditting', list[currentItemIndex + 1]);
    }
  }
}

function createNewList() {
  store.dispatch('_setmodalNameToShow', 'listModal');
}

function editCurrentList() {
  if (store.getters.currentListObj) {
    store.dispatch('_setListForEditting', store.getters.currentListObj);
    store.dispatch('_setmodalNameToShow', 'listModal');
  }
}

function randomizeList() {
  if (store.getters.sorting === 'shuffled') {
    store.dispatch('_setShuffledList', shuffleArray(store.getters.filteredList));
    store.dispatch('_switchShuffleTrigger');
  }
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
