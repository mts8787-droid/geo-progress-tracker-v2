const T = {
  ko: {
    // Header
    headerTitle: 'Stakeholders별 Action Item Progress Tracker',
    admin: 'Admin',
    published: 'Published',
    refresh: '새로고침',
    webPublish: '웹 게시',
    publishing: '게시 중...',
    publishedAt: '게시됨',
    openPublicUrl: '공개 URL 열기',
    unpublish: '게시 취소',

    // Filters
    all: '전체',
    allStakeholders: '전체 조직',

    // CategorySummary
    categorySummary: '과제 구분별 달성률',
    stakeholderCount: (n) => `유관조직 ${n}개`,
    monthlyRate: (m) => `${m} 달성률`,
    cumulativeRate: '누적 달성률',

    // SummaryCards
    monthRate: (m) => `${m} 달성률`,
    cumRate: '누적 달성률',
    annualProgress: '연간 진척률',
    warningTasks: '주의 필요 과제',
    achieved: '달성',
    inProgress: '추진',
    notAchieved: '미달성',
    below80: '달성률 80% 미만',
    count: '건',

    // PerformanceCharts
    monthlyGoalVsActual: '월별 목표 대비 실적',
    cumulativeGoalVsActual: '연간 누적 목표대비 실적',
    actual: '실적',
    goal: '목표',
    cumGoal: '누적 목표',
    cumActual: '누적 실적',

    // StakeholderRanking
    orgRate: '조직별 달성률',
    belowTasks: (n) => `미달성 과제 ${n}건`,
    org: '조직',
    taskStatus: '과제 현황',
    noStakeholder: '해당 스테이크홀더가 없습니다.',

    // DetailTable
    quantitativeTasks: '정량 과제 현황',
    taskCategory: '과제 구분',
    task: '과제',
    goalDetail: '목표 상세',
    goalLabel: '목표',
    actualLabel: '실적',
    rateLabel: '달성률',
    annualGoal: '연간목표',
    noTasksForSH: '해당 스테이크홀더의 과제가 없습니다.',

    // QualitativeTable
    qualitativeTasks: '정성 과제 현황',
    result: (m) => `${m} 결과`,
    qualAchieved: '달성',
    qualInProgress: '추진',
    qualNotAchieved: '미달성',
    noQualTasks: '해당 스테이크홀더의 정성 과제가 없습니다.',

    // RawGoalTable
    rawGoalTitle: '[참고] Stakeholders별 월간 목표 원본 데이터',
    annual: '연간',
    total: '합계',
    noDataForSH: '해당 스테이크홀더의 데이터가 없습니다.',

    // Tooltip
    tooltipTaskCount: (n) => `과제 수: ${n}개`,
    tooltipOrgs: '소속 조직',

    // Category filter
    categoryFilter: '과제 구분 필터',
    clearFilter: '필터 해제',

    // Loading
    loadingData: '데이터를 불러오는 중...',

    // Stakeholder/data translation (ko → ko는 그대로)
    _sh: {},
    _cat: {},
    _month: {},
  },
  en: {
    headerTitle: 'Stakeholder Action Item Progress Tracker',
    admin: 'Admin',
    published: 'Published',
    refresh: 'Refresh',
    webPublish: 'Publish',
    publishing: 'Publishing...',
    publishedAt: 'Published',
    openPublicUrl: 'Open public URL',
    unpublish: 'Unpublish',

    all: 'All',
    allStakeholders: 'All Stakeholders',

    categorySummary: 'Achievement by Task Category',
    stakeholderCount: (n) => `${n} stakeholder${n !== 1 ? 's' : ''}`,
    monthlyRate: (m) => `${m} Rate`,
    cumulativeRate: 'Cumulative Rate',

    monthRate: (m) => `${m} Achievement`,
    cumRate: 'Cumulative Rate',
    annualProgress: 'Annual Progress',
    warningTasks: 'Needs Attention',
    achieved: 'Achieved',
    inProgress: 'In Progress',
    notAchieved: 'Not Achieved',
    below80: 'Below 80% achievement',
    count: '',

    monthlyGoalVsActual: 'Monthly Goal vs Actual',
    cumulativeGoalVsActual: 'Annual Cumulative Goal vs Actual',
    actual: 'Actual',
    goal: 'Goal',
    cumGoal: 'Cum. Goal',
    cumActual: 'Cum. Actual',

    orgRate: 'Achievement by Organization',
    belowTasks: (n) => `${n} task${n !== 1 ? 's' : ''} below target`,
    org: 'Org',
    taskStatus: 'Task Status',
    noStakeholder: 'No stakeholders found.',

    quantitativeTasks: 'Quantitative Tasks',
    taskCategory: 'Category',
    task: 'Task',
    goalDetail: 'Goal Detail',
    goalLabel: 'Goal',
    actualLabel: 'Actual',
    rateLabel: 'Rate',
    annualGoal: 'Annual',
    noTasksForSH: 'No tasks for this stakeholder.',

    qualitativeTasks: 'Qualitative Tasks',
    result: (m) => `${m} Result`,
    qualAchieved: 'Achieved',
    qualInProgress: 'In Progress',
    qualNotAchieved: 'Not Achieved',
    noQualTasks: 'No qualitative tasks for this stakeholder.',

    rawGoalTitle: '[Ref] Monthly Goal Raw Data by Stakeholder',
    annual: 'Annual',
    total: 'Total',
    noDataForSH: 'No data for this stakeholder.',

    tooltipTaskCount: (n) => `Tasks: ${n}`,
    tooltipOrgs: 'Organizations',

    categoryFilter: 'Category Filter',
    clearFilter: 'Clear filter',

    loadingData: 'Loading data...',

    // Stakeholder/data translation (ko → en)
    _sh: { '고가혁': 'CVIOs', '브랜드': 'Brand', '전체': 'All' },
    _cat: {
      '콘텐츠 수정': 'Content Modification', '신규 콘텐츠 제작': 'New Content Creation',
      '기술 SEO': 'Technical SEO', '구조화 데이터': 'Structured Data',
      '콘텐츠 최적화': 'Content Optimization', '데이터 분석': 'Data Analysis',
      '전략 수립': 'Strategy Planning', '모니터링': 'Monitoring',
      '외부채널 관리': 'External Channel Mgmt', '닷컴 기술 개선': 'Dotcom Tech Improvement',
      '전사 변화 관리': 'Enterprise Change Mgmt',
    },
    _month: {
      '3월':'Mar','4월':'Apr','5월':'May','6월':'Jun','7월':'Jul','8월':'Aug',
      '9월':'Sep','10월':'Oct','11월':'Nov','12월':'Dec','1월':'Jan','2월':'Feb',
    },
  },
}

export function t(lang, key, ...args) {
  const val = T[lang]?.[key] ?? T.ko[key] ?? key
  if (typeof val === 'function') return val(...args)
  return val
}

// 조직명 번역
export function tSH(lang, name) {
  if (lang === 'ko' || !name) return name
  return T.en._sh[name] || name
}

// 과제 구분 번역
export function tCat(lang, name) {
  if (lang === 'ko' || !name) return name
  return T.en._cat[name] || name
}

// 월 라벨 번역
export function tMonth(lang, name) {
  if (lang === 'ko' || !name) return name
  return T.en._month[name] || name
}
