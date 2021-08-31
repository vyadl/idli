import store from '@/store/index';
import { shuffleArray } from '@/utils/utils';

export const initHotkeys = function initHotkeys() {
  document.addEventListener('keyup', event => {
    const key = event.code;

    if (!event.target.closest('input[type=text]') && !event.target.closest('textarea')) {
      createNewItem(key);
      switchEdittingItemBack(key);
      createNewList(key);
      updateCurrentList(key);
      randomizeList(key);
      switchFocusMode(key);
      exitFocusMode(key);
      switchSidebarMode(key);
    }
  });
};

function switchEdittingItemBack(key) {
  if ((key === 'ArrowUp' || key === 'ArrowDown')
    && store.getters.edittingItemObj
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

function createNewItem(key) {
  if (key === 'KeyI') {
    store.getters.isItemFormInSidebar
      ? store.dispatch('_openSidebar', 'item')
      : store.dispatch('_setModalName', 'itemModal');
  }
}

function createNewList(key) {
  if (key === 'KeyL') {
    store.dispatch('_setModalName', 'listModal');
  }
}

function updateCurrentList(key) {
  if (key === 'KeyE' && store.getters.currentListObj) {
    store.dispatch('_setListForEditting', store.getters.currentListObj);
    store.dispatch('_setModalName', 'listModal');
  }
}

function randomizeList(key) {
  if (key === 'KeyR' && store.getters.sorting === 'shuffled') {
    store.dispatch('_setShuffledList', shuffleArray(store.getters.filteredList));
    store.dispatch('_switchShuffleTrigger');
  }
}

function switchFocusMode(key) {
  if (key === 'KeyF') {
    store.dispatch('_switchFocusMode');
  }
}

function exitFocusMode(key) {
  if (key === 'Escape' && store.getters.isFocusOnList) {
    store.dispatch('_switchFocusMode');
  }
}

function switchSidebarMode(key) {
  if (key === 'KeyS') {
    store.getters.isSidebarOpen
      ? store.dispatch('_closeSidebar')
      : store.dispatch('_openSidebar', store.getters.sidebarMode || 'lists');
  }
}
