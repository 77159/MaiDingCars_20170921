(function (exports) {

    /**
     * 热力图动画播放类
     * @param {JSON} config { map, radius, opacity, max, fadeTime, stayTime }
     *
     * steps:
     *        0. var hma = new fengmap.HeatMapAnimation({map: map, fadeTime, stayTime});
     *        1. hma.createTextures or hma.setTextrues
     *        3. hma.play(); or hma.play(fadeTime, stayTime)
     *        4. hma.stop();
     */
    function HeatMapAnimation(config) {

        config = config || {};
        this.map = config.map;

        //
        // 热力图实例
        //
        this.heatMap = fengmap.FMHeatMap.create(map, {
            radius: config.radius || 20,
            opacity: config.opacity || .5,
            max: config.max || 100
        });

        this.loop = config.loop === undefined ? true : config.loop;

        //
        // textures, 计算好的热力图
        //
        this.textures = [];

        //
        // 当前层需要设计热力图的所有材质
        //
        this.materials = [];

        //
        // 过渡时间 & 停留时间
        //
        this.fadeTime = .5;
        this.stayTime = .5;

        // 暂停
        this._pause = true;

        this._fadeCnt = 0;
        this._stayCnt = 0;
        this._sign = 0;
        this._index = 0;
        this._start = false;
        this._jumpIndex = -1;

        this.isPlaying = false;

        this.updateFunc = this._update.bind(this);

    }

    HeatMapAnimation.prototype = {

        constructor: HeatMapAnimation,

        /**
         * 从给定的 点集数组 创建所有的纹理
         * @param {Array} points [{x,y,value}, ...]
         */
        createTextures: function (points) {
            var s = this;

            var res = [];

            // clear first
            // s.clearTextures();

            if (points.length < 2) {
                console.log('点集数量小于 2 , 不能制作动画');
                return;
            }

            points.forEach(function (f) {
                res.push(s.heatMap.getTexture(f));
            });

            return res;
        },

        setTextures: function (textures) {
            this.textures = textures;
        },

        /**
         * 播放动画
         * @param  {float} ft 自定义过度时间
         * @param  {float} st 自定义停留时间
         */
        play: function (ft, st) {
            if (this.isPlaying || !this.textures.length) {
                return;
            }

            if (ft !== undefined) {
                this.fadeTime = ft;
            }

            if (st !== undefined) {
                this.stayTime = st;
            }

            this.isPlaying = true;
            this._pause = false;

            this.collectMaterials(this.map.focusGroupID);

            this.map.on('update', this.updateFunc);
        },

        pause: function () {
            this._pause = true;
        },

        resume: function () {
            this._pause = false;
        },

        stop: function () {

            this.isPlaying = false;

            this.map.off('update', this.updateFunc);

            this._index = 0;
            this._fadeCnt = this._stayCnt = 0;
            this._sign = 0;
            this._start = false;
            this._pause = true;

            this._pause = true;

            //
            // clear heatMap
            //
            this.materials.forEach(function (m) {
                m.map = null;
                m.needsUpdate = true;
            });

        },

        jumpTo: function (index) {
            index = Math.min(Math.max(index, 0), this.textures.length);
            this._jumpIndex = index;
        },

        collectMaterials: function (groupID) {
            groupID = groupID || this.map.focusGroupID;
            this.materials = this.heatMap.collectMaterials(groupID);
        },

        _clearMaterialMap: function () {
            this.materials.forEach(function (f) {
                f.map = null;
            });
        },

        clearTextures: function () {

            this.stop();

            this._clearMaterialMap();

            this.textures.forEach(function (f) {
                f.dispose();
            });

            this.textures.length = 0;
        },

        /**
         * 改变材质中两张纹理的输出比
         * @param  {float} value 0 ~ 1
         */
        _changeSwap: function (value) {
            if (!this.materials.length) {
                return;
            }

            this.materials.forEach(function (itm) {
                itm.swap = value;
                itm.needsUpdate = true;
            });
        },

        indexTo: function (index) {
            var s = this;
            if (s.materials.length <= 0) {
                this.collectMaterials(this.map.focusGroupID);
            }
            s.materials.forEach(function (itm) {
                itm.swap = 0;
                itm.map = s.textures[index];
                itm.needsUpdate = true;
            });
        },

        _update: function (delta) {

            var s = this;

            if (s._pause) {
                return;
            }

            s._sign = s._index % 2;

            //
            // 初始设置两个图
            //
            if (!s._start) {
                s._start = true;
                s.materials.forEach(function (itm) {
                    itm.map = s.textures[0];
                    itm.map2 = s.textures[1];
                    itm.needsUpdate = true;
                })
            }

            if (s._fadeCnt >= 1) {

                if (!s._stayCnt) {

                    if (s._jumpIndex > -1) {
                        s._index = s._jumpIndex;
                        s._jumpIndex = -1;
                    } else {
                        s._index++;
                    }

                    if (s._index === s.textures.length) {
                        if (this.loop) {
                            s._index = 0;
                        } else {
                            s.stop();
                            return;
                        }
                    }

                    s.materials.forEach(function (itm) {
                        if (s._sign) {
                            itm.map = s.textures[s._index];
                        } else {
                            itm.map2 = s.textures[s._index];
                        }
                    });
                }

                s._stayCnt += delta / s.stayTime;

                if (s._stayCnt >= 1) {
                    s._stayCnt = 0;
                    s._fadeCnt = 0;
                }

            } else {
                s._fadeCnt += delta / s.fadeTime;
                var v = Math.min(Math.max(s._sign ? s._fadeCnt : 1 - s._fadeCnt, 0), 1);
                s._changeSwap(v);
            }

        }

    }

    exports.HeatMapAnimation = HeatMapAnimation;

})((this.fengmap = this.fengmap || {}));










