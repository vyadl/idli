<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import ItemView from '@/components/item/ItemView.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    ModalBasic,
    ItemForm,
    ItemView,
  },
  computed: {
    ...mapGetters('lists', [
      'isOwnerView',
    ]),
    ...mapGetters('items', [
      'currentItemObj',
    ]),
  },
  methods: {
    ...mapMutations('items', [
      'setCurrentItemObj',
    ]),
  },
};
</script>

<template>
  <ModalBasic
    class="item-modal"
    name="itemModal"
    :width="isOwnerView ? 500 : 400"
  >
    <ItemForm v-if="isOwnerView" />
    <ItemView
      v-else
      :item="currentItemObj"
      @finish-view="setCurrentItemObj(null)"
    />
  </ModalBasic>
</template>
