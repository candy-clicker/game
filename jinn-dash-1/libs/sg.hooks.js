var SG = {
    lang: 'en'
}
var SG_Hooks = {
    documentLoaded: false,

    getLanguagesCalled: false,
    loadedCalled: false,
    startCalled: false,
    levelUpCalled: false,
    gameOverCalled: false,

    setOrientationHandlerCalled: false,
    setUnpauseHandlerCalled: false,

    startMultiplayerModeCalled: false,
    startSingleplayerModeCalled: false,

    commandObserver: null,

    ingameCurrnecy: 1000,

    getIngameCurrencyCalled: null,
    addIngameCurrencyCalled: null,
    deductIngameCurrencyCalled: null,

    unlockedBoosters: ['booster-1', 'booster-2'],

    getUnlockedBoostersCalled: null,
    addBoosterCalled: null,
    deductBoosterCalled: null,

    unlockedItems: ['items-1', 'items-2'],

    getUnlockedItemsCalled: null,
    addItemCalled: null,
    deductItemCalled: null,

    offerCompletedCalled: null,

    registerObserverCalled: false,
    assignPlayMatchCallbackCalled: false,

    triggerGiftCalled: false,
    giftTypePlain: 'gift-type-plain',
    giftTypeIncentivised: 'gift-type-incentivised',
    giftTypeCpi: 'gift-type-cpi',

    triggerWalkthroughCalled: false,

    triggerDailyTaskCalled: false,
    getAmountOfDailyTasksTodoCalled: false,

    tiresDefinitionFileExists: false,
    boostersDefinitioFileExists: false,

    crossPromotionLinkClicked: false,

    pageDisplayedCalled: false,

    PAGE_WELCOME_SCREEN: 'welcome-screen',
    PAGE_MODE_SELECTION: 'mode-selection',
    PAGE_MAIN_MENU: 'main-menu',
    PAGE_READY_FOR_MATCH: 'ready-for-match',
    PAGE_PAUSE: 'pause',
    PAGE_GAME_OVRE: 'game-over',
    PAGE_LEVELS_MAP: 'levels-map',
    PAGE_SHOP: 'shop',

    OFFER_TYPE_BOOSTER: 'booster',
    OFFER_TYPE_ITEM: 'item',
    OFFER_TYPE_LIFE: 'life',

    storageGetUsed: false,
    storageSetUsed: false,

    _loadFile: function (file, callback) {
        var client = new XMLHttpRequest();
        client.open('GET', file, true);
        client.onreadystatechange = function () {
            if (client.readyState == 4 && client.status == 200) {
                callback();
            }
        };
        client.send();
    },

    _getQueryParam: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
    },

    _getLocaleParam: function () {
        return this._getQueryParam('locale');
    },

    getLanguage: function (supportedLanguages) {
        if (!SG_Hooks.documentLoaded) {
            throw "Softgames - getLanguage: Do not call getLanguage before document is fully loaded. use window.onload to start your game!";
        } else if ((Object.prototype.toString.call(supportedLanguages)).toLowerCase() != "[object array]") {
            throw "Softgames - getLanguage: No supported languages given. Please call SG_Hooks.getLanguage(['en','es',...]) - Array of Strings required!";
        }

        var selectedLanguage = this._getLocaleParam();
        if (selectedLanguage === undefined) {
            var randomIndex = Math.floor(Math.random() * supportedLanguages.length);
            selectedLanguage = supportedLanguages[randomIndex];
            SG_log("Softgames - getLanguage: '" + supportedLanguages.toString() + "' successfully initiated. Randomly chosen was '" + selectedLanguage + "'");
        } else {
            SG_log("Softgames - getLanguage: '" + supportedLanguages.toString() + "' successfully initiated. Selected language is '" + selectedLanguage + "'");
        }

        SG_Hooks.getLanguagesCalled = true;

        return selectedLanguage;
    },

    track: function (eventName, eventData) {
        SG_Log("Track: " + eventName, eventData);
    },

    getGameConfig: function () {
        var json = {
            "levels": {
                "1": {
                    "points": 100,
                    "time": 18
                }
            },
            "breakBetweenRetries": {
                "enabled": true,
                "maxAmountOfRetries": 5,
                "timeToWait": 600
            },
            "highscores": {
                "enableEmbedViews": true
            },
            "gifts": {
                "enabled": true,
                "plainGift": {
                    "inGame": 20,
                    "mapOrMenu": 30,
                    "levelStart": 20,
                    "rewarding": 40,
                    "dailyRewards": 30
                },
                "incentivisedGift": {
                    "inGame": 60,
                    "mapOrMenu": 40,
                    "levelStart": 20,
                    "rewarding": 10,
                    "dailyRewards": 35
                },
                "cpiGift": {
                    "inGame": 20,
                    "mapOrMenu": 30,
                    "levelStart": 60,
                    "rewarding": 50,
                    "dailyRewards": 25
                }
            },
            "walkthrough": {
                "enabled": true,
                "iconPath": "//d1bjj4kazoovdg.cloudfront.net/assets/games/2020-tetra/small_icon.jpg"
            },
            "dailyTasks": {
                "enabled": true
            },
            "dailyRewards": {
                "enabled": true
            },
            "crossPromotion": {
                "enabled": true,
                "links": {
                    "iconPath": "//d1bjj4kazoovdg.cloudfront.net/assets/games/2020-tetra/small_icon.jpg",
                    "href": "//m.softgames.de",
                    "action": function () {
                        SG_Hooks.crossPromotionLinkClicked = true;
                    }
                }
            }
        };
        return window.btoa(JSON.stringify(json));
    },

    loadProgress: function(progress){
        window._azerionIntegrationSDK.onLoadProgress(progress);
    },

    loaded: function () {
        if (SG_Hooks.loadedCalled) {
            throw "Softgames - loaded: loaded already called";
        }
        //TODO: validate if game is loaded somehow ?
        SG_Hooks.loadedCalled = true;
        window._azerionIntegrationSDK.removeSplashLoader(function() {
            if (SG_Hooks.registerObserverCalled) {
                SG_Hooks.commandObserver({action: 'runGame'});
            }
        }.bind(this));
    },

    start: function () {
        if (!SG_Hooks.documentLoaded) {
            throw "Softgames - start: Do not call start() before document is fully loaded. use window.onload to start your game!";
        }
        if (!SG_Hooks.loadedCalled) {
            throw "Softgames - start: Start should not be called before loaded was called";
        }
        SG_Hooks.startCalled = true;
    },


    isEnabledIncentiviseButton: function () {
        return true;
    },

    levelStarted: function (level) {
        if (!SG_isNothing(level) && !SG_isInt(level)) {
            throw "Softgames - levelStarted(level): The 'level'-parameter must be an integer '" + (typeof level) + "' given.";
        }

        SG_log("Softgames - levelStarted: call successful - level=" + level);
        SG_Hooks.levelStartedCalled = true;
    },

    levelFinished: function (level, score) {
        if (!SG_isNothing(level) && !SG_isInt(level)) {
            throw "Softgames - levelFinished(level,score): The 'level'-parameter must be an integer '" + (typeof level) + "' given.";
        }

        if (!SG_isNothing(score) && !SG_isInt(score)) {
            throw "Softgames - levelFinished(level,score): The 'score'-parameter must be an integer '" + (typeof level) + "' given.";
        }

        SG_log("Softgames - levelFinished: call successful - level=" + level + ", score=" + score);
        SG_Hooks.levelFinishedCalled = true;
    },

    tutorialFinished: function () {
        SG_log("Softgames - tutorialFinished: call successful");
        SG_Hooks.tutorialFinishedCalled = true;
    },

    levelUp: function (level, score) {
        if (!SG_isNothing(level) && !SG_isInt(level)) {
            throw "Softgames - levelUp(level,score): The 'level'-parameter must be an integer '" + (typeof level) + "' given.";
        }

        // score is optional
        if (!SG_isNothing(score) && !SG_isInt(score)) {
            throw "Softgames - levelUp(level,score): The 'score'-parameter must be an integer, '" + (typeof score) + "' given.";
        }

        SG_log("Softgames - levelUp: call successful - level=" + level + ", score=" + score);
        SG_Hooks.levelUpCalled = true;
    },

    gameOver: function (level, score) {
        if (!SG_isNothing(level) && !SG_isInt(level)) {
            throw "Softgames - gameOver(level,score): The 'level'-parameter must be an integer '" + (typeof level) + "' given.";
        }

        if (!SG_isNothing(score) && !SG_isInt(score)) {
            throw "Softgames - gameOver(level,score): The 'score'-parameter must be an integer, '" + (typeof score) + "' given.";
        }

        SG_log("Softgames - gameOver: call successful - level=" + level + ", score=" + score);
        SG_Hooks.gameOverCalled = true;
    },
    setOrientationHandler: function (f) {

        if (!SG_isFunction(f)) {
            throw "Softgames - setOrientationHandler: The 'f'-parameter must be a function, '" + (typeof f) + "' given.";
        }

        SG_log("Softgames - setOrientationHandler: call successful - orientationHandler=" + f);
        SG_Hooks.setOrientationHandlerCalled = true;
    },

    setResizeHandler: function (f) {
        if (!SG_isFunction(f)) {
            throw "Softgames - setResizeHandler: The 'f'-parameter must be a function, '" + (typeof f) + "' given.";
        }

        SG_log("Softgames - setResizeHandler: call successful - resizeHandler=" + f);
        SG_Hooks.setResizeHandlerCalled = true;
    },

    setPauseHandler: function (f) {
        if (!SG_isFunction(f)) {
            throw "Softgames - setPauseHandler: The 'f'-parameter must be a function, '" + (typeof f) + "' given.";
        }

        SG_log("Softgames - setPauseHandler: call successful - pauseHandler=" + f);
        SG_Hooks.setPauseHandlerCalled = true;
    },

    setUnpauseHandler: function (f) {
        if (!SG_isFunction(f)) {
            throw "Softgames - setUnpauseHandler: The 'f'-parameter must be a function, '" + (typeof f) + "' given.";
        }

        SG_log("Softgames - setUnpauseHandler: call successful - pauseHandler=" + f);
        SG_Hooks.setUnpauseHandlerCalled = true;
    },

    triggerIncentivise: function (callback) {
        window._azerionIntegrationSDK.showRewardedAd('incentivise', function() {
            callback(true);
        }, function() {
            callback(false);
        })
    },

    triggerMidrollAd:function (callback){
        if(game) {
            if(!JinnDash.player.mute) {
                game.sound.mute = true;
            }
            game.paused = true;
        }
        window._azerionIntegrationSDK.showInterstitialAd('midroll', function() {
            if(game) {
                if(!JinnDash.player.mute) {
                    game.sound.mute = false;
                }
                game.paused = false;
            }
            callback();
        })
    },

    triggerLogin: function (callback) {
        callback(true);
    },

    triggerMoreGames: function () {
        return true;
    },

    getLoginButton: function (optional, callback) {
        setTimeout(function () {
            callback({status: 'success'});
        }, 5000);

        return {
            type: 'facebook',
            content: '<button>FB</button>'
        };
    },

    isLoginButtonEnabled: function (callback) {
        callback(true);
    },

    getHighscoresPerLevel: function (level, callback) {
        if (!SG_isNothing(level) && !SG_isInt(level)) {
            throw "Softgames - getHighscoresPerLevel(level): The 'level'-parameter must be an integer'" + (typeof level) + "' given.";
        }
        SG_log("Softgames - getHighscoresPerLevel: call successful - level=" + level);
        fake_data =
            {
                "scores": [
                    {
                        "0": {
                            "list": [
                                {
                                    "id": 223110261,
                                    "name": "User1",
                                    "score": 27,
                                    "avatar": "http://graph.facebook.com/10206790858/picture?type=square",
                                    "position": 1
                                },
                                {"id": 208955982, "name": "User2", "score": 26, "avatar": "", "position": 2},
                                {
                                    "id": 215733503,
                                    "name": "User3",
                                    "score": 16,
                                    "avatar": "http://graph.facebook.com/10203865942/picture?type=square",
                                    "position": 3
                                },
                                {
                                    "id": 222675254,
                                    "name": "User4",
                                    "score": 10,
                                    "avatar": "http://graph.facebook.com/92252686115/picture?type=square",
                                    "position": 4
                                },
                                {
                                    "id": 222586955,
                                    "name": "User5",
                                    "score": 8,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 5
                                },
                                {
                                    "id": 222586956,
                                    "name": "User6",
                                    "score": 7,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 6
                                },
                                {
                                    "id": 222586957,
                                    "name": "User7",
                                    "score": 6,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 7
                                },
                                {
                                    "id": 222586958,
                                    "name": "User8",
                                    "score": 5,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 8
                                },
                                {
                                    "id": 222586969,
                                    "name": "User9",
                                    "score": 4,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 9
                                },
                                {
                                    "id": 222910,
                                    "name": "User10",
                                    "score": 3,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 10
                                }
                            ],
                            "currentUser": {
                                "id": 222586955,
                                "name": "User5",
                                "score": 8,
                                "avatar": "http://graph.facebook.com/102051119/picture?type=square"
                            },
                            "amountOfLevelPlayers": 50
                        }
                    },
                    {
                        "1": {
                            "list": [
                                {
                                    "id": 223110269,
                                    "name": "User1",
                                    "score": 65,
                                    "avatar": "http://graph.facebook.com/10206790858/picture?type=square",
                                    "position": 1
                                },
                                {"id": 208955986, "name": "User2", "score": 55, "avatar": "", "position": 2},
                                {
                                    "id": 215733500,
                                    "name": "User3",
                                    "score": 50,
                                    "avatar": "http://graph.facebook.com/10203865942/picture?type=square",
                                    "position": 3
                                },
                                {
                                    "id": 222675250,
                                    "name": "User4",
                                    "score": 49,
                                    "avatar": "http://graph.facebook.com/92252686115/picture?type=square",
                                    "position": 4
                                },
                                {
                                    "id": 222586959,
                                    "name": "User5",
                                    "score": 48,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 5
                                },
                                {
                                    "id": 222586956,
                                    "name": "User6",
                                    "score": 47,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 6
                                },
                                {
                                    "id": 222586957,
                                    "name": "User7",
                                    "score": 46,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 7
                                },
                                {
                                    "id": 222586958,
                                    "name": "User8",
                                    "score": 45,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 8
                                },
                                {
                                    "id": 222586969,
                                    "name": "User9",
                                    "score": 44,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 9
                                },
                                {
                                    "id": 222910,
                                    "name": "User10",
                                    "score": 43,
                                    "avatar": "http://graph.facebook.com/102051119/picture?type=square",
                                    "position": 10
                                }
                            ],
                            "currentUser": {
                                "id": 222586955,
                                "name": "User555",
                                "score": 8,
                                "avatar": "http://graph.facebook.com/102051119/picture?type=square"
                            },
                            "amountOfLevelPlayers": 20
                        }
                    },
                    {
                        "2": {
                            "list": [],
                            "currentUser": {
                                "id": 222586955,
                                "name": "User555",
                                "score": 8,
                                "avatar": "http://graph.facebook.com/102051119/picture?type=square"
                            },
                            "amountOfLevelPlayers": 0
                        }
                    }]
            };
        callback(fake_data.scores[level]);
    },

    getOffers: function (section, callback) {
        if (!SG_isFunction(callback)) {
            throw "Softgames - getOffers: The 'callback' must be a function, '" + (typeof callback) + "' given.";
        }

        callback([{
            "id": 123,
            "infoText": "Don't want to wait? Install and open to get MORE lives!",
            "iconURL": "https://games.softgames.de/assets/offer-icon.png",
            "title": "Game name feed",
            "buttonText": "Any text feed",
            "buttonURL": 'http://m.softgames.de'
        }]);
    },

    startOffer: function (offerId, callback) {
        if (!SG_isFunction(callback)) {
            throw "Softgames - getOffers: The 'callback' must be a function, '" + (typeof callback) + "' given.";
        }

        setTimeout(function () {
            callback({
                "breakBetweenRetries": {
                    "id": 1,
                    "maxAmountOfRetries": 5,
                    "timeToWait": 600
                }
            });
        }, 5000);
    },

    getNativeAds: function (amount, callback) {
        if (!SG_isFunction(callback)) {
            throw "Softgames - getNativeAds: The 'callback' must be a function, '" + (typeof callback) + "' given.";
        }

        item = {
            "id": 123,
            "title": "Awesome game",
            "description": "Free",
            "rating": 3.5,
            "buttonText": "Play now",
            "buttonLink": "http://m.softgames.de",
            "iconBase64": "data:image/png;base64,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4W3le8hd/+G1P9Ill3xRE1uaaQu2WS2JlF5LmGbftWQId8iLDK+J6sqKatVRVfr9rRu1duvbOvKoQw7QFRcfp7ENTSouIh4OVNof8+i2vz+hS390w86p/sqHp2h+i/SXp9t129P5YgV7897rvqzZc/dFnOMFoFJ6eOvpl1frost+wLvGIwb/CoCoXDPry7Vma6ceWj6o1RRH0czGeS9/hwpilFQA8/YMqK6pST/5yU904omEYLFd7LoL0i7/+T13PyJEtwsucLlZsq2trfrg6afrlZdfVm15pTp6kbN1DbpwRkYHTvKrosiraDasuxf3qmvpNk0eV6efr6YxAOVJNv7rAjo70lLkYz94QZdecpauPPt4LH2Pelk4cRZYWTCgoXhKj7+5FtDkBd3y8Jvavp3fcIhUrMMWTtLJU2gVevgBmkM1TBFuWM+wZcamKE2uoRx5vaad8im9F5zgnMPHkwm7Ujcutu+L0KtX750xRqtb4/rAe0o0uTKrEGp75fa0nmhN6t5nO/mU4e8J+7iuueYaetx91rHgbfEXCF94dD60m+9GRLw73A2XmyVrFahXX321Q/CyyglUp/Tpu+dP1qnExxvrigiOkLWSpty4FNCkZFhdGwM6YyZh0MGwOupLdMlRLTrmwIA2x/MLIJrtVQKCealUffiNFfSD7dM5FDAUl/t18kFTdeKc8froqX36+GXX67UVa/WFC0/QZ885QZWomTToXSDswaJP6crf3apPnnIURC8j1SrP3ePrRUuTjA6dNV6LJtXognu366opWZ0yIaUvbMnpvfOKUSlQDGPwSKTLuaB6re8v048fSOnPD8c1dWIAaXaJ04TwzDPP3GnUGcH3pBs3Ita7EdtWud0savab3/xGdY3jFelt1cM/bdSnz6zU1OZyhcHUXWDrZt0PkybV1t6v+rE18pLH3rV9QJee26ijDgQYBXDZsiUf8MjSdmQoXYRudWk1UbGvXPVz3ffo08r1RxUjh64Ii7uprlI15Xkja87saaoCWUsnWFxY1tu7BnXZ1dfqt3+6S51k2PYODGvzYF5st3fGNRAdotecTx/7cINuvmSM0uv7wOFTigykycjFeET7ZED0fN6cSqllnz4FW+DCsK69yKVVawdUQTWsBY/eeustR8wbsfckwU2IjAinm2i3C92+fbt+/7vfOcKsfXOX7rz8AB09HUg1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"
        };

        list = [];

        for (i = 0; i < amount; i++) {
            list.push(item);
        }

        callback(list);
    },

    startNativeAd: function (adId, callback) {
        if (!SG_isFunction(callback)) {
            throw "Softgames - startNativeAd: The 'callback' must be a function, '" + (typeof callback) + "' given.";
        }

        setTimeout(function () {
            callback(true);
        }, 5000);

        return true;
    },

    buildKey: function (key) {
        return location.pathname + '_' + key;
    },

    getStorageItem: function (key) {
        SG_Hooks.storageGetUsed = true;
        try {
            return localStorage.getItem(SG_Hooks.buildKey(key));
        } catch (error) {
            return undefined;
        }
    },

    getStorageItemAsync: function (key, callback, noEncoding) {
        try {

            if (!callback || typeof callback != 'function') {
                callback = function (err) {
                    console.log(err);
                };
                throw new Error('callback is not a valid function');
            }

            if (!key || typeof key != 'string') {
                throw new Error('key is not a valid string');
            }

            var value = localStorage.getItem(SG_Hooks.buildKey(key));

            if (value !== undefined && value !== null && !noEncoding) {
                value = window.atob(value);
            }

            callback(undefined, value);
        } catch (error) {
            callback(error);
        }
    },

    setStorageItem: function (key, value) {
        SG_Hooks.storageSetUsed = true;
        try {
            localStorage.setItem(SG_Hooks.buildKey(key), value);
        } catch (error) {
            return undefined;
        }
    },

    setStorageItemAsync: function (key, value, callback, noEncoding) {
        try {

            if (!callback || typeof callback != 'function') {
                callback = function (err) {
                    if (err) {
                        console.log('failed to store item: ' + key, err);
                    } else {
                        console.log('successfully stored item: ' + key);
                    }
                };
            }

            if (!key || typeof key != 'string') {
                throw new Error('key is not a valid string');
            }

            if (!value || typeof value != 'string') {
                throw new Error('value is not a valid string');
            }

            if (value !== undefined && value !== null && !noEncoding) {
                value = window.btoa(value);
            }

            localStorage.setItem(SG_Hooks.buildKey(key), value);
            callback();
        } catch (error) {
            callback(error);
        }
    },

    startMultiplayerMode: function (callback) {
        SG_Hooks.startMultiplayerModeCalled = true;
        callback();
    },

    startSingleplayerMode: function (callback) {
        SG_Hooks.startSingleplayerModeCalled = true;
        callback();
    },

    registerObserver: function (callback) {
        SG_Hooks.commandObserver = callback;
        SG_Hooks.registerObserverCalled = true;
    },

    triggerGift: function (giftType, callback) {
        SG_Hooks.triggerGiftCalled = true;
        /* verify gift type */
        setTimeout(function () {
            callback();
        }, 5000);
    },

    triggerWalkthrough: function (callback) {
        SG_Hooks.triggerWalktroughCalled = true;
        setTimeout(function () {
            callback();
        }, 5000);
    },

    triggerDailyTask: function (callback) {
        SG_Hooks.triggerDailyTaskCalled = true;
        setTimeout(function () {
            callback();
        }, 5000);
    },

    getAmountOfDailyTasksTodo: function (callback) {
        SG_Hooks.getAmountOfDailyTasksTodoCalled = true;
        setTimeout(function () {
            callback(3);
        }, 5000);
    },

    pageDisplayed: function (view) {
        SG_Hooks.pageDisplayedCalled = true;
    },

    getIngameCurrency: function () {
        if (SG_Hooks.debug) {
            console.log('Get in-game currency');
        }
        SG_Hooks.getIngameCurrencyCalled = true;
        return SG_Hooks.ingameCurrnecy;
    },

    addIngameCurrency: function (amount) {
        if (SG_Hooks.debug) {
            console.log('Add in-game currency: ', amount);
        }
        SG_Hooks.addIngameCurrencyCalled = true;
        SG_Hooks.ingameCurrnecy = SG_Hooks.ingameCurrnecy + amount;
    },

    deductIngameCurrency: function (amount) {
        if (SG_Hooks.debug) {
            console.log('Deduct in-game currency: ', amount);
        }
        SG_Hooks.deductIngameCurrencyCalled = true;
        SG_Hooks.ingameCurrnecy = SG_Hooks.ingameCurrnecy - amount;
    },

    getUnlockedBoosters: function () {
        if (SG_Hooks.debug) {
            console.log('Get unlocked boosters');
        }
        SG_Hooks.getUnlockedBoostersCalled = true;
        return SG_Hooks.unlockedBoosters;
    },

    addBooster: function (boosterSlug, amount) {
        if (SG_Hooks.debug) {
            console.log('Add booster: ' + boosterSlug + ' - ' + amount);
        }
        SG_Hooks.addBoosterCalled = true;
    },

    deductBooster: function (boosterSlug, amount) {
        if (SG_Hooks.debug) {
            console.log('Deduct booster: ' + boosterSlug + ' - ' + amount);
        }
        SG_Hooks.deductBoosterCalled = true;
    },

    getUnlockedItems: function () {
        if (SG_Hooks.debug) {
            console.log('Get unlocked items');
        }
        SG_Hooks.getUnlockedItemsCalled = true;
        return SG_Hooks.unlockedItems;
    },

    addItem: function (itemSlug, amount) {
        if (SG_Hooks.debug) {
            console.log('Add item: ' + itemSlug + ' - ' + amount);
        }
        SG_Hooks.addItemCalled = true;
    },

    deductItem: function (itemSlug, amount) {
        if (SG_Hooks.debug) {
            console.log('Deduct item: ' + itemSlug + ' - ' + amount);
        }
        SG_Hooks.deductItemCalled = true;
    },

    offerCompleted: function (offerId, successful) {
        if (SG_Hooks.debug) {
            console.log('Offer id [' + offerId + '] is accepted: ' + String(successful));
        }
        SG_Hooks.offerCompletedCalled = true;
    },

    beforePlayButtonDisplay: function (callback) {
        if (SG_Hooks.debug) {
            console.log('Executing beforePlayButtonDisplay ...', {callbackGiven: !!callback});
        }
        SG_Hooks.beforePlayButtonDisplayCalled = true;
        callback();
    },

    playButtonPressed: function (callback) {
        if (SG_Hooks.debug) {
            console.log('Executing playButtonPressed ...', {callbackGiven: !!callback});
        }
        SG_Hooks.playButtonPressedCalled = true;
        callback();
    },

    /* Deprecated */
    assignPlayMatchCallback: function (callback) {
        SG_Hooks.assignPlayMatchCallbackCalled = true;
        callback();
    }
};

