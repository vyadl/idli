<template>
  <div class="test-data">
    <div
      class="open-message"
      @click="areTestListsShown = !areTestListsShown"
    >show test lists</div>
    <div
      class="test-list-buttons"
      v-if="areTestListsShown"
    >
      <ButtonText
        v-for="list in testData"
        :key="list.name"
        :text="list.name"
        :style-type="'solid'"
        @click="_addList(JSON.parse(JSON.stringify(list)))"
      />
    </div>
  </div>
</template>

<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
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
    ...mapActions(['_addList']),
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
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
