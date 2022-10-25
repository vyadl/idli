export default {
  visualization: state => state.visualization,
  sorting: state => state.visualization.sorting,
  mode: state => state.visualization.mode,
  shuffleTrigger: state => state.visualization.shuffleTrigger,
  listAlign: state => state.visualization.listAlign,
  areItemDetailsShown: state => state.visualization.areItemDetailsShown,
  isItemsOrderReversed: state => state.visualization.isItemsOrderReversed,
};
