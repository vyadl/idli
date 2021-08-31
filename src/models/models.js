module.exports = {
  User() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.roles = [];
    this.accessToken = null;
  },
  List() {
    this.title = null;
    this.isPrivate = true;
    this.tags = [];
    this.categories = [];
  },
  Item() {
    this.title = null;
    this.details = '';
    this.tags = [];
    this.category = null;
  },
};
