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
    this.id = null;
    this.isPrivate = true;
    this.items = [];
    this.tags = [];
    this.categories = [];
  },
  Item() {
    this.id = null;
    this.text = null;
    this.details = null;
    this.tags = [];
    this.category = null;
  },
};
