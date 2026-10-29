// 화면 묶음 · 케이스 정의
//   기준: Figma 파일 PsdhLBFPL0pf4O0rTtUyDo, 페이지 "Bitcoin direction call" → 섹션 "한국어 (KO)" (4:2)
//   h = proto.html 해시. p 화면 · now 시뮬레이션 시각(UTC) · vote · bal · streak · noti · res · acc · e(예외 플래그) …
//   look = [화면 설명 문구, 번호 붙일 셀렉터]. 셀렉터 끝 ' ^N' = N단계 위 부모
const OPEN = 'now=2026-10-29T05:00:00Z';     // 투표 가능 (마감 4시간 전)
const CLOSED = 'now=2026-10-29T09:30:00Z';   // 마감 ~ 결과 발표 사이

const GROUPS = [
  { id: 'm-p01', plat: 'mobile', name: '01 투표 전 (DV-P01)', fig: '14:2' },
  { id: 'm-p02', plat: 'mobile', name: '02 결과 대기 (DV-P02)', fig: '41:3262' },
  { id: 'm-noti', plat: 'mobile', name: '02-1 알림 받기 (DV-S06 · S08)', fig: '4:2' },
  { id: 'm-p03', plat: 'mobile', name: '03 마감 안내 (DV-P03)', fig: '4:2' },
  { id: 'm-p04', plat: 'mobile', name: '04 내 적립금 (DV-P04)', fig: '14:158' },
  { id: 'm-p05', plat: 'mobile', name: '05 내 투표 기록 (DV-P05)', fig: '4:2' },
  { id: 'm-ex', plat: 'mobile', name: '07 예외 처리 (DV-E)', fig: '4:2' },
  { id: 'w-w01', plat: 'web', name: '06 웹 진입 안내 (DV-W01)', fig: '4:2' },
];

