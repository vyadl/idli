<script>
import { mapGetters, mapActions } from 'vuex';
import ToggleSwitch from '@/components/formElements/ToggleSwitch.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';

export default {
  components: {
    ToggleSwitch,
    PopupBox,
  },
  props: {
    hintPosition: {
      type: String,
      default: 'right',
      validator(value) {
        return value
          ? ['right', 'lower-left', 'upper-right', 'upper-center', 'lower-center'].includes(value)
          : true;
      },
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    title: String,
  },
  computed: {
    ...mapGetters([
      'isDraggableMode',
    ]),
  },
  methods: {
    ...mapActions([
      '_toggleDraggableMode',
    ]),
  },
};
</script>

<template>
  <div class="draggable-switch">
    <ToggleSwitch
      :is-checked="isDraggableMode"
      :title="title"
      :stop-propagation="stopPropagation"
      @change="_toggleDraggableMode"
    />
    <PopupBox
      button-style-type="hint"
      :stop-propagation="stopPropagation"
      :position="hintPosition"
    >
      <span>
        Entering this mode, you will be able to sort your list manually by 
        dragging and dropping items in the order you like. 
        Note: all your filters and visualization will be reset.
      </span>
    </PopupBox>
  </div>
</template>

<style lang="scss">
.draggable-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
