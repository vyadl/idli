export default {
  User() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.roles = [];
    this.accessToken = null;
  },
  List() {
    this.name = null;
    this.isPrivate = true;
    this.tags = [];
    this.categories = [];
  },
  Item() {
    this.text = null;
    this.details = null;
    this.tags = [];
    this.category = null;
  },
};
