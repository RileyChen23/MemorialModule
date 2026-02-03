/**
 * pages/memorial/memorial.ts
 * 纪念空间页面
 * 伦理设计意图：纪念模式下禁用娱乐化功能，保持静默缅怀氛围
 */

import { get } from '../../utils/request';
import type { FamilyMemberVO } from '../../types';

interface MemorialPageData {
  member: FamilyMemberVO | null;
  isMemorialMode: boolean;
  memorialText: string;
  candleLit: boolean;
  messageCount: number;
}

Page<MemorialPageData, any>({
  data: {
    member: null,
    isMemorialMode: false,
    memorialText: '',
    candleLit: false,
    messageCount: 0,
  },

  /**
   * 生命周期
   */
  onLoad(options: any) {
    const memberId = options.memberId;
    if (memberId) {
      this.loadMemberInfo(memberId);
    }
  },

  /**
   * 加载家人信息
   * 伦理设计意图：检查成员状态，决定是否启用纪念模式
   */
  async loadMemberInfo(memberId: string) {
    try {
      const res = await get<FamilyMemberVO>(`/api/family/${memberId}`);
      const member = res.data;

      // 伦理设计意图：如果家人状态为已故，强制进入纪念模式
      if (member.status === 'deceased') {
        this.setData({
          member,
          isMemorialMode: true,
          memorialText: `${member.name}，虽然您已离去，但爱与思念永恒`,
        });
      } else {
        this.setData({
          member,
          isMemorialMode: false,
          memorialText: `${member.name}，愿平安与快乐常伴您左右`,
        });
      }

      // 加载留言数量
      this.loadMessageCount(memberId);
    } catch (err: any) {
      console.error('加载家人信息失败：', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      });
    }
  },

  /**
   * 加载留言数量
   */
  async loadMessageCount(memberId: string) {
    try {
      const res = await get<number>(`/api/memorial/messages/count?memberId=${memberId}`);
      this.setData({ messageCount: res.data });
    } catch (err: any) {
      console.error('加载留言数量失败：', err);
    }
  },

  /**
   * 点燃蜡烛
   * 伦理设计意图：简单的交互，保持静默缅怀氛围
   */
  lightCandle() {
    if (this.data.candleLit) {
      return;
    }

    this.setData({ candleLit: true });
  },

  /**
   * 发送留言
   */
  sendMessage() {
    if (!this.data.member) {
      return;
    }

    wx.navigateTo({
      url: `/pages/memorial/message/message?memberId=${this.data.member.memberId}`,
    });
  },

  /**
   * 查看所有留言
   */
  viewAllMessages() {
    if (!this.data.member) {
      return;
    }

    wx.navigateTo({
      url: `/pages/memorial/messages/messages?memberId=${this.data.member.memberId}`,
    });
  },
});

