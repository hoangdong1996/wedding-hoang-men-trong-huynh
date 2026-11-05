export const wedding = {
  demo: true,
  bride: 'Minh Anh', groom: 'Hoàng Nam', initials: 'A & N',
  date: '2027-03-21T17:00:00+07:00', endDate: '2027-03-21T21:00:00+07:00',
  dateLabel: 'Chủ nhật, 21 tháng 03 năm 2027',
  venue: 'The Garden', address: 'Địa điểm minh họa · TP. Hồ Chí Minh',
  mapsUrl: '', rsvpUrl: '',
  // URL biểu mẫu dành cho người trả lời, không phải URL chỉnh sửa/quản trị.
  wishes: { formUrl: '' },
  coverImage: 'images/wedding/a7500273.webp', musicUrl: '', publicUrl: '',
  couple: [
    { role:'Cô dâu', name:'Minh Anh', image:'images/wedding/a7500412.webp', description:'Yêu những buổi sáng bình yên, những đóa hoa nhỏ và những chuyến đi cùng người mình thương.' },
    { role:'Chú rể', name:'Hoàng Nam', image:'images/wedding/a7500287.webp', description:'Tìm thấy niềm vui trong những điều giản dị, và tìm thấy một mái nhà ở người mình yêu.' }
  ],
  events: [
    { id:'bride', label:'Nhà gái', title:'Lễ vu quy', date:'2027-03-21T09:00:00+07:00', endDate:'2027-03-21T11:00:00+07:00', venue:'Tư gia nhà gái', address:'Địa điểm minh họa · TP. Hồ Chí Minh', mapsUrl:'', schedule:[{time:'09:00',title:'Đón khách'},{time:'09:30',title:'Lễ gia tiên'},{time:'10:00',title:'Chung vui cùng gia đình'}] },
    { id:'groom', label:'Nhà trai', title:'Lễ thành hôn', date:'2027-03-21T17:00:00+07:00', endDate:'2027-03-21T21:00:00+07:00', venue:'The Garden', address:'Địa điểm minh họa · TP. Hồ Chí Minh', mapsUrl:'', schedule:[{time:'17:00',title:'Đón khách'},{time:'18:00',title:'Lễ thành hôn'},{time:'18:30',title:'Tiệc chung vui'}] }
  ],
  gifts: [] as { name:string; bank:string; account:string; qrImage:string }[],
  invitation: 'Giữa muôn vàn cuộc gặp gỡ, chúng mình đã tìm thấy nhau. Và giờ đây, chúng mình muốn cùng bạn viết nên một kỷ niệm thật đẹp trong ngày bắt đầu hành trình mới.',
  story: [
    { year: '2022', title: 'Lần đầu gặp gỡ', text: 'Một cuộc hẹn tình cờ, một câu chuyện chẳng muốn kết thúc.' },
    { year: '2024', title: 'Cùng nhau đi xa', text: 'Những chuyến đi nhỏ, những ngày bình thường trở nên đặc biệt.' },
    { year: '2027', title: 'Một nhà, một hành trình', text: 'Từ hôm nay, mọi con đường đều có một người đồng hành.' }
  ],
  schedule: [ { time: '17:00', title: 'Đón khách', text: 'Gặp gỡ, chụp ảnh và lưu lại những khoảnh khắc.' }, { time: '18:00', title: 'Lễ thành hôn', text: 'Cùng chứng kiến lời hẹn ước của chúng mình.' }, { time: '18:30', title: 'Tiệc chung vui', text: 'Nâng ly cho tình yêu và những điều tốt đẹp.' } ],
  // Thay bằng ảnh WebP của bạn trong public/images; để trống dùng tranh minh họa nội bộ.
  photos: [
    { src: 'images/wedding/a7500193-thumb.webp', fullSrc: 'images/wedding/a7500193.webp', alt: 'Một ngày bên nhau' },
    { src: 'images/wedding/a7500239-thumb.webp', fullSrc: 'images/wedding/a7500239.webp', alt: 'Dịu dàng trong nắng' },
    { src: 'images/wedding/a7500258-thumb.webp', fullSrc: 'images/wedding/a7500258.webp', alt: 'Một lời hẹn ước' },
    { src: 'images/wedding/a7500264-thumb.webp', fullSrc: 'images/wedding/a7500264.webp', alt: 'Chung một hành trình' },
    { src: 'images/wedding/a7500273-thumb.webp', fullSrc: 'images/wedding/a7500273.webp', alt: 'Bình yên bên người thương' },
    { src: 'images/wedding/a7500324-thumb.webp', fullSrc: 'images/wedding/a7500324.webp', alt: 'Nắm tay qua những ngày đẹp' },
    { src: 'images/wedding/a7500339-thumb.webp', fullSrc: 'images/wedding/a7500339.webp', alt: 'Cùng nhau dưới nắng' },
    { src: 'images/wedding/a7500387-thumb.webp', fullSrc: 'images/wedding/a7500387.webp', alt: 'Lưu giữ ngày yêu' },
    { src: 'images/wedding/a7500476-thumb.webp', fullSrc: 'images/wedding/a7500476.webp', alt: 'Khoảnh khắc của chúng mình' },
    { src: 'images/wedding/a7500510-thumb.webp', fullSrc: 'images/wedding/a7500510.webp', alt: 'Tựa vào vai nhau' },
    { src: 'images/wedding/a7500606-thumb.webp', fullSrc: 'images/wedding/a7500606.webp', alt: 'Dạo bước cùng nhau' },
    { src: 'images/wedding/a7500637-thumb.webp', fullSrc: 'images/wedding/a7500637.webp', alt: 'Niềm vui giản dị' }
  ] as { src: string; fullSrc?: string; alt: string }[]
};
