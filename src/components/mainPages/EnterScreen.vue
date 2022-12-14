<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import { publicListsForAuthScreen } from '@/store/config';

export default {
  components: {
    ButtonText,
    CustomLink,
  },
  computed: {
    publicListsForAuthScreen() {
      return publicListsForAuthScreen;
    },
  },
  methods: {
    openForm(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<template>
  <div class="enter-screen">
    <div class="buttons-container">
      <ButtonText
        text="sign up"
        style-type="bordered"
        size="small"
        stop-propagation
        @click="openForm('requestRegistration')"
      />
      <ButtonText
        text="sign in"
        style-type="bordered"
        size="small"
        stop-propagation
        @click="openForm('signIn')"
      />
    </div>
    <span class="conjunction">
      — or —
    </span>
    <div class="public-lists-container">
      <span class="public-lists-title">
        check some public lists:
      </span>
      <div>
        <div 
          v-for="list in publicListsForAuthScreen"
          :key="list.id"
          class="public-list"
        >
          <CustomLink
            :to="{ name: 'list', params: { id: list.id } }"
            target="_blank"
            :title="list.title"
            with-arrow
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .enter-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    transition: transform 0.5s;

    .buttons-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .conjunction,
    .public-lists-title {
      width: 100%;
      text-align: center;
      font-variant-caps: all-small-caps;
    }

    .public-lists-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: map-get($colors, 'gray-dark');
    }

    .public-list {
      margin-bottom: 5px;
      text-align: left;
      font-size: 13px;
    }
  }
</style>
