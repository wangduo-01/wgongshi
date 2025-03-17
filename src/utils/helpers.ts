/**
 * 格式化日期为"YYYY-MM-DD"格式
 * @param date 日期对象或日期字符串
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期为友好显示格式："YYYY年MM月DD日"
 * @param date 日期对象或日期字符串
 */
export const formatDateFriendly = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * 格式化时间为"HH:MM:SS"格式
 * @param seconds 秒数
 */
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hrs > 0) parts.push(`${hrs}小时`);
  if (mins > 0) parts.push(`${mins}分钟`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}秒`);
  
  return parts.join(' ');
};

/**
 * 将准确率转换为文字描述
 * @param accuracy 准确率（0-100）
 */
export const getAccuracyText = (accuracy: number): string => {
  if (accuracy >= 90) return '优秀';
  if (accuracy >= 75) return '良好';
  if (accuracy >= 60) return '一般';
  return '需加强';
};

/**
 * 将准确率转换为颜色
 * @param accuracy 准确率（0-100）
 */
export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 90) return '#4cd964'; // 绿色
  if (accuracy >= 75) return '#34aadc'; // 蓝色
  if (accuracy >= 60) return '#ffcc00'; // 黄色
  return '#ff3b30'; // 红色
};

/**
 * 截断文字，超过指定长度则显示省略号
 * @param text 文字内容
 * @param maxLength 最大长度
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 根据学科生成对应的颜色
 * @param subject 学科名称
 */
export const getSubjectColor = (subject: string): string => {
  const colorMap: Record<string, string> = {
    '数学': '#4a89dc',
    '物理': '#967adc',
    '化学': '#d770ad',
    '生物': '#37bc9b',
    '地理': '#f6bb42',
    '历史': '#8cc152',
    '政治': '#e9573f',
    '语文': '#3bafda',
    '英语': '#4fc1e9'
  };
  
  return colorMap[subject] || '#95a5a6';
};

/**
 * 获取随机ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * 将日期对象转换为可读的时间差文本
 * @param date 日期字符串或对象
 */
export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
  return `${Math.floor(diff / 31536000)}年前`;
}; 