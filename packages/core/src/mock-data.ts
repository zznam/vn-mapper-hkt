// ── Coordinate ──────────────────────────────────────────────────────────────

export interface ICoordinate {
  latitude: number;
  longitude: number;
}

/** @deprecated Use ICoordinate instead */
export type Coordinate = ICoordinate;

// ── Location Types ───────────────────────────────────────────────────────────

export enum ELocationType {
  House = 'house',
  Office = 'office',
}

/** @deprecated Use ELocationType instead */
export type LocationType = 'house' | 'office';

// ── Floor Plan ───────────────────────────────────────────────────────────────

export interface IFloorPlan {
  floorNumber: string;
  planImageUrl: string;
}

/** @deprecated Use IFloorPlan instead */
export type FloorPlan = IFloorPlan;

// ── House / Location ─────────────────────────────────────────────────────────

export interface IHouse {
  id: string;
  type: ELocationType;
  address: string;
  coordinate: ICoordinate;
  imageUrl: string;
  details?: string;
  buildingLayouts?: IFloorPlan[];
  tags?: string[];
  isBookmarked?: boolean;
}

/** @deprecated Use IHouse instead */
export type House = IHouse;

// ── API Base URL (resolved at runtime so mobile & API share one source) ──────

const API_BASE = 'http://10.122.96.152:3001';

// ── Mock Route (hẻm path in District 5, HCMC) ───────────────────────────────

export const MOCK_ROUTE: ICoordinate[] = [
  { latitude: 10.762622, longitude: 106.660172 },
  { latitude: 10.762750, longitude: 106.660180 },
  { latitude: 10.762880, longitude: 106.660200 },
  { latitude: 10.762950, longitude: 106.660350 },
  { latitude: 10.763000, longitude: 106.660500 },
  { latitude: 10.763050, longitude: 106.660650 },
  { latitude: 10.763100, longitude: 106.660780 },
  { latitude: 10.763150, longitude: 106.660900 },
];

// ── Mock Houses (20 locations along and near the route) ──────────────────────

