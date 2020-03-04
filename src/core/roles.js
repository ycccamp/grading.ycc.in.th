const roleNames = {
  admin: 'ผู้ดูแลระบบ',
  core: 'ผู้ตรวจคำถามกลาง',
  designer: 'ผู้ตรวจคำถามสาขา Designer',
  marketing: 'ผู้ตรวจคำถามสาขา Marketing',
  creative: 'ผุ้ตรวจสาขา Creative',
  content: 'ผู้ตรวจคำถามสาขา Content',
  programming: 'ผู้ตรวจคำถามสาขา Programming',
  none: 'รอการยืนยันสิทธิ',
}

const roleName = role => roleNames[role] || role

export const majorRoles = ['programming', 'designer']
export const graderRoles = ['core', ...majorRoles]

export const isGrader = role => graderRoles.includes(role)

export function isAllowed(targetRole, currentRole) {
  if (targetRole === 'grader') {
    return isGrader(currentRole)
  }

  if (currentRole === targetRole) {
    return true
  }
}

export default roleName
