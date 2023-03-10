export const User = function User() {
  this.id = null;
  this.username = null;
  this.email = null;
  this.roles = [];
  this.accessToken = null;
};

export const List = function List() {
  this.title = null;
  this.isPrivate = true;
  this.tags = [];
  this.categories = [];
};

export const Item = function Item({ title = '', tags = [], category = null } = {}) {
  this.title = title;
  this.details = '';
  this.tags = tags;
  this.category = category;
};
