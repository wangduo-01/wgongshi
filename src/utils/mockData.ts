import { Formula, PracticeRecord, PracticeQuestion, ErrorRecord, SearchHistory } from '../types/models';

// 模拟公式数据
export const mockFormulas: Formula[] = [
  {
    id: '1',
    title: '勾股定理',
    content: 'a² + b² = c²，其中c是直角三角形的斜边，a和b是两条直角边。',
    category: '几何',
    subject: '数学',
    grade: '初中',
    accuracy: 85,
    isFavorite: true,
    practiceCount: 12,
    lastPracticeDate: '2023-03-10',
  },
  {
    id: '2',
    title: '二次方程求根公式',
    content: 'x = (-b ± √(b² - 4ac)) / 2a，其中ax² + bx + c = 0是一个二次方程。',
    category: '代数',
    subject: '数学',
    grade: '初中',
    accuracy: 70,
    isFavorite: false,
    practiceCount: 8,
    lastPracticeDate: '2023-03-05',
  },
  {
    id: '3',
    title: '牛顿第二定律',
    content: 'F = ma，其中F是力，m是质量，a是加速度。',
    category: '力学',
    subject: '物理',
    grade: '高中',
    accuracy: 92,
    isFavorite: true,
    practiceCount: 15,
    lastPracticeDate: '2023-03-12',
  },
  {
    id: '4',
    title: '圆的面积公式',
    content: 'S = πr²，其中r是圆的半径。',
    category: '几何',
    subject: '数学',
    grade: '小学',
    accuracy: 95,
    isFavorite: false,
    practiceCount: 10,
    lastPracticeDate: '2023-03-08',
  },
  {
    id: '5',
    title: '正弦定理',
    content: 'a/sin A = b/sin B = c/sin C，其中a、b、c是三角形的边长，A、B、C是对应的角。',
    category: '三角函数',
    subject: '数学',
    grade: '高中',
    accuracy: 65,
    isFavorite: true,
    practiceCount: 6,
    lastPracticeDate: '2023-03-01',
  },
  {
    id: '6',
    title: '理想气体状态方程',
    content: 'PV = nRT，其中P是压力，V是体积，n是物质的量，R是气体常数，T是温度。',
    category: '热力学',
    subject: '物理',
    grade: '高中',
    accuracy: 78,
    isFavorite: false,
    practiceCount: 9,
    lastPracticeDate: '2023-03-03',
  },
  {
    id: '7',
    title: '平行四边形面积公式',
    content: 'S = ah，其中a是底边长度，h是高。',
    category: '几何',
    subject: '数学',
    grade: '初中',
    accuracy: 88,
    isFavorite: true,
    practiceCount: 11,
    lastPracticeDate: '2023-03-09',
  },
  {
    id: '8',
    title: '欧姆定律',
    content: 'I = U/R，其中I是电流，U是电压，R是电阻。',
    category: '电学',
    subject: '物理',
    grade: '初中',
    accuracy: 90,
    isFavorite: false,
    practiceCount: 14,
    lastPracticeDate: '2023-03-11',
  }
];

// 模拟练习记录数据
export const mockPracticeRecords: PracticeRecord[] = [
  {
    id: '1',
    formulaId: '1',
    date: '2023-03-10',
    accuracy: 80,
    timeTaken: 300, // 5分钟
    questionCount: 10,
    correctCount: 8,
  },
  {
    id: '2',
    formulaId: '3',
    date: '2023-03-12',
    accuracy: 90,
    timeTaken: 240, // 4分钟
    questionCount: 10,
    correctCount: 9,
  },
  {
    id: '3',
    formulaId: '2',
    date: '2023-03-05',
    accuracy: 70,
    timeTaken: 360, // 6分钟
    questionCount: 10,
    correctCount: 7,
  },
  {
    id: '4',
    formulaId: '5',
    date: '2023-03-01',
    accuracy: 60,
    timeTaken: 420, // 7分钟
    questionCount: 10,
    correctCount: 6,
  }
];

// 模拟练习题目数据
export const mockPracticeQuestions: PracticeQuestion[] = [
  {
    id: '1',
    formulaId: '1',
    question: '直角三角形的两条直角边分别为3和4，则斜边长为多少？',
    answer: '5',
    type: 'fill-blank',
    difficulty: 'easy',
  },
  {
    id: '2',
    formulaId: '1',
    question: '一个直角三角形，斜边长为13，一条直角边长为5，则另一条直角边长为多少？',
    answer: '12',
    type: 'fill-blank',
    difficulty: 'medium',
  },
  {
    id: '3',
    formulaId: '2',
    question: '求解方程x² - 5x + 6 = 0',
    answer: 'x = 2, x = 3',
    type: 'fill-blank',
    difficulty: 'medium',
  },
  {
    id: '4',
    formulaId: '3',
    question: '一个质量为2kg的物体受到4N的力，其加速度为多少？',
    answer: '2 m/s²',
    type: 'fill-blank',
    difficulty: 'easy',
  }
];

// 模拟错题记录
export const mockErrorRecords: ErrorRecord[] = [
  {
    id: '1',
    formulaId: '2',
    formulaTitle: '二次方程求根公式',
    questionId: '3',
    question: '求解方程x² - 5x + 6 = 0',
    correctAnswer: 'x = 2, x = 3',
    userAnswer: 'x = 2, x = 4',
    date: '2023-03-05',
    reviewCount: 2,
    lastReviewDate: '2023-03-07',
  },
  {
    id: '2',
    formulaId: '5',
    formulaTitle: '正弦定理',
    questionId: '5',
    question: '在三角形ABC中，a = 5, b = 7, A = 30°，则角B等于多少？',
    correctAnswer: '约为44.4°',
    userAnswer: '40°',
    date: '2023-03-01',
    reviewCount: 1,
    lastReviewDate: '2023-03-02',
  }
];

// 模拟搜索历史
export const mockSearchHistory: SearchHistory[] = [
  {
    id: '1',
    keyword: '勾股定理',
    timestamp: '2023-03-10T14:30:00Z',
  },
  {
    id: '2',
    keyword: '牛顿定律',
    timestamp: '2023-03-09T16:45:00Z',
  },
  {
    id: '3',
    keyword: '圆的面积',
    timestamp: '2023-03-08T10:15:00Z',
  }
]; 