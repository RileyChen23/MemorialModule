const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { memberName, reminderTime, remindType, message } = event

  if (!memberName || !reminderTime) {
    return { error: '缺少必要参数' }
  }

  try {
    // 保存提醒记录
    const result = await db.collection('reminders').add({
      data: {
        memberName,
        reminderTime: new Date(reminderTime),
        remindType: remindType || 'hug', // hug, birthday, other
        message: message || '',
        status: 'pending', // pending, sent
        createTime: new Date(),
        _openid: wxContext.OPENID
      }
    })

    return {
      code: 200,
      id: result._id,
      message: '提醒设置成功'
    }
  } catch (error) {
    console.error('设置提醒失败', error)
    return { code: 500, error: '设置提醒失败' }
  }
}
