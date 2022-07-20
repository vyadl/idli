<template>
  <ModalBasic
    class="about-modal"
    name="aboutModal"
    title="about idli"
  >
    <div class="project-descr">
      Creative manager of lists
    </div>
    <br><br>
    Created by:
    <br><br>
    Mariia Br
    <div class="descr">
      (frontend)
      <br>
      <a
        href="mailto:tnuocc@gmail.com"
        target="_blank"
      >tnuocc@gmail.com</a>
    </div>
    <br>
    Kseniya Korovina
    <br>
    <div class="descr">
      (frontend, design)
      <br>
      <a
        href="mailto:korovinaksusha@gmail.com"
        target="_blank"
      >korovinaksusha@gmail.com</a>
    </div>
    <br>
    Daria Slobodeniuk
    <br>
    <div class="descr">
      (designer of logo)
      <br>
      <a
        href="mailto:slobodenuk1@gmail.com"
        target="_blank"
      >slobodenuk1@gmail.com</a>
    <br><br>
    </div>
    Philip Sukolenov
    <br>
    <div class="descr">
      (idea, product owner, frontend, backend, design)
      <br>
      <a
        href="http://vyadl.me"
        target="_blank"
      >
        vyadl.me
      </a>
    </div>
  </ModalBasic>
</template>

<script>
import ModalBasic from '@/components/modals/ModalBasic.vue';

export default {
  components: {
    ModalBasic,
  },
};
</script>

<style lang="scss">
  .about-modal {
    .descr {
      font-size: 12px;
    }
    .project-descr {
      font-size: 18px;
    }
  }
</style>
