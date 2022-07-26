export const User = () => {
  this.id = null;
  this.username = null;
  this.email = null;
  this.roles = [];
  this.accessToken = null;
};

export const List = () => {
  this.title = null;
  this.isPrivate = true;
  this.tags = [];
  this.categories = [];
};

export const Item = () => {
  this.title = null;
  this.details = '';
  this.tags = [];
  this.category = null;
};
