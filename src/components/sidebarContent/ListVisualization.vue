<template>
  <div class="list-visualization">
    <SidebarCard
      class="sorting"
      title="sorting"
    >
      <RadioCustom
        v-for="title in sortingTitles"
        :key="title"
        :label="title"
        :value="title"
        :model-value="sorting"
        name="sorting"
        @change="_setSorting(title)"
      />
      <ButtonText
        class="sorting-action"
        v-if="sorting === 'shuffled'"
        text="randomize it!"
        style-type="underline"
        @click="_shuffleFilteredList"
      />
    </SidebarCard>
    <SidebarCard title="modeTitles">
      <div class="buttons-container">
        <RadioCustom
          v-for="title in modeTitles"
          :key="title"
          :label="title"
          :value="title"
          :model-value="mode"
          name="mode"
          @change="_setMode(title)"
        />
      </div>
    </SidebarCard>
    <SidebarCard title="theme">
      <div class="buttons-container">
        <RadioCustom
          v-for="title in themeTitles"
          :key="title"
          :label="title"
          :value="title"
          :model-value="theme"
          name="theme"
          @change="_setTheme(title)"
        />
      </div>
    </SidebarCard>
  </div>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    RadioCustom,
    ButtonText,
  },
  data: () => ({
    sortingTitles: ['default', 'shuffled'],
    modeTitles: ['list', 'cloud', 'stars'],
    themeTitles: ['default', 'inverted'],
  }),
  computed: {
    ...mapGetters({
      sorting: 'sorting',
      mode: 'mode',
      theme: 'theme',
    }),
  },
  methods: {
    ...mapActions({
      _setSorting: '_setSorting',
      _setMode: '_setMode',
      _setTheme: '_setTheme',
      _shuffleFilteredList: '_shuffleFilteredList',
    }),
  },
};
</script>

<style lang="scss">
  .list-visualization {
    .sorting {
      position: relative;
    }

    .sorting-action {
      position: absolute;
      top: 35px;
      right: 0;
    }

    .buttons-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
</style>
