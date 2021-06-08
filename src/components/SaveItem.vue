<template>
  <div
    class="save-item"
    :class="{ 'visible': isChangingActive }"
  >
    <div
      class="mask"
      @click="cancelChanging"
    ></div>
    <div class="inner">
      <div>
        <div class="text-label">
          item
        </div>
        <input
          type="text"
          class="item-name"
          v-model="item.text"
        >
      </div>
      <div>
        <div
          class="text-label"
          :class="{ 'clickable': !isDetailsShowed && !item.details }"
          @click="isDetailsShowed = !isDetailsShowed"
        >
          {{ !isDetailsShowed && !item.details ? 'write' : '' }} details
        </div>
        <textarea
          class="item-description"
          v-if="item.details || isDetailsShowed"
          v-model="item.details"
        ></textarea>
      </div>
      <div class="item-settings">
        <label
          class="g-label"
          :class="{ 'active': item.tags.indexOf(tag.id) !== -1 }"
          v-for="tag in filters.tags"
          :key="tag.id"
        >
          <input
            type="checkbox"
            class="g-hidden"
            :value="tag.id"
            v-model="item.tags"
            :true-value="1"
            :false-value="0"
          >
          {{ tag.name }}
        </label>
      </div>
      <div class="item-types">
        <label
          class="g-label"
          :class="{'active': item.type === type.id}"
          v-for="type in filters.types"
          :key="type.id"
        >
          {{ type.name }}
          <input
            type="radio"
            class="g-hidden"
            name="type"
            :value="type.id"
            v-model="item.type"
            @click="unableType(type.id)"
          >
        </label>
      </div>
      <div class="buttons-container">
        <button
          class="item-button"
          type="button"
          @click="saveItem"
          :disabled="!item.text"
        >{{ activeItem ? 'change' : 'add'}}</button>
        <button
          class="item-button"
          type="button"
          v-if="activeItem"
          @click="cancelChanging"
        >cancel</button>
        <button
          class="item-button"
          type="button"
          @click="deleteItem"
        >{{ activeItem ? 'delete' : 'cancel' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      isDetailsShowed: false,
      item: {
        id: 1,
        text: '',
        details: '',
        tags: [],
        type: '',
      },
    };
  },

  computed: {
    ...mapGetters(['list', 'filters', 'activeItem', 'isChangingActive']),
  },

  created() {
    if (this.activeItem) {
      this.item = { ...this.activeItem };
    }
  },

  watch: {
    activeItem() {
      if (this.activeItem) {
        this.item = { ...this.activeItem };
      }
    },
  },

  methods: {
    ...mapActions(['_addItem', '_changeItem', '_deleteItem', '_setActiveItem']),

    saveItem() {
      if (this.activeItem) {
        this._changeItem({
          ...this.item,
        });
      } else {
        this._addItem({
          ...this.item,
        });
      }

      this.finishChanging();
    },

    chooseType(itemType) {
      this.item.type = itemType;
    },

    deleteItem() {
      this._deleteItem(this.activeItem);
      this.finishChanging();
    },

    cancelChanging() {
      this._setActiveItem(null);
      this.finishChanging();
    },

    finishChanging() {
      this.item.text = '';
      this.item.details = '';
      this.item.type = '';
      this.item.tags = [];
    },

    unableType(id) {
      if (this.item.type === id) {
        this.item.type = '';
      }
    },
  },
};
</script>

<style lang="scss">
  .save-item {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100vw;
    padding: 15px;
    color: #000;

    &.visible {
      .mask {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: rgba(#444, .3);
        opacity: 1;
      }

      .inner {
        transform: none;
        opacity: 1;
        background-color: #fff;
        position: relative;
        border-radius: 4px;
        padding: 15px;
        box-shadow: 2px 2px 10px 0 rgba(#222, .6);
        width: 500px;
        max-width: 70vw;
        margin: 0 auto;
      }
    }

    .mask {
      transition: .2s opacity;
    }

    .inner {
      transition: .2s opacity, .2s transform;
      transform: translateY(-300px);
      opacity: 0;
    }

    .text-label {
      color: #999;
      font-size: 11px;

      &.clickable {
        cursor: pointer;
        opacity: .6;

        &:hover {
          opacity: 1;
        }
      }
    }

    .item-name,
    .item-description {
      outline: none;
      padding: 8px 6px;
      width: 100%;
      border: none;
      border-bottom: 1px solid #bbb;
      font: 14px Verdana, sans-serif;

      &:focus {
        border-bottom: 1px solid #666;
      }
    }

    .item-name {
      margin-bottom: 15px;
    }

    .item-description {
      resize: none;
    }

    .item-settings {
      padding: 15px;
      text-align: center;
    }

    .item-types {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 200px;
      padding: 10px 0 15px;
      margin: auto;
    }

    .buttons-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }

    .item-button {
      border-radius: 5px;
      background: transparent;
      border: 1px solid #444;
      color: #333;
      transition: opacity .2s;
      padding: 5px;
      font: 14px Verdana, sans-serif;
      cursor: pointer;
      margin: 0 7px;

      &:hover {
        opacity: .7;
      }

      &:active {
        opacity: .6;
      }

      &:disabled {
        opacity: .4;
      }
    }
  }
</style>
