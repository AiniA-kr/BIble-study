// 페이지 전환 함수
const API_URL = 'http://127.0.0.1:5500/%EC%8B%A0%ED%95%99%EC%9B%90%20%EC%82%AC%EC%9D%B4%ED%8A%B8/%ED%85%8C%EC%8A%A4%ED%8A%B8.html#';
function showPage(pageId) {
    // 모든 페이지 콘텐츠 숨기기
    const pageContents = document.querySelectorAll('.page-content');
    pageContents.forEach(page => {
        page.style.display = 'none';
    });
    
    // 기본 메인 콘텐츠 (강의 목록) 숨기기
    document.querySelector('.main-content > .lectures-title').style.display = 'none';
    document.querySelector('.main-content > .category-tabs').style.display = 'none';
    document.querySelector('.main-content > .board-list').style.display = 'none';
    document.querySelector('.main-content > .pagination').style.display = 'none';
    
    // 선택된 페이지 표시
    if (pageId === 'evangelist') {
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
        // 연구과정 페이지 표시 (메인 콘텐츠 그대로 사용)
        document.querySelector('.main-content > .lectures-title').style.display = 'block';
        document.querySelector('.main-content > .category-tabs').style.display = 'flex';
        document.querySelector('.main-content > .board-list').style.display = 'block';
        document.querySelector('.main-content > .pagination').style.display = 'flex';
        
        // 사이드바 내용 변경 (연구과정용)
        updateSidebar('연구과정', [
            '• 강좌전체목록',
            '• 강의전체목록',
            '• 전문강의 강좌',
            '• 강사별 강좌',
            '• 등록연도별 강좌',
            '• 전도인수련회 강좌'
        ]);
    } else if (pageId === 'theology') {
        // 다른 페이지는 아직 구현되지 않았으므로 기본 메인 콘텐츠 표시
        document.querySelector('.main-content > .lectures-title').textContent = '신학과정 강의목록';
        document.querySelector('.main-content > .lectures-title').style.display = 'block';
        document.querySelector('.main-content > .category-tabs').style.display = 'flex';
        document.querySelector('.main-content > .board-list').style.display = 'block';
        document.querySelector('.main-content > .pagination').style.display = 'flex';
        
        // 사이드바 내용 변경 (신학과정용)
        updateSidebar('신학과정', [
            '• 성서신학',
            '• 조직신학',
            '• 역사신학',
            '• 실천신학',
            '• 선교학',
            '• 특별강좌'
        ]);
    } else if (pageId === 'regular') {
        // 정규과정 페이지 표시
        document.querySelector('.main-content > .lectures-title').textContent = '정규과정 강의목록';
        document.querySelector('.main-content > .lectures-title').style.display = 'block';
        document.querySelector('.main-content > .category-tabs').style.display = 'flex';
        document.querySelector('.main-content > .board-list').style.display = 'block';
        document.querySelector('.main-content > .pagination').style.display = 'flex';
        
        // 사이드바 내용 변경 (정규과정용)
        updateSidebar('정규과정', [
            '• 1학년 과정',
            '• 2학년 과정',
            '• 3학년 과정',
            '• 4학년 과정',
            '• 졸업논문',
            '• 특별과정'
        ]);
    } else {
        // 그 외 페이지는 기본 메인 콘텐츠 표시
        document.querySelector('.main-content > .lectures-title').style.display = 'block';
        document.querySelector('.main-content > .category-tabs').style.display = 'flex';
        document.querySelector('.main-content > .board-list').style.display = 'block';
        document.querySelector('.main-content > .pagination').style.display = 'flex';
    }
    
    // 네비게이션 메뉴 활성화 표시
    const navItems = document.querySelectorAll('.nav li a');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 메뉴 활성화
    event.target.classList.add('active');
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

// 강의 상세 페이지 열기 함수
function openLectureDetail(lectureId) {
    document.getElementById(lectureId).style.display = 'block';
    
    // 스크롤 방지
    document.body.style.overflow = 'hidden';
}

// 강의 상세 페이지 닫기 함수
function closeLectureDetail(lectureId) {
    document.getElementById(lectureId).style.display = 'none';
    
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
    document.getElementById(videoId).style.display = 'block';
}

// 강의 등록 함수
function registerLecture(category, series, number, instructor, description, youtubeLink, driveLink) {
    // 실제 서버에 데이터를 전송하는 대신, 브라우저 콘솔에 출력
    console.log('강의가 등록되었습니다:', {
        category,
        series,
        number,
        instructor,
        description,
        youtubeLink,
        driveLink,
        registrationDate: new Date().toISOString().split('T')[0]
    });
    
    // 성공 메시지 표시
    alert('강의가 성공적으로 등록되었습니다!');
    
    // 폼 초기화
    document.getElementById('lecture-form').reset();
    
    // 실제 구현에서는 여기서 서버에 데이터를 전송하고,
    // 서버 응답에 따라 처리하는 로직이 추가되어야 합니다.
}

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 초기 메뉴 활성화 (기본: 연구과정)
    const researchMenu = document.querySelector('.nav li:nth-child(4) a');
    if (researchMenu) {
        researchMenu.classList.add('active');
    }
    
    // 페이지네이션 이벤트 리스너
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 현재 활성화된 페이지 링크 비활성화
            document.querySelector('.pagination a.active').classList.remove('active');
            
            // 클릭한 페이지 링크 활성화
            this.classList.add('active');
            
            // 실제 프로젝트에서는 여기에 페이지 데이터 로딩 로직 추가
        });
    });
    
    // 강의 등록 폼 제출 이벤트 리스너
    const lectureForm = document.getElementById('lecture-form');
    if (lectureForm) {
        lectureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const category = document.getElementById('lecture-category').value;
            const series = document.getElementById('lecture-series').value;
            const number = document.getElementById('lecture-number').value;
            const instructor = document.getElementById('lecture-instructor').value;
            const description = document.getElementById('lecture-description').value;
            const youtubeLink = document.getElementById('youtube-link').value;
            const driveLink = document.getElementById('drive-link').value;
            
            // 강의 등록 처리
            registerLecture(category, series, number, instructor, description, youtubeLink, driveLink);
        });
    }
});