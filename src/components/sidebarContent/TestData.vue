<template>
  <SidebarCard
    class="test-data"
    title="test data"
  >
    <ButtonText
      class="open-button"
      :text="areTestListsShown ? 'hide test lists' : 'show test lists'"
      @click="areTestListsShown = !areTestListsShown"
    />
    <div
      class="test-list-buttons"
      v-if="areTestListsShown"
    >
      <ButtonText
        v-for="list in testData"
        :key="list.name"
        :text="list.name"
        style-type="line"
        @click="_addList(JSON.parse(JSON.stringify(list)))"
      />
    </div>
  </SidebarCard>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    SidebarCard,
    ButtonText,
  },
  data: () => ({
    areTestListsShown: false,
    testData: [],
  }),
  created() {
    axios.get('/test_data.json').then(({ data }) => {
      this.testData = data;
    });
  },
  methods: {
    ...mapActions({
      _addList: '_addList',
    }),
  },
};
</script>

<style lang="scss">
  .test-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .open-button {
      margin-bottom: 10px;
    }

    .test-list-buttons {
      width: 100%;
    }
  }
</style>
