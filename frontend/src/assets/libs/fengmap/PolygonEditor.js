
/**
 * EditablePolygonMarker
 * 可编辑多边形标注
 */
(function(exports) {

	//
	// 画圆点, 返回 texture
	//
	function getCircleTexture(size) {
		var ctx = document.createElement('canvas').getContext('2d');

		size = size || 128;

		ctx.canvas.width = size;
		ctx.canvas.height = size;

		// start to draw
		ctx.beginPath();

	    var circle = {
	        x : size / 2,    //圆心的x轴坐标值
	        y : size / 2,    //圆心的y轴坐标值
	        r : size / 2 - 4      //圆的半径
	    };

	    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);  

	    // 填充
	    ctx.fillStyle = 'white'
	    ctx.globalAlpha = .5;
	    ctx.fill();

	    // 描边
	    ctx.strokeStyle = "white";
	    ctx.globalAlpha = 1;
	    ctx.lineWidth = 6;
	    ctx.stroke();

	    return new fm.CanvasTexture(ctx.canvas);
	}

	var normalColor = 0x22A5ee;

	//
	// 得到圆点的sprite
	//
	exports.createCircleSprite = function(map, size) {
		size = size || 128;
		var tex = getCircleTexture(size);

		var mat = new fm.SpriteMaterial({map: tex, color: normalColor});
		var sprite = new fm.Sprite(mat);

		sprite.update = function () {
			var scale = fengmap.MapUtil.getSpriteScale(map, sprite);

			// use for snap
			sprite._scale_ = scale;

			sprite.scale.setScalar(size * scale / 2);
		}

		sprite.setGreen = function () {
			sprite.material.color.setHex(0x00ff00);
		}

		sprite.setRed = function () {
			sprite.material.color.setHex(0xff0000);
		}

		sprite.setNormal = function () {
			sprite.material.color.setHex(normalColor);
		}

		// register update event circle
		map.on('update', sprite.update);

		sprite.dispose = function () {
			map.off('update', sprite.update);
			sprite.parent.remove(sprite);
			sprite.material.dispose();
			sprite.material.map.dispose();
		}

		return sprite;
	}

	/**
	 * 可编辑多边形标注的绘制与编辑
	 * @param {JSON} config {map, color, snapDis, }
	 */
	function PolygonEditor(config) {

		this.config = config || {};

		this.map = this.config.map;

		normalColor = this.config.color || normalColor;

		this.mode = 'create';  // create | edit

		this.isStarted = false;

		//
		// 圆点
		//
		this.circle = fengmap.createCircleSprite(this.map, 32);
		this.circle.visible = false;
		this.circle.material.depthTest = false;
		this.circle.renderOrder = 100;

		this.map.mapScene.o3dScene_.add(this.circle);

		//
		// events
		//
		this._md = this.mousedown.bind(this);
		this._mm = this.mousemove.bind(this);
		this._mu = this.mouseup.bind(this);
		this._ma = this.mouseabort.bind(this);

		//
		// 鼠标工具
		//
		this.mt = new fengmap.FMMouseTrack({
			map: this.map,
			mousedown: this._md,
			mousemove: this._mm,
			mouseup: this._mu,
			mouseabort: this._ma
		});

		//
		// 点集合
		//
		this.points = [];
		this.vertices = [];

		// 线的样式
		this.lineStyle = {
			lineWidth: 2,
			color: normalColor,
			offsetHeight: 0,
			lineType: 'full',
			segments: 2
		};

		// polygon marker 样式
		this.polygonMarkerStyle = {
			//设置颜色
			color: normalColor,
			//设置透明度
			alpha: .5,
			//设置边框线的宽度
			lineWidth: 1.5,
			//设置高度
			height: 2.1,
		}

		// 用于前3个点的动态画线
		this.linePs = [];

	}

	PolygonEditor.prototype = {
		constructor: PolygonEditor,

		updateLine: function(points) {
			if (this.line) {
				this.line.dispose();
			}
			this.line = this.map.drawLineMark(points || this.points, this.lineStyle);
		},

		getPMLayer: function() {
			var group = this.map.getFMGroup(this.map.focusGroupID);
			return group.getOrCreateLayer('polygonMarker');
		},

		updatePolygonMarker: function(points, vertices) {
			var pm = this.mode === 'create' ? this.polygonMarker : this.snaped.pm;

			if (pm) {
				pm.update({
					points: points
				});
			} else {
				
				var layer = this.getPMLayer();

				this.polygonMarkerStyle.points = points;
				this.polygonMarker = new fengmap.FMPolygonMarker(
					this.polygonMarkerStyle
				);

				layer.addMarker(this.polygonMarker);

				pm = this.polygonMarker;

			}

			// record ps & vs
			pm._ps = points.slice();
			pm._vs = vertices.slice();

			//
			// 体面的得到些PolygonMarker里所有点的方法
			//
			pm.getPoints = function () {
				return pm._ps;
			}
		},

		clearSnapPM: function() {
			if (this.snapPM) {
				this.snapPM.setColor(normalColor);
				this.snapPM = null;
			}
		},

		/**
		 * 手动结束
		 */
		abort: function() {
			this.mt.abort();
		},

		mousedown: function(e) {

			this.isMouseDown = true;
			var v = this.snapVec || e.point;

			// Need to clone!
			v = v.clone();

			// 记录下点击时的点
			this._lastVec = e.point;

			// 创建模式
			if (this.mode === 'create') {

				//
				// append index
				//
				v.index = this.vertices.length;

				this.vertices.push(v);
				this.points.push(this.map.toMapCoord(v));

				// 添加到动态线点集合
				if (this.mt.clickCount < 3) {
					this.linePs.push(this.map.toMapCoord(v));
				}

				// 画到第三个点的时候, 因为已经可以创建 polygonMarker了, 
				// 所以可以把动态线清除了
				if (this.mt.clickCount === 2) {
					this.line.dispose();
					this.linePs.length = 0;
				}

				if (this.points.length > 2) {
					this.updatePolygonMarker(this.points, this.vertices);
				}

			} else if (this.mode === 'edit') {	// 编辑模式

				this.clearSnapPM();

				this.snaped = this._snaped;

				if (this.snaped) {
					this.snapPMs = this.getSnapPMs(this.snaped.pm.o3d_);
				}

			}
		},

		mousemove: function(e) {

			var res = this.snap(e.point);
			var offset = new fm.Vector3();

			this._snaped = null;

			// 设置圆点的位置
			if (res && res.vec) {
				this.circle.setGreen();
				this.snapVec = res.vec;

				this.circle.position.copy(res.vec);

				this._snaped = res;
			} else {
				this.circle.setNormal();
				this.snapVec = null;
				this.circle.position.copy(e.point);
			}

			//
			// 前三个点的动态画线
			//
			if (this.mode === 'create') {

				if (this.mt.clickCount < 3) {
					var ps = this.linePs.slice();
					ps.push(this.map.toMapCoord(this.snapVec || e.point));

					this.updateLine(ps);
				}

			}

			// 鼠标按下 & 为编辑模式
			if (this.snaped && this.isMouseDown && this.mode === 'edit') {

				offset.copy(e.point.clone().sub(this._lastVec));
				this._lastVec = e.point.clone();

				// 得到当前捕捉到的 polygonMarker
				res = this.snaped;

				//
				// drag update polygonMarker
				//
				var ps = res.pm._ps;
				var vs = res.pm._vs;

				//
				// DONOT use res.vec.clone(); because need to update this vector
				//
				var newVec = res.vec.add(offset);

				// 如果捕捉到了点
				if (this.snapVec) {
					newVec = this.snapVec.clone();
					newVec.index = res.vec.index;
				}

				this.circle.position.copy(newVec);

				ps[res.vec.index] = this.map.toMapCoord(newVec);
				vs[res.vec.index] = newVec;

				this.updatePolygonMarker(ps, vs);
			}
			
		},

		mouseup: function(e) {
			this.isMouseDown = false;

			if (this.mode === 'edit') {
				this.snapPMs = this.getSnapPMs();
			}
		},

		mouseabort: function(e) {
			this.circle.visible = false;

			this.points.length = 0;
			this.vertices.length = 0;

			// map.options.container.style.cursor = 'auto';

			// clear line
			if (this.line) {
				this.line.dispose();
			}

			// invoke callback 
			if (this.polygonMarker && this.config.callback) {
				this.config.callback(this.polygonMarker);
			}

			// 恢复被捕捉的PolygonMarker的颜色
			this.clearSnapPM();

			this.line = null;
			this.polygonMarker = null;

			this.linePs.length = 0;

			this.isStarted = false;

		},

		/**
		 * 捕捉点
		 */
		snap: function(vec) {
			if (!this.snapPMs) {
				return;
			}

			var res = {vec: null};

			for (var i = 0; i < this.snapPMs.length; i++) {
				var pm = this.snapPMs[i];

				if (!pm._vs) {
					continue;
				}

				res.pm = pm;

				for (var j = 0; j < pm._vs.length; j++) {
					var v = pm._vs[j];

					var dis = v.distanceTo(vec);

					if (dis < 10 * this.circle._scale_) {
						res.vec = v;

						this.clearSnapPM();

						// 将当前捕捉到的polygonMarker的颜色改为橙色
						pm.setColor(0xF68F00);
						this.snapPM = pm;

						return res;
					}
				}
			}

			this.clearSnapPM();

			return res;
		},

		getSnapPMs: function(exclude) {
			var cs = this.getPMLayer().o3d_.children;

			var res = [];

			for (var i = 0; i < cs.length; i++) {
				var c = cs[i];

				if (c !== exclude) {
					res.push(c.fm_);
				}

			}

			return res;
		},

		start: function(mode) {
			// map.options.container.style.cursor = 'none';

			// abort first
			this.abort();

			// 设置模式, 创建 | 编辑
			this.mode = mode || 'create';
			this.isStarted = true;

			//
			// 收集所有需要捕捉的点
			//
			this.snapPMs = this.getSnapPMs();

			this.circle.visible = true;
			this.mt.startTrack();

		},

		dispose: function() {

			this.mt.dispose();

			this.circle.parent.remove(this.circle);

			this.circle.material.dispose();
			this.circle.material.map.dispose();

		}
	}

	exports.FMPolygonEditor = PolygonEditor;

})((this.fengmap = this.fengmap || {}));