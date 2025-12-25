// 로컬 스토리지 관리 함수들
const lectureStorage = {
    // 모든 강의 데이터 불러오기
    getAllLectures: function() {
        const lectures = localStorage.getItem('lectures');
        return lectures ? JSON.parse(lectures) : [];
    },
    
    // 강의 저장하기
    saveLecture: function(lecture) {
        const lectures = this.getAllLectures();
        
        // 새 강의에 ID 부여 (마지막 ID + 1 또는 1부터 시작)
        const newId = lectures.length > 0 ? Math.max(...lectures.map(l => l.id)) + 1 : 1;
        lecture.id = newId;
        
        // 등록일 설정
        lecture.registerDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
        
        // 새 강의 추가
        lectures.push(lecture);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('lectures', JSON.stringify(lectures));
        
        return lecture;
    },
    
    // 특정 ID의 강의 조회
    getLectureById: function(id) {
        const lectures = this.getAllLectures();
        return lectures.find(lecture => lecture.id === parseInt(id));
    },
    
    // 강의 업데이트
    updateLecture: function(id, updatedData) {
        const lectures = this.getAllLectures();
        const index = lectures.findIndex(lecture => lecture.id === parseInt(id));
        
        if (index !== -1) {
            lectures[index] = { ...lectures[index], ...updatedData };
            localStorage.setItem('lectures', JSON.stringify(lectures));
            return lectures[index];
        }
        
        return null;
    },
    
    // 강의 삭제
    deleteLecture: function(id) {
        const lectures = this.getAllLectures();
        const filteredLectures = lectures.filter(lecture => lecture.id !== parseInt(id));
        
        if (filteredLectures.length < lectures.length) {
            localStorage.setItem('lectures', JSON.stringify(filteredLectures));
            return true;
        }
        
        return false;
    },
    
    // 카테고리별 강의 조회
    getLecturesByCategory: function(category) {
        const lectures = this.getAllLectures();
        return lectures.filter(lecture => lecture.category === category);
    },
    
    // 페이지네이션을 위한 강의 조회
    getLecturesPaginated: function(category, page, pageSize = 5, sortBy = null) {
        let lectures = category === 'all' 
                      ? this.getAllLectures() 
                      : this.getLecturesByCategory(category);
        
        // 정렬 적용
        if (sortBy) {
            switch(sortBy) {
                case '카테고리순':
                    lectures.sort((a, b) => a.category.localeCompare(b.category));
                    break;
                case '강좌명순':
                    lectures.sort((a, b) => a.series.toLowerCase().localeCompare(b.series.toLowerCase()));
                    break;
                case '강의명순':
                    lectures.sort((a, b) => a.series.localeCompare(b.series) || a.number.localeCompare(b.number));
                    break;
                case '강사명순':
                    lectures.sort((a, b) => a.instructor.localeCompare(b.instructor));
                    break;
                case '등록일순':
                    lectures.sort((a, b) => new Date(b.registerDate) - new Date(a.registerDate)); // 최신순
                    break;
                default:
                    // 기본은 등록일 최신순
                    lectures.sort((a, b) => new Date(b.registerDate) - new Date(a.registerDate));
            }
        } else {
            // 기본 정렬: 등록일 최신순
            lectures.sort((a, b) => new Date(b.registerDate) - new Date(a.registerDate));
        }
        
        // 페이지네이션 계산
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedLectures = lectures.slice(startIndex, endIndex);
        
        return {
            lectures: paginatedLectures,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(lectures.length / pageSize),
                totalLectures: lectures.length,
                category: category
            }
        };
    },
    
    // 파일 스토리지 (Base64로 인코딩하여 저장)
    saveFile: function(fileData, fileName) {
        // 이미 저장된 파일 목록 가져오기
        const files = localStorage.getItem('files') ? JSON.parse(localStorage.getItem('files')) : {};
        
        // 파일 추가
        files[fileName] = fileData;
        
        // 저장
        localStorage.setItem('files', JSON.stringify(files));
        
        return fileName;
    },
    
    // 파일 불러오기
    getFile: function(fileName) {
        const files = localStorage.getItem('files') ? JSON.parse(localStorage.getItem('files')) : {};
        return files[fileName] || null;
    },
    
    // 샘플 데이터 초기화 (처음 사용할 때)
    initSampleData: function() {
        // 이미 데이터가 있으면 초기화하지 않음
        if (this.getAllLectures().length > 0) return;
        
        const sampleLectures = [
            {
                id: 1,
                category: '성서/성서배경',
                series: '역대하',
                number: '1. 역대하 개요 및 서론',
                instructor: '김재선 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                youtubeEmbedLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                driveLink: 'https://drive.google.com/file/d/1Sample_ID/view',
                driveEmbedLink: 'https://drive.google.com/file/d/1Sample_ID/preview',
                registerDate: '2025-03-18',
                duration: '00:49:45',
                materials: [
                    { name: '강의 노트', url: '#', type: 'pdf' },
                    { name: '역대하 역사 연대표', url: '#', type: 'xls' },
                    { name: '추천 참고 도서 목록', url: '#', type: 'doc' }
                ]
            },
            {
                id: 2,
                category: '성서/성서배경',
                series: '요한복음 4',
                number: '75. 두 가지 중요한 질문',
                instructor: '홍길헌 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                youtubeEmbedLink: 'https://www.youtube.com/embed/jNQXAC9IVRw',
                driveLink: 'https://drive.google.com/file/d/2Sample_ID/view',
                driveEmbedLink: 'https://drive.google.com/file/d/2Sample_ID/preview',
                registerDate: '2025-03-16',
                duration: '00:45:12',
                materials: [
                    { name: '강의 요약본', url: '#', type: 'pdf' },
                    { name: '요한복음 4장 주석 자료', url: '#', type: 'doc' }
                ]
            },
            {
                id: 3,
                category: '성서/성서배경',
                series: '레위기 3',
                number: '42. 하나님 백성의 거룩한 삶',
                instructor: '이상민 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                youtubeEmbedLink: 'https://www.youtube.com/embed/9bZkp7q19f0',
                driveLink: 'https://drive.google.com/file/d/3Sample_ID/view',
                driveEmbedLink: 'https://drive.google.com/file/d/3Sample_ID/preview',
                registerDate: '2025-03-14',
                duration: '00:48:32',
                materials: []
            },
            {
                id: 4,
                category: '성서/성서배경',
                series: '주제별성경연구2',
                number: '21. 자기 유익을 구지 아니하며',
                instructor: '변인교 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=kffacxfA7G4',
                youtubeEmbedLink: 'https://www.youtube.com/embed/kffacxfA7G4',
                driveLink: 'https://drive.google.com/file/d/4Sample_ID/view',
                driveEmbedLink: 'https://drive.google.com/file/d/4Sample_ID/preview',
                registerDate: '2025-03-13',
                duration: '00:39:45',
                materials: [
                    { name: '강의 자료', url: '#', type: 'pdf' }
                ]
            },
            {
                id: 5,
                category: '성서/성서배경',
                series: '성경 해석의 원칙 2',
                number: '31. 회개와 믿음을 통한 구원의 원칙',
                instructor: '신용철 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=XqZsoesa55w',
                youtubeEmbedLink: 'https://www.youtube.com/embed/XqZsoesa55w',
                driveLink: 'https://drive.google.com/file/d/5Sample_ID/view',
                driveEmbedLink: 'https://drive.google.com/file/d/5Sample_ID/preview',
                registerDate: '2025-03-12',
                duration: '00:52:18',
                materials: []
            },
            {
                id: 6,
                category: '전도인과정',
                series: '전도학개론',
                number: '1. 전도의 성경적 원리',
                instructor: '박성준 목사',
                youtubeLink: 'https://www.youtube.com/watch?v=sample1',
                youtubeEmbedLink: 'https://www.youtube.com/embed/sample1',
                driveLink: 'https://drive.google.com/file/d/evangelist1/view',
                driveEmbedLink: 'https://drive.google.com/file/d/evangelist1/preview',
                registerDate: '2025-03-15',
                duration: '00:42:15',
                materials: [
                    { name: '강의 노트', url: '#', type: 'pdf' },
                    { name: '전도 방법 요약표', url: '#', type: 'doc' },
                    { name: '추천 전도 서적', url: '#', type: 'pdf' }
                ]
            },
            {
                id: 7,
                category: '전도인과정',
                series: '전도실전',
                number: '15. 관계를 통한 전도 방법',
                instructor: '김민수 전도사',
                youtubeLink: 'https://www.youtube.com/watch?v=sample2',
                youtubeEmbedLink: 'https://www.youtube.com/embed/sample2',
                driveLink: 'https://drive.google.com/file/d/evangelist2/view',
                driveEmbedLink: 'https://drive.google.com/file/d/evangelist2/preview',
                registerDate: '2025-03-10',
                duration: '00:38:22',
                materials: []
            }
        ];
        
        localStorage.setItem('lectures', JSON.stringify(sampleLectures));
        console.log('샘플 데이터 초기화 완료');
    }
};

