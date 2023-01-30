import { defaultVisualization } from '@/store/config';

export default {
  setSorting(state, sorting) {
    state.visualization.sorting = sorting;
  },
  setMode(state, mode) {
    state.visualization.mode = mode;
  },
  toggleShuffleTrigger(state) {
    state.visualization.shuffleTrigger = !state.visualization.shuffleTrigger;
  },
  setListAlign(state, align) {
    state.visualization.listAlign = align;
  },
  toggleItemDetailsShowingMode(state) {
    state.visualization.areItemDetailsShown = !state.visualization.areItemDetailsShown;
  },
  toggleItemsOrder(state) {
    state.visualization.isItemsOrderReversed = !state.visualization.isItemsOrderReversed;
  },
  resetVisualizationToDefault(state) {
    Object.keys(defaultVisualization).forEach(key => {
      state.visualization[key] = defaultVisualization[key];
    });
  },
};
