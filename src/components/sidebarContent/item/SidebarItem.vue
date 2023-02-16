<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import ItemView from '@/components/item/ItemView.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SectionCard,
    ItemForm,
    ItemView,
    InfoMessage,
    ButtonText,
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
    ...mapActions('items', [
      '_addNewItemPlaceholder',
    ]),
  },
};
</script>

<template>
  <SectionCard
    v-if="currentItemObj"
    class="sidebar-item"
  >
    <ItemForm v-if="isOwnerView" />
    <ItemView
      v-else
      :item="currentItemObj"
    />
  </SectionCard>
  <div v-else>
    <InfoMessage message="choose item from the list to see it here" />
    <ButtonText
      v-if="isOwnerView"
      text="or add new one"
      style-type="underline"
      @click="_addNewItemPlaceholder"
    />
  </div>
</template>
