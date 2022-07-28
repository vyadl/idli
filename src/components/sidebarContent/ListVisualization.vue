<template>
  <div class="list-visualization">
    <SidebarCard 
      title="sorting"
      class="main-sorting"
    >
      <div class="buttons-container">
        <RadioCustom
          v-for="sortingOption in mainSortingOptions"
          :key="sortingOption.title"
          :label="sortingOption.title"
          :value="sortingOption.type"
          :model-value="sorting"
          name="sorting"
          @change="_setSorting(sortingOption.type)"
        />
        <ButtonText
          v-if="sorting === 'shuffled'"
          class="randomize"
          text="randomize!"
          style-type="underline"
          @click="_switchShuffleTrigger"
        />
      </div>
    </SidebarCard>
    <hr class="break-line" />
    <SidebarCard>
      <div class="buttons-container">
        <RadioCustom
          v-for="sortingOption in secondarySortingOptions"
          :key="sortingOption.title"
          :label="sortingOption.title"
          :value="sortingOption.type"
          :model-value="sorting"
          name="sorting"
          @change="_setSorting(sortingOption.type)"
        />
      </div>
    <CheckboxCustom
      label="reverse order"
      style-type="classic"
      :value="false"
      :model-value="isItemsOrderReversed"
      @change="toggleItemsOrder"
    />
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
        class="buttons-container"
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
import { 
  mapGetters, 
  mapActions, 
  mapState, 
  mapMutations,
} from 'vuex';

export default {
  components: {
    SidebarCard,
    RadioCustom,
    CheckboxCustom,
    ButtonText,
  },
  data: () => ({
    mainSortingOptions: {
      custom: {
        title: 'custom',
        type: 'custom',
      },
      shuffled: {
        title: 'shuffled',
        type: 'shuffled',
      },
    },
    secondarySortingOptions: {
      alphabetic: {
        title: 'alphabetic',
        type: 'alphabetic',
      },
      dateCreated: {
        title: 'date created',
        type: 'dateCreated',
      },
      dateUpdated: {
        title: 'date updated',
        type: 'dateUpdated',
      },
    },
    modeTitles: ['list', 'page', 'cards', 'cloud', 'stars'],
    themeTitles: ['default', 'inverted'],
    structuredModes: ['list', 'page', 'cards'],
    unstructuredModes: ['cloud', 'stars'],
  }),
  computed: {
    ...mapState({
      isItemsOrderReversed: state => state.visualization.isItemsOrderReversed,
    }),
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
    ...mapMutations({
      toggleItemsOrder: 'toggleItemsOrder',
    }),
    ...mapActions({
      _setSorting: '_setSorting',
      _setMode: '_setMode',
      _setTheme: '_setTheme',
      _setListAlign: '_setListAlign',
      _changeItemDetailsShowingMode: '_changeItemDetailsShowingMode',
      _switchShuffleTrigger: '_switchShuffleTrigger',
    }),
  },
};
</script>

<style lang="scss">
  .list-visualization {
    .main-sorting {
      margin-bottom: 0;
    }
    .buttons-container {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-bottom: 10px;
    }
    .break-line {
      margin: 0;
      border: none;
      border-bottom: 1px solid map-get($colors, 'black');
      width: 50%;
    }
    .randomize {
      position: absolute;
      right: 0;
      bottom: 100%;
      font-size: 11px;
    }
  }
</style>
