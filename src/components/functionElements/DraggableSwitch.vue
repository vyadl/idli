<script>
import { mapGetters, mapActions } from 'vuex';
import ToggleSwitch from '@/components/formElements/ToggleSwitch.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';

export default {
  components: {
    ToggleSwitch,
    PopupBox,
    CheckboxCustom,
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
    styleType: {
      type: String,
      validator(value) {
        return value
          ? ['checkbox'].includes(value)
          : true;
      },
    },
    size: {
      type: String,
      validator(value) {
        return value
          ? ['small'].includes(value)
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
  <div
    class="draggable-switch"
    :class="styleType"
  >
    <CheckboxCustom
      v-if="styleType === 'checkbox'"
      :label="title"
      style-type="initial"
      :size="size"
      :model-value="isDraggableMode"
      @update:model-value="_toggleDraggableMode"
    />
    <ToggleSwitch
      v-else
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
  width: fit-content;
  background-color: map-get($colors, 'white');

  &.checkbox {
    align-items: flex-start;
    padding-top: 5px;
  }

  &.inverted-theme {
    background-color: map-get($colors, 'black');
  }
}
</style>
