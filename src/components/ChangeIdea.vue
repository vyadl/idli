<template>
<div>
  <input 
    type="text" 
    v-model="text"
  >
  <button 
    class="add__button"
    type="button"
    @click="changeItem"
    :disabled="!text"
  >change</button>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'changeItem',
  data: function() {
    return {
      text: '',
    }
  },
  
  created() {
    this.text = this.activeItem.text;
  },

  computed: {
    ...mapGetters(['activeItem']),
  },

  methods: {
    ...mapActions(['_changeItem']),
    changeItem() {
      this._changeItem({
        id: this.activeItem.id,
        text: this.text,
      })
    }
  },
}
</script>

<style scoped lang="scss">
.add {
  color: #000;

  &__button {
    border-radius: 5px;
    background: transparent;
    border: 1px solid #444;
    color: #333;
    transition: opacity .2s;
    padding: 5px;
    font: 14px Verdana, sens-serif;
    &:hover {
      opacity: .9;
    }
    &:active {
      opacity: .7;
    }
    &:disabled {
      opacity: .4;
    }
  }
}
</style>