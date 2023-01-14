<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';
import { handleRequestStatuses } from '@/utils/misc';

export default {
  components: {
    SectionCard,
    ButtonText,
    ErrorMessage,
    InfoMessage,
  },
  data: () => ({
    areTestListsShown: false,
    requestHandling: {
      isRequestProcessing: false,
      errorMessage: '',
    },
  }),
  computed: {
    ...mapGetters('lists', [
      'lists',
      'testLists',
    ]),
  },
  created() {
    this.areTestListsShown = !this.lists.length;
  },
  methods: {
    ...mapActions([
      '_resetCustomView',
    ]),
    ...mapActions('lists', [
      '_copyTestListToUserLists',
    ]),
    addTestList(list) {
      this.requestHandling.isRequestProcessing = true;
      this.requestHandling.errorMessage = '';

      const request = this._copyTestListToUserLists(list);

      handleRequestStatuses(request, this.requestHandling);
      this._resetCustomView();
    },
  },
};
</script>

<template>
  <SectionCard class="test-data">
    <ButtonText
      :text="areTestListsShown ? 'hide test lists' : 'show test lists'"
      style-type="underline"
      @click="areTestListsShown = !areTestListsShown"
    />
    <ErrorMessage
      v-if="requestHandling.errorMessage"
      :message="requestHandling.errorMessage"
    />
    <div v-if="areTestListsShown">
      <InfoMessage
        class="info-message"
        message="choosing test list will copy it to your lists"
      />
      <div class="lists-container">
        <ButtonText
          v-for="list in testLists"
          :key="list.title"
          class="list-title"
          :text="list.title"
          style-type="line"
          :disabled="requestHandling.isRequestProcessing"
          @click="addTestList(list)"
        />
      </div>
    </div>
  </SectionCard>
</template>

<style lang="scss" scoped>
  .test-data {
    .lists-container {
      display: flex;
      flex-direction: column;
    }

    .info-message {
      margin-bottom: 10px;
    }

    .list-title {
      margin-bottom: 5px;
    }
  }
</style>
