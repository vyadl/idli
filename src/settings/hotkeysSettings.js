import store from '@/store/index';

export const initHotkeys = function initHotkeys() {
  document.addEventListener('keyup', event => {
    const key = event.code;

    if (!event.target.closest('input[type=text]') && !event.target.closest('textarea')) {
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
        case 'Escape':
          exitFocusMode();
          break;
        case 'KeyS':
          switchSidebarMode();
          break;
        default:
      }
    }
  });
};

function createNewItem() {
  store.getters.isItemFormInSidebar
    ? store.dispatch('_openSidebar', 'item')
    : store.dispatch('_setmodalNameToShow', 'itemModal');
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
