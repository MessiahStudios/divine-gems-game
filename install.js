(function () {
    var deferredPrompt = null;
    var assetsReady = false;
    var gameplayActive = false;
    var clickBound = false;
    var notNowBound = false;
    var dismissBound = false;
    var fallbackTimer = null;
    var BIP_WAIT_MS = 2800;
    var DISMISS_KEY = 'divinegems-install-hint-dismissed';

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.navigator.standalone === true;
    }

    function detectPlatform() {
        var ua = navigator.userAgent || '';
        var platform = navigator.platform || '';
        var maxTouch = navigator.maxTouchPoints || 0;
        var isIOS = /iPad|iPhone|iPod/i.test(ua) ||
            (platform === 'MacIntel' && maxTouch > 1);
        var isAndroid = /Android/i.test(ua);
        var isWindows = /Win/i.test(platform) || /Windows/i.test(ua);
        var isMac = !isIOS && (/Mac/i.test(platform) || /Macintosh/i.test(ua));
        var isLinux = /Linux/i.test(platform) && !isAndroid;
        return {
            isIOS: isIOS,
            isAndroid: isAndroid,
            isWindows: isWindows,
            isMac: isMac,
            isLinux: isLinux,
            isDesktop: !isIOS && !isAndroid
        };
    }

    function chromiumInstallLabel(p) {
        if (p.isAndroid) {
            return 'Install Divine Gems';
        }
        if (p.isIOS) {
            return 'Install';
        }
        if (p.isWindows) {
            return 'Install Divine Gems (Windows)';
        }
        if (p.isMac) {
            return 'Install Divine Gems (Mac)';
        }
        if (p.isLinux) {
            return 'Install Divine Gems (Linux)';
        }
        return 'Install Divine Gems';
    }

    function hintForIOS(p) {
        if (p.isIOS) {
            return 'To install on this iPhone or iPad: tap <strong>Share</strong> <span aria-hidden="true">(□↑)</span>, then <strong>Add to Home Screen</strong>.';
        }
        return '';
    }

    function hintForAndroidFallback() {
        return 'To install on Android: open the browser <strong>menu (⋮)</strong> and choose <strong>Install app</strong>, <strong>Add to Home screen</strong>, or <strong>Install</strong> (wording varies). Chrome usually offers the best install experience.';
    }

    function hintForDesktopFallback(p) {
        if (p.isWindows) {
            return 'To install on Windows: look for an <strong>Install</strong> or <strong>App</strong> icon in the address bar, or open the browser menu and choose <strong>Install Divine Gems</strong>.';
        }
        if (p.isMac) {
            return 'To install on Mac: look for an <strong>Install</strong> or <strong>App</strong> icon in the address bar, or use the browser <strong>File</strong> / <strong>View</strong> menu for install options.';
        }
        if (p.isLinux) {
            return 'To install on Linux: look for an <strong>Install</strong> icon in the address bar or use the browser menu to install this app.';
        }
        return 'To install: use your browser’s <strong>Install</strong> or <strong>App</strong> option, often shown in the address bar.';
    }

    function hintDismissed() {
        try {
            return window.sessionStorage.getItem(DISMISS_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function setHintDismissed() {
        try {
            window.sessionStorage.setItem(DISMISS_KEY, '1');
        } catch (ignore) { }
    }

    function hideInstallUI() {
        var footer = document.getElementById('footer');
        var actions = document.getElementById('footerInstallActions');
        var btn = document.getElementById('footerInstallButton');
        var notNow = document.getElementById('footerNotNowInstall');
        var hint = document.getElementById('footerInstallHint');
        var dismissBtn = document.getElementById('footerDismissInstallHint');
        if (footer) {
            footer.style.display = 'none';
        }
        if (actions) {
            actions.style.display = 'none';
        }
        if (btn) {
            btn.style.display = 'none';
        }
        if (notNow) {
            notNow.style.display = 'none';
        }
        if (hint) {
            hint.style.display = 'none';
            hint.innerHTML = '';
        }
        if (dismissBtn) {
            dismissBtn.style.display = 'none';
        }
    }

    function showFooterChrome() {
        var footer = document.getElementById('footer');
        if (footer) {
            footer.style.display = 'block';
        }
    }

    function bindDismissIfNeeded() {
        if (dismissBound) {
            return;
        }
        var dismissBtn = document.getElementById('footerDismissInstallHint');
        if (!dismissBtn) {
            return;
        }
        dismissBound = true;
        dismissBtn.addEventListener('click', function () {
            setHintDismissed();
            hideInstallUI();
        });
    }

    function bindNotNowIfNeeded() {
        if (notNowBound) {
            return;
        }
        var notNow = document.getElementById('footerNotNowInstall');
        if (!notNow) {
            return;
        }
        notNowBound = true;
        notNow.addEventListener('click', function () {
            setHintDismissed();
            hideInstallUI();
        });
    }

    function showChromiumInstallButton() {
        var p = detectPlatform();
        var footer = document.getElementById('footer');
        var actions = document.getElementById('footerInstallActions');
        var btn = document.getElementById('footerInstallButton');
        var notNow = document.getElementById('footerNotNowInstall');
        var hint = document.getElementById('footerInstallHint');
        var dismissBtn = document.getElementById('footerDismissInstallHint');
        if (!footer || !btn || !actions || !notNow) {
            return;
        }
        if (hint) {
            hint.style.display = 'none';
            hint.innerHTML = '';
        }
        if (dismissBtn) {
            dismissBtn.style.display = 'none';
        }
        btn.textContent = chromiumInstallLabel(p);
        btn.style.display = 'inline-flex';
        notNow.style.display = 'inline-flex';
        actions.style.display = 'flex';
        showFooterChrome();
        bindNotNowIfNeeded();

        if (!clickBound) {
            clickBound = true;
            btn.addEventListener('click', function () {
                if (!deferredPrompt) {
                    return;
                }
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function (choice) {
                    console.log('Install prompt outcome:', choice && choice.outcome);
                    deferredPrompt = null;
                    hideInstallUI();
                }).catch(function () {
                    deferredPrompt = null;
                });
            });
        }
    }

    function showManualInstallHint(html, showDismiss) {
        var footer = document.getElementById('footer');
        var actions = document.getElementById('footerInstallActions');
        var btn = document.getElementById('footerInstallButton');
        var notNow = document.getElementById('footerNotNowInstall');
        var hint = document.getElementById('footerInstallHint');
        var dismissBtn = document.getElementById('footerDismissInstallHint');
        if (!footer || !hint) {
            return;
        }
        if (actions) {
            actions.style.display = 'none';
        }
        if (btn) {
            btn.style.display = 'none';
        }
        if (notNow) {
            notNow.style.display = 'none';
        }
        hint.innerHTML = html;
        hint.style.display = 'block';
        showFooterChrome();
        if (showDismiss && dismissBtn) {
            dismissBtn.style.display = 'inline-flex';
            bindDismissIfNeeded();
        } else if (dismissBtn) {
            dismissBtn.style.display = 'none';
        }
    }

    function clearFallbackTimer() {
        if (fallbackTimer !== null) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
        }
    }

    function showFallbackHintAfterDelay() {
        clearFallbackTimer();
        fallbackTimer = setTimeout(function () {
            fallbackTimer = null;
            if (!assetsReady || isStandalone() || hintDismissed() || gameplayActive) {
                return;
            }
            if (deferredPrompt) {
                return;
            }
            var p = detectPlatform();
            if (p.isIOS) {
                return;
            }
            if (p.isAndroid) {
                showManualInstallHint(hintForAndroidFallback(), true);
            } else {
                showManualInstallHint(hintForDesktopFallback(p), true);
            }
        }, BIP_WAIT_MS);
    }

    function updateInstallUI() {
        if (isStandalone()) {
            clearFallbackTimer();
            hideInstallUI();
            return;
        }
        if (!assetsReady || gameplayActive) {
            if (gameplayActive) {
                clearFallbackTimer();
                hideInstallUI();
            }
            return;
        }
        if (hintDismissed()) {
            clearFallbackTimer();
            hideInstallUI();
            return;
        }

        var p = detectPlatform();

        if (p.isIOS) {
            clearFallbackTimer();
            if (deferredPrompt) {
                deferredPrompt = null;
            }
            showManualInstallHint(hintForIOS(p), true);
            return;
        }

        if (deferredPrompt) {
            clearFallbackTimer();
            showChromiumInstallButton();
            return;
        }

        clearFallbackTimer();
        showFallbackHintAfterDelay();
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        clearFallbackTimer();
        updateInstallUI();
    });

    window.addEventListener('divinegems-assets-ready', function () {
        assetsReady = true;
        updateInstallUI();
    });

    window.addEventListener('divinegems-gameplay-started', function () {
        gameplayActive = true;
        clearFallbackTimer();
        hideInstallUI();
    });

    window.addEventListener('divinegems-returned-to-menu', function () {
        gameplayActive = false;
        updateInstallUI();
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        hideInstallUI();
    });

    window.addEventListener('load', function () {
        if (isStandalone()) {
            hideInstallUI();
        }
    });
})();
