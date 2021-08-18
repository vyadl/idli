<template>
  <div class="list-visualization">
    <SidebarCard
      class="sorting"
      title="sorting"
    >
      <RadioCustom
        v-for="sorting in sortings"
        :key="sorting"
        :label="sorting"
        :value="sorting"
        v-model="localSorting"
        name="sorting"
        @change="_setSorting(sorting)"
      />
      <ButtonText
        class="sorting-action"
        v-if="sorting === 'shuffle'"
        text="randomize it!"
        style-type="underline"
        @click="_shuffleFilteredList"
      />
    </SidebarCard>
    <SidebarCard title="modes">
      <div class="buttons-container">
        <RadioCustom
          v-for="mode in modes"
          :key="mode"
          :label="mode"
          :value="mode"
          v-model="localMode"
          name="mode"
          @change="_setMode(mode)"
        />
      </div>
    </SidebarCard>
    <SidebarCard title="theme">
      <div class="buttons-container">
        <RadioCustom
          v-for="theme in themes"
          :key="theme"
          :label="theme"
          :value="theme"
          v-model="localTheme"
          name="theme"
          @change="_setTheme(theme)"
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
    sortings: ['default', 'shuffle'],
    modes: ['list', 'cloud', 'stars'],
    themes: ['default', 'invert'],
    localSorting: '',
    localMode: '',
    localTheme: '',
  }),
  computed: {
    ...mapGetters({
      sorting: 'sorting',
      mode: 'mode',
      theme: 'theme',
    }),
  },
  watch: {
    sorting: {
      handler: function sortingHandler() {
        this.localSorting = this.sorting;
      },
      immediate: true,
    },
    mode: {
      handler: function modeHandler() {
        this.localMode = this.mode;
      },
      immediate: true,
    },
    theme: {
      handler: function themeHandler() {
        this.localTheme = this.theme;
      },
      immediate: true,
    },
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
