<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';
import { defaultVisualization } from '@/store/config';

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
    structuredModes: ['list', 'page', 'cards'],
    unstructuredModes: ['cloud', 'stars'],
  }),
  computed: {
    ...mapGetters([
      ...Object.keys(defaultVisualization),
    ]),
    listAlignTitles() {
      return ['list', 'page'].includes(this.mode)
        ? ['left', 'center', 'right', this.mode === 'list' ? 'random' : 'edges']
        : [];
    },
    isResetButtonActive() {
      return Object.keys(defaultVisualization)
        .some(option => this[option] !== defaultVisualization[option]);
    },
  },
  watch: {
    sorting: function sortingHandler(newSorting) {
      if (this.unstructuredModes.includes(this.mode) && newSorting === 'custom') {
        this._setMode('list');
      }
    },
    mode: function modeHandler(newMode, oldMode) {
      if (this.unstructuredModes.includes(oldMode) && this.structuredModes.includes(newMode)) {
        this._setSorting('custom');
      } else if (this.unstructuredModes.includes(newMode)) {
        this._setSorting('shuffled');
      } else if (['list', 'page'].includes(newMode)
        && ['random', 'edges'].includes(this.listAlign)) {
        this._setListAlign('center');
      }
    },
  },
  methods: {
    ...mapActions([
      '_setSorting',
      '_setMode',
      '_setListAlign',
      '_toggleItemDetailsShowingMode',
      '_toggleItemsOrder',
      '_toggleShuffleTrigger',
      '_resetVisualizationToDefault',
    ]),
  },
};
</script>

<template>
  <div class="sidebar-visualization">
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
          @click="_toggleShuffleTrigger"
        />
      </div>
    </SidebarCard>
    <hr
      v-if="sorting !== 'shuffled'"
      class="break-line"
    />
    <SidebarCard v-if="sorting !== 'shuffled'">
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
        @update:modelValue="_toggleItemsOrder"
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
        @update:modelValue="_toggleItemDetailsShowingMode"
      />
    </SidebarCard>
    <footer class="footer">
      <ButtonText
        v-if="isResetButtonActive"
        text="reset all to default"
        style-type="underline"
        @click="_resetVisualizationToDefault"
      />
    </footer>
  </div>
</template>

<style lang="scss">
  .sidebar-visualization {
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
    .footer {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>