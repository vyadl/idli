<template>
  <div class="list-visualization">
    <SidebarCard title="sorting">
      <CheckboxCustom
        label="shuffle mode"
        v-model="localIsShuffled"
        @change="_switchShuffleMode(localIsShuffled)"
      />
      <ButtonText
        text="randomize it!"
        v-if="isShuffled"
        @click="_shuffleFilteredList"
      />
    </SidebarCard>
    <SidebarCard title="modes">
      <CheckboxCustom
        label="cloud mode"
        v-model="localCloudMode"
        @change="_switchCloudMode(localCloudMode)"
      />
      <CheckboxCustom
        label="stars mode"
        v-model="localStarsMode"
        @change="_switchStarsMode(localStarsMode)"
      />
    </SidebarCard>
    <SidebarCard title="theme">
      <CheckboxCustom
        label="invert"
        v-model="localInvertMode"
        @change="_switchInvertMode(localInvertMode)"
      />
    </SidebarCard>
  </div>
</template>

<script>
import SidebarCard from '@/components/wrappers/SidebarCard.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SidebarCard,
    CheckboxCustom,
    ButtonText,
  },
  data: () => ({
    sortings: ['default', 'shuffle'],
    modes: ['list', 'cloud', 'stars'],
    themes: ['default', 'invert'],
    localCloudMode: false,
    localInvertMode: false,
    localStarsMode: false,
    localIsShuffled: false,
  }),
  computed: {
    ...mapGetters([
      'isCloudModeOn',
      'isStarsModeOn',
      'isInvert',
      'isShuffled',
    ]),
  },
  created() {
    this.localCloudMode = this.isCloudModeOn;
    this.localInvertMode = this.isInvert;
    this.localStarsMode = this.isStarsModeOn;
    this.localIsShuffled = this.isShuffled;
  },
  methods: {
    ...mapActions([
      '_shuffleFilteredList',
      '_switchCloudMode',
      '_switchStarsMode',
      '_switchInvertMode',
      '_switchShuffleMode',
    ]),
  },
};
</script>
