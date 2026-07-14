/* ==========================================================================
   DUMMY DATA — replace with PHP/MySQL API responses in the next phase.
   ========================================================================== */

const CATEGORIES = [
  { id: 'but-bi', icon: 'pen', name: 'Bút bi', count: 86 },
  { id: 'but-chi', icon: 'pen', name: 'Bút chì', count: 42 },
  { id: 'giay-a4', icon: 'paperStack', name: 'Giấy A4', count: 58 },
  { id: 'so', icon: 'notebook', name: 'Sổ tay', count: 74 },
  { id: 'ho-so', icon: 'folder', name: 'Hồ sơ & Kẹp file', count: 63 },
  { id: 'bang-keo', icon: 'tape', name: 'Băng keo & Kéo', count: 39 },
  { id: 'may-tinh', icon: 'calculator', name: 'Máy tính Casio', count: 21 },
  { id: 'may-in', icon: 'printer', name: 'Máy in & Mực in', count: 17 },
  { id: 'phu-kien', icon: 'package', name: 'Phụ kiện văn phòng', count: 55 },
  { id: 'but-long', icon: 'pen', name: 'Bút lông & Highlight', count: 30 },
  { id: 'giay-note', icon: 'paperStack', name: 'Giấy Note', count: 26 },
  { id: 'giay-mau', icon: 'paperStack', name: 'Giấy màu', count: 19 },
];

// Palette used to vary generated thumbnail illustrations per product
const THUMB_PALETTES = [
  ['#DD0000', '#F03A3A'], ['#FF7A00', '#FFB347'], ['#2563EB', '#5B8DEF'],
  ['#16A34A', '#4ADE80'], ['#FFC857', '#FFDD8C'], ['#1F2937', '#4B5563'],
];

