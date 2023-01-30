<script>
import { mapGetters } from 'vuex';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    ButtonText,
    PopupBox,
  },
  computed: {
    ...mapGetters('items', [
      'currentItemObj',
    ]),
  },
  methods: {
    openSingleItemInNewTab() {
      window.open(`${window.location.origin}/item/${this.currentItemObj.id}`, '_blank');
    },
    copySingleItemLink() {
      navigator.clipboard.writeText(`${window.location.origin}/item/${this.currentItemObj.id}`);
    },
  },
};
</script>

<template>
  <div class="dropdown-menu">
    <PopupBox
      button-style-type="dots"
      stop-propagation
      position="left"
      content-type="functional"
    >
      <ButtonText
        text="copy item link"
        style-type="brick"
        size="small"
        @click="copySingleItemLink"
      />
      <ButtonText
        text="open item in new tab"
        style-type="brick"
        size="small"
        @click="openSingleItemInNewTab"
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
