<template>
  <SidebarCard
    class="list-visualization"
    title="visualization"
  >
    <div class="visualization">
      <CheckboxCustom
        label="shuffle mode"
        v-model="localIsShuffled"
        @change="_switchShuffleMode"
      />
      <ButtonText
        text="randomize it!"
        v-if="isShuffled"
        @click="_shuffleFilteredList"
      />
      <CheckboxCustom
        label="cloud mode"
        v-model="localCloudMode"
        @change="_switchCloudMode"
      />
      <CheckboxCustom
        label="stars mode"
        v-if="isCloudModeOn"
        :class="{ 'active': isStarsModeOn }"
        v-model="localStarsMode"
        @change="_switchStarsMode"
      />
      <CheckboxCustom
        label="invert"
        :class="{ 'active': isInvert }"
        v-model="localInvertMode"
        @change="_switchInvertMode"
      />
    </div>
  </SidebarCard>
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
    localCloudMode: 0,
    localInvertMode: 0,
    localStarsMode: 0,
    localIsShuffled: 0,
  }),
  computed: {
    ...mapGetters([
      'isCloudModeOn',
      'isStarsModeOn',
      'isInvert',
      'isShuffled',
    ]),
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
