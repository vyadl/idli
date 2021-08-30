<template>
  <div class="list-visualization">
    <SidebarCard title="sorting">
      <div class="buttons-container">
        <RadioCustom
          v-for="title in sortingTitles"
          :key="title"
          :label="title"
          :value="title"
          :model-value="sorting"
          name="sorting"
          @change="_setSorting(title)"
        />
      </div>
      <div
        class="buttons-container central"
        v-if="sorting === 'shuffled'"
      >
        <ButtonText
          class="randomize-button"
          text="randomize!"
          small
          @click="_shuffleFilteredList"
        />
      </div>
    </SidebarCard>
    <SidebarCard title="mode">
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
      <div
        class="buttons-container central"
        v-if="listAlignTitles.length"
      >
        <RadioCustom
          v-for="title in listAlignTitles"
          :key="title"
          :label="title"
          small
          :value="title"
          :model-value="listAlign"
          name="listAlign"
          @change="_setListAlign(title)"
        />
      </div>
      <CheckboxCustom
        v-if="['list', 'cards'].includes(mode)"
        label="show items' details"
        style-type="classic"
        :value="false"
        :model-value="areItemDetailsShown"
        @change="_changeItemDetailsShowingMode"
      />
    </SidebarCard>
    <SidebarCard title="theme">
      <div class="buttons-container">
        <RadioCustom
          class="theme"
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
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    RadioCustom,
    CheckboxCustom,
    ButtonText,
  },
  data: () => ({
    sortingTitles: ['default', 'shuffled'],
    modeTitles: ['list', 'page', 'cards', 'cloud', 'stars'],
    themeTitles: ['default', 'inverted'],
    structuredModes: ['list', 'page', 'cards'],
    unstructuredModes: ['cloud', 'stars'],
  }),
  computed: {
    ...mapGetters({
      sorting: 'sorting',
      mode: 'mode',
      theme: 'theme',
      listAlign: 'listAlign',
      areItemDetailsShown: 'areItemDetailsShown',
    }),
    listAlignTitles() {
      return ['list', 'page'].includes(this.mode)
        ? ['left', 'center', 'right', this.mode === 'list' ? 'random' : 'edges']
        : [];
    },
  },
  watch: {
    sorting: function sortingHandler(newSorting) {
      if (this.unstructuredModes.includes(this.mode) && newSorting === 'default') {
        this._setMode('list');
      }
    },
    mode: function modeHandler(newMode, oldMode) {
      if (this.unstructuredModes.includes(oldMode) && this.structuredModes.includes(newMode)) {
        this._setSorting('default');
      } else if (this.unstructuredModes.includes(newMode)) {
        this._setSorting('shuffled');
      } else if (['list', 'page'].includes(newMode)
        && ['random', 'edges'].includes(this.listAlign)) {
        this._setListAlign('center');
      }
    },
  },
  methods: {
    ...mapActions({
      _setSorting: '_setSorting',
      _setMode: '_setMode',
      _setTheme: '_setTheme',
      _shuffleFilteredList: '_shuffleFilteredList',
      _setListAlign: '_setListAlign',
      _changeItemDetailsShowingMode: '_changeItemDetailsShowingMode',
    }),
  },
};
</script>

<style lang="scss">
  .list-visualization {
    .buttons-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-bottom: 10px;

      &.central {
        justify-content: center;
      }
    }
  }
</style>
