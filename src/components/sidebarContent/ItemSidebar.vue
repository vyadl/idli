<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ItemForm from '@/components/list/ItemForm.vue';
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
    class="item-sidebar"
    :title="edittingItemObj ? 'edit item' : 'new item'"
  >
    <ItemForm />
  </SidebarCard>
</template>
