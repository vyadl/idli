<template>
  <div class="lists-showing">
    <div>
      <label
        class="g-label"
        :class="{'active': list.id == currentId}"
        v-for="list in lists"
        :key="list.id"
      >
        {{ list.name }}
        <input
          type="radio"
          class="g-hidden"
          :true-value="1"
          :false-value="0"
          name="list-id"
          :value="list.id"
          @change="_switchList(list.id)"
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['lists', 'currentId']),
  },

  methods: {
    ...mapActions(['_switchList']),
  },
};
</script>
