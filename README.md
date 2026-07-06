# Career Site

경력기술서 웹 페이지. 빌드 도구 없이 정적 파일만으로 동작합니다.

## 내용 수정 방법

**모든 텍스트는 [`assets/data.js`](assets/data.js) 한 파일에서 수정합니다.**
HTML/CSS는 건드릴 필요 없습니다.

| 수정하고 싶은 것 | data.js에서 고칠 곳 |
| --- | --- |
| 이름 / 직함 / 헤드라인 / 소개 문단 | `name`, `role`, `headline`, `intro` |
| 연락처 추가·삭제 (GitHub 등) | `contacts` 배열 (주석 처리된 예시 참고) |
| PDF 다운로드 버튼 | `download` (없애려면 `null`) — `resume_ahyoung_kim.pdf` 파일로 연결 |
| 경력 | `experience` 배열 |
| 요약 문장마다 줄바꿈 | `summary`를 문자열 배열로 (항목 사이에 줄바꿈 삽입) |
| 기술 키워드 | `skills` 배열 |
| 프로젝트 추가/삭제/순서 변경 | `projects` 배열 항목을 추가/삭제/이동 |
| 프로젝트를 간략 카드로 | 해당 프로젝트에 `compact: true` |
| 핵심 성과 강조 배지 | 해당 프로젝트에 `highlight: "..."` |
| 교육/자격 | `education` 배열 |

수정 후 브라우저에서 새로고침하면 바로 반영됩니다.

## 로컬에서 열기

`index.html`을 더블클릭해서 열거나, 서버로 띄우려면:

```bash
python3 -m http.server 8000 --directory .
# http://localhost:8000
```

## 파일 구조

```
index.html          페이지 뼈대 (거의 수정할 일 없음)
resume_ahyoung_kim.pdf  다운로드용 PDF
assets/data.js      ★ 내용 (여기만 수정)
assets/app.js       data.js를 화면에 그리는 스크립트
assets/styles.css   디자인 (색상은 상단 :root 변수에서 조정)
```

## 디자인 조정

색상·폭 등은 [`assets/styles.css`](assets/styles.css) 맨 위 `:root` 변수만 바꾸면 전체에 반영됩니다.
다크모드는 기본으로 시스템 설정을 따라가고, 네비게이션 오른쪽 토글(☾/☀)로 직접 바꿀 수 있습니다(선택은 브라우저에 저장됨). 폰트는 Pretendard(CDN)입니다.
폰트 크기는 `:root`의 `--fs-*` 변수로 단계별로 정의되어 있습니다.
