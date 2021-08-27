<template>
  <div
    class="app-notification"
    :class="[
      { shown: isNotificationShown },
      `${globalTheme}-theme`,
    ]"
  >
    <div class="text">
      {{ notification }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

const RESET_NOTIFICATION_TIME = 4500;

export default {
  data: () => ({
    isNotificationShown: false,
  }),
  computed: {
    ...mapGetters({
      notification: 'notification',
    }),
  },
  watch: {
    notification: {
      handler: function notificationHandler() {
        if (this.notification) {
          this.isNotificationShown = true;

          setTimeout(() => {
            this.isNotificationShown = false;
            this._setNotification('');
          }, RESET_NOTIFICATION_TIME);
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      _setNotification: '_setNotification',
    }),
  },
};
</script>

<style lang="scss">
  .app-notification {
    position: absolute;
    left: 15px;
    bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: auto;
    border-radius: 3px;
    background-color: map-get($colors, 'black');
    opacity: 0;

    &.shown {
      animation: notification 4s cubic-bezier(0.45, 0, 0.55, 1);
    }

    .text {
      padding: 20px;
      color: map-get($colors, 'white')
    }

    &.inverted-theme {
      background-color: map-get($colors, 'white');

      .text {
        color: map-get($colors, 'black');
      }
    }
  }
</style>
