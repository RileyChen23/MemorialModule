const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 统计年度拥抱次数
  const hugLogs = await db.collection('hugLogs')
    .where({
      _openid: openid,
      createTime: db.command.gte(new Date('2026-01-01'))
    })
    .get()

  const hugCount = hugLogs.data.length

  // 统计总距离
  const totalDistance = hugLogs.data.reduce((sum: number, log: any) => {
    return sum + (log.distance || 0)
  }, 0)

  // 统计月度数据
  const monthlyData = []
  for (let i = 1; i <= 12; i++) {
    const month = i < 10 ? `0${i}` : `${i}`
    const monthLogs = hugLogs.data.filter((log: any) => {
      const logMonth = log.createTime.substring(5, 7)
      return logMonth === month
    })
    monthlyData.push({
      month: `${i}`,
      count: monthLogs.length
    })
  }

  // 找出最远距离
  const longestDistance = hugLogs.data.reduce((max: number, log: any) => {
    return Math.max(max, log.distance || 0)
  }, 0)

  // 找出最常拥抱的成员
  const memberCount: Record<string, number> = {}
  hugLogs.data.forEach((log: any) => {
    if (log.toMemberName) {
      memberCount[log.toMemberName] = (memberCount[log.toMemberName] || 0) + 1
    }
  })
  let mostHuggedMember = ''
  let maxCount = 0
  Object.keys(memberCount).forEach(name => {
    if (memberCount[name] > maxCount) {
      maxCount = memberCount[name]
      mostHuggedMember = name
    }
  })

  return {
    hugCount,
    totalDistance: Math.round(totalDistance),
    welfareTotal: hugCount * 0.001,
    monthlyData,
    longestDistance: Math.round(longestDistance),
    mostHuggedMember
  }
}
