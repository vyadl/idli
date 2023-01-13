<script>
import { mapActions } from 'vuex';
import ButtonText from '@/components/formElements/ButtonText.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';

export default {
  components: {
    ButtonText,
    CustomLink,
  },
  data() {
    return {
      publicListsForAuthScreen: null,
    };
  },
  async created() {
    this.publicListsForAuthScreen = await this._getPublicListsForAuthScreen();
  },
  methods: {
    ...mapActions('auth', [
      '_getPublicListsForAuthScreen',
    ]),
    openForm(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<template>
  <div
    class="enter-screen"
    :class="`${globalTheme}-theme`"
  >
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
    <Transition name="slide-fade">
      <div
        v-if="publicListsForAuthScreen"
        class="public-lists-section"
      >
        <div class="conjunction">
          — or —
        </div>
        <div class="public-lists-container">
          <span class="public-lists-title">
            check some public lists:
          </span>
          <div>
            <div 
              v-for="( title, id ) in publicListsForAuthScreen"
              :key="id"
              class="public-list"
            >
              <CustomLink
                :to="{ name: 'list', params: { id } }"
                target="_blank"
                :title="title"
                with-arrow
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
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

    .public-lists-section,
    .public-lists-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .public-lists-section {
      gap: 20px;
    }

    .public-lists-container {
      gap: 10px;
    }

    .conjunction,
    .public-lists-title {
      width: 100%;
      text-align: center;
      font-variant-caps: all-small-caps;
    }

    .public-list {
      margin-bottom: 5px;
      text-align: left;
      font-size: 13px;
      color: map-get($colors, 'gray-dark');
    }

    &.inverted-theme {
      .public-list {
        color: map-get($colors, 'gray-light');
      }
    }
  }
</style>