export const MOCK_HOUSES: IHouse[] = [
  // --- Core route houses ---
  {
    id: 'h1',
    type: ELocationType.House,
    address: '123/1 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762650, longitude: 106.660150 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Cổng sắt màu xanh, hẻm xe máy.',
    tags: ['Hẻm Xe Máy 🛵', 'An Ninh 🛡️', 'Số Đỏ 📄'],
    isBookmarked: false,
  },
  {
    id: 'h2',
    type: ELocationType.Office,
    address: '123/3 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762800, longitude: 106.660160 },
    imageUrl: `${API_BASE}/public/office.png`,
    details: 'Tòa nhà văn phòng Hẻm IT, 3 tầng.',
    buildingLayouts: [
      { floorNumber: 'Tầng Trệt - Lễ tân', planImageUrl: `${API_BASE}/public/floor_plan.png` },
      { floorNumber: 'Tầng 1 - Phòng họp', planImageUrl: `${API_BASE}/public/floor_plan.png` },
      { floorNumber: 'Tầng 2 - Khu làm việc', planImageUrl: `${API_BASE}/public/floor_plan.png` },
    ],
    tags: ['Hẻm Ôtô 🚗', 'Khu Làm Việc 💻', 'Bảo Vệ 💂'],
    isBookmarked: false,
  },
  {
    id: 'h3',
    type: ELocationType.House,
    address: '123/5A Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762980, longitude: 106.660300 },
    imageUrl: `${API_BASE}/public/house_2.png`,
    details: 'Nhà 2 lầu, có camera an ninh.',
    tags: ['Hẻm Xe Máy 🛵', 'Yên Tĩnh 🤫'],
    isBookmarked: true,
  },
  {
    id: 'h4',
    type: ELocationType.House,
    address: '123/7 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763020, longitude: 106.660480 },
    imageUrl: `${API_BASE}/public/house_3.png`,
    details: 'Cuối hẻm, cửa nhôm kính.',
    tags: ['Hẻm Xe Máy 🛵', 'Cuối Hẻm 📍'],
    isBookmarked: false,
  },
  // --- Extended houses deeper in the alley ---
  {
    id: 'h5',
    type: ELocationType.House,
    address: '123/9 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763060, longitude: 106.660600 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Nhà mái bằng, cổng xanh lá, trước nhà trồng cây kiểng.',
    tags: ['Hẻm Xe Máy 🛵', 'Có Cây Xanh 🌿'],
    isBookmarked: false,
  },
  {
    id: 'h6',
    type: ELocationType.House,
    address: '123/11 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763085, longitude: 106.660690 },
    imageUrl: `${API_BASE}/public/house_2.png`,
    details: 'Nhà 1 trệt 1 lầu, sơn vàng, có biển số rõ ràng.',
    tags: ['Hẻm Xe Máy 🛵', 'Biển Số Rõ 🔢'],
    isBookmarked: false,
  },
  {
    id: 'h7',
    type: ELocationType.House,
    address: '123/13 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763110, longitude: 106.660770 },
    imageUrl: `${API_BASE}/public/house_3.png`,
    details: 'Nhà ngay góc nhánh hẻm, có rào chắn ban đêm.',
    tags: ['Hẻm Nhánh ↪️', 'An Ninh 🛡️'],
    isBookmarked: false,
  },
  {
    id: 'h8',
    type: ELocationType.Office,
    address: '123/15 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763130, longitude: 106.660850 },
    imageUrl: `${API_BASE}/public/office.png`,
    details: 'Văn phòng nhỏ, 2 tầng, có wifi miễn phí cho khách.',
    buildingLayouts: [
      { floorNumber: 'Tầng Trệt - Tiếp tân', planImageUrl: `${API_BASE}/public/floor_plan.png` },
      { floorNumber: 'Tầng 1 - Văn phòng', planImageUrl: `${API_BASE}/public/floor_plan.png` },
    ],
    tags: ['Hẻm Xe Máy 🛵', 'Wifi Miễn Phí 📶'],
    isBookmarked: false,
  },
  {
    id: 'h9',
    type: ELocationType.House,
    address: '123/17 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.763145, longitude: 106.660880 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Nhà cấp 4, mái tôn, số nhà viết trên tường.',
    tags: ['Hẻm Xe Máy 🛵', 'Nhà Cấp 4 🏚️'],
    isBookmarked: false,
  },
  // --- Sub-alley branch (252/45/...) ---
  {
    id: 'h10',
    type: ELocationType.House,
    address: '252/45/1 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762700, longitude: 106.660050 },
    imageUrl: `${API_BASE}/public/house_2.png`,
    details: 'Hẻm cụt, nhà đầu hẻm phụ, cổng gỗ.',
    tags: ['Hẻm Cụt 🚫', 'Hẻm Xe Máy 🛵'],
    isBookmarked: false,
  },
  {
    id: 'h11',
    type: ELocationType.House,
    address: '252/45/3 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762720, longitude: 106.659990 },
    imageUrl: `${API_BASE}/public/house_3.png`,
    details: 'Nhà 3 tầng, mặt tiền hẹp, ban công hoa.',
    tags: ['Hẻm Phụ 🔀', 'Ban Công Hoa 🌸'],
    isBookmarked: true,
  },
  {
    id: 'h12',
    type: ELocationType.House,
    address: '252/45/5 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762740, longitude: 106.659940 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Cuối hẻm phụ, chó nuôi trong nhà.',
    tags: ['Hẻm Cụt 🚫', 'Chú Ý Chó 🐕'],
    isBookmarked: false,
  },
  // --- Deeper sub-alley (252/45/14/...) ---
  {
    id: 'h13',
    type: ELocationType.House,
    address: '252/45/14/2 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762760, longitude: 106.659880 },
    imageUrl: `${API_BASE}/public/house_2.png`,
    details: 'Hẻm sâu 3 cấp. Chỉ đi bộ hoặc xe đạp được.',
    tags: ['Hẻm Sâu 🪜', 'Chỉ Đi Bộ 🚶'],
    isBookmarked: false,
  },
  {
    id: 'h14',
    type: ELocationType.House,
    address: '252/45/14/7 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762780, longitude: 106.659820 },
    imageUrl: `${API_BASE}/public/house_3.png`,
    details: 'Nhà cuối hẻm sâu nhất. Yên tĩnh tuyệt đối.',
    tags: ['Hẻm Sâu 🪜', 'Yên Tĩnh 🤫', 'Cuối Hẻm 📍'],
    isBookmarked: true,
  },
  // --- Spread on the other side of Nguyễn Trãi ---
  {
    id: 'h15',
    type: ELocationType.House,
    address: '456/2 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762550, longitude: 106.660400 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Nhà ở mặt đường chính, gần chợ.',
    tags: ['Hẻm Ôtô 🚗', 'Gần Chợ 🛒'],
    isBookmarked: false,
  },
  {
    id: 'h16',
    type: ELocationType.Office,
    address: '456/4 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762530, longitude: 106.660460 },
    imageUrl: `${API_BASE}/public/office.png`,
    details: 'Kho nhỏ kết hợp văn phòng, có cửa cuốn.',
    buildingLayouts: [
      { floorNumber: 'Tầng Trệt - Kho hàng', planImageUrl: `${API_BASE}/public/floor_plan.png` },
    ],
    tags: ['Hẻm Ôtô 🚗', 'Cửa Cuốn 🔒'],
    isBookmarked: false,
  },
  {
    id: 'h17',
    type: ELocationType.House,
    address: '456/6 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762510, longitude: 106.660510 },
    imageUrl: `${API_BASE}/public/house_2.png`,
    details: 'Nhà cho thuê phòng, có thang máy mini.',
    tags: ['Hẻm Ôtô 🚗', 'Cho Thuê 🏠', 'Thang Máy 🛗'],
    isBookmarked: false,
  },
  {
    id: 'h18',
    type: ELocationType.House,
    address: '456/8A Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762490, longitude: 106.660560 },
    imageUrl: `${API_BASE}/public/house_3.png`,
    details: 'Nhà ở góc hẻm, rất dễ nhận biết vì có cây bàng lớn.',
    tags: ['Hẻm Ôtô 🚗', 'Cây Bàng 🌳', 'Dễ Nhận Biết ✅'],
    isBookmarked: false,
  },
  {
    id: 'h19',
    type: ELocationType.House,
    address: '456/10 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762470, longitude: 106.660620 },
    imageUrl: `${API_BASE}/public/house_1.png`,
    details: 'Nhà nghỉ mini, có biển hiệu màu đỏ.',
    tags: ['Hẻm Ôtô 🚗', 'Biển Hiệu Đỏ 🔴'],
    isBookmarked: false,
  },
  {
    id: 'h20',
    type: ELocationType.Office,
    address: '456/12 Nguyễn Trãi, Q5',
    coordinate: { latitude: 10.762450, longitude: 106.660680 },
    imageUrl: `${API_BASE}/public/office.png`,
    details: 'Trung tâm dịch vụ pháp lý, có bãi đậu xe trước cổng.',
    buildingLayouts: [
      { floorNumber: 'Tầng Trệt - Tiếp tân', planImageUrl: `${API_BASE}/public/floor_plan.png` },
      { floorNumber: 'Tầng 1 - Luật sư', planImageUrl: `${API_BASE}/public/floor_plan.png` },
      { floorNumber: 'Tầng 2 - Hội đồng', planImageUrl: `${API_BASE}/public/floor_plan.png` },
    ],
    tags: ['Hẻm Ôtô 🚗', 'Dịch Vụ Pháp Lý ⚖️', 'Bãi Xe 🅿️'],
    isBookmarked: false,
  },
];