const CASES = [
  // ── 01 투표 전 ──
  { id: 'DV-P01-a', g: 'm-p01', t: '투표 전 · 미투표', h: `p=P01&${OPEN}`,
    look: [
      ['이벤트 이미지 · 메인 타이틀', '[data-k="title"]'],
      ['마감 타이머: 투표 마감(09:00 UTC)까지 hh:mm:ss. 1시간 미만이면 색 변경', '[data-k="timer"]'],
      ['BTC 현재가: 비트코인 가격 예측 혜택과 같은 가격', '[data-k="price"]'],
      ['[올라간다] 선택 → 상승 예측 확인 바텀시트', '[data-k="up"]'],
      ['[떨어진다] 선택 → 하락 예측 확인 바텀시트', '[data-k="down"]'],
      ['실시간 참여 현황: 1,000명 이상 "오늘 {N}명 참여 중", 미만 "투표에 참여하고 혜택도 받아가세요". 1분마다 갱신', '[data-k="live"]'],
      ['[내 적립금] → 내 적립금 · [메인으로] → 앱 메인', '[data-k="cta"]'],
      ['유의사항 아코디언: 기본 닫힘, 어드민 관리 항목', '[data-k="notes"]'],
    ] },
  { id: 'DV-P01-c', g: 'm-p01', t: '투표 전 · 마감 1시간 미만', h: 'p=P01&now=2026-10-29T08:30:00Z',
    look: [['마감까지 1시간 미만이면 타이머 색 변경', '[data-k="timer"]'], ['참여 인원 1,000명 미만 문구', '[data-k="live"]']], f: ['few'], hx: '&few=1' },
  { id: 'DV-S01-a', g: 'm-p01', t: '선택 확인 시트 · 상승', h: `p=P01&${OPEN}&ov=s01up`,
    look: [
      ['타이틀: 선택한 방향 "상승으로 예측할까요?"', '[data-k="sheet"] h2'],
      ['기준가: 시트를 연 시점에 서버가 기록한 BTC 가격. 2분 유효, 만료 시 자동 갱신', '[data-k="sheetEntry"]'],
      ['[취소] 시트 닫힘 · [확정하기] 투표 제출 → 결과 대기 + 출석 팝업. 확정 뒤에는 투표 전 화면으로 돌아가지 않음', '[data-k="sheetBtns"]'],
    ] },
  { id: 'DV-S01-b', g: 'm-p01', t: '선택 확인 시트 · 하락', h: `p=P01&${OPEN}&ov=s01down`,
    look: [['타이틀: "하락으로 예측할까요?"', '[data-k="sheet"] h2'], ['기준가 · 자동 갱신 남은 시간', '[data-k="sheetEntry"]'], ['[확정하기]를 누르면 결과 대기로 이어짐', '[data-k="sheetBtns"]']] },
  { id: 'DV-D02-a', g: 'm-p01', t: '결과 팝업 · 1개 적중', h: `p=P01&${OPEN}&res=hit&bal=0.50`,
    look: [
      ['미확인 결과가 있으면 진입 시 가장 먼저 노출 (모든 화면 공통)', '[data-k="result"]'],
      ['기준가 → 판정가 · 예측 뱃지. 판정가 ≥ 기준가면 상승', '[data-k="resPrice"]'],
      ['결과를 본 순간 적립 (적중 · 빗나감 금액은 어드민 설정)', '[data-k="resReward"]'],
      ['[확인] 팝업 닫힘', '[data-k="result"] [data-act="resOk"]'],
    ] },
  { id: 'DV-D02-b', g: 'm-p01', t: '결과 팝업 · 1개 빗나감', h: `p=P01&${OPEN}&res=miss&bal=0.50`,
    look: [['빗나감도 결과를 보면 적립', '[data-k="resReward"]'], ['기준가 → 판정가 · 예측 뱃지', '[data-k="resPrice"]']] },
  { id: 'DV-D03-a', g: 'm-p01', t: '결과 팝업 · 여러 개 (일부 적중)', h: `p=P01&${OPEN}&res=multi&bal=0.50`,
    look: [['미확인 결과가 여러 개면 한 팝업에 묶어서 노출 · 합산 적립', '[data-k="result"]']],
    note: ['Figma DV-D03-a 버튼은 [오늘도 투표하기]로 남아 있음. 결과 팝업 버튼 [확인] 확정에 맞춰 [확인]으로 표시'] },

  // ── 02 결과 대기 ──
  { id: 'DV-P02-b', g: 'm-p02', t: '결과 대기 · 알림 미동의 (S1)', h: `p=P02&${OPEN}&vote=up&noti=s1`,
    look: [
      ['선택한 방향 그래픽 · 타이틀', '[data-k="dir"]'],
      ['결과 발표(10:00 UTC)까지 카운트다운', '[data-k="timer"]'],
      ['기준가 · 확정 일시 (기기 시간대)', '[data-k="entry"]'],
      ['이번 회차 상승/하락 투표 비율. 1분마다 갱신. 상승 반올림, 하락 = 100 − 상승 (한쪽 1표 이상인데 0%면 1% / 99%)', '[data-k="ratio"]'],
      ['알림 배너 1-1: 수신 동의 중 하나라도 미동의. [알림 켜기] → KR은 수신 동의 바텀시트, 그 외 국가는 동의 Y 저장 후 기기 알림 확인', '[data-k="banner"]'],
      ['[내 적립금] · [메인으로]', '[data-k="cta"]'],
    ] },
  { id: 'DV-P02-c', g: 'm-p02', t: '결과 대기 · 기기 알림 꺼짐 (S2)', h: `p=P02&${OPEN}&vote=up&noti=s2`, env: true,
    look: [['알림 배너 1-2: 수신 동의 완료 & 기기 알림 꺼짐. [알림 켜기] → 기기 알림 켜기 안내 팝업', '[data-k="banner"]']] },
  { id: 'DV-P02-d', g: 'm-p02', t: '결과 대기 · 알림 신청 완료 직후', h: `p=P02&${OPEN}&vote=up&noti=done`,
    look: [['알림 배너 1-3: 신청 완료 직후, 같은 화면에 머무는 동안 1회만. 다시 들어오면 배너 미노출(S3)', '[data-k="banner"]']] },
  { id: 'DV-P02-s3', g: 'm-p02', t: '결과 대기 · 알림 모두 켜짐 (S3)', h: `p=P02&${OPEN}&vote=down&noti=s3`,
    look: [['수신 동의 완료 & 기기 알림 켜짐이면 배너 미노출', '[data-k="cta"]'], ['하락 선택 시 빨간 화살표 · "떨어진다고 예측했어요"', '[data-k="dir"]']] },
  { id: 'DV-D06-a1', g: 'm-p02', t: '출석 팝업 · 첫 출석', h: `p=P02&${OPEN}&vote=up&ov=attend1&streak=1`,
    look: [
      ['투표 확정 직후 결과 대기 화면에서 가장 먼저 노출', '[data-k="attend"]'],
      ['출석 현황: 1회 ~ 7회, 현재 위치 = (연속 출석 − 1) % 7 + 1', '[data-k="attend"] [data-k="slots"]'],
      ['다음 투표 안내: 다음 회차 오픈(10:00 UTC)을 기기 시간대로. 현지 날짜 기준 오늘/내일, 시각은 기기 언어 · 지역 설정 형식', '[data-k="nextVote"]'],
      ['[내 예측 보기] 팝업 닫힘', '[data-k="attend"] [data-act="close"]'],
    ] },
  { id: 'DV-D06-a2', g: 'm-p02', t: '출석 팝업 · 2~6회차', h: `p=P02&${OPEN}&vote=up&ov=attend3`,
    states: [['attend3', '3회차', 'DV-D06-a2'], ['attend6', '6회차', 'DV-D06-a2']], sk: 'ov',
    look: [['"연속 N회 출석" · "N번 더 연속 출석하면 보너스를 받아요" (1번 남으면 "1번만 더 출석하면…")', '[data-k="attPop"]'], ['출석 현황', '[data-k="attend"] [data-k="slots"]']] },
  { id: 'DV-D06-a3', g: 'm-p02', t: '출석 팝업 · 새 출석 시작', h: `p=P02&${OPEN}&vote=up&ov=attend8`,
    look: [['7회 보너스를 받은 뒤 다음 회차: "새 출석 시작", 1회부터', '[data-k="attPop"]']] },
  { id: 'DV-D06-a4', g: 'm-p02', t: '출석 팝업 · 출석 다시 시작', h: `p=P02&${OPEN}&vote=up&ov=attendBroken`,
    look: [['회차를 놓쳐 연속이 끊긴 뒤: "{MM.DD} {시각} 마감 회차에 참여하지 않아 다시 시작해요". 처음 놓친 회차의 마감 시각(09:00 UTC)을 기기 시간대로', '[data-k="attPop"]']] },
  { id: 'DV-D06-c', g: 'm-p02', t: '출석 팝업 · 7회째 보너스', h: `p=P02&${OPEN}&vote=up&ov=attend7&bal=0.70`,
    look: [['7회째 출석 시 보너스 자동 적립 · 적립액 · 현재 적립금', '[data-k="attPop"]']] },

  // ── 02-1 알림 받기 ──
  { id: 'DV-N01', g: 'm-noti', t: '알림 받기 플로우 (조작)', h: `p=P02&${OPEN}&vote=up&noti=s1`, env: true, nd: 'off', os: 'yes',
    look: [['[알림 켜기]부터 눌러 보며 기기 상태(오른쪽 패널)에 따라 바뀌는 흐름 확인', '[data-k="banner"]']],
    note: ['수신 동의 저장 · 기기 알림 확인 결과는 패널 "결과"에 남아요'] },
  { id: 'DV-S08', g: 'm-noti', t: '수신 동의 바텀시트 (BS-01)', h: `p=P02&${OPEN}&vote=up&noti=s1&ov=consent`, env: true,
    look: [
      ['타이틀 · 서브텍스트', '[data-k="consent"] h2'],
      ['알림 미리보기: 실제 발송되는 결과 알림 형태', '[data-k="consent"] [data-k="preview"]'],
      ['전체 동의: 하위 항목이 2개 이상일 때만. 일괄 체크 · 해제', '[data-k="cAll"]'],
      ['미동의 항목만 노출, 기본 해제. 저장 값: 필수 알림 · 마케팅 정보 수신 동의 · 마케팅 알림', '[data-k="consentRows"]'],
      ['[동의하고 알림 받기]: 노출 항목 모두 체크 시 활성 → 저장 → 마케팅 동의 상세 팝업 → 기기 알림 확인', '[data-k="agree"]'],
    ],
    note: ['동의 상세 팝업 문구는 법무 확인 후 확정 (FE 확인 필요)'] },
  { id: 'DV-S08-m', g: 'm-noti', t: '마케팅 수신 동의 상세 팝업', h: `p=P02&${OPEN}&vote=up&noti=s1&ov=mkt`, env: true,
    look: [['광고성 앱 푸시 동의가 포함되면 노출. 기존 알림 설정의 마케팅 수신 동의 상세 팝업과 같음', '[data-k="mktInfo"]'], ['[확인] → 기기 알림 상태에 따라 처리', '[data-k="mkt"] [data-act="mktOk"]']] },
  { id: 'DV-S06', g: 'm-noti', t: '기기 알림 켜기 안내 팝업 (BS-02)', h: `p=P02&${OPEN}&vote=up&noti=s2&ov=device`, env: true,
    look: [
      ['노출: 1-2 [알림 켜기], 수신 동의 직후 기기 알림 꺼짐, KR 외 국가에서 1-1 선택 시 기기 알림 꺼짐', '[data-k="deviceGuide"] h2'],
      ['알림 미리보기', '[data-k="deviceGuide"] [data-k="preview"]'],
      ['[알림 켜기]: OS 창 가능 → OS 창, 불가 → 기기 설정 앱. [다음에 할게요] 닫힘', '[data-k="deviceGuide"] [data-act="ndOn"]'],
    ] },
  { id: 'DV-S05', g: 'm-noti', t: 'OS 알림 허용 창 (시뮬레이션)', h: `p=P02&${OPEN}&vote=up&noti=s2&ov=os`, env: true,
    look: [['OS가 제공하는 창 (문구 변경 불가). 허용 → 1-3, 허용 안 함 → 토스트 · 1-2 유지', '[data-k="osDialog"]']] },
  { id: 'DV-S07', g: 'm-noti', t: '기기 설정 앱 이동 (시뮬레이션)', h: `p=P02&${OPEN}&vote=up&noti=s2&ov=settings`, env: true, os: 'no',
    look: [['OS 창을 띄울 수 없으면 설정 앱으로 이동. 결과 대기 화면이 다시 보이면 기기 알림 재조회', '[data-k="settings"]']] },

  // ── 03 마감 안내 ──
  { id: 'DV-P03-a', g: 'm-p03', t: '마감 안내 · 오늘 상승 투표', h: `p=P03&${CLOSED}&vote=up`,
    look: [
      ['매일 09:00 ~ 10:00 UTC 노출. 그래픽 · "오늘 투표는 마감됐어요"', '[data-k="title"]'],
      ['결과 발표(10:00 UTC)까지 카운트다운', '[data-k="timer"]'],
      ['진행 중인 내 예측: 이번 회차 참여자만. 방향 뱃지 · 기준가', '[data-k="mine"]'],
      ['[내 적립금] · [메인으로]', '[data-k="cta"]'],
    ] },
  { id: 'DV-P03-b', g: 'm-p03', t: '마감 안내 · 오늘 미투표', h: `p=P03&${CLOSED}`,
    look: [['미참여면 "진행 중인 내 예측" 미노출', '[data-k="timer"]']] },

  // ── 04 내 적립금 ──
  { id: 'DV-P04-a', g: 'm-p04', t: '내 적립금 · 적립금 구간', h: `p=P04&${OPEN}&bal=0.70`, sk: 'bal',
    states: [['0.00', '0.00', 'DV-P04-PLa'], ['0.70', '0.70', 'DV-P04-PLb'], ['1.00', '1.00', 'DV-P04-PLc'], ['5.50', '5.50', 'DV-P04-PLe']],
    look: [
      ['타이틀: 내 적립금', '[data-k="title"]'],
      ['적립금 카드: 1 USDT 단위(정수)로 일괄 수령, 남은 소수점은 이월', '[data-k="bal"]'],
      ['[적립금 수령하기]: 1 USDT 미만 비활성 · 이상 활성 → 계정 선택 바텀시트', '[data-k="claim"]'],
      ['안내 문구: 0.00 / 0~1 미만 "{부족액} USDT 더 모으면…" · 1.00 "1 USDT를 받을 수 있어요" · 1 초과 "{수령액} … {이월액} USDT는 다음 적립금으로 이어져요"', '[data-k="guide"]'],
      ['출석 체크 영역', '[data-k="att"]'],
      ['[내 투표 기록 보기] → 내 투표 기록', '[data-k="hist"]'],
      ['CTA: 미참여 [투표 참여하기] · 참여 [내 예측 보기] · 마감 [메인으로]', '[data-k="cta"]'],
    ] },
  { id: 'DV-P04-ST', g: 'm-p04', t: '내 적립금 · 출석 카드 상태', h: `p=P04&${OPEN}&bal=0.70&streak=2&att=todo`, sk: 'att',
    states: [['todo', '미참여 · 마감 전', 'DV-P04-ST1'], ['done', '참여 완료', 'DV-P04-ST4'], ['broken', '연속 끊김', 'DV-P04-ST7'], ['closed', '마감 후 미참여', 'DV-P04-ST8']],
    look: [
      ['7회 연속 출석하면 보너스. 슬롯 1회 ~ 7회 고정, 현재 출석 위치 하이라이트 ("오늘" 표기 없음)', '[data-k="att"]'],
      ['서브 문구: 참여 완료 "오늘 출석 완료! 내일도 만나요" · 미참여 "오늘 투표하고 출석 체크하세요" · 마감 후 "오늘 투표는 마감됐어요. 다음 회차에 만나요" · 끊김 "{MM.DD} {시각} 마감 회차에 참여하지 않아 다시 시작해요"', '[data-k="attSub"]'],
      ['스탬프: 출석 완료 체크 · 이번 회차 외곽선 · 남은 회차 회색 · 7회차 보물상자', '[data-k="att"] [data-k="slots"]'],
    ],
    note: ['상태 "참여 완료" · "마감 후 미참여"는 화면 시각과 무관하게 카드만 바꿔서 보여줘요'] },
  { id: 'DV-S03-a', g: 'm-p04', t: '계정 선택 바텀시트 · 적립금 1.20', h: `p=P04&${OPEN}&bal=1.20&ov=acc`,
    look: [
      ['거래소별 총합 잔액 · 계정별 잔액. CEX는 UID 개수, DEX는 지갑 정보', '[data-k="accList"]'],
      ['선택한 계정 하이라이트', '[data-k="accList"] .sel'],
      ['[이 계정으로 받기] → 지급 (이벤트 리워드로 지급)', '[data-k="payBtn"]'],
    ] },
  { id: 'DV-D01-a', g: 'm-p04', t: '연동 유도 팝업 · 첫 연동 보너스 대상', h: `p=P04&${OPEN}&bal=1.20&acc=none&ov=d01a`,
    look: [['활성 계정 없음 · 첫 연동 혜택 대상: 모은 적립금 + 첫 연동 보너스(첫 연동 한정)', '[data-k="linkInfo"]'], ['[계정 연동하기] → 계정 연동 화면', '[data-k="d01a"] [data-act="link"]']] },
  { id: 'DV-D01-b', g: 'm-p04', t: '연동 유도 팝업 · 보너스 대상 아님', h: `p=P04&${OPEN}&bal=1.20&acc=nobonus&ov=d01b`,
    look: [['활성 계정 없음 · 첫 연동 혜택 비대상: 모은 적립금만', '[data-k="linkInfo"]']] },
  { id: 'DV-D05-a', g: 'm-p04', t: '지급 완료 · 1 USDT 지급, 0.20 이월', h: `p=P04&${OPEN}&bal=1.20&ov=paid`,
    look: [['"적립금을 받았어요" + 지급액 · 이벤트 리워드로 지급', '[data-k="paid"]'], ['지급된 거래소 · 계정(UID 또는 지갑 주소) · 이월액(있을 때)', '[data-k="paidInfo"]']] },

  // ── 05 내 투표 기록 ──
  { id: 'DV-P05-a', g: 'm-p05', t: '내 투표 기록 · 기본', h: `p=P05&${OPEN}`,
    look: [
      ['투표 요약: 결과 확정 회차 1건 이상일 때 노출', '[data-k="sum"]'],
      ['적중률 = 적중 / 결과 확정 × 100 반올림. 결과 대기 · 미확인 제외, 분모 0이면 "-"', '[data-k="rate"]'],
      ['최다 연속 적중: 빗나가면 끊김, 미참여 회차는 제외', '[data-k="best"]'],
      ['상승/하락 비율: 높은 쪽 표기, 동률은 상승 50%', '[data-k="lean"]'],
      ['월별 묶음(YYYY.MM) · 최신순. 행: 일자 · 방향 · 기준가 · 결과', '[data-k="list"]'],
      ['결과 대기 행은 누를 수 없음', '[data-k="row-wait"]'],
      ['결과 확인(미확인) 행 → 결과 팝업 + 적립', '[data-k="row-view"]'],
    ] },
  { id: 'DV-P05-b', g: 'm-p05', t: '내 투표 기록 · 빈 상태', h: `p=P05&${OPEN}&hist=empty`,
    look: [['참여 회차가 없으면 요약 미노출 · 빈 상태 · [오늘 투표하기]', '[data-k="empty"]']] },

  // ── 07 예외 처리 ──
  { id: 'DV-E01', g: 'm-ex', t: '시세 지연 · 투표 전', h: `p=P01&${OPEN}&e=e01`,
    look: [['시세를 못 받았거나 늦을 때: 현재가 자리에 "시세를 불러오는 중이에요"', '[data-k="price"]'], ['[올라간다] · [떨어진다] 비활성, 시세를 받으면 정상', '[data-k="up"]']] },
  { id: 'DV-E02', g: 'm-ex', t: '선택 확인 시트 · 마감 후 확정', h: `p=P01&${OPEN}&ov=e02`,
    look: [['시트를 연 채 09:00 UTC가 지난 뒤 [확정하기] → 서버 거부 · 팝업. [확인] → 시트 닫고 마감 안내로', '[data-k="e02"]']],
    s: [{ wait: 400 }, { click: '[data-act="lock"]' }] },
  { id: 'DV-E04', g: 'm-ex', t: '결과 대기 · 결과 집계 중', h: `p=P02&now=2026-10-29T10:00:05Z&vote=up&noti=s3&e=e04`,
    look: [['결과 발표 시각이 지났지만 판정 전: 안내 문구를 집계 중으로 교체', '[data-k="timer"]']] },
  { id: 'DV-E07', g: 'm-ex', t: '계정 선택 시트 · 지급 직전 계정 이슈', h: `p=P04&${OPEN}&bal=1.20&ov=acc&e=e07`,
    look: [['시트를 연 사이 계정이 이슈 상태로 바뀜. [확인] → 목록 갱신(해당 계정 비활성)', '[data-k="e07"]']],
    s: [{ wait: 400 }, { click: '[data-act="pay"]' }] },
  { id: 'DV-E09', g: 'm-ex', t: '미지원 앱 버전', h: `p=P01&${OPEN}&e=e09`,
    look: [['미션 기능이 없는 구버전 앱: 팝업 → [업데이트하기] OS별 스토어', '[data-k="e09"]']], note: ['팝업 문구는 초안'] },
  { id: 'DV-E10', g: 'm-ex', t: '선택 확인 시트 · 확정 실패', h: `p=P01&${OPEN}&ov=e10&e=e10`,
    look: [['투표 확정 또는 7회차 보너스 적립 실패(둘 다 취소): 시트 유지 · 토스트 · 다시 시도', '[data-k="sheetBtns"]']],
    s: [{ wait: 400 }, { click: '[data-act="lock"]' }] },
  { id: 'DV-E11', g: 'm-ex', t: '계정 선택 시트 · 지급 실패', h: `p=P04&${OPEN}&bal=1.20&ov=acc&e=e11`,
    look: [['지급 요청 실패(적립금 차감 없음): 시트 유지 · 토스트 · 다시 시도', '[data-k="payBtn"]']],
    s: [{ wait: 400 }, { click: '[data-act="pay"]' }] },
  { id: 'DV-E12', g: 'm-ex', t: '투표 전 · 제재 회원', h: `p=P01&${OPEN}&e=e12`, sk: 'res',
    states: [['', '투표 시도', 'DV-E12'], ['hit', '결과 확인 후', 'DV-E12']],
    look: [['제재 회원이 [올라간다] · [떨어진다]를 누르거나, 결과 팝업을 닫았을 때 (결과는 정상 노출 · 적립)', '[data-k="e12"]']],
    s: [{ wait: 400 }, { click: '[data-act="pick"][data-dir="up"]' }] },
  { id: 'DV-E13', g: 'm-ex', t: '내 적립금 · 제재 회원', h: `p=P04&${OPEN}&bal=5.50&e=e13&ov=e13`,
    look: [['제재 회원이 [적립금 수령하기] 선택: 팝업. 적립금은 유지, 해제 후 수령 가능', '[data-k="e13"]']] },

  // ── 06 웹 진입 안내 ──
  { id: 'DV-W01-a', g: 'w-w01', t: '모바일 웹 · 첫 화면', h: `p=W01&${OPEN}`, w: '390',
    look: [
      ['이벤트 소개: 오늘의 투표 · 비트코인 상승·하락 맞히기 · 안내 문구', '[data-k="intro"]'],
      ['현재 BTC 가격 (실제 가격과 다를 수 있음 · 유의사항 안내)', '[data-k="price"]'],
      ['지난 회차 참여자 선택 비율. 상승 반올림, 하락 = 100 − 상승. 참여자 0명이면 미노출', '[data-k="ratio"]'],
      ['투표 마감 카운트다운 (10:00 ~ 익일 09:00 UTC)', '[data-k="count"]'],
      ['유의사항 아코디언', '[data-k="notes"]'],
      ['[앱 다운로드]: 하단 고정, OS별 스토어', '[data-k="dl"]'],
    ] },
  { id: 'DV-W01-b', g: 'w-w01', t: '모바일 웹 · 유의사항 펼침', h: `p=W01&${OPEN}&notes=1`, w: '390',
    look: [['선택 시 전체 항목 노출 · 화살표 방향 전환', '[data-k="notes"]']], s: [{ hl: '[data-k="notes"]' }] },
  { id: 'DV-W01-d', g: 'w-w01', t: '모바일 웹 · 마감 시간', h: `p=W01&${CLOSED}`, w: '390',
    look: [['마감 후 ~ 결과 발표 전 (09:00 ~ 10:00 UTC): "결과 발표까지 남은 시간입니다."', '[data-k="count"]']] },
  { id: 'DV-W01-e', g: 'w-w01', t: '모바일 웹 · 지난 회차 참여자 0명', h: `p=W01&${OPEN}&r0=1`, w: '390', f: ['r0'],
    look: [['지난 회차 참여자 0명이면 비율 카드 미노출', '[data-k="price"]']] },
  { id: 'DV-W01-c', g: 'w-w01', t: '데스크톱 웹', h: `p=W01&${OPEN}`, w: 'fluid',
    look: [
      ['이벤트 소개', '[data-k="intro"]'],
      ['현재 BTC 가격', '[data-k="price"]'],
      ['지난 회차 참여자 선택 비율', '[data-k="ratio"]'],
      ['앱 다운로드 QR: 다운로드 버튼 대신 QR, 스캔 시 앱 다운로드 페이지', '[data-k="qr"]'],
      ['투표 마감 카운트다운', '[data-k="count"]'],
      ['유의사항: 아코디언 없이 전체 상시 노출', '[data-k="notes"]'],
    ],
    note: ['768px 이상은 데스크톱 구성, 미만은 모바일 웹 구성 (창 폭을 바꿔 확인)'] },
];

// 상태값 케이스: sk(해시 키)로 상태값을 넘긴다
CASES.forEach((c) => {
  if (c.hx) c.h += c.hx;
  if (c.states && c.sk) c.h = c.h.replace(new RegExp('(^|&)' + c.sk + '=[^&]*'), '') + '&' + c.sk + '=state';
});
