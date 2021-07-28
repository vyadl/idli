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
    this.items = [];
    this.filters = {
      tags: [],
      categories: [],
    };
    this.checkedFilters = {
      tags: [],
      categories: [],
    };
    this.isPrivate = true;
  },
};
