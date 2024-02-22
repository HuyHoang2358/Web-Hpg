import type { ChartOptions } from 'chart.js';

export const webServiceOptions = [
  {
    label: 'wms',
    value: 'wms',
  },
];

export const dataOptions = [
  {
    label: 'vector',
    value: 'vector',
  },
  // {
  //   label: 'raster',
  //   value: 'raster',
  // },
];

export const shareOptions = [
  {
    label: 'Công khai',
    value: 'public',
  },
  {
    label: 'Riêng tư',
    value: 'private',
  },
  {
    label: 'Nội bộ',
    value: 'internal',
  },
];

export const objectTypeOptions = [
  {
    label: 'Tất cả',
    value: 'all',
  },
  {
    label: 'Công trình',
    value: 'construction',
  },
  {
    label: 'Lồng bè',
    value: 'raftCage',
  },
  {
    label: 'Khu đất bỏ hoang',
    value: 'abandonedLand',
  },
];

export const displayDateFormat = 'DD/MM/YYYY';

export const bodyDateFormat = 'DD-MM-YYYY';

export const responseDateFormat = 'YYYY-MM-DD';

export const activeKeyBottomHome = 'BOTTOM_HOME';

export const keyNotificationMap = 'keyNotificationMap';

export const randomAllKey = 'ALL_KEY_WEB_HP';

export const defaultPage = 1;

export const defaultPageSize = 10;

export const defaultPassword = '123456aA@';

export const coating = [
  { id: 2, name: 'road', color: '#FFAA32', vn_name: 'Đường GT', rgb: [255, 170, 50] },
  { id: 3, name: 'water', color: '#A0FFFF', vn_name: 'Mặt nước', rgb: [160, 255, 255] },
  { id: 4, name: 'forest', color: '#AAFF32', vn_name: 'Rừng, cây xanh', rgb: [170, 255, 50] },
  { id: 5, name: 'agricultural', color: '#FFFF64', vn_name: 'Vườn, ruộng', rgb: [255, 255, 100] },
  {
    id: 1,
    name: 'building',
    color: '#FFA0FF',
    vn_name: 'Công trình nhân tạo',
    rgb: [255, 160, 255],
  },
  {
    id: 0,
    name: 'ground',
    color: '#FFFFFF',
    vn_name: 'Đất trống và cây bụi',
    rgb: [255, 255, 254],
  },
];

export const objects = [
  {
    id: 2,
    name: 'building',
    color: '#FFA0FF',
    vn_name: 'Building',
    rgb: [255, 160, 255],
  },
];

export const stackedBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: function (context) {
        return Number(context?.dataset?.data[context?.dataIndex]) > 10;
      },
      font: {
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
      stacked: true,
    },
    x: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
      stacked: true,
      min: 0,
    },
  },
};

export const horizontalBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: '#f2f2f2',
      display: function (context) {
        return Number(context?.dataset?.data[context?.dataIndex]) > 0;
      },
      font: {
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
    },
    x: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
    },
  },
};

export const verticalBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'x',
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: '#f2f2f2',
      display: function (context) {
        return Number(context?.dataset?.data[context?.dataIndex]) > 0;
      },
      font: {
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
    },
    x: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        display: false,
      },
    },
  },
};

export const excelMineType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const objectsExample = [
  {
    latitude: '20.726480999859895',
    longitude: '106.62209451198578',
    height: 0,
  },
  {
    latitude: '20.717233512618325',
    longitude: '106.62736880779266',
    height: 0,
  },
  {
    latitude: '20.724896433136678',
    longitude: '106.61056208610535',
    height: 0,
  },
  {
    latitude: '20.722263182293286',
    longitude: '106.64155232906342',
    height: 0,
  },
  {
    latitude: '20.722349485484038',
    longitude: '106.63861048221588',
    height: 0,
  },
  {
    latitude: '20.72810570760207',
    longitude: '106.62394094467163',
    height: 0,
  },
  {
    latitude: '20.723541673746972',
    longitude: '106.63861048221588',
    height: 0,
  },
  {
    latitude: '20.72060034058311',
    longitude: '106.64110279083252',
    height: 0,
  },
  {
    latitude: '20.721768444234673',
    longitude: '106.62396991252899',
    height: 0,
  },
];
