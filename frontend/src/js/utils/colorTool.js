'use strict';
/**
 * FMEditorColor 颜色帮助类
 * @author cwj 2017-03-03
 */

export const FMEditorColor = {
	/**
	 * 把选择元素中的color转为主题颜色字符串(r,g,b)。主题文件 颜色需要
	 * @param  {[array]} color [r,g,b]
	 * @return {[string]}      'r,g,b'
	 */
	toColorStr: (color) => {
		if (color && color.length >= 3)
			return color[0] + ',' + color[1] + ',' + color[2];
		else return '';
	},

	/**
	 * 把选择元素中的color转为css颜色字符串rgba(r,g,b,a)。css 颜色需要
	 * @param  {[array]} color [r,g,b,a]
	 * @return {[string]}      'rgba(r,g,b,a)'
	 */
	toRGBAColorStr: (color) => {
		if (color && color.length > 3)
			return 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
		else return '';
	},

	/**
	 * 把主题文件中的color转为openlayer所需颜色值array[r,g,b,a]。 openlayer颜色需要
	 * @param  {string} color 'r,g,b'
	 * @param {number} alpha 透明度0-1
	 * @return {array}      [r,g,b,a]
	 */
	toColor: (color, alpha) => {
		let rgba = color.split(',');
		rgba.push(parseFloat(alpha));
		return rgba;
	},

	/**
	 * 把颜色值得到rgba对象。material-ui需要
	 * @param  {[string]} color [rgba(r,g,b,a)]
	 * @param  {[int]} alpha [0.3]
	 * @return {[json]}       [{r,g,b,a}]
	 */
	toRGBColor: (color) => {
		let rgbColor;
		if (color.length === 0) {
			rgbColor = {
				r: 68,
				g: 149,
				b: 239,
				a: 1,
			}
		} else {
			rgbColor = {
				r: color[0],
				g: color[1],
				b: color[2],
				a: color[3],
			};
		}

		return rgbColor;
	}
};