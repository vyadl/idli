<script>
import PopupBox from '@/components/wrappers/PopupBox.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    ButtonText,
    PopupBox,
  },
  props: {
    options: Array,
    buttonSize: String,
    position: {
      type: String,
      default: 'right',
      validator(value) {
        return value
          ? [
            'right',
            'left',
            'lower-left',
            'upper-right',
            'upper-center',
            'lower-center',
          ]
            .includes(value)
          : true;
      },
    },
  },
};
</script>

<template>
  <div class="dropdown-menu">
    <PopupBox
      button-style-type="dots"
      :button-size="buttonSize"
      stop-propagation
      :position="position"
      content-type="functional"
    >
      <ButtonText
        v-for="option in options"
        :key="option.name"
        :text="option.name"
        style-type="brick"
        size="small"
        stop-propagation
        @click="option.method"
      />
    </PopupBox>
  </div>
</template>
