document.addEventListener('DOMContentLoaded', () => {
    // 기존 변수들
    const nicknameScreen = document.getElementById('nicknameScreen');
    const descriptionScreen = document.getElementById('descriptionScreen');
    const nicknameInput = document.getElementById('nicknameInput');
    const startButton = document.getElementById('startButton');
    const startGameButton = document.getElementById('startGameButton');
    const displayedNickname = document.getElementById('displayedNickname');

    let playerNickname = '';

    // --- 여기에 추가할 새로운 게임 플레이 관련 변수들 ---
    const gameBoard = document.getElementById('game-board'); // 게임 보드 div ID
    // 주의: gameScreen은 기존 HTML에 있었다면, 이제 game-play-screen으로 역할이 분리됩니다.
    // 여기서는 gamePlayScreen이라는 새로운 변수를 사용합니다.
    const gamePlayScreen = document.getElementById('game-play-screen');

    let currentMapIndex = 0; // 현재 맵 인덱스 (0: 정글, 1: 바다, 2: 도시)
    let foundItemsCount = 0; // 현재 맵에서 찾은 아이템 개수
    const itemsPerMap = 10; // 맵 당 숨은 아이템 개수

    // 맵별 배경 이미지 경로 (배경 순서: 정글, 바다, 도시)
    const mapBackgrounds = [
        './images/KakaoTalk_20250721_131318488.png', // 정글
        './images/KakaoTalk_20250721_131318488_01.png', // 바다
        './images/KakaoTalk_20250721_131318488_02.png'  // 도시
    ];

    // 각 맵에 숨겨질 아이템 이미지 경로 (총 30개)
    // 첫 번째 맵 (정글) 아이템
    const map1Items = [
        './images/cho1.png', './images/cho2.png', './images/cho3.png', './images/cho4.png', './images/cho5.jpg',
        './images/cho6.jpg', './images/cho7.png', './images/cho8.png', './images/cho9.jpg', './images/cho10.png'
    ];

    // 두 번째 맵 (바다) 아이템
    const map2Items = [
        './images/pa1.png', './images/pa2.png', './images/pa3.png', './images/pa4.jpg', './images/pa5.png',
        './images/pa6.png', './images/pa7.png', './images/pa8.png', './images/pa9.png', './images/pa10.png'
    ];

    // 세 번째 맵 (도시) 아이템
    const map3Items = [
        './images/bo1.png', './images/bo2.png', './images/bo3.png', './images/bo4.png', './images/bo5.png',
        './images/bo6.png', './images/bo7.png', './images/bo8.png', './images/bo9.jpg', './images/bo10.png'
    ];

    const allMapItems = [map1Items, map2Items, map3Items]; // 모든 맵의 아이템들을 배열에 담기
    // --- 새로운 게임 플레이 관련 변수들 끝 ---


    // --- 새로운 함수 정의들 ---

    // 게임 보드 초기화 및 아이템 배치
    function initializeGameBoard() {
        gameBoard.innerHTML = ''; // 기존 아이템 모두 제거
        gameBoard.style.backgroundImage = `url(${mapBackgrounds[currentMapIndex]})`;
        foundItemsCount = 0; // 찾은 아이템 개수 초기화

        const currentMapItems = allMapItems[currentMapIndex];
        // 아이템들을 무작위 위치에 배치
        for (let i = 0; i < itemsPerMap; i++) {
            const item = document.createElement('img');
            item.src = currentMapItems[i];
            item.classList.add('game-item'); // CSS 스타일링을 위한 클래스 추가
            item.dataset.found = 'false'; // 찾았는지 여부를 나타내는 데이터 속성

            // 무작위 위치 설정 (게임 보드 크기 내에서)
            // 아이템의 크기를 고려하여 화면 밖으로 나가지 않도록 조정 (예: 100px 아이템의 경우)
            const itemWidth = 100; // 아이템 이미지의 예상 너비 (필요시 조절)
            const itemHeight = 100; // 아이템 이미지의 예상 높이 (필요시 조절)

            const maxX = gameBoard.offsetWidth - itemWidth;
            const maxY = gameBoard.offsetHeight - itemHeight;

            item.style.position = 'absolute'; // 중요: absolute여야 left/top 적용됨
            item.style.left = `${Math.random() * maxX}px`;
            item.style.top = `${Math.random() * maxY}px`;

            item.addEventListener('click', () => {
                if (item.dataset.found === 'false') {
                    item.dataset.found = 'true';
                    item.style.opacity = '0'; // 아이템을 숨김
                    foundItemsCount++;
                    console.log(`찾은 아이템: ${foundItemsCount}/${itemsPerMap}`);

                    if (foundItemsCount === itemsPerMap) {
                        // 현재 맵의 모든 아이템을 찾았을 때
                        currentMapIndex++;
                        if (currentMapIndex < mapBackgrounds.length) {
                            // 다음 맵으로 이동
                            console.log(`다음 맵으로 이동: 맵 ${currentMapIndex + 1}`);
                            setTimeout(initializeGameBoard, 1000); // 1초 후 다음 맵 로드
                        } else {
                            // 모든 맵 클리어! 게임 종료 처리
                            console.log('모든 맵 클리어! 게임 종료.');
                            alert('모든 맵을 클리어했습니다! 게임 종료.');
                            // 게임을 다시 시작하려면 닉네임 화면으로 돌아갑니다.
                            gamePlayScreen.classList.remove('active');
                            nicknameScreen.classList.add('active');
                            nicknameInput.value = ''; // 닉네임 입력창 초기화
                        }
                    }
                }
            });
            gameBoard.appendChild(item);
        }
    }
    // --- 새로운 함수 정의들 끝 ---


    // 닉네임 입력 화면 -> 게임 설명 화면
    startButton.addEventListener('click', () => {
        playerNickname = nicknameInput.value.trim();

        if (playerNickname.length >= 1 && playerNickname.length <= 4) {
            console.log("플레이어 닉네임:", playerNickname);
            
            displayedNickname.textContent = `${playerNickname}`; 
            
            nicknameScreen.classList.remove('active');
            descriptionScreen.classList.add('active');

        } else {
            alert('닉네임은 1글자 이상 4글자 이하로 입력해주세요.');
            nicknameInput.focus();
        }
    });

    // 게임 설명 화면 -> 게임 플레이 화면 (새로운 게임 시작 로직)
    startGameButton.addEventListener('click', () => {
        descriptionScreen.classList.remove('active');
        gamePlayScreen.classList.add('active'); // game-play-screen 활성화
        console.log("게임 시작 버튼 클릭! 게임 플레이 화면으로 전환.");
        
        currentMapIndex = 0; // 첫 번째 맵부터 시작
        initializeGameBoard(); // 게임 보드 초기화 및 첫 맵 아이템 배치
        // TODO: 타이머 시작 로직 추가 (다음 단계에서 구현)
    });

    // 추가: 닉네임 입력 필드에서 Enter 키 눌렀을 때도 다음 화면으로 이동
    nicknameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            startButton.click();
        }
    });

    // 초기 로드 시 화면 설정
    // 모든 화면을 기본적으로 숨기고 닉네임 화면만 표시합니다.
    if (nicknameScreen) {
        nicknameScreen.classList.add('active');
    }
    if (descriptionScreen) {
        descriptionScreen.classList.remove('active');
    }
    if (gamePlayScreen) {
        gamePlayScreen.classList.remove('active');
    }
});