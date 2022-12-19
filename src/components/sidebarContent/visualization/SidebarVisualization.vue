<script>
import SectionCard from '@/components/wrappers/SectionCard.vue';
import RadioCustom from '@/components/formElements/RadioCustom.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ToggleSwitch from '@/components/formElements/ToggleSwitch.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { defaultVisualization } from '@/store/config';

export default {
  components: {
    SectionCard,
    RadioCustom,
    CheckboxCustom,
    ToggleSwitch,
    ButtonText,
    PopupBox,
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
      'isDraggableMode',
    ]),
    ...mapGetters('visualization', [
      ...Object.keys(defaultVisualization),
    ]),
    listAlignTitles() {
      return ['list', 'page'].includes(this.mode)
        ? ['left', 'center', 'right', this.mode === 'list' ? 'random' : 'edges']
        : [];
    },
    isResetButtonActive() {
      return Object
        .keys(defaultVisualization)
        .some(
          option => this[option] !== defaultVisualization[option],
        );
    },
  },
  watch: {
    sorting: function sortingHandler(newSorting) {
      if (this.unstructuredModes.includes(this.mode) && newSorting === 'custom') {
        this._setMode('list');
      }

      if (newSorting !== 'custom') {
        this._exitDraggableMode();
      }

      if (newSorting === 'shuffle') {
        this.toggleShuffleTrigger();
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

      if (newMode !== 'list') {
        this._exitDraggableMode();
      }
    },
  },
  methods: {
    ...mapMutations('visualization', [
      'toggleShuffleTrigger',
    ]),
    ...mapActions([
      '_exitDraggableMode',
      '_toggleDraggableMode',
    ]),
    ...mapActions('visualization', [
      '_setSorting',
      '_setMode',
      '_setListAlign',
      '_toggleItemDetailsShowingMode',
      '_toggleItemsOrder',
      '_resetVisualizationToDefault',
    ]),
  },
};
</script>

<template>
  <div class="sidebar-visualization">
    <SectionCard 
      title="sorting"
      class="main-sorting"
    >
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
      <div class="buttons-container paired">
        <RadioCustom
          :label="mainSortingOptions.custom.title"
          :value="mainSortingOptions.custom.type"
          :model-value="sorting"
          name="sorting"
          @change="_setSorting(mainSortingOptions.custom.type)"
        />
        <div class="draggable-mode-section">
          <ToggleSwitch
            :is-checked="isDraggableMode"
            title="reorder mode"
            @change="_toggleDraggableMode"
          />
          <PopupBox
            button-style-type="hint"
            stop-propagation
            position="lower-left"
          >
            <span>
              Entering this mode, you will be able to sort your list manually by 
              dragging and dropping items in the order you like. 
              Note: all your filters and visualization will be reset.
            </span>
          </PopupBox>
        </div>
      </div>
      <div class="buttons-container paired">
        <RadioCustom
          :label="mainSortingOptions.shuffled.title"
          :value="mainSortingOptions.shuffled.type"
          :model-value="sorting"
          name="sorting"
          @change="_setSorting(mainSortingOptions.shuffled.type)"
        />
        <div class="randomize-button-container">
          <ButtonText
            v-if="sorting === 'shuffled'"
            text="randomize!"
            style-type="underline"
            size="small"
            @click="toggleShuffleTrigger"
          />
        </div>
      </div>
      <CheckboxCustom
        label="reverse order"
        style-type="initial"
        :value="false"
        :model-value="isItemsOrderReversed"
        @update:model-value="_toggleItemsOrder"
      />
    </SectionCard>
    <SectionCard title="mode">
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
        v-if="listAlignTitles.length"
        class="buttons-container"
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
        style-type="initial"
        :value="false"
        :model-value="areItemDetailsShown"
        @update:model-value="_toggleItemDetailsShowingMode"
      />
    </SectionCard>
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
      padding-top: 15px;

      &.paired {
        gap: 10px;
        align-items: flex-start;
        padding-top: 3px;
      }
    }

    .draggable-mode-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .randomize-button-container {
      height: 40px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
