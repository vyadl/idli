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
    position: {
      type: String,
      default: 'left',
      validator(value) {
        return value
          ? ['right',
            'left',
            'lower-left',
            'upper-right',
            'upper-center',
            'lower-center']
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
        @click="option.method"
      />
    </PopupBox>
  </div>
</template>

<style lang="scss">
  .dropdown-menu {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-top: 10px;
  }
</style>
