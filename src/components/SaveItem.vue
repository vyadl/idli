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
      <InputCustom
        label="item"
        :value="item.text"
        @input="item.text = $event"
      />
      <TextareaCustom
        label="details"
        :value="item.details"
        @input="item.details = $event"
        @click="isDetailsShowed = !isDetailsShowed"
      />
      <div class="item-settings">
        <label
          class="g-label"
          :class="{ 'active': item.tags.indexOf(tag.id) !== -1 }"
          v-for="tag in currentListFilters.tags"
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
      <div class="item-caregories">
        <label
          class="g-label"
          :class="{'active': item.categories === category.id}"
          v-for="category in currentListFilters.categories"
          :key="category.id"
        >
          {{ category.name }}
          <input
            type="radio"
            class="g-hidden"
            name="category"
            :value="category.id"
            v-model="item.categories"
            @click="unableCategory(category.id)"
          >
        </label>
      </div>
      <div class="buttons-container">
        <ButtonText
          :disabled="!item.text"
          :text="activeItem ? 'change' : 'add'"
          style-type="bordered"
          @click="saveItem"
        />
        <ButtonText
          v-if="activeItem"
          text="cansel"
          style-type="bordered"
          @click="cancelChanging"
        />
        <ButtonText
          :text="activeItem ? 'delete' : 'cancel'"
          style-type="bordered"
          @click="deleteItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import TextareaCustom from '@/components/formElements/TextareaCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    InputCustom,
    TextareaCustom,
    ButtonText,
  },
  data: () => ({
    isDetailsShowed: false,
    item: {
      id: '',
      text: '',
      details: '',
      tags: [],
      categories: '',
    },
  }),
  computed: {
    ...mapGetters([
      'currentListFilters',
      'activeItem',
      'isChangingActive',
    ]),
  },
  watch: {
    activeItem() {
      if (this.activeItem) {
        this.item = { ...this.activeItem };
      }
    },
  },
  created() {
    if (this.activeItem) {
      this.item = { ...this.activeItem };
    }
  },
  methods: {
    ...mapActions([
      '_addItem',
      '_changeItem',
      '_deleteItem',
      '_setActiveItem',
    ]),
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
    chooseCategory(itemCategory) {
      this.item.categories = itemCategory;
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
      this.item.categories = '';
      this.item.tags = [];
    },
    unableCategory(id) {
      if (this.item.categories === id) {
        this.item.categories = '';
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
        padding: 20px 25px;
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

    .item-settings {
      padding: 15px;
      text-align: center;
    }

    .item-categories {
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
