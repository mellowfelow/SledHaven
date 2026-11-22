(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'search_products',
        description: 'Search the SledHaven snowmobile and gear catalog by keyword and optional category.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keyword' },
            category: { type: 'string', description: 'Optional category slug: mountain, trail, touring, utility' }
          }
        },
        execute: async function (args) {
          var q = args && args.query ? encodeURIComponent(args.query) : '';
          var cat = args && args.category ? '&category=' + encodeURIComponent(args.category) : '';
          var res = await fetch('/api/search/?q=' + q + cat);
          return res.json();
        }
      },
      {
        name: 'list_categories',
        description: 'List SledHaven snowmobile categories with product counts.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function () {
          var res = await fetch('/api/categories/');
          return res.json();
        }
      },
      {
        name: 'browse_products',
        description: 'Browse the full inventory, optionally filtered by category.',
        inputSchema: {
          type: 'object',
          properties: { category: { type: 'string', description: 'Category slug to browse' } }
        },
        execute: async function (args) {
          var url = args && args.category
            ? 'https://sledhaven.com/shop/' + args.category + '/'
            : 'https://sledhaven.com/shop/';
          window.location.href = url;
          return { url: url };
        }
      },
      {
        name: 'contact',
        description: 'Open the SledHaven contact/concierge page for sales or support questions.',
        inputSchema: { type: 'object', properties: {} },
        execute: async function () {
          window.location.href = 'https://sledhaven.com/contact/';
          return { url: 'https://sledhaven.com/contact/' };
        }
      }
    ]
  });
})();