function productThumbSVG(iconName, seed) {
  const p = THUMB_PALETTES[seed % THUMB_PALETTES.length];
  const icon = ICONS[iconName] || ICONS.pen;
  const inner = icon.replace('<svg', '<svg').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p[0]}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${p[1]}" stop-opacity="0.22"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#g${seed})"/>
    <circle cx="100" cy="100" r="58" fill="#fff" opacity="0.6"/>
    <g transform="translate(60,60) scale(3.3)" stroke="${p[0]}" fill="${p[0]}" color="${p[0]}">${inner}</g>
  </svg>`;
}

const PRODUCTS = [
  { id: 1, image: 'images/products/p1.jpeg', name: 'Bút bi Thiên Long TL-027 (Hộp 10 cây)', cat: 'but-bi', price: 35000, oldPrice: 45000, rating: 4.8, reviews: 214, badge: 'Bán chạy', brand: 'Thiên Long' },
  { id: 2, image: 'images/products/p2.jpeg', name: 'Bút gel Deli mực đen 0.5mm', cat: 'but-bi', price: 8000, oldPrice: null, rating: 4.6, reviews: 98, badge: 'Mới', brand: 'Deli' },
  { id: 3, image: 'images/products/p3.jpeg', name: 'Bút chì gỗ 2B Staedtler (Hộp 12 cây)', cat: 'but-chi', price: 42000, oldPrice: 52000, rating: 4.9, reviews: 156, badge: '-19%', brand: 'Staedtler' },
  { id: 4, image: 'images/products/p4.jpeg', name: 'Giấy A4 Double A 70gsm (Ram 500 tờ)', cat: 'giay-a4', price: 68000, oldPrice: 78000, rating: 4.9, reviews: 342, badge: 'Bán chạy', brand: 'Double A' },
  { id: 5, image: 'images/products/p5.jpeg', name: 'Sổ tay bìa da Kraft A5 200 trang', cat: 'so', price: 55000, oldPrice: 75000, rating: 4.7, reviews: 121, badge: '-27%', brand: 'Campus' },
  { id: 6, image: 'images/products/p6.jpeg', name: 'Bìa còng hồ sơ 3 phân Thiên Long', cat: 'ho-so', price: 32000, oldPrice: null, rating: 4.5, reviews: 67, badge: null, brand: 'Thiên Long' },
  { id: 7, image: 'images/products/p7.jpeg', name: 'Băng keo trong 5cm x 100m (Cuộn)', cat: 'bang-keo', price: 15000, oldPrice: 19000, rating: 4.4, reviews: 88, badge: null, brand: 'Deli' },
  { id: 8, image: 'images/products/p8.jpeg', name: 'Kéo văn phòng cán mềm chống trượt', cat: 'bang-keo', price: 22000, oldPrice: null, rating: 4.6, reviews: 54, badge: 'Mới', brand: 'Deli' },
  { id: 9, image: 'images/products/p9.jpeg', name: 'Máy tính Casio FX-580VN X', cat: 'may-tinh', price: 495000, oldPrice: 550000, rating: 5.0, reviews: 410, badge: 'Bán chạy', brand: 'Casio' },
  { id: 10, image: 'images/products/p10.jpeg', name: 'Máy in Canon LBP2900 (đã qua sử dụng)', cat: 'may-in', price: 1850000, oldPrice: 2200000, rating: 4.3, reviews: 45, badge: '-16%', brand: 'Canon' },
  { id: 11, image: 'images/products/p11.jpeg', name: 'Mực in HP 12A chính hãng', cat: 'may-in', price: 320000, oldPrice: null, rating: 4.7, reviews: 76, badge: null, brand: 'HP' },
  { id: 12, image: 'images/products/p12.jpeg', name: 'Bút lông bảng Thiên Long WB-02 (Bộ 4 màu)', cat: 'but-long', price: 45000, oldPrice: 58000, rating: 4.6, reviews: 63, badge: '-22%', brand: 'Thiên Long' },
  { id: 13, image: 'images/products/p13.jpeg', name: 'Bút Highlight dạ quang (Bộ 6 màu)', cat: 'but-long', price: 38000, oldPrice: null, rating: 4.5, reviews: 91, badge: 'Mới', brand: 'Deli' },
  { id: 14, image: 'images/products/p14.jpeg', name: 'Giấy Note nhiều màu 76x76mm (Set 5 tập)', cat: 'giay-note', price: 25000, oldPrice: 30000, rating: 4.7, reviews: 133, badge: null, brand: 'Deli' },
  { id: 15, image: 'images/products/p15.jpeg', name: 'Giấy màu A4 thủ công (Xấp 100 tờ)', cat: 'giay-mau', price: 40000, oldPrice: null, rating: 4.4, reviews: 39, badge: null, brand: 'Colokit' },
  { id: 16, image: 'images/products/p16.jpeg', name: 'Kẹp bướm đa năng (Hộp 12 cái)', cat: 'phu-kien', price: 18000, oldPrice: 22000, rating: 4.3, reviews: 47, badge: null, brand: 'Deli' },
  { id: 17, image: 'images/products/p17.jpeg', name: 'Bút bi cao cấp Thiên Long Sign Pen 038', cat: 'but-bi', price: 6000, oldPrice: null, rating: 4.8, reviews: 302, badge: 'Bán chạy', brand: 'Thiên Long' },
  { id: 18, image: 'images/products/p18.jpeg', name: 'Sổ lò xo A5 kẻ ngang 100 trang', cat: 'so', price: 28000, oldPrice: 34000, rating: 4.6, reviews: 84, badge: '-18%', brand: 'Campus' },
  { id: 19, image: 'images/products/p19.jpeg', name: 'Bìa hồ sơ nhựa cứng A4 (Hộp 20 cái)', cat: 'ho-so', price: 62000, oldPrice: null, rating: 4.5, reviews: 29, badge: 'Mới', brand: 'Deli' },
  { id: 20, image: 'images/products/p20.jpeg', name: 'Máy tính Casio FX-880BTG', cat: 'may-tinh', price: 890000, oldPrice: 990000, rating: 4.9, reviews: 58, badge: '-10%', brand: 'Casio' },
  { id: 21, image: 'images/products/p21.jpeg', name: 'Giấy A3 Double A 80gsm (Ram 500 tờ)', cat: 'giay-a4', price: 145000, oldPrice: null, rating: 4.8, reviews: 62, badge: null, brand: 'Double A' },
  { id: 22, image: 'images/products/p22.jpeg', name: 'Bút máy Hero 359 ngòi trung', cat: 'but-bi', price: 65000, oldPrice: 80000, rating: 4.7, reviews: 71, badge: '-19%', brand: 'Hero' },
  { id: 23, image: 'images/products/p23.jpg', name: 'Kệ để bàn đa năng 6 ngăn', cat: 'phu-kien', price: 89000, oldPrice: 110000, rating: 4.6, reviews: 53, badge: 'Mới', brand: 'Deli' },
  { id: 24, image: 'images/products/p24.jpeg', name: 'Combo bút bi + bút chì + tẩy (Set 3 món)', cat: 'but-bi', price: 24000, oldPrice: 32000, rating: 4.7, reviews: 118, badge: '-25%', brand: 'Thiên Long' },
];

function getProduct(id) { return PRODUCTS.find(p => p.id == id); }
function getCategoryName(catId) { const c = CATEGORIES.find(c => c.id === catId); return c ? c.name : catId; }

const NEWS = [
  { id: 1, image: 'images/news/n1.jpeg', title: '10 mẹo học tập hiệu quả với sổ tay Bullet Journal', cat: 'Mẹo học tập', date: '28/06/2026', excerpt: 'Bullet Journal không chỉ là một cuốn sổ, đó là một hệ thống giúp bạn quản lý thời gian và ghi nhớ kiến thức tốt hơn mỗi ngày.' },
  { id: 2, image: 'images/news/n2.jpeg', title: 'Cách chọn bút bi phù hợp với từng loại giấy viết', cat: 'Mẹo văn phòng', date: '24/06/2026', excerpt: 'Không phải loại bút nào cũng phù hợp với mọi loại giấy. Cùng tìm hiểu cách chọn bút để có nét chữ đẹp và bền mực nhất.' },
  { id: 3, image: 'images/news/n3.jpg', title: 'Flash Sale tháng 7: Giảm đến 40% toàn bộ dụng cụ học tập', cat: 'Khuyến mãi', date: '20/06/2026', excerpt: 'Chương trình khuyến mãi lớn nhất mùa tựu trường đã chính thức khởi động với hàng ngàn ưu đãi hấp dẫn.' },
  { id: 4, image: 'images/news/n4.jpeg', title: 'Hướng dẫn mua hàng và thanh toán online an toàn', cat: 'Hướng dẫn mua hàng', date: '15/06/2026', excerpt: 'Từng bước đặt hàng, chọn phương thức thanh toán và theo dõi đơn hàng dễ dàng chỉ trong vài phút.' },
  { id: 5, image: 'images/news/n5.jpeg', title: 'Chuẩn bị dụng cụ học tập cho năm học mới', cat: 'Mẹo học tập', date: '10/06/2026', excerpt: 'Danh sách đầy đủ những vật dụng cần thiết giúp các bạn học sinh, sinh viên sẵn sàng cho năm học mới.' },
  { id: 6, image: 'images/news/n6.jpeg', title: 'Tuyển dụng nhân viên bán hàng & vận hành kho', cat: 'Tuyển dụng', date: '05/06/2026', excerpt: 'VPP Hoàng Linh đang mở rộng đội ngũ tại TP.HCM và Hà Nội với nhiều vị trí hấp dẫn, phúc lợi tốt.' },
];

const TESTIMONIALS = [
  { name: 'Nguyễn Thị Minh Anh', role: 'Giáo viên Tiểu học', avatar: 'images/avatars/customer-1.svg', text: 'Đặt hàng số lượng lớn cho lớp học mà giá vẫn rất tốt, giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!', rating: 5 },
  { name: 'Trần Văn Hùng', role: 'Nhân viên văn phòng', avatar: 'images/avatars/customer-2.svg', text: 'Mực in và giấy A4 chất lượng, đúng như mô tả. Sẽ tiếp tục ủng hộ shop trong thời gian tới.', rating: 5 },
  { name: 'Lê Thảo Vy', role: 'Sinh viên năm 3', avatar: 'images/avatars/customer-3.svg', text: 'Sổ tay đẹp, giá sinh viên dễ chịu, có nhiều mẫu để lựa chọn. Shop tư vấn nhiệt tình nữa.', rating: 4 },
];

const BRANDS = [
  { name: 'Thiên Long', logo: 'images/brands/ThienLong.png' },
  { name: 'Deli', logo: 'images/brands/Deli.png' },
  { name: 'Casio', logo: 'images/brands/Casio.png' },
  { name: 'Double A', logo: 'images/brands/DouleA.png' },
  { name: 'Campus', logo: 'images/brands/Campus.png' },
  { name: 'Staedtler', logo: 'images/brands/Staedtler.png' },
];
