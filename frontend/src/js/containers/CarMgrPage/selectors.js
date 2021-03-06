/**
 * @authors  hxb (huangxuebing@fengmap.com)
 * @date     2017/9/6
 * @describe 车辆管理 selectors
 */
'use strict';
import {createSelector} from 'reselect';

const selectCar = (state) => state.get('car');

const carDataSourceSelector = () => createSelector(
    selectCar,
    (carState) => carState.get('carDataSource')
);

const tableDataLoadingSelector = () => createSelector(
    selectCar,
    (carState) => carState.get('tableDataLoading')
);


const carListSelector = () => createSelector(
    selectCar,
    (carState) => {
        const carDataSource = carState.get('carDataSource') ? carState.get('carDataSource') : [];
        return carDataSource.filter((item) => {
            return item.deviceCode !== null && item.deviceCode !== '';
        });
    }
);

export {
    selectCar,
    carDataSourceSelector,
    tableDataLoadingSelector,
    carListSelector
};
