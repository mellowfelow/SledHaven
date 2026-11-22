(function () {
  if (typeof window === 'undefined') return;
  var tools = [
    {
      name: 'list_snowmobiles',
      description: 'Fetch in-stock SledHaven snowmobiles and alpine gear.',
      execute: function (args) {
        var cat = args && args.category ? '?category=' + encodeURIComponent(args.category) : '';
        return fetch('/api/products/' + cat).then(function (r) { return r.json(); });
      }
    },
    {
      name: 'search_snowmobiles',
      description: 'Search SledHaven inventory by keyword.',
      execute: function (args) {
        var q = args && args.query ? encodeURIComponent(args.query) : '';
        return fetch('/api/search/?q=' + q).then(function (r) { return r.json(); });
      }
    }
  ];
  window.__WEBMCP_TOOLS__ = tools;
  if (navigator && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
    tools.forEach(function (t) {
      try { navigator.modelContext.registerTool(t); } catch (e) {}
    });
  }
})();