SG_isInt = function (i) {
    return i === +i && i === (i | 0);
};
SG_isNothing = function (v) {
    return (v === '' || v === null || typeof v == "undefined");
};
SG_isFunction = function (f) {
    return typeof f == 'function';
};
SG_log = function (s) {
    console.log(s);
};
SG_load = function () {
    SG_Hooks.documentLoaded = true;
    try {
        console.log('AZ: Creating splashloader');
        window._azerionIntegrationSDK.createSplashLoader("Jinn Dash" );
        window._azerionIntegrationSDK.addListeners();
    } catch(e) {
        console.log(`AzerionIntegration splash failed: ${e}`)
    }
   /* SG_Hooks._loadFile('in-game-tiers.json', function () {
        SG_Hooks.tiresDefinitionFileExists = true;
    });

    SG_Hooks._loadFile('boosters.json', function () {
        SG_Hooks.boostersDefinitioFileExists = true;
    });*/
};

SG_check = function () {
    var failed = false;

    SG_log("-------- Checking integration of Softgames-Hooks --------");
    if (!SG_Hooks.getLanguagesCalled) {
        SG_log("SG_Hooks.getLanguage was not called. You have to call SG_Hooks.getLanguage(['en','es',...]); *after* window.onload.");
        failed = true;
    }

    if (!SG_Hooks.setOrientationHandlerCalled) {
        SG_log("SG_Hooks.setOrientationHandler was not called. You have to provide a game-function, that handles changes of orientation for the game.");
        failed = true;
    }

    if (!SG_Hooks.setResizeHandlerCalled) {
        SG_log("SG_Hooks.setResizeHandler was not called. You have to provide a game-function, that handles changes of window-size for the game.");
        failed = true;
    }

    if (!SG_Hooks.setPauseHandlerCalled) {
        SG_log("SG_Hooks.setPauseHandler was not called. You have to provide a game-function, that handles pause game.");
        failed = true;
    }

    if (!SG_Hooks.setUnpauseHandlerCalled) {
        SG_log("SG_Hooks.setUnpauseHandler was not called. You have to provide a game-function, that handles unpause game.");
        failed = true;
    }

    if (!SG_Hooks.startCalled) {
        SG_log("SG_Hooks.start was not called. You have to call SG_Hooks.start(); when player starts the game.");
        failed = true;
    }

    if (!SG_Hooks.levelUpCalled && !SG_Hooks.gameOverCalled) {
        SG_log("You have to call SG_Hooks.levelUp or SG_Hooks.gameOver when player leveled up or game is over.");
        failed = true;
    }

    if (!SG_Hooks.levelStartedCalled) {
        SG_log("You have to call SG_Hooks.levelStarted when player starts playing game.");
        failed = true;
    }

    if (!SG_Hooks.levelFinishedCalled) {
        SG_log("You have to call SG_Hooks.levelFinished when player finish level/game.");
        failed = true;
    }

    if (!SG_Hooks.tutorialFinishedCalled) {
        SG_log("You have to call SG_Hooks.tutorialFinished when player finish tutorial. When game hasn't tutorial please ignore.");
    }

    if (!SG_Hooks.storageSetUsed) {
        SG_log("Game is not using local storage via SG Hooks");
        failed = true;
    }

    if (!SG_Hooks.storageSetUsed) {
        SG_log("Game is not using local storage via SG Hooks");
        failed = true;
    }

    if (!SG_Hooks.startMultiplayerModeCalled) {
        SG_log("Game is not setting play mode - multiplayer");
        failed = true;
    }

    if (!SG_Hooks.startSingleplayerModeCalled) {
        SG_log("Game is not setting play mode - singleplayer");
        failed = true;
    }

    if (!SG_Hooks.registerObserverCalled) {
        SG_log("Game is not registering observer");
        failed = true;
    }

    if (!SG_Hooks.triggerGiftCalled) {
        SG_log("Game is not tiggering gift");
        failed = true;
    }

    if (!SG_Hooks.triggerWalkthroughCalled) {
        SG_log("Game is not tiggering walkthrough");
        failed = true;
    }

    if (!SG_Hooks.triggerDailyTaskCalled) {
        SG_log("Game is not tiggering daily task");
        failed = true;
    }

    if (!SG_Hooks.getAmountOfDailyTasksTodoCalled) {
        SG_log("Game is not calling get amount of daily tasks");
        failed = true;
    }

    if (!SG_Hooks.tiresDefinitionFileExists) {
        SG_log("Game doesn't have tries difinition file");
        failed = true;
    }

    if (!SG_Hooks.boostersDefinitioFileExists) {
        SG_log("Game doesn't have boosters difinition file");
        failed = true;
    }

    if (!SG_Hooks.crossPromotionLinkClicked) {
        SG_log("Cross promotion link has been never called");
        failed = true;
    }

    if (!SG_Hooks.pageDisplayedCalled) {
        SG_log("Page displayed has been never called");
        failed = true;
    }

    if (!SG_Hooks.getIngameCurrencyCalled) {
        SG_log("Get in-game currency has been never called");
        failed = true;
    }

    if (!SG_Hooks.addIngameCurrencyCalled) {
        SG_log("Add in-game currency has been never called");
        failed = true;
    }

    if (!SG_Hooks.deductIngameCurrencyCalled) {
        SG_log("Deduct in-game currency has been never called");
        failed = true;
    }

    if (!SG_Hooks.getUnlockedBoostersCalled) {
        SG_log("Get unlocked boosters has been never called");
        failed = true;
    }

    if (!SG_Hooks.addBoosterCalled) {
        SG_log("Add booster has been never called");
        failed = true;
    }

    if (!SG_Hooks.deductBoosterCalled) {
        SG_log("Deduct booster has been never called");
        failed = true;
    }

    if (!SG_Hooks.getUnlockedItemsCalled) {
        SG_log("Get unlocked items has been never called");
        failed = true;
    }

    if (!SG_Hooks.addItemCalled) {
        SG_log("Add item has been never called");
        failed = true;
    }

    if (!SG_Hooks.deductItemCalled) {
        SG_log("Deduct item has been never called");
        failed = true;
    }

    if (!SG_Hooks.offerCompletedCalled) {
        SG_log("Offer completed has been never called");
        failed = true;
    }

    if (failed) {
        SG_log("-------- Check FAILED --------");
        return false;
    } else {
        SG_log("-------- Check PASSED --------");
        return true;
    }
};
if (window.attachEvent) {
    window.attachEvent("onload", SG_load);
} else {
    window.addEventListener("load", SG_load, true);
}
