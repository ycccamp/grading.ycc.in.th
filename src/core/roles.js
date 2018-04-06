const roleNames = {
  admin: 'ผู้ดูแลระบบ',
  core: 'ผู้ตรวจคำถามกลาง',
  design: 'ผู้ตรวจคำถามสาขา Design',
  marketing: 'ผู้ตรวจคำถามสาขา Marketing',
  content: 'ผู้ตรวจคำถามสาขา Content',
  programming: 'ผู้ตรวจคำถามสาขา Programming',
  none: 'รอการยืนยันสิทธิ',
}

const roleName = role => roleNames[role] || role

export default roleName
