<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ItemForm from '@/components/item/ItemForm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    SidebarCard,
    ItemForm,
  },
  computed: {
    ...mapGetters([
      'edittingItemObj',
    ]),
  },
};
</script>

<template>
  <SidebarCard
    class="sidebar-item"
    :title="edittingItemObj ? 'edit item' : 'new item'"
  >
    <ItemForm />
  </SidebarCard>
</template>
