export const wedding = {
  demo: false,
  bride: 'Hoàng Mến', groom: 'Trọng Huynh', initials: 'M & H',
  date: '2026-11-17T10:00:00+07:00', endDate: '2026-11-17T12:00:00+07:00',
  dateLabel: 'Thứ Ba, 17 tháng 11 năm 2026',
  venue: 'Tư gia nhà gái', address: 'TDP Phương Lạn, phường Lục Nam, TP. Bắc Ninh',
  mapsUrl: '', rsvpUrl: '',
  // URL biểu mẫu dành cho người trả lời, không phải URL chỉnh sửa/quản trị.
  wishes: { formUrl: '' },
  coverImage: 'images/wedding/a7500273.webp', musicUrl: '', publicUrl: 'https://wedding-basic-hoang-demo.jetounce1.chatgpt.site',
  families: {
    bride: { label: 'Nhà gái', father: 'Hoàng Văn Tâm', mother: 'Đỗ Thị Hương' },
    groom: { label: 'Nhà trai', father: 'Nguyễn Văn Hạnh', mother: 'Nguyễn Thị May' }
  },
  couple: [
    { role:'Cô dâu', name:'Hoàng Mến', image:'images/wedding/a7500412.webp', description:'Con gái ông Hoàng Văn Tâm và bà Đỗ Thị Hương.' },
    { role:'Chú rể', name:'Trọng Huynh', image:'images/wedding/a7500287.webp', description:'Con trai ông Nguyễn Văn Hạnh và bà Nguyễn Thị May.' }
  ],
  events: [
    { id:'dinner', label:'Tiệc thân mật', title:'Bữa cơm chung vui', date:'2026-11-16T15:00:00+07:00', endDate:'2026-11-16T18:00:00+07:00', venue:'Tư gia nhà gái', address:'TDP Phương Lạn, phường Lục Nam, TP. Bắc Ninh', mapsUrl:'', schedule:[{time:'15:00',title:'Bữa cơm thân mật'}] },
    { id:'vu-quy', label:'Nhà gái', title:'Lễ vu quy', date:'2026-11-17T10:00:00+07:00', endDate:'2026-11-17T12:00:00+07:00', venue:'Tư gia nhà gái', address:'TDP Phương Lạn, phường Lục Nam, TP. Bắc Ninh', mapsUrl:'', schedule:[{time:'10:00',title:'Lễ vu quy'}] }
  ],
  gifts: [] as { name:string; bank:string; account:string; qrImage:string }[],
  invitation: 'Trân trọng kính mời bạn tới dự lễ vu quy của Hoàng Mến và Trọng Huynh. Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.',
  story: [] as { year:string; title:string; text:string }[],
  schedule: [ { time: '10:00', title: 'Lễ vu quy', text: 'Cùng gia đình chứng kiến ngày vui của Hoàng Mến và Trọng Huynh.' } ],
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
