<script>
import ButtonText from '@/components/formElements/ButtonText.vue';
import ErrorMessage from '@/components/textElements/ErrorMessage.vue';
import PasswordField from '@/components/auth/PasswordField.vue';
import CheckboxCustom from '@/components/formElements/CheckboxCustom.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    ButtonText,
    ErrorMessage,
    PasswordField,
    CheckboxCustom,
  },
  data: () => ({
    currentPassword: '',
    newPassword: '',
    passwordToCheck: '',
    isRequestProcessing: false,
    errorMessage: '',
    logoutFromAllDevices: false,
  }),
  computed: {
    isChangeButtonActive() {
      return this.currentPassword
        && this.newPassword
        && this.passwordToCheck 
        && !this.isRequestProcessing;
    },
  },
  methods: {
    ...mapActions('auth', [
      '_changePassword',
    ]),
    clearMessage() {
      this.errorMessage = '';
    },
    closePasswordChangeModal() {
      this.$vfm.hide('passwordChangeModal');
    },
    changePassword() {
      if (this.newPassword === this.passwordToCheck) {
        this.clearMessage();
        this.isRequestProcessing = true;
        this._changePassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          isLogoutFromAllDevices: this.logoutFromAllDevices,
        })
          .then(() => {
            this.closePasswordChangeModal();
          })
          .catch(errorMessage => {
            this.errorMessage = errorMessage;
          })
          .finally(() => {
            this.isRequestProcessing = false;
          });
      } else {
        this.errorMessage = 'passwords don\'t match';
      }
    },
  },
};
</script>

<template>
  <form
    class="password-change-form"
    @submit.prevent="changePassword"
  >
    <div class="input-fields">
      <PasswordField
        v-model="currentPassword"
        label="current password"
        @input="clearMessage"
      />
      <PasswordField
        v-model="newPassword"
        label="new password"
        @input="clearMessage"
      />
      <PasswordField
        v-model="passwordToCheck"
        label="confirm password"
        @input="clearMessage"
      />
    </div>
    <div class="logout-checkbox">
      <CheckboxCustom
        v-model="logoutFromAllDevices"
        style-type="initial"
        label="Log out from all devices"
      />
    </div>
    <div class="error-container">
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
      />
    </div>
    <ButtonText
      text="change password"
      style-type="bordered"
      type="submit"
      :disabled="!isChangeButtonActive"
    />
  </form>
</template>

<style lang="scss">
.password-change-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 10px;

  .input-fields {
    display: flex;
    flex-direction: column;
  }

  .input-fields,
  .logout-checkbox,
  .error-container {
    width: 100%;
  }

  .logout-checkbox {
    padding-top: 10px;
  }

  .error-container {
    height: 30px;
  }
}
  
</style>
