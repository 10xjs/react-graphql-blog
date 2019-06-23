import {
  createBrowserHistory,
  Location,
  History,
  BrowserHistoryBuildOptions,
} from 'history';

// Restore the scroll position on history API back calls. This works in most
// browsers for back and forward navigation events, but does not set the
// scroll position on push and replace events - which is solved by patching
// the react-router history object below.
history.scrollRestoration = 'auto';

const createRouterHistory = (options?: BrowserHistoryBuildOptions): History => {
  const routerHistory = createBrowserHistory(options);

  let previousLocation: Location = routerHistory.location;
  routerHistory.listen((location, action) => {
    const hashChange = location.hash !== previousLocation.hash;
    const searchChange = location.search !== previousLocation.search;
    const pathChange = location.pathname !== previousLocation.pathname;

    let scrolled = false;

    if (hashChange || !searchChange || !pathChange) {
      const [, hash] = location.hash.split('#');
      requestAnimationFrame(() => {
        const scrollTo = (top: number) => {
          scrolled = true;
          window.scrollTo({top, behavior: pathChange ? 'auto' : 'smooth'});
        };
        if (hash) {
          const target = document.querySelector(`#${hash}, [name=${hash}]`);
          if (target) {
            scrollTo(target.getBoundingClientRect().top + window.pageYOffset);
          }
        } else if (hashChange) {
          scrollTo(0);
        }
      });
    }

    if (
      (!scrolled && pathChange && action === 'PUSH') ||
      action === 'REPLACE'
    ) {
      window.scrollTo({top: 0});
    }

    previousLocation = location;
  });

  return routerHistory;
};

export default createRouterHistory();
