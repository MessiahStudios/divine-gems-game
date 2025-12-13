// Open Source Match 3 Game by Clockworkchilli
App = function()
{
    var self = this; // Main app context

    // Layers to use for rendering
    this.layers = {background:17, boardBack:16, board:15, boardFront:14, front:13};

    // Flags
    this.musicMuted = false;
    this.soundMuted = false;
    this.socialEnabled = true;
    this.gameOver = false;
    this.musicPlaying = false;
    this.musicPausedByPauseButton = false;

    // Scores
    this.scores = {values:[0,0,0]};

    /**
     * Function that takes a number of seconds and returns a string of the time in minutes
     * @param {number} numSeconds The number of seconds that we will convert
     * @returns {string} A string representation of the provided time in minutes
     */
    this.getTimeString = function (numSeconds)
    {
        if (!numSeconds || numSeconds < 1)
        {
            return '0:00';
        }

        var timeString = '';
        var minutes = 0;
        var seconds = Math.floor(numSeconds);

        // Deal with minutes
        while (seconds >= 60)
        {
            seconds -= 60;
            minutes++;
        }

        timeString = minutes > 0 ? minutes + ':' : '0:';

        // Deal with seconds
        if (seconds > 0)
        {
            timeString += seconds < 10 ? ('0' + seconds) : seconds;
        }
        else
        {
            timeString += '00';
        }
        return timeString;
    };

    // Load all assets
    this.load = function()
    {
        // Set a stack of loading images
        wade.setLoadingImages(['images/divineGemsTitle.png']);

        // Optionally, display a loading bar
        wade.setLoadingBar(true, {x: 0, y: 150}, '#000000', '#ffffff');

        // LOAD SCRIPTS
        wade.loadScript('bar.js');
        wade.loadScript('counter.js');
        wade.loadScript('match3.js');

        // Load AUDIO
        if (wade.isWebAudioSupported())
        {
            // background music
            wade.preloadAudio('sounds/Walperion-Music-Ode-to-Victory.ogg', false, true);
        }

        if (wade.isWebAudioSupported())
        {
            wade.loadAudio('sounds/PowerUp8.ogg');
            wade.loadAudio('sounds/fiveSound-lion.ogg');
            wade.loadAudio('sounds/fiveSound-lionAtWAR.ogg');
            wade.loadAudio('sounds/Explosion3.ogg');
        }

        // LOAD IMAGES
        // Squares
        wade.loadImage('images/cross_object_new.png');
        wade.loadImage('images/christian_arabic_symbol_new.png');
        wade.loadImage('images/crown_object_new.png');
        wade.loadImage('images/fish_symbol_new.png');
        wade.loadImage('images/nails_object_new.png');
        wade.loadImage('images/selected.png');
        //wade.loadImage('images/special4.png');
        wade.loadImage('images/special5-lion.png');
        wade.loadImage('images/cross_object_glow.png');
        wade.loadImage('images/christian_arabic_symbol_glow.png');
        wade.loadImage('images/crown_object_glow.png');
        wade.loadImage('images/fish_symbol_glow.png');
        wade.loadImage('images/nails_object_glow.png');
        wade.loadImage('images/trinity_object_new.png');
        wade.loadImage('images/trinity_object_glow.png');

        // UI and background
        wade.loadImage('images/background.png');
        wade.loadImage('images/top.png');
        wade.loadImage('images/barTime.png');
        wade.loadImage('images/markerTime.png');
        wade.loadImage('images/buttonSoundOff.png');
        wade.loadImage('images/buttonSoundOn.png');
        wade.loadImage('images/buttonBack.png');
        //wade.loadImage('images/potionBar.png');
        wade.loadImage('images/menuBackground.png');
        wade.loadImage('images/dgTitle.png');
        wade.loadImage('images/divineGemsTitle.png');
        wade.loadImage('images/buttonPlay.png');
        wade.loadImage('images/backgroundShareBox.png');
        wade.loadImage('images/buttonCredit.png');
        wade.loadImage('images/wadePowered.png');
        wade.loadImage('images/buttonsMuteOn.png');
        wade.loadImage('images/buttonsMuteOff.png');
        wade.loadImage('images/buttonPause.png');
        wade.loadImage('images/buttonUnpause.png');

        // Shiny
        wade.loadImage('images/shatter.png');
        wade.loadImage('images/specialEffect1.png');
        wade.loadImage('images/bigBoom.png');
        wade.loadImage('images/fiveEffect.png');
        wade.loadImage('images/flash.png');

        // Share
        wade.loadImage('images/gh_R.png'); //legacy social media outlet
        wade.loadImage('images/fb_R.png');
        wade.loadImage('images/x_R.png');
    wade.loadImage('images/inst_R.png');
    wade.loadImage('images/yt_R.png');
    //wade.loadImage('images/vlog_R.png'); //legacy social media outlet
    wade.loadImage('images/imdb_R.png');
    wade.loadImage('images/li_R.png');

    };

    // Loading
    this.loadingBar = function() {
        console.log('Loading bar function is called');
        // Check if all assets are loaded
        var loadingInterval = setInterval(function() {
            var percentage = wade.getLoadingPercentage();
        console.log('Loading Percentage:', percentage);

            if (percentage >= 100) {
                clearInterval(loadingInterval);
                wade.setLoadingBar(false);  // Hide the loading bar
        document.getElementById('__wade_loading_bar').style.display = 'none';
                self.init();  // Proceed to game initialization
            }
        }, 100);  // Check every 100ms

        this.load();  // Start loading assets
    };
    // Enter main program
    this.init = function()
    {
    wade.setLoadingBar(false);  // Hide the loading bar
        // Setup screen
        wade.setMinScreenSize(608, 920); //996
        wade.setMaxScreenSize(608, 920); //996

        wade.setSwipeTolerance(1, 2);

        // {background:17, boardBack:16, board:15, boardFront:14, front:13};
        wade.setLayerRenderMode(self.layers.background, "webgl");
        wade.setLayerRenderMode(self.layers.boardBack, "webgl");
        wade.setLayerRenderMode(self.layers.board, "webgl");
        wade.setLayerRenderMode(self.layers.boardFront, "webgl");
        //wade.setLayerRenderMode(self.layers.front, "webgl"); // Need 1 canvas layer for timer bar gradient and other etc

        // Lower resolution factor if mobile
        if (wade.getContainerHeight() <= 768)
        {
            self.isMobile = true;
            wade.setLayerResolutionFactor(this.layers.background, 0.75);
            wade.setLayerResolutionFactor(this.layers.boardBack, 0.75);
            wade.setLayerResolutionFactor(this.layers.board, 0.75);
            wade.setLayerResolutionFactor(this.layers.boardFront, 0.75);
            wade.setLayerResolutionFactor(this.layers.front, 0.75);
        }
        else
        {
            self.isMobile = false;
        }

        // Create main menu and the game on play pressed
        this.game();
    };

    /**
     * Creates the main menu
     */
    this.game = function()
    {
        // Create menu graphical elements
        var backgroundSprite = new Sprite('images/menuBackground.png', this.layers.boardBack);
        var menu = new SceneObject(backgroundSprite);
        wade.addSceneObject(menu, true);
        var titleSprite = new TextSprite('Divine Gems','84px ArtDept1', '#3fb7e3', 'center', this.layers.front);
        titleSprite.setShadow('#000000', 3, 4, 4);
        //textObject.addSprite(titleSprite, {x:0, y: -460});
        //Original | Start
        //var titleSprite = new Sprite('images/dgTitle.png', this.layers.board);
        menu.addSprite(titleSprite, {x: 0, y:-wade.getScreenHeight()/2 + 100});
        //end
        var dgtSprite = new Sprite('images/divineGemsTitle.png', this.layers.board);
        menu.addSprite(dgtSprite, {x:0, y:-130});
        var shareBackSprite = new Sprite('images/backgroundShareBox.png', wade.app.layers.front);
        menu.addSprite(shareBackSprite, {x:-wade.getScreenWidth()/2 + 175, y:wade.getScreenHeight()/2 - 125});

        // Create play button
        var playButtonSprite = new Sprite('images/buttonPlay.png', wade.app.layers.front);
        var playButton = new SceneObject(playButtonSprite);
        playButton.onMouseUp = function()
        {
    // Initialize AudioContext when the play button is clicked
            console.log("[BUTTON] Play button clicked - starting game, musicMuted:", self.musicMuted, "musicPlaying:", self.musicPlaying);
            if (!self.audioContext || self.audioContext.state === 'suspended') {
        try {
                self.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        self.audioContext.resume().then(() => {
            console.log("AudioContext resumed after user interaction.");
        });
        } catch (e) {
                    console.error("Web Audio API is not supported in this browser.");
        }
        }

        if(!self.musicMuted && !self.musicPlaying) {
                self.musicPlaying = true;
                self.musicSource = wade.playAudio('sounds/Walperion-Music-Ode-to-Victory.ogg', true);
            }

            wade.clearScene();


            // Draw background and foreground
            var backgroundSprite = new Sprite('images/background.png', self.layers.background);
            backgroundSprite.setSize(608, 920);
            //var topSprite = new Sprite('images/top.png', self.layers.front);
            var graphics = new SceneObject(null);
            graphics.addSprite(backgroundSprite, {x:0, y:wade.getScreenHeight()/2 - backgroundSprite.getSize().y/2});
            //graphics.addSprite(topSprite, {x:0, y:-backgroundSprite.getSize().y/2 + 74}); // Evil magic numbers
            wade.addSceneObject(graphics);

            // Use Match3 behavior to create the game
            this.theGame = new SceneObject(null, Match3);
            wade.addSceneObject(this.theGame, true, {match3:
            {
                numCells: {x:7, y:7},
                cellSize: {x:85, y:85},
                margin: 5,
                items: [
                    {normal: 'images/cross_object_new.png', special:'images/cross_object_glow.png', probability:25},
                    {normal: 'images/christian_arabic_symbol_new.png', special:'images/christian_arabic_symbol_glow.png', probability:25},
                    {normal: 'images/crown_object_new.png', special:'images/crown_object_glow.png', probability:25},
                    {normal: 'images/trinity_object_new.png', special:'images/trinity_object_glow.png', probability:25},
                    {normal: 'images/fish_symbol_new.png', special:'images/fish_symbol_glow.png', probability:25},
                    {normal: 'images/nails_object_new.png', special:'images/nails_object_glow.png', probability:25}],
                specialFive: 'images/special5-lion.png',
                matchSound: 'sounds/PowerUp8.ogg',
                explosionSound: 'sounds/Explosion3.ogg',
                specialFiveSound: 'sounds/fiveSound-lion.ogg',
        specialFiveLionsAtWAR: 'sounds/fiveSound-lionAtWAR.ogg',
                itemLayer: self.layers.board,
                bottomLayer: self.layers.boardBack,
                topLayer: self.layers.boardFront,
                gravity: 2000,
                effectScale: 1.5,
                sparkleAnimation: {name:'images/specialEffect1.png', numCellsX:5, numCellsY:4, speed:15, looping:false},
                splashAnimation: {name:'images/shatter.png', numCellsX:5, numCellsY:5, speed:60, looping:false},
                explosionAnimation: {name:'images/bigBoom.png', numCellsX:6, numCellsY:4, speed:30, looping:false},
                specialFourAnimation: {name:'images/flash.png', numCellsX:4, numCellsY:3, speed:15, looping:true},
                specialFiveAnimation: {name:'images/fiveEffect.png',numCellsX:5, numCellsY:4, speed:30, looping:false},
                glowSize:16

            }});

            // Create the timer
            var timerBarSprite = new Sprite('images/barTime.png', self.layers.front); //self.layers.front
            var timer = new SceneObject(timerBarSprite, Bar);
            //timer.setSpriteOffsets(timerOffset);
            timer.removeOnGameOver = true;
            timer.timePassed = 0;
            timer.setPosition(0, 330);
            timer.onUpdate = function () {
                timer.timePassed += wade.c_timeStep;
                var percent = (30 - timer.timePassed) / 30 * 100;
            };
            wade.addSceneObject(timer, true);
            timer.getBehavior('Bar').init({bar: {size: {x: 580, y: 30},
                timer: 30,
                layer: self.layers.front,
                reverse: true,
                offset: {x:0,y:0},
                spriteIndex: 1,
                useGradient: true,
                foreColor: ['#00FF00', '#FF0000'],
                marker: 'images/markerTime.png',
                markerLayer: self.layers.front}});

            wade.app.onScoreAdded = function(value)
            {
                timer.getBehavior().addTime(value/300);
            };

            self.inGameButtons();

            // Create score text
            var scoreText = new TextSprite('SCORE','64px ArtDept1', '#44bce8', 'center', self.layers.front);
            scoreText.setShadow('#000000', 3, 4, 4);
            var scoreT = new TextSprite('0', '42px Monopower', '#012c3d', 'center', self.layers.front);
            scoreT.setShadow('#000000', 3, 0, 4);
            self.scoreObject = new SceneObject(scoreT, Counter);
            self.scoreObject.removeOnGameOver = true;
            self.scoreObject.setPosition(0, -wade.getScreenHeight()/2 + 138);
            self.scoreObject.addSprite(scoreText, {x:0, y:-65});
            wade.addSceneObject(self.scoreObject);

            // Increment score
            self.onMatch = function(match)
            {
                self.scoreObject.getBehavior().addValue(match.length*100);
            };

        };
        playButton.setPosition(0, 130);
        playButtonSprite.setDrawFunction(wade.drawFunctions.resizeOverTime_ (30, 16, 301, 156, 0.3, playButtonSprite.getDrawFunction(), function()
        {
            // Create credits button
            var creditsButtonSprite = new Sprite('images/buttonCredit.png', self.layers.front);
            var creditsButton = new SceneObject(creditsButtonSprite);
            creditsButtonSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, creditsButtonSprite.getDrawFunction()));
            creditsButton.onMouseUp = function()
            {
                console.log("[BUTTON] Credits button clicked");
                wade.clearScene();
                self.credits();
            };
            creditsButton.setPosition(-wade.getScreenWidth()/2 + 175, wade.getScreenHeight()/2 - 180);
            wade.addSceneObject(creditsButton, true);

            // Create share buttons if social flag set
            if(self.socialEnabled)
            {
        var github = new Sprite('images/gh_R.png', self.layers.front);
                github.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, github.getDrawFunction()));
                var githubObj = new SceneObject(github);
                githubObj.onMouseUp = function()
                {
                    console.log("[BUTTON] GitHub button clicked");
                    open('https://github.com/MessiahStudios', '_blank');
                };
                githubObj.setPosition(-wade.getScreenWidth()/2 + 65, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(githubObj, true);

        var instagram = new Sprite('images/inst_R.png', self.layers.front);
                instagram.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, instagram.getDrawFunction()));
                var instagramObj = new SceneObject(instagram);
                instagramObj.onMouseUp = function()
                {
                    console.log("[BUTTON] Instagram button clicked");
                    open('https://www.instagram.com/jaguarsjiujitsu/', '_blank');
                };
                instagramObj.setPosition(-wade.getScreenWidth()/2 + 120, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(instagramObj, true);

                var facebook = new Sprite('images/fb_R.png', self.layers.front);
                facebook.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, facebook.getDrawFunction()));
                var facebookObj = new SceneObject(facebook);
                facebookObj.onMouseUp = function()
                {
                    console.log("[BUTTON] Facebook button clicked");
                    open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmessiahstudios.github.io%2Fdivine-gems-game%2F&amp;src=sdkpreparse');
                };
                facebookObj.setPosition(-wade.getScreenWidth()/2 + 175, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(facebookObj, true);

        var youtube = new Sprite('images/yt_R.png', self.layers.front);
                youtube.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, youtube.getDrawFunction()));
                var youtubeObj = new SceneObject(youtube);
                youtubeObj.onMouseUp = function()
                {
                    console.log("[BUTTON] YouTube button clicked");
                    open('https://www.youtube.com/channel/UC_FZ9hdaRTOFAo-TBtc1fGw', '_blank');
                };
                youtubeObj.setPosition(-wade.getScreenWidth()/2 + 230, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(youtubeObj, true);

        // Twitter now X
                var twitter = new Sprite('images/x_R.png', self.layers.front);
                twitter.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, twitter.getDrawFunction()));
                var twitterObj = new SceneObject(twitter);
                twitterObj.onMouseUp = function()
                {
                    console.log("[BUTTON] X/Twitter button clicked");
                    open('https://x.com/Messiah_Studios', '_blank');
                };
                twitterObj.setPosition(-wade.getScreenWidth()/2 + 285, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(twitterObj, true);
            }
        }));
        wade.addSceneObject(playButton, true);

        /*
    // Wade Powered icon
    // after reading official docs I can add powered by "WADE Game Engine" in my credits section
        var wadeSprite = new Sprite('images/wadePowered.png', self.layers.front);
        var wadeObj = new SceneObject(wadeSprite);
        wadeObj.setPosition(wade.getScreenWidth()/2 - wadeSprite.getSize().x/2, wade.getScreenHeight()/2 - wadeSprite.getSize().y/2);
        wadeObj.onMouseUp = function()
        {
            open('http://www.clockworkchilli.com');
        };
        wade.addSceneObject(wadeObj, true);
    */
    };

    /**
     * Creates the credits page
     */
    this.credits = function()
    {
        // Credits background
        var backgroundSprite = new Sprite('images/menuBackground.png', this.layers.front);
        var background = new SceneObject(backgroundSprite);
        wade.addSceneObject(background);

        // Main menu button
        var backSprite = new Sprite('images/buttonBack.png', this.layers.front);
        var backButton = new SceneObject(backSprite);
        backButton.onMouseUp = function()
        {
            console.log("[BUTTON] Back button clicked - returning to menu");
            wade.clearScene();
            self.game();
        };
        backButton.setPosition(0, wade.getScreenHeight()/2 - 75);
        wade.addSceneObject(backButton, true);

        // Credits
        var theMSCred = new TextSprite('Messiah Studios','60px ArtDept1', '#3fb7e3', 'center', this.layers.front);
        theMSCred.setShadow('#000000', 3, 4, 4);
        var workTitles = new TextSprite('Creator: Kenneth James Mendoza','30px ArtDept1', '#01516f', 'left', wade.app.layers.front);
        workTitles.setShadow('#000000', 1, 2, 2);
        var textObject = new SceneObject(theMSCred);
        textObject.addSprite(workTitles, {x:-275, y: 75});
        textObject.setPosition(0, -wade.getScreenHeight()/2 + 80);

        // Create share buttons if social flag set
                    if(self.socialEnabled)
                    {
            /*
            //old social media outlet
            var vlog = new Sprite('images/vlog_R.png', self.layers.front);
                        vlog.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, vlog.getDrawFunction()));
                        var vlogObj = new SceneObject(vlog);
                        vlogObj.onMouseUp = function()
                        {
                            open('https://messiahstudios.blogspot.com/?view=classic', '_blank');
                        };
                        vlogObj.setPosition(-175, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(vlogObj, true);
            */

                        var github = new Sprite('images/gh_R.png', self.layers.front);
                        github.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, github.getDrawFunction()));
                        var githubObj = new SceneObject(github);
                        githubObj.onMouseUp = function()
                        {
                            console.log("[BUTTON] Credits - GitHub button clicked");
                            open('https://github.com/MessiahStudios', '_blank');
                        };
                        githubObj.setPosition(-125, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(githubObj, true);


            var instagram = new Sprite('images/inst_R.png', self.layers.front);
            instagram.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, instagram.getDrawFunction()));
            var instagramObj = new SceneObject(instagram);
            instagramObj.onMouseUp = function()
            {
                console.log("[BUTTON] Credits - Instagram button clicked");
                open('https://www.instagram.com/jaguarsjiujitsu/', '_blank');
            };
            instagramObj.setPosition(-75, -wade.getScreenHeight()/2 + 225);
            wade.addSceneObject(instagramObj, true);

                        var facebook = new Sprite('images/fb_R.png', self.layers.front);
                        facebook.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, facebook.getDrawFunction()));
                        var facebookObj = new SceneObject(facebook);
                        facebookObj.onMouseUp = function()
                        {
                            console.log("[BUTTON] Credits - Facebook button clicked");
                            open('https://www.facebook.com/Messiah.Studios.Social', '_blank');
                        };
                        facebookObj.setPosition(-25, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(facebookObj, true);

            var youtube = new Sprite('images/yt_R.png', self.layers.front);
            youtube.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, youtube.getDrawFunction()));
            var youtubeObj = new SceneObject(youtube);
            youtubeObj.onMouseUp = function()
            {
                console.log("[BUTTON] Credits - YouTube button clicked");
                open('https://www.youtube.com/channel/UC_FZ9hdaRTOFAo-TBtc1fGw', '_blank');
            };
            youtubeObj.setPosition(25, -wade.getScreenHeight()/2 + 225);
            wade.addSceneObject(youtubeObj, true);

                        var twitter = new Sprite('images/x_R.png', self.layers.front);
                        twitter.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, twitter.getDrawFunction()));
                        var twitterObj = new SceneObject(twitter);
                        twitterObj.onMouseUp = function()
                        {
                            console.log("[BUTTON] Credits - X/Twitter button clicked");
                            open('https://x.com/Messiah_Studios', '_blank');
                        };
                        twitterObj.setPosition(75, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(twitterObj, true);

                        var imdb = new Sprite('images/imdb_R.png', self.layers.front);
                        imdb.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, imdb.getDrawFunction()));
                        var imdbObj = new SceneObject(imdb);
                        imdbObj.onMouseUp = function()
                        {
                            console.log("[BUTTON] Credits - IMDB button clicked");
                            open('http://www.imdb.com/name/nm8210329/?ref_=ttfc_fc_cr33', '_blank');
                        };
                        imdbObj.setPosition(125, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(imdbObj, true);

            var linkedIn = new Sprite('images/li_R.png', self.layers.front);
                        linkedIn.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, linkedIn.getDrawFunction()));
                        var linkedInObj = new SceneObject(linkedIn);
                        linkedInObj.onMouseUp = function()
                        {
                            console.log("[BUTTON] Credits - LinkedIn button clicked");
                            open('https://www.linkedin.com/in/kennethjamesmendoza', '_blank');
                        };
                        linkedInObj.setPosition(175, -wade.getScreenHeight()/2 + 225);
                        wade.addSceneObject(linkedInObj, true);
                    }

        // using icon instead
        var gameEngine = new TextSprite('Powered By Wade Game Engine','35px ArtDept1', '#012c3d', 'center', this.layers.front);
        var geLink = new SceneObject(gameEngine);
        geLink.onMouseUp = function()
        {
            console.log("[BUTTON] Credits - Wade Game Engine link clicked");
            open('https://clockworkchilli.com/', '_blank');
        };
        geLink.setPosition(0, -55);
        wade.addSceneObject(geLink, true);


        var specialThanks = new TextSprite('Additional Credits','48px ArtDept1', '#3fb7e3', 'center', this.layers.front);
        specialThanks.setShadow('#000000', 3, 4, 4);
        textObject.addSprite(specialThanks, {x:0, y: 460});
        var soundCredit = new TextSprite('SFX: \"PoweUp8 & Explosion3\"\n\nBy Eric Matyas','30px ArtDept1', '#01516f', 'center', this.layers.front);
        soundCredit.setShadow('#000000', 1, 2, 2);
        textObject.addSprite(soundCredit, {x:0, y: 530});

        // Link to sound
        var soundLink = new TextSprite('www.soundimage.org','42px ArtDept1', '#012c3d', 'center', this.layers.front);
        var soundObject = new SceneObject(soundLink);
        soundObject.onMouseUp = function()
        {
            console.log("[BUTTON] Credits - Sound image link clicked");
            open('http://www.soundimage.org', '_blank');
        };
        soundObject.setPosition(0, 300);
        wade.addSceneObject(textObject);
        wade.addSceneObject(soundObject, true);
    };

    /**
     * Creates the buttons on the bottom bar in game
     */
    this.inGameButtons = function()
    {
        // Create the pause/play button FIRST (so it can be referenced by menu button)
        var pauseText = new TextSprite('PAUSED','100px ArtDept1', '#44bce8', 'center', self.layers.front);
        var pauseTextObject = new SceneObject(pauseText);
        pauseTextObject.setPosition(0, -100);
        wade.addSceneObject(pauseTextObject);
        pauseTextObject.setVisible(false);

        pauseText.setShadow('#000000', 3, 4, 4);
        var pauseSprite = new Sprite('images/buttonPause.png', self.layers.front);
        var pauseButton = new SceneObject(pauseSprite);
        pauseButton.removeOnGameOver = true;
        pauseButton.paused = false;
        pauseButton.onMouseUp = function()
        {
            this.paused = !this.paused;
            console.log("[BUTTON] Pause button clicked - paused:", this.paused, "musicPlaying:", self.musicPlaying, "musicMuted:", self.musicMuted);
            if(this.paused)
            {
                // Pause music if playing
                if(self.musicPlaying && self.musicSource && !self.musicMuted)
                {
                    wade.stopAudio(self.musicSource);
                    self.musicPausedByPauseButton = true;
                }

                // Create darker area
                var darkSprite = new Sprite(null, self.layers.front);
                darkSprite.setSize(wade.getScreenWidth(), wade.getScreenHeight());
                this.blackArea = new SceneObject(darkSprite);
                this.blackArea.onMouseDown = function()
                {
                    return true;
                };
                this.blackArea.onMouseUp = function()
                {
                    return true;
                };
                darkSprite.cache();
                darkSprite.setDrawFunction(wade.drawFunctions.solidFill_('rgba(0, 0, 0, 0.4)'));
                wade.addSceneObject(this.blackArea);

                // Create larger play button under paused text
                var largePauseSprite = new Sprite('images/buttonUnpause.png', self.layers.front);
                largePauseSprite.setSize(200,200);
                this.largeButton = new SceneObject(largePauseSprite);
                this.largeButton.setPosition(0, 50);
                this.largeButton.onMouseDown = function()
                {
                    return true;
                };

                this.largeButton.onMouseUp = function()
                {
                    console.log("[BUTTON] Large unpause button clicked - resuming game");
                    wade.removeSceneObject(pauseButton.blackArea);
                    pauseTextObject.setVisible(false);
                    wade.resumeSimulation();
                    pauseSprite.setImageFile('images/buttonPause.png');
                    wade.removeSceneObject(this);
                    pauseButton.paused = false;
                    // Resume music if it was paused by pause button
                    if(self.musicPausedByPauseButton && !self.musicMuted)
                    {
                        self.musicSource = wade.playAudio('sounds/Walperion-Music-Ode-to-Victory.ogg', true);
                        self.musicPausedByPauseButton = false;
                    }
                };
                wade.addSceneObject(this.largeButton, true);

                pauseTextObject.setVisible(true);
                pauseSprite.setImageFile('images/buttonUnpause.png');
                wade.pauseSimulation();
            }
            else
            {
                this.largeButton && wade.removeSceneObject(this.largeButton);
                wade.removeSceneObject(this.blackArea);
                pauseTextObject.setVisible(false);
                wade.resumeSimulation();
                pauseSprite.setImageFile('images/buttonPause.png');
                // Resume music if it was paused by pause button
                if(self.musicPausedByPauseButton && !self.musicMuted)
                {
                    self.musicSource = wade.playAudio('sounds/Walperion-Music-Ode-to-Victory.ogg', true);
                    self.musicPausedByPauseButton = false;
                }
            }
        };
        pauseButton.setPosition(-75, wade.getScreenHeight()/2 - pauseSprite.getSize().y/2);
        wade.addSceneObject(pauseButton, true);

        // Create the music mute button
        if(self.musicMuted)
        {
            var muteSprite = new Sprite('images/buttonSoundOff.png', self.layers.front);
        }
        else
        {
            var muteSprite = new Sprite('images/buttonSoundOn.png', self.layers.front);
        }

        var muteButton = new SceneObject(muteSprite);
        muteButton.removeOnGameOver = true;
        muteButton.onMouseUp = function() {
            self.musicMuted = !self.musicMuted;

            console.log("[BUTTON] Music mute button clicked - musicMuted:", self.musicMuted);
            if(self.musicMuted) {
                // Stop music if playing
                if(self.musicSource) {
                    wade.stopAudio(self.musicSource);
                    self.musicSource = null;
                }
                muteSprite.setImageFile('images/buttonSoundOff.png');
            } else {
                // Resume music if game is playing and not paused
                if(self.musicPlaying && !pauseButton.paused && !self.musicPausedByPauseButton) {
                    self.musicSource = wade.playAudio('sounds/Walperion-Music-Ode-to-Victory.ogg', true);
                }
                muteSprite.setImageFile('images/buttonSoundOn.png');
            }
        };
        muteButton.setPosition(200, wade.getScreenHeight()/2 - muteSprite.getSize().y/2);
        wade.addSceneObject(muteButton, true);

        // Create the sound mute button
        if(self.soundMuted)
        {
            var muteSprite2 = new Sprite('images/buttonsMuteOff.png', self.layers.front);
        }
        else
        {
            var muteSprite2 = new Sprite('images/buttonsMuteOn.png', self.layers.front);
        }
        var muteButton2 = new SceneObject(muteSprite2);
        muteButton2.removeOnGameOver = true;
        muteButton2.onMouseUp = function()
        {
            self.soundMuted = !self.soundMuted;
            console.log("[BUTTON] Sound mute button clicked - soundMuted:", self.soundMuted);
            if(self.soundMuted)
            {
                muteSprite2.setImageFile('images/buttonsMuteOff.png');
            }
            else
            {
                muteSprite2.setImageFile('images/buttonsMuteOn.png');
            }
        };
        muteButton2.setPosition(75, wade.getScreenHeight()/2 - muteSprite2.getSize().y/2);
        wade.addSceneObject(muteButton2, true);

        // Create the main menu button
        var menuSprite = new Sprite('images/buttonBack.png', self.layers.front);
        var menuObject = new SceneObject(menuSprite);
        menuObject.removeOnGameOver = true;
        menuObject.onMouseUp = function(){
            // Stop music when returning to the main menu
            console.log("[BUTTON] Menu button clicked - stopping music and returning to main menu");
            if (self.musicSource !== null && self.musicSource !== undefined) {
                wade.stopAudio(self.musicSource);
                self.musicSource = null;
            }
            self.musicPlaying = false;
            self.musicPausedByPauseButton = false;

            wade.setMainLoopCallback(null,'update');
            
            // Resume simulation if paused before clearing scene
            if(pauseButton.paused)
            {
                wade.resumeSimulation();
            }
            
            wade.clearScene();
            self.game();
        };
        menuObject.setPosition(-200, wade.getScreenHeight()/2 - muteSprite.getSize().y/2);
        wade.addSceneObject(menuObject, true);
    };

    /**
     * Gets called by match 3 logic on game over condition
     */
    this.onGameOver = function() {
        this.gameOver = false;
        // Force music to stop (playing or not)
    if (self.musicPlaying && self.musicSource) {
        wade.stopAudio(self.musicSource);
        self.musicSource = null;
        self.musicPlaying = false;
    }

        // Create explosion sound
        if(!wade.app.soundMuted)
        {
            wade.playAudioIfAvailable('sounds/Explosion3.ogg');
        }

        // Get previous best scores
        var scoresObj = wade.retrieveLocalObject("match3Scores");
        if(scoresObj)
        {
            self.scores = scoresObj;
        }
        self.scores.values.push(self.scoreObject.getBehavior().getValue());
        self.scores.values.sort(function(a, b){return b-a});
        self.scores.values.length = 3;
        wade.storeLocalObject("match3Scores", self.scores);

        // Remove buttons
        wade.removeSceneObjects(wade.getSceneObjects('removeOnGameOver', true));



        var timeOutSprite = new TextSprite('Time\'s Up!','72px ArtDept1', '#44bce8', 'center', self.layers.front);
        timeOutSprite.setShadow('#000',3 ,4 ,4);
        timeOutSprite.cache();
        timeOutSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 2.0, timeOutSprite.getDrawFunction(),function()
        {
            // You Scored message
            var youScoredSprite = new TextSprite('You scored a\ntotal of ' + self.scoreObject.getBehavior().getValue() +'!','42px ArtDept1', '#44bce8', 'center', self.layers.front);
            youScoredSprite.setShadow('#000',1 ,2 ,2);
            youScoredSprite.cache();
            youScoredSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, timeOutSprite.getDrawFunction(), function()
            {
                // Previous scores
                var scoreSprite = new TextSprite('Current Best:\n1. ' + self.scores.values[0] + '\n2. ' + self.scores.values[1] + '\n3. ' + self.scores.values[2],'42px ArtDept1', '#44bce8', 'left', self.layers.front);
                scoreSprite.setShadow('#000',1 ,2 ,2);
                scoreSprite.cache();
                scoreSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, scoreSprite.getDrawFunction(), function()
                {
                    // Create the back button, will go back to main menu
                    var backButtonSprite = new Sprite('images/buttonBack.png', self.layers.front);
                    backButtonSprite.setSize(96, 96);
                    var backButton = new SceneObject(backButtonSprite);
                    backButton.setPosition(wade.getScreenWidth()/2 - 120, wade.getScreenHeight()/2 - 245);
                    backButtonSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backButtonSprite.getDrawFunction()));

                    backButton.onMouseUp = function() // Go to main menu
                    {
            console.log("[BUTTON] Back button clicked - returning to menu");
                        wade.clearScene();
                        self.game();
                    };
                    wade.addSceneObject(backButton, true);

                    // Create share buttons if social flag set
                    if(self.socialEnabled)
                    {
            /*
            //old social media outlet
                        var google = new Sprite('images/gp_R.png', self.layers.front);
                        google.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, google.getDrawFunction()));
                        var googleObj = new SceneObject(google);
                        googleObj.onMouseUp = function()
                        {
                            open('https://plus.google.com/share?url=https://www.messiahstudios.net/games/wade/index.html', '_blank');
                        };
                        googleObj.setPosition(-225, wade.getScreenHeight()/2 - 225);
                        wade.addSceneObject(googleObj, true);
            */

            var instagram = new Sprite('images/inst_R.png', self.layers.front);
            instagram.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, instagram.getDrawFunction()));
            var instagramObj = new SceneObject(instagram);
            instagramObj.onMouseUp = function()
            {
                open('https://www.instagram.com/jaguarsjiujitsu/', '_blank');
            };
            instagramObj.setPosition(-175, wade.getScreenHeight()/2 - 225);
            wade.addSceneObject(instagramObj, true);

                        var facebook = new Sprite('images/fb_R.png', self.layers.front);
                        facebook.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, facebook.getDrawFunction()));
                        var facebookObj = new SceneObject(facebook);
                        facebookObj.onMouseUp = function()
                        {
                            open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmessiahstudios.github.io%2Fdivine-gems-game%2F&amp;src=sdkpreparse');
                        };
                        facebookObj.setPosition(-125, wade.getScreenHeight()/2 - 225);
                        wade.addSceneObject(facebookObj, true);

            var youtube = new Sprite('images/yt_R.png', self.layers.front);
            youtube.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, youtube.getDrawFunction()));
            var youtubeObj = new SceneObject(youtube);
            youtubeObj.onMouseUp = function()
            {
                open('https://www.youtube.com/channel/UC_FZ9hdaRTOFAo-TBtc1fGw', '_blank');
            };
            youtubeObj.setPosition(-75, wade.getScreenHeight()/2 - 225);
            wade.addSceneObject(youtubeObj, true);

                        var twitter = new Sprite('images/x_R.png', self.layers.front);
                        twitter.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, twitter.getDrawFunction()));
                        var twitterObj = new SceneObject(twitter);
                        twitterObj.onMouseUp = function()
                        {
                            open('https://twitter.com/share?url=https://messiahstudios.github.io/divine-gems-game/&via=Messiah_Studios&text=Finally%20Finished%20New%20Match%203%20Game%20%23Divine%20%23Gems%20%23HTML5', '_blank');
                        };
                        twitterObj.setPosition(-25, wade.getScreenHeight()/2 - 225);
                        wade.addSceneObject(twitterObj, true);
                    }
                }));
                var scoreTextObject = new SceneObject(scoreSprite);
                scoreTextObject.setPosition(-scoreSprite.getSize().x/2, 0);
                wade.addSceneObject(scoreTextObject);
            }));

            titleObject.addSprite(youScoredSprite, {x:0, y: 75});
        }));
        var titleObject = new SceneObject(timeOutSprite);
        titleObject.setPosition(0, -200);
        wade.addSceneObject(titleObject);
    };

};

//# sourceURL=app.js
// Start the app
var app = new App();
app.loadingBar();  // Start the loading process



