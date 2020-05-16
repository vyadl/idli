<template>
  <div class="visualization">
    <div class="g-setting-title g-setting-title--main">visualization</div>
    <label class="g-label" :class="{ 'g-label--active': isShuffled }">
      shuffle mode
      <input
        type="checkbox"
        class="g-hidden"
        :true-value="1"
        :false-value="0"
        v-model="localIsShuffled"
        @change="_switchShuffleMode"
      />
    </label>
    <div
      v-if="isShuffled"
      class="g-button visualization__button"
      @click="_shuffleFilteredList"
    >randomize it!</div>
    <label class="g-label" :class="{ 'g-label--active': isCloudModeOn }">
      cloud mode
      <input
        type="checkbox"
        class="g-hidden"
        :true-value="1"
        :false-value="0"
        v-model="localCloudMode"
        @change="_switchCloudMode"
      />
    </label>
    <label v-if="isCloudModeOn" class="g-label" :class="{ 'g-label--active': isStarsModeOn }">
      stars mode
      <input
        type="checkbox"
        class="g-hidden"
        :true-value="1"
        :false-value="0"
        v-model="localStarsMode"
        @change="_switchStarsMode"
      />
    </label>
    <label class="g-label" :class="{ 'g-label--active': isInvert }">
      invert
      <input
        type="checkbox"
        class="g-hidden"
        :true-value="1"
        :false-value="0"
        v-model="localInvertMode"
        @change="_switchInvertMode"
      />
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Visualization",
  data: function() {
    return {
      localCloudMode: 0,
      localInvertMode: 0,
      localStarsMode: 0,
      localIsShuffled: 0
    };
  },

  computed: {
    ...mapGetters([
      "filters",
      "isCloudModeOn",
      "isStarsModeOn",
      "isInvert",
      "isShuffled"
    ])
  },

  methods: {
    ...mapActions([
      "_shuffleFilteredList",
      "_switchCloudMode",
      "_switchStarsMode",
      "_switchInvertMode",
      "_switchShuffleMode"
    ])
  }
};
</script>
