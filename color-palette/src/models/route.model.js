function routeRender(routes) {
  if (!location.hash) {
    history.replaceState(null, "", "/#/");
  }

  const routeView = document.querySelector("route-view");
  const [hash, queryString = ""] = location.hash.split("?");
  const query = queryString.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    acc[key] = value;
    return acc;
  }, {});

  history.replaceState(query, "");
  const currentRoute = routes.find((route) => {
    return new RegExp(`${route.path}/?$`).test(hash);
  });

  routeView.innerHTML = "";
  routeView.append(new currentRoute.component().el);
  window.scrollTo(0, 0);
}

function createRouter(routes) {
  return function () {
    window.addEventListener("popstate", () => {
      routeRender(routes);
    });
    routeRender(routes);
  };
}

export default createRouter;
