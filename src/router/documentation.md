# Vue Router implementation in IDLI

**isLoginRequired for beforeEach guard:**
meta field "isLoginRequired" check is used to redirect to auth page 
if user is not logged in for viewing some paths.

**handleQueryOnLoad:**
currently, query is handled after a list is fetched from server in MainList created hook.
this only works on "list" router path,
i.e. on "?sidebar=lists" with "/" home path, sidebar will *not* be opened.

**defaultQueryValues in /config.js:**
are used for check and remove query if value is default.

**store as SOT:**
components change Vuex store, store changes routes (and routes may change store on load).
this prevents from using watchers, and makes store the only SOT.
e.g. sidebarMode: 
click on page mutates the mode, changing sidebar display, and adds corresponding query.
(the exception is right below - "item" path)

**"item" path:**
currently, a single item can be viewed by its ID only if manually put in URL (/item/:id).
SingleItem is the only component which pushes query to router without changing store.
