<template>
  <SidebarCard
    class="test-data"
  >
    <ButtonText
      class="open-button"
      style-type="underline"
      :text="areTestListsShown ? 'hide test lists' : 'show test lists'"
      @click="areTestListsShown = !areTestListsShown"
    />
    <ErrorMessage
      :message="errorMessage"
      v-if="errorMessage"
    />
    <div
      class="test-list-buttons"
      v-if="areTestListsShown"
    >
      <ButtonText
        style-type="line"
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
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    SidebarCard,
    ButtonText,
    ErrorMessage,
  },
  data: () => ({
    areTestListsShown: false,
    testData: [],
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      lists: 'lists',
    }),
  },
  created() {
    axios.get('/test_data.json').then(({ data }) => {
      this.testData = data;
    });
    this.areTestListsShown = Boolean(!this.lists.length);
  },
  methods: {
    ...mapActions({
      _addTestList: '_addTestList',
    }),
    addTestList(list) {
      this.isRequestProcessing = true;
      this._addTestList(list)
        .catch(error => {
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
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
    width: 100%;

    .open-button {
      margin-bottom: 10px;
    }

    .test-list-buttons {
      width: 100%;
    }
  }
</style>