// 페이지 전환 함수
function showPage(pageId) {
    // 모든 페이지 콘텐츠 숨기기
    const pageContents = document.querySelectorAll('.page-content');
    pageContents.forEach(page => {
        page.style.display = 'none';
    });
    
    // 기본 메인 콘텐츠 (연구과정) 관련 요소 숨기기
    const researchContent = document.getElementById('research-content');
    if (researchContent) {
        researchContent.style.display = 'none';
    }
    
    // 선택된 페이지 표시 및 데이터 로드
    if (pageId === 'main') {
        // 메인 화면 표시
        document.getElementById('main-content').style.display = 'block';
        
        // 사이드바 내용 변경 (메인용)
        updateSidebar('수강 가이드', [
            '• 초급과정 안내',
            '• 중급과정 안내',
            '• 고급과정 안내',
            '• 수강 신청 방법',
            '• 학습 진행 방법',
            '• 자주 묻는 질문'
        ]);
    } else if (pageId === 'evangelist') {
        document.getElementById('evangelist-content').style.display = 'block';
        
        // 사이드바 내용 변경 (전도인용)
        updateSidebar('전도인과정', [
            '• 신규강의목록',
            '• 인기강의목록',
            '• 필수강의',
            '• 전도인수련회',
            '• 특별강좌',
            '• 전도자료실'
        ]);
        
        // 전도인 강의 목록 가져오기
        fetchLectures('전도인과정', 1);
    } else if (pageId === 'admin') {
        // 관리자 페이지 표시
        document.getElementById('admin-content').style.display = 'block';
        
        // 사이드바 내용 변경 (관리자용)
        updateSidebar('관리자 메뉴', [
            '• 강의 등록',
            '• 강의 관리',
            '• 사용자 관리',
            '• 카테고리 관리',
            '• 통계/분석',
            '• 설정'
        ]);
    } else if (pageId === 'research') {
        // 연구과정 페이지 표시
        document.getElementById('research-content').style.display = 'block';
        
        // 사이드바 내용 변경 (연구과정용)
        updateSidebar('연구과정', [
            '• 강좌전체목록',
            '• 강의전체목록',
            '• 전문강의 강좌',
            '• 강사별 강좌',
            '• 등록연도별 강좌',
            '• 전도인수련회 강좌'
        ]);
        
        // 연구과정 강의 목록 가져오기
        fetchLectures('성서/성서배경', 1);
    } else if (pageId === 'theology') {
        // 신학과정 페이지 표시
        document.getElementById('research-content').style.display = 'block';
        document.querySelector('.lectures-title').textContent = '신학과정 강의목록';
        
        // 사이드바 내용 변경 (신학과정용)
        updateSidebar('신학과정', [
            '• 성서신학',
            '• 조직신학',
            '• 역사신학',
            '• 실천신학',
            '• 선교학',
            '• 특별강좌'
        ]);
        
        // 신학과정 강의 목록 가져오기
        fetchLectures('신학과정', 1);
    } else if (pageId === 'regular') {
        // 정규과정 페이지 표시
        document.getElementById('research-content').style.display = 'block';
        document.querySelector('.lectures-title').textContent = '정규과정 강의목록';
        
        // 사이드바 내용 변경 (정규과정용)
        updateSidebar('정규과정', [
            '• 1학년 과정',
            '• 2학년 과정',
            '• 3학년 과정',
            '• 4학년 과정',
            '• 졸업논문',
            '• 특별과정'
        ]);
        
        // 정규과정 강의 목록 가져오기
        fetchLectures('정규과정', 1);
    } else {
        // 그 외 페이지는 메인 화면 표시
        document.getElementById('main-content').style.display = 'block';
        
        // 기본 강의 목록 가져오기
        fetchLectures('all', 1);
    }
    
    // 네비게이션 메뉴 활성화 표시
    const navItems = document.querySelectorAll('.nav li a');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 메뉴 활성화
    if (event && event.target) {
        event.target.classList.add('active');
    } else if (pageId === 'main') {
        // 메인 메뉴(로고)를 클릭했을 때는 아무 메뉴도 활성화하지 않음
    } else {
        // 초기 로드 시 해당 메뉴 활성화
        const menuItem = document.querySelector(`.nav li a[onclick="showPage('${pageId}')"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
    }
}

// 사이드바 업데이트 함수
function updateSidebar(title, items) {
    const sidebarTitle = document.querySelector('.sidebar h3');
    const sidebarItems = document.querySelector('.sidebar ul');
    
    // 제목 변경
    sidebarTitle.textContent = title;
    
    // 항목 변경
    sidebarItems.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        sidebarItems.appendChild(li);
    });
}

// 강의 목록 가져오기 함수 (로컬 스토리지에서)
function fetchLectures(category, page = 1, sortBy = null) {
    try {
        // 로딩 표시
        showLoading(true);
        
        // 로컬 스토리지에서 데이터 가져오기
        const data = lectureStorage.getLecturesPaginated(category, page, 5, sortBy);
        
        // 데이터 표시
        displayLectures(data.lectures);
        updatePagination(data.pagination);
    } catch (error) {
        console.error('강의 목록 가져오기 오류:', error);
        // 오류 발생 시 빈 목록 표시
        displayLectures([]);
    } finally {
        // 로딩 표시 숨기기
        showLoading(false);
    }
}

// 로딩 표시 함수
function showLoading(isLoading) {
    // 로딩 요소가 있다면 표시/숨기기
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'flex' : 'none';
    }
}

// 강의 목록 표시 함수
function displayLectures(lectures) {
    const lecturesList = document.querySelector('.board-list');
    lecturesList.innerHTML = '';
    
    if (!lectures || lectures.length === 0) {
        lecturesList.innerHTML = '<div class="no-lectures" style="padding: 20px; text-align: center;">등록된 강의가 없습니다.</div>';
        return;
    }
    
    lectures.forEach(lecture => {
        const lectureItem = document.createElement('div');
        lectureItem.className = 'board-item';
        lectureItem.onclick = () => openLectureDetail(lecture.id);
        
        lectureItem.innerHTML = `
            <div class="title">&lt;${lecture.series}&gt; ${lecture.number}</div>
            <div class="info">
                <div>강사: ${lecture.instructor}</div>
                <div>등록일: ${lecture.registerDate}</div>
                <div>카테고리: ${lecture.category}</div>
            </div>
            <div class="links">
                <button class="view-button" onclick="openLectureDetail(${lecture.id}); event.stopPropagation();">강의보기</button>
            </div>
        `;
        
        lecturesList.appendChild(lectureItem);
    });
}

// 페이지네이션 업데이트 함수
function updatePagination(pagination) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // 페이지네이션 데이터가 없는 경우 숨기기
    if (!pagination || pagination.totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }
    
    // 이전 페이지 버튼
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.className = 'arrow';
    prevButton.innerHTML = '&laquo;';
    prevButton.onclick = (e) => {
        e.preventDefault();
        if (pagination.currentPage > 1) {
            fetchLectures(pagination.category, pagination.currentPage - 1);
        }
    };
    
    // 페이지 번호 버튼들
    const pageButtons = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
        const pageButton = document.createElement('a');
        pageButton.href = '#';
        pageButton.textContent = i;
        if (i === pagination.currentPage) {
            pageButton.className = 'active';
        }
        pageButton.onclick = (e) => {
            e.preventDefault();
            fetchLectures(pagination.category, i);
        };
        pageButtons.push(pageButton);
    }
    
    // 다음 페이지 버튼
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.className = 'arrow';
    nextButton.innerHTML = '&raquo;';
    nextButton.onclick = (e) => {
        e.preventDefault();
        if (pagination.currentPage < pagination.totalPages) {
            fetchLectures(pagination.category, pagination.currentPage + 1);
        }
    };
    
    // 페이지네이션에 버튼들 추가
    paginationContainer.appendChild(prevButton);
    pageButtons.forEach(button => paginationContainer.appendChild(button));
    paginationContainer.appendChild(nextButton);
}

// 강의 상세 페이지 열기 함수
function openLectureDetail(lectureId) {
    // ID가 문자열인 경우 (고정 강의) 그대로 사용
    if (typeof lectureId === 'string') {
        const detailElement = document.getElementById(lectureId);
        if (detailElement) {
            detailElement.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        return;
    }
    
    // 이후는 숫자 ID로 저장된 강의
    try {
        // 강의 상세 정보 가져오기
        const lecture = lectureStorage.getLectureById(lectureId);
        
        if (!lecture) {
            alert('강의 정보를 찾을 수 없습니다.');
            return;
        }
        
        // 기존 강의 상세 페이지 확인
        let lectureDetailElement = document.getElementById(`lecture-detail-${lectureId}`);
        
        // 없으면 새로 생성
        if (!lectureDetailElement) {
            lectureDetailElement = createLectureDetailElement(lecture);
            document.body.appendChild(lectureDetailElement);
        } else {
            // 있으면 정보 업데이트
            updateLectureDetailElement(lectureDetailElement, lecture);
        }
        
        // 페이지 표시
        lectureDetailElement.style.display = 'block';
        
        // 스크롤 방지
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('강의 상세 페이지 열기 오류:', error);
        alert('강의 상세 정보를 불러오는데 실패했습니다.');
    }
}

// 동적으로 강의 상세 페이지 요소 생성
function createLectureDetailElement(lecture) {
    const lectureDetail = document.createElement('div');
    lectureDetail.id = `lecture-detail-${lecture.id}`;
    lectureDetail.className = 'lecture-detail';
    
    lectureDetail.innerHTML = `
        <div class="lecture-detail-container">
            <div class="lecture-header">
                <h2>&lt;${lecture.series}&gt; ${lecture.number}</h2>
                <div class="lecture-info">강사: ${lecture.instructor} | 등록일: ${lecture.registerDate} | 재생시간: ${lecture.duration || '00:00:00'}</div>
                <button class="close-button" onclick="closeLectureDetail(${lecture.id})">×</button>
            </div>
            <div class="lecture-body">
                <div class="video-tabs">
                    <div class="video-tab active" onclick="switchVideoTab(this, 'youtube-video-${lecture.id}')">유튜브 영상</div>
                    <div class="video-tab" onclick="switchVideoTab(this, 'drive-video-${lecture.id}')">구글드라이브 영상</div>
                    <div class="video-tab" onclick="switchVideoTab(this, 'audio-player-${lecture.id}')">오디오 강의</div>
                </div>
                
                <div class="lecture-video" id="youtube-video-${lecture.id}">
                    <iframe src="${lecture.youtubeEmbedLink || '#'}" allowfullscreen></iframe>
                </div>
                
                <div class="lecture-video" id="drive-video-${lecture.id}" style="display: none;">
                    <iframe src="${lecture.driveEmbedLink || '#'}" allowfullscreen></iframe>
                </div>
                
                <div class="lecture-video" id="audio-player-${lecture.id}" style="display: none;">
                    <audio controls style="width:100%">
                        <source src="#" type="audio/mpeg">
                        브라우저가 오디오 재생을 지원하지 않습니다.
                    </audio>
                </div>
                <div class="additional-materials">
                    <h3>추가 자료</h3>
                    <ul class="materials-list">
                        ${lecture.materials && lecture.materials.length > 0 ? 
                            lecture.materials.map(material => 
                                `<li><a href="${material.url}"><span class="icon">${getIconForFileType(material.type)}</span> ${material.name}</a></li>`
                            ).join('') : 
                            '<li>추가 자료가 없습니다.</li>'
                        }
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    return lectureDetail;
}

// 강의 상세 정보 업데이트
function updateLectureDetailElement(element, lecture) {
    // 제목과 정보 업데이트
    element.querySelector('h2').textContent = `<${lecture.series}> ${lecture.number}`;
    element.querySelector('.lecture-info').textContent = `강사: ${lecture.instructor} | 등록일: ${lecture.registerDate} | 재생시간: ${lecture.duration || '00:00:00'}`;
    
    // 비디오 소스 업데이트
    const youtubeVideo = element.querySelector(`#youtube-video-${lecture.id} iframe`);
    if (youtubeVideo) {
        youtubeVideo.src = lecture.youtubeEmbedLink || '#';
    }
    
    const driveVideo = element.querySelector(`#drive-video-${lecture.id} iframe`);
    if (driveVideo) {
        driveVideo.src = lecture.driveEmbedLink || '#';
    }
    
    // 추가 자료 업데이트
    const materialsList = element.querySelector('.materials-list');
    if (materialsList) {
        materialsList.innerHTML = '';
        
        if (lecture.materials && lecture.materials.length > 0) {
            lecture.materials.forEach(material => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${material.url}"><span class="icon">${getIconForFileType(material.type)}</span> ${material.name}</a>`;
                materialsList.appendChild(li);
            });
        } else {
            materialsList.innerHTML = '<li>추가 자료가 없습니다.</li>';
        }
    }
}

// 강의 상세 페이지 닫기 함수
function closeLectureDetail(lectureId) {
    // ID가 문자열인 경우 (고정 강의)
    if (typeof lectureId === 'string') {
        const detailElement = document.getElementById(lectureId);
        if (detailElement) {
            detailElement.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        return;
    }
    
    // 이후는 숫자 ID로 저장된 강의
    const detailElement = document.getElementById(`lecture-detail-${lectureId}`);
    if (detailElement) {
        detailElement.style.display = 'none';
    }
    
    // 스크롤 다시 활성화
    document.body.style.overflow = 'auto';
}

// 비디오 탭 전환 함수
function switchVideoTab(tab, videoId) {
    // 모든 탭 비활성화
    const tabs = tab.parentElement.querySelectorAll('.video-tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    // 선택한 탭 활성화
    tab.classList.add('active');
    
    // 모든 비디오 컨텐츠 숨기기
    const videoContainers = tab.parentElement.parentElement.querySelectorAll('.lecture-video');
    videoContainers.forEach(vc => vc.style.display = 'none');
    
    // 선택한 비디오 컨텐츠 표시
    const selectedVideo = document.getElementById(videoId);
    if (selectedVideo) {
        selectedVideo.style.display = 'block';
    }
}

// 파일 타입에 따른 아이콘 반환
function getIconForFileType(fileType) {
    switch (fileType) {
        case 'pdf': return '📄';
        case 'doc': case 'docx': return '📝';
        case 'ppt': case 'pptx': return '📊';
        case 'xls': case 'xlsx': return '📈';
        case 'zip': case 'rar': return '📦';
        case 'mp3': case 'wav': return '🔊';
        case 'mp4': case 'avi': case 'mov': return '🎬';
        default: return '📎';
    }
}

// 파일을 Base64로 변환하는 함수
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 강의 등록 함수
async function registerLecture() {
    try {
        // 로딩 표시
        showLoading(true);
        
        // 폼 데이터 수집
        const category = document.getElementById('lecture-category').value;
        const series = document.getElementById('lecture-series').value;
        const number = document.getElementById('lecture-number').value;
        const instructor = document.getElementById('lecture-instructor').value;
        const youtubeLink = document.getElementById('youtube-link').value;
        const driveLink = document.getElementById('drive-link').value;
        
        // 필수 필드 유효성 검사
        if (!category || !series || !number || !instructor) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }
        
        // 파일 처리 (로컬 스토리지에서는 제한적)
        const lectureFile = document.getElementById('lecture-file').files[0];
        const materialFiles = document.getElementById('material-files').files;
        
        // YouTube 링크에서 임베드 링크 생성
        let youtubeEmbedLink = '';
        if (youtubeLink) {
            // YouTube 링크 형식: https://www.youtube.com/watch?v=VIDEO_ID
            const videoId = youtubeLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&]+)/);
            if (videoId && videoId[1]) {
                youtubeEmbedLink = `https://www.youtube.com/embed/${videoId[1]}`;
            }
        }
        
        // Google Drive 링크에서 임베드 링크 생성
        let driveEmbedLink = '';
        if (driveLink) {
            // Drive 링크 형식: https://drive.google.com/file/d/FILE_ID/view
            const fileId = driveLink.match(/https:\/\/drive\.google\.com\/file\/d\/([^\/]+)/);
            if (fileId && fileId[1]) {
                driveEmbedLink = `https://drive.google.com/file/d/${fileId[1]}/preview`;
            }
        }
        
        // 파일 데이터 준비 (실제 파일은 로컬 스토리지에 저장하기 어려움)
        const materials = [];
        
        // 실제 환경에서는 파일을 서버에 업로드하고 URL을 얻어야 함
        // 여기서는 예시로 파일 이름만 저장
        if (materialFiles && materialFiles.length > 0) {
            for (let i = 0; i < materialFiles.length; i++) {
                const file = materialFiles[i];
                const fileType = file.name.split('.').pop().toLowerCase();
                
                // 실제로는 파일을 저장하고 URL을 얻어야 함
                // 이 예시에서는 파일 이름과 타입만 저장
                materials.push({
                    name: file.name,
                    url: '#', // 실제 URL은 서버에 업로드 후 얻을 수 있음
                    type: fileType
                });
                
                // 작은 파일인 경우 Base64로 변환하여 로컬 스토리지에 저장할 수 있음 (선택적)
                // 주의: 로컬 스토리지 용량 제한이 있으므로 큰 파일은 피해야 함
                if (file.size < 1000000) { // 1MB 미만 파일만
                    try {
                        const base64Data = await fileToBase64(file);
                        // 로컬 스토리지에 파일 데이터 저장 (옵션)
                        lectureStorage.saveFile(base64Data, file.name);
                    } catch (e) {
                        console.error('파일 변환 오류:', e);
                    }
                }
            }
        }
        
        // 새 강의 데이터 생성
        const newLecture = {
            category,
            series,
            number,
            instructor,
            description,
            youtubeLink,
            youtubeEmbedLink,
            driveLink,
            driveEmbedLink,
            materials,
            duration: '00:00:00' // 기본값
        };
        
        // 로컬 스토리지에 저장
        const savedLecture = lectureStorage.saveLecture(newLecture);
        
        // 성공 메시지 표시
        alert('강의가 성공적으로 등록되었습니다!');
        console.log('저장된 강의:', savedLecture);
        
        // 폼 초기화
        document.getElementById('lecture-form').reset();
        
        // 연구과정 페이지로 이동 (또는 적절한 페이지로)
        showPage('research');
        
    } catch (error) {
        console.error('강의 등록 오류:', error);
        alert('강의 등록에 실패했습니다: ' + error.message);
    } finally {
        // 로딩 표시 숨기기
        showLoading(false);
    }
}

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 샘플 데이터 초기화
    lectureStorage.initSampleData();
    
    // 초기 메뉴 활성화 (기본: 메인 페이지)
    showPage('main');
    
    // 강의 등록 폼 제출 이벤트 리스너
    const lectureForm = document.getElementById('lecture-form');
    if (lectureForm) {
        lectureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerLecture();
        });
    }
    
    // 카테고리 탭 클릭 이벤트 리스너
    const categoryTabs = document.querySelectorAll('.category-tabs div');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭 비활성화
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭한 탭 활성화
            this.classList.add('active');
            
            // 현재 카테고리 가져오기
            const category = getCurrentCategory();
            
            // 정렬 기준에 따라 데이터 가져오기
            fetchLectures(category, 1, this.textContent.trim());
        });
    });
    
    // 현재 카테고리 가져오기 함수
    function getCurrentCategory() {
        // 현재 활성화된 메뉴 항목 가져오기
        const activeMenu = document.querySelector('.nav a.active');
        if (activeMenu) {
            const onclickAttr = activeMenu.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/showPage\('(.*?)'\)/);
                if (match && match[1]) {
                    const pageId = match[1];
                    
                    // 페이지 ID에 따른 카테고리 반환
                    switch(pageId) {
                        case 'theology': return '신학과정';
                        case 'regular': return '정규과정';
                        case 'evangelist': return '전도인과정';
                        case 'research': return '성서/성서배경';
                        default: return 'all';
                    }
                }
            }
        }
        // 기본값
        return '성서/성서배경';
    }
    
    // 로컬 스토리지 변경 감지
    window.addEventListener('storage', function(e) {
        // 다른 탭에서 로컬 스토리지가 변경되면 데이터 새로고침
        if (e.key === 'lectures') {
            // 현재 카테고리와 페이지 유지하면서 데이터 새로고침
            const category = getCurrentCategory();
            const currentPage = document.querySelector('.pagination a.active');
            const page = currentPage ? parseInt(currentPage.textContent) : 1;
            
            fetchLectures(category, page);
        }
    });
});