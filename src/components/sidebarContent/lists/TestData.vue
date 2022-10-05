<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    ButtonText,
    ErrorMessage,
    InfoMessage,
  },
  data: () => ({
    areTestListsShown: false,
    isRequestProcessing: false,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters([
      'lists',
      'testLists',
    ]),
  },
  created() {
    this.areTestListsShown = !this.lists.length;
  },
  methods: {
    ...mapActions([
      '_copyTestListToUserLists',
    ]),
    addTestList(list) {
      this.isRequestProcessing = true;
      this.errorMessage = '';
      this._copyTestListToUserLists(list)
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
    <div v-if="areTestListsShown">
      <InfoMessage
        class="info-message"
        message="choosing test list will copy it to your lists"
      />
      <div class="buttons-container">
        <ButtonText
          v-for="list in testLists"
          :key="list.title"
          class="list-title"
          :text="list.title"
          style-type="line"
          :disabled="isRequestProcessing"
          @click="addTestList(list)"
        />
      </div>
    </div>
  </SidebarCard>
</template>

<style lang="scss">
  .test-data {
    .buttons-container {
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
