(function (exports) {
	/**
	 * 鼠标跟踪器
	 * 用于制作
	 * @param {JSON} config {map, object, mousedown, mousemove, mouseup}
	 */
	function MouseTrack(config) {

		this.map = config.map;
		this.config = config || {};

		this.object = this.config.object;

		// for mapPicker.getPick_
		this.container = this.map.options.container;

		// 用于计算与 plane 的交点
		this.raycaster = new fm.Raycaster();

		// 用于计算交差的平面
		this.plane = new fm.Mesh(new fm.PlaneGeometry(10000,10000,1,1), new fm.MeshBasicMaterial({
			visible: false
		}));

		this.plane.rotateX(-Math.PI / 2);
		this.plane.visible = false;

		// add plane to scene
		this.map.mapScene.getO3dScene().add(this.plane);

		// 点击计数
		this.clickCount = 0;

		// 是否为鼠标追踪状态
		this.isTracking = false;

		this._mouseDownFun = this.mouseDown.bind(this);
		this._mouseMoveFun = this.mouseMove.bind(this);
		this._mouseUpFun = this.mouseUp.bind(this);

		this.addEvents();
	}

	MouseTrack.prototype = {
		constructor: MouseTrack,

		addEvents: function() {
			var s = this;
			var dom = s.map.options.container;
			dom.addEventListener('mousedown',  s._mouseDownFun);
			dom.addEventListener('mousemove',  s._mouseMoveFun);
			dom.addEventListener('mouseup',    s._mouseUpFun);
			dom.addEventListener('touchstart', s._mouseDownFun);
			dom.addEventListener('touchmove',  s._mouseMoveFun);
			dom.addEventListener('touchend',   s._mouseUpFun);
		},

		dispose: function() {
			// stop first
			this.stopTrack();

			var s = this;
			var dom = s.map.options.container;
			dom.removeEventListener('mousedown',  s._mouseDownFun);
			dom.removeEventListener('mousemove',  s._mouseMoveFun);
			dom.removeEventListener('mouseup',    s._mouseUpFun);
			dom.removeEventListener('touchstart', s._mouseDownFun);
			dom.removeEventListener('touchmove',  s._mouseMoveFun);
			dom.removeEventListener('touchend',   s._mouseUpFun);

			this.plane.parent.remove(this.plane);
			this.plane.geometry.dispose();
			this.plane.material.dispose();
		},

		getMouse: function(e) {
			return fengmap.MapPicker.prototype.getPick_.call(this, e);
		},

		getPick: function() {

			this.raycaster.setFromCamera(this.currentPick, this.map.currentCamera_);
			var inters = this.raycaster.intersectObject(this.object || this.plane, true);

			if (inters.length > 0) {
				return inters[0];
			}

			return null;

		},

		updatePlaneHeight: function(gid, offsetHeight) {
			offsetHeight = offsetHeight === undefined ? 2.1 : offsetHeight;
			var h = this.map.getGroupHeight(gid) + offsetHeight;
			this.plane.position.y = h;
			this.plane.updateMatrixWorld();
		},

		abort: function() {
			if (this.config.mouseabort) {
				this.config.mouseabort();
			}

			this.stopTrack();
		},

		mouseDown: function(e) {
			if (!this.isTracking) {return;}

			if (e.button === 2) {
				this.abort();
				return;
			}

			this.isMouseDown = true;

			this._lastPick = this.getMouse(e);
			this.currentPick = this._lastPick.clone();

			var inter = this.getPick(e);
			this.point = inter.point;

			if (this.config.mousedown) {
				this.config.mousedown(inter);
			}

			e.preventDefault();
		},

		mouseMove: function(e) {
			if (!this.isTracking) {return;}

			this.currentPick = this.getMouse(e);

			var inter = this.getPick(e);
			this.point = inter.point;

			if (this.config.mousemove) {
				this.config.mousemove(inter);
			}
			
			e.preventDefault();
		},

		mouseUp: function(e) {
			if (!this.isTracking) {return;}

			this.isMouseDown = false;

			this.clickCount ++;

			if (this.config.mouseup) {
				this.config.mouseup();
			}
			
			e.preventDefault();
		},

		startTrack: function() {
			this.updatePlaneHeight(this.map.focusGroupID);

			this.isTracking = true;
			this.plane.visible = true;

			this.map.mapPicker.enabled = false;

			// controls ONLY ENABLE ZOOM
			this.map.controls.enablePan = false;
			this.map.controls.enableRotate = false;

		},

		stopTrack: function() {
			this.clickCount = 0;

			this.isTracking = false;
			this.plane.visible = false;

			this.map.mapPicker.enabled = true;
			
			// controls ONLY ENABLE ZOOM
			this.map.controls.enablePan = true;
			this.map.controls.enableRotate = true;
		},

	}

	exports.FMMouseTrack = MouseTrack;

})((this.fengmap = this.fengmap || {}));



