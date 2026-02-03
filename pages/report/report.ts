import request from '../../utils/request'
import type { ApiResponse } from '../../types'

Page({
  data: {
    year: 2026,
    hugCount: 0,
    distance: '0公里',
    welfareTotal: '0份',
    monthlyData: [] as { month: string, count: number }[],
    longestDistance: '0公里',
    mostHuggedMember: '',
    loading: true,
  },

  onLoad() {
    this.loadAnnualReport()
  },

  // 加载年度报告
  async loadAnnualReport() {
    try {
      const res = await request.get<ApiResponse<{
        hugCount: number
        totalDistance: number
        welfareTotal: number
        monthlyData: { month: string, count: number }[]
        longestDistance: number
        mostHuggedMember: string
      }>>('/api/report/annual')

      if (res.code === 200 && res.data) {
        this.setData({
          hugCount: res.data.hugCount,
          distance: `${res.data.totalDistance}公里`,
          welfareTotal: `${res.data.welfareTotal.toFixed(3)}份`,
          monthlyData: res.data.monthlyData,
          longestDistance: `${res.data.longestDistance}公里`,
          mostHuggedMember: res.data.mostHuggedMember || '暂无',
          loading: false,
        })
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    } catch (e: any) {
      console.error('加载年度报告失败', e)
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 生成分享图片
  async generateShareImage() {
    wx.showLoading({ title: '生成中...' })
    // TODO: 调用后端生成分享图片接口
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '功能开发中', icon: 'none' })
    }, 1000)
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: `${this.data.year}年度爱的报告 - 我给妈妈${this.data.hugCount}个拥抱`,
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-report.png',
    }
  },
})
