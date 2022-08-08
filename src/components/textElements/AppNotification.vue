<script>
import { mapGetters, mapActions } from 'vuex';

const RESET_NOTIFICATION_TIME = 4500;

export default {
  data: () => ({
    isIniting: true,
    isNotificationShown: false,
  }),
  computed: {
    ...mapGetters({
      notification: 'notification',
    }),
  },
  watch: {
    notification: {
      handler: async function notificationHandler() {
        if (this.notification.text) {
          const resetNotificationTime = this.notification.time || RESET_NOTIFICATION_TIME;

          this.isNotificationShown = true;

          await setTimeout(() => {
            this.isNotificationShown = false;
            this.isIniting = false;
          }, resetNotificationTime);

          setTimeout(() => {
            this._setNotification({
              time: null,
              text: '',
            });
          }, resetNotificationTime + RESET_NOTIFICATION_TIME);
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

<template>
  <div
    class="app-notification"
    :class="[{
        shown: isNotificationShown,
        hide: !isNotificationShown && !isIniting,
        hidden: isIniting,
      },
      `${globalTheme}-theme`,
    ]"
  >
    <div class="text">
      {{ notification.text }}
    </div>
  </div>
</template>

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
      animation: notification-show 1s cubic-bezier(0.45, 0, 0.55, 1);
      animation-fill-mode: both;
    }

    &.hide {
      animation: notification-hide 3s cubic-bezier(0.45, 0, 0.55, 1);
      animation-fill-mode: both;
    }

    &.hidden {
      opacity: 0;
      visibility: hidden;
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
