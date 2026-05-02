// Bump version when precache list changes so old caches are dropped.
const CACHE_NAME = 'divine-gems-v2';

self.addEventListener('install', function (event) {
  var base = self.registration.scope;
  function u(path) {
    return new URL(path, base).href;
  }

  var filesToCache = [
    u('index.html'),
    u('app.js'),
    u('manifest.json'),
    u('style.css'),
    u('bar.js'),
    u('counter.js'),
    u('favicon.ico'),
    u('match3.js'),
    u('jquery-1.11.1.min.js'),
    u('wade.ifx_1.0.js'),
    u('wade.particles_1.0.1.js'),
    u('wade_1.5.js'),
    u('install.js'),
    u('fonts/Akashi.eot'),
    u('fonts/Akashi.svg'),
    u('fonts/Akashi.ttf'),
    u('fonts/Akashi.woff'),
    u('fonts/MonospaceTypewriter.eot'),
    u('fonts/MonospaceTypewriter.svg'),
    u('fonts/MonospaceTypewriter.ttf'),
    u('fonts/MonospaceTypewriter.woff'),
    u('images/background.png'),
    u('images/backgroundShareBox.png'),
    u('images/barTime.png'),
    u('images/bigBoom.png'),
    u('images/buttonBack.png'),
    u('images/buttonCredit.png'),
    u('images/buttonPause.png'),
    u('images/buttonPlay.png'),
    u('images/buttonSoundOff.png'),
    u('images/buttonSoundOn.png'),
    u('images/buttonUnpause.png'),
    u('images/buttonsMuteOff.png'),
    u('images/buttonsMuteOn.png'),
    u('images/christian_arabic_symbol_glow.png'),
    u('images/christian_arabic_symbol_new.png'),
    u('images/cross_object_glow.png'),
    u('images/cross_object_new.png'),
    u('images/crown_object_glow.png'),
    u('images/crown_object_new.png'),
    u('images/dgTitle.png'),
    u('images/divineGemsTitle.png'),
    u('images/divineGemsTitle_padded_192x192.png'),
    u('images/divineGemsTitle_padded_512x512.png'),
    u('images/fbSend.png'),
    u('images/fb_R.png'),
    u('images/fish_symbol_glow.png'),
    u('images/fish_symbol_new.png'),
    u('images/fiveEffect.png'),
    u('images/fiveEffect2.png'),
    u('images/flash.png'),
    u('images/gh_R.png'),
    u('images/imdb_R.png'),
    u('images/installButton.png'),
    u('images/inst_R.png'),
    u('images/li_R.png'),
    u('images/markerTime.png'),
    u('images/menuBackground.png'),
    u('images/nails_object_glow.png'),
    u('images/nails_object_new.png'),
    u('images/potionBar.png'),
    u('images/scoreArea.png'),
    u('images/selected.png'),
    u('images/shatter.png'),
    u('images/special4.png'),
    u('images/special5-lion.png'),
    u('images/specialEffect1.png'),
    u('images/x_R.png'),
    u('images/top.png'),
    u('images/topWithScore.png'),
    u('images/trinity_object_glow.png'),
    u('images/trinity_object_new.png'),
    u('images/wadePowered.png'),
    u('images/yt_R.png'),
    u('sounds/Explosion3.aac'),
    u('sounds/Explosion3.ogg'),
    u('sounds/PowerUp8.aac'),
    u('sounds/PowerUp8.ogg'),
    u('sounds/Walperion-Music-Ode-to-Victory.aac'),
    u('sounds/Walperion-Music-Ode-to-Victory.ogg'),
    u('sounds/fiveSound-lion.aac'),
    u('sounds/fiveSound-lion.ogg'),
    u('sounds/fiveSound-lionAtWAR.ogg')
  ];

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
