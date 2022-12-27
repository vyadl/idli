<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';

export default {
  components: {
    ModalBasic,
  },
};
</script>

<template>
  <ModalBasic
    class="about-modal"
    :class="`${globalTheme}-theme`"
    name="aboutModal"
    title="about idli"
    width="350"
  >
    <div>
      <div class="project-descr">
        Creative manager of lists
      </div>
      <br><br>
      Created by:
      <br><br>
      <div class="participants">
        <div>
          Mariia Br
          <div class="descr">
            <div>(frontend, design)</div>
            <a
              href="mailto:tnuocc@gmail.com"
              target="_blank"
            >
              tnuocc@gmail.com
            </a>
          </div>
        </div>
        <div>
          Kseniya Korovina
          <div class="descr">
            <div>(frontend, design)</div>
            <a
              href="mailto:korovinaksusha@gmail.com"
              target="_blank"
            >
              korovinaksusha@gmail.com
            </a>
          </div>
        </div>
        <div>
          Daria Slobodeniuk
          <br>
          <div class="descr">
            <div>(designer of logo)</div>
            <a
              href="mailto:slobodenuk1@gmail.com"
              target="_blank"
            >
              slobodenuk1@gmail.com
            </a>
          </div>
        </div>
        <div>
          Philip Sukolenov
          <br>
          <div class="descr">
            <div>(idea, product owner, frontend, backend, design)</div>
            <a
              href="https://vyadl.me"
              target="_blank"
            >
              vyadl.me
            </a>
          </div>
        </div>
      </div>
    </div>
  </ModalBasic>
</template>

<style lang="scss">
  .about-modal {
    .participants {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .descr {
      line-height: 1.5;
      font-size: 12px;
      color: map-get($colors, 'gray-dark');
    }

    .project-descr {
      font-size: 18px;
    }

    &.inverted-theme {
      .descr {
        color: map-get($colors, 'gray-light');
      }
    }
  }
</style>
