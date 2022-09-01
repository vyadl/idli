<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SidebarCard,
    ItemForm,
    InfoMessage,
    ButtonText,
  },
  computed: {
    ...mapGetters([
      'edittingItemObj',
    ]),
  },
  methods: {
    ...mapActions([
      '_addNewItemPlaceholder',
    ]),
  },
};
</script>

<template>
  <SidebarCard
    v-if="edittingItemObj"
    class="sidebar-item"
    :title="edittingItemObj.id ? 'edit item' : 'new item'"
  >
    <ItemForm />
  </SidebarCard>
  <div v-else>
    <ButtonText
      text="add new item"
      style-type="underline"
      @click="_addNewItemPlaceholder"
    />
    <InfoMessage message="or choose one from the list" />
  </div>
</template>
