<template>
  <SettingsCard title="test data">
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
    <ModalConfirmation
      text="sure?"
      name="modal"
    />
    <ButtonText
      style-type="bordered"
        text="modal"
        @click="$modal.show('modal')"/>
  </SettingsCard>
</template>

<script>
import SettingsCard from '@/components/settings/SettingsCard.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import ModalConfirmation from '@/components/formElements/ModalConfirmation.vue';
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    ModalConfirmation,
    SettingsCard,
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
    click(event) {
      echo(event.target.value);
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
