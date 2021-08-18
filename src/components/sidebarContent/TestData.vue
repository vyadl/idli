<template>
  <SidebarCard class="test-data">
    <ButtonText
      :text="areTestListsShown ? 'hide test lists' : 'show test lists'"
      style-type="underline"
      @click="areTestListsShown = !areTestListsShown"
    />
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
    />
    <div
      class="buttons-container"
      v-if="areTestListsShown"
    >
      <InfoMessage
        class="info-message"
        message="choosing test list will copy it to your lists"
      />
      <ButtonText
        class="list-name"
        v-for="list in testData"
        :key="list.name"
        :text="list.name"
        style-type="line"
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
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    SidebarCard,
    ButtonText,
    ErrorMessage,
    InfoMessage,
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
      this.errorMessage = '';
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

    .buttons-container {
      width: 100%;
    }

    .info-message {
      margin-bottom: 10px;
    }

    .list-name {
      margin-bottom: 5px;
    }
  }
</style>
