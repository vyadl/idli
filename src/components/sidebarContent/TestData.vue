<template>
  <SidebarCard
    class="test-data"
    title="test data"
  >
    <div
      class="open-message"
      @click="areTestListsShown = !areTestListsShown"
    >show test lists</div>
    <div
      class="test-list-buttons"
      v-if="areTestListsShown"
    >
      <ButtonText
        style-type="solid"
        v-for="list in testData"
        :key="list.name"
        :text="list.name"
        :disabled="isRequestProcessing"
        @click="addTestList(list)"
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
    isRequestProcessing: false,
  }),
  created() {
    axios.get('/test_data.json').then(({ data }) => {
      this.testData = data;
    });
  },
  methods: {
    ...mapActions({
      _addTestList: '_addTestList',
    }),
    addTestList(list) {
      this.isRequestProcessing = true;
      this._addTestList(list).then(() => {
        this.isRequestProcessing = false;
      });
    },
  },
};
</script>

<style lang="scss">
  .test-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .open-message {
      margin-bottom: 10px;
      color: map-get($colors, 'gray-1');
      cursor: pointer;
    }

    .test-list-buttons {
      width: 100%;
    }
  }
</style>
