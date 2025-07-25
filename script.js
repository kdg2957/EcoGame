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
    const gamePlayScreen = document.getElementById('game-play-screen'); // game-play-screen 변수 추가
    const resultScreen = document.getElementById('resultScreen'); // 결과 화면 변수 추가
    const rankingScreen = document.getElementById('rankingScreen'); // 랭킹 화면 변수 추가 (나중에 사용)

    const timerDisplay = document.getElementById('timerDisplay'); // 타이머 DOM 요소
    // --- 새로 추가된 DOM 요소 변수 ---
    const foundItemsDisplay = document.getElementById('foundItemsDisplay'); // 찾은 아이템 개수 DOM 요소 추가
    const restartButton = document.getElementById('restartButton'); // 재시작 버튼 변수 추가


    let currentMapIndex = 0; // 현재 맵 인덱스 (0: 정글, 1: 바다, 2: 도시)
    let foundItemsCount = 0; // 현재 맵에서 찾은 아이템 개수 (맵 전환 시 초기화)
    let totalFoundItems = 0; // 전체 게임에서 찾은 총 아이템 개수 (게임 전체에서 유지)
    const itemsPerMap = 10; // 맵 당 숨은 아이템 개수

    const totalGameTime = 20; // 전체 게임 시간 (초)
    let timeLeft = totalGameTime; // 남은 시간
    let timerInterval; // setInterval을 저장할 변수

    // 맵별 배경 이미지 경로 (배경 순서: 정글, 바다, 도시)
    const mapBackgrounds = [
        './images/KakaoTalk_20250721_131318488.png', // 정글 (png가 아니라 jpg였으므로 수정)
        './images/KakaoTalk_20250721_131318488_01.png', // 바다 (png가 아니라 jpg였으므로 수정)
        './images/KakaoTalk_20250721_131318488_02.png'  // 도시 (png가 아니라 jpg였으므로 수정)
    ];

    // 각 맵에 숨겨질 아이템 이미지 경로 (총 30개)
    const mapItems = [
        // 첫 번째 맵 (정글) 아이템
        [
            './images/cho1.png', './images/cho2.png', './images/cho3.png', './images/cho4.png', './images/cho5.png',
            './images/cho6.png', './images/cho7.png', './images/cho8.png', './images/cho9.png', './images/cho10.png'
        ],
        // 두 번째 맵 (바다) 아이템
        [
            './images/pa1.png', './images/pa2.png', './images/pa3.png', './images/pa4.png', './images/pa5.png',
            './images/pa6.png', './images/pa7.png', './images/pa8.png', './images/pa9.png', './images/pa10.png'
        ],
        // 세 번째 맵 (도시) 아이템
        [
            './images/bo1.png', './images/bo2.png', './images/bo3.png', './images/bo4.png', './images/bo5.png',
            './images/bo6.png', './images/bo7.png', './images/bo8.png', './images/bo9.png', './images/bo10.png'
        ]
    ];


    // --- 새로운 함수 정의들 ---

    // 화면 전환 함수
    function showScreen(screenToShow) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    // 게임 초기화 함수 (타이머 및 게임 상태 초기화)
    function resetGame() {
        currentMapIndex = 0;
        foundItemsCount = 0; // 현재 맵 아이템 수 초기화
        totalFoundItems = 0; // 전체 찾은 아이템 수 초기화
        timeLeft = totalGameTime; // 타이머 초기화
        timerDisplay.textContent = timeLeft; // 화면 타이머 표시 업데이트
        stopTimer(); // 혹시 모를 상황 대비 타이머 중지
        updateFoundItemsDisplay(); // 찾은 아이템 개수 디스플레이 초기화
    }

    // --- 타이머 관련 함수 ---
    function startTimer() {
        // 이미 타이머가 실행 중이면 중복 실행 방지
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerDisplay.textContent = timeLeft; // 초기 시간 표시

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "0";
                // 시간 초과 시 게임 종료 처리
                endGameProcess();
            }
        }, 1000); // 1초마다 감소
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // 게임 종료 후 닉네임 화면으로 돌아가는 함수 (타이머 중지 및 초기화 포함)
    // 이 함수는 '다시 시작하기' 버튼에 연결됩니다.
    function resetGameAndReturnToNickname() {
        stopTimer(); // 타이머 중지
        resetGame(); // 게임 상태 초기화 (여기서 foundItemsDisplay도 초기화됨)
        showScreen(nicknameScreen); // 닉네임 화면으로 전환
        // 닉네임 입력 필드 초기화 및 포커스
        nicknameInput.value = '';
        nicknameInput.focus();
    }

    // 게임 보드 초기화 및 아이템 배치
    function initializeGameBoard() {
        gameBoard.innerHTML = ''; // 기존 아이템 모두 제거
        gameBoard.style.backgroundImage = `url(${mapBackgrounds[currentMapIndex]})`;
        
        foundItemsCount = 0; // 현재 맵에서 찾은 아이템 개수 초기화 (중요: 다음 맵으로 갈 때마다 리셋)
        updateFoundItemsDisplay(); // 맵 전환 시 찾은 아이템 개수 디스플레이 업데이트 (현재 맵 아이템 0으로 초기화 반영)

        const currentMapItems = mapItems[currentMapIndex]; // mapItems로 변수명 변경 반영

        const boardWidth = gameBoard.offsetWidth;
        const boardHeight = gameBoard.offsetHeight;

        const itemSize = 100; // game-item의 width/height와 일치해야 합니다.

        for (let i = 0; i < itemsPerMap; i++) {
            const item = document.createElement('img');
            item.src = currentMapItems[i];
            item.classList.add('game-item'); // CSS 스타일링을 위한 클래스 추가
            item.dataset.found = 'false'; // 찾았는지 여부를 나타내는 데이터 속성

            // 무작위 위치 설정
            const randomX = Math.random() * (boardWidth - itemSize);
            const randomY = Math.random() * (boardHeight - itemSize);

            item.style.position = 'absolute'; // 중요: absolute여야 left/top 적용됨
            item.style.left = `${randomX}px`;
            item.style.top = `${randomY}px`;

            item.addEventListener('click', () => {
                if (item.dataset.found === 'false') {
                    item.dataset.found = 'true';
                    item.style.opacity = '0'; // 아이템을 숨김
                    foundItemsCount++; // 현재 맵에서 찾은 아이템 수 증가
                    totalFoundItems++; // 전체 게임에서 찾은 아이템 수 증가 (핵심!)

                    updateFoundItemsDisplay(); // 찾은 아이템 개수 디스플레이 업데이트

                    console.log(`현재 맵 찾은 아이템: ${foundItemsCount}/${itemsPerMap}`);
                    console.log(`전체 찾은 아이템: ${totalFoundItems}/${mapItems.length * itemsPerMap}`);

                    if (foundItemsCount === itemsPerMap) { // 현재 맵의 모든 아이템을 찾았을 때
                        setTimeout(() => { // 잠시 텀을 두고 다음 맵으로 전환
                            currentMapIndex++;
                            if (currentMapIndex < mapBackgrounds.length) {
                                // 다음 맵으로 이동
                                console.log(`다음 맵으로 이동: 맵 ${currentMapIndex + 1}`);
                                initializeGameBoard(); // 다음 맵 로드
                            } else {
                                // 모든 맵 클리어! 게임 종료 처리
                                console.log('모든 맵 클리어! 게임 종료.');
                                // 모든 맵 클리어 시 게임 종료 처리
                                endGameProcess();
                            }
                        }, 500); // 0.5초 대기
                    }
                }
            });
            gameBoard.appendChild(item);
        }
    }

    // --- 게임 종료 시 호출될 중앙 처리 함수 ---
    function endGameProcess() {
        stopTimer(); // 타이머 중지
        displayRandomCardAtGameEnd(); // 랜덤 카드 표시 함수 호출
        showScreen(resultScreen); // 결과 화면으로 전환
        // 여기서는 resetGame()을 호출하지 않습니다. 사용자가 '다시 시작하기' 버튼을 누를 때까지 결과 화면에 머무릅니다.
    }


    // --- 랜덤 카드 표시 함수 ---
    /**
     * 게임 종료 시 4개의 카드 중 하나를 무작위로 표시하고 해당 이미지를 로드하는 함수.
     * 이 함수는 게임 로직의 '게임 종료' 시점에 호출됩니다.
     */
    function displayRandomCardAtGameEnd() {
        const cards = [
            document.getElementById('card1'),
            document.getElementById('card2'),
            document.getElementById('card3'),
            document.getElementById('card4')
        ];

        const cardImages = [ // 랜덤으로 표시할 이미지 경로
            './images/card1.png',
            './images/card2.png',
            './images/card3.png',
            './images/card4.png'
        ];

        // 1. 모든 카드를 숨기고, 모든 카드 내부의 이미지도 숨깁니다.
        cards.forEach(card => {
            if (card) {
                card.style.display = 'none';
                const img = card.querySelector('.card-image');
                if (img) {
                    img.src = ''; // 이미지 소스 초기화
                    img.style.display = 'none'; // 이미지 자체를 숨김
                }
            }
        });

        // 2. 0부터 3까지의 무작위 정수 인덱스를 생성합니다.
        const randomIndex = Math.floor(Math.random() * cards.length);

        // 3. 무작위로 선택된 카드를 표시하고, 해당 이미지를 로드합니다.
        const selectedCard = cards[randomIndex];
        const selectedImageSrc = cardImages[randomIndex]; // 선택된 카드에 해당하는 이미지 경로

        if (selectedCard) {
            selectedCard.style.display = 'flex'; // 카드를 보이게 함 (CSS에서 flex로 설정했으므로)
            
            const imgElement = selectedCard.querySelector('.card-image');
            if (imgElement) {
                imgElement.src = selectedImageSrc; // 이미지 src 설정
                imgElement.style.display = 'block'; // 이미지를 보이게 함
            }
        }

        console.log(`무작위로 선택된 카드: ${selectedCard ? selectedCard.id : '없음'}`);
        console.log(`표시될 이미지: ${selectedImageSrc}`);
    }

    // --- 찾은 아이템 개수를 화면에 업데이트하는 함수 ---
    function updateFoundItemsDisplay() {
        foundItemsDisplay.textContent = `찾은 개수: ${totalFoundItems}`;
    }


    // --- 이벤트 리스너 ---

    startButton.addEventListener('click', () => {
        playerNickname = nicknameInput.value.trim();

        if (playerNickname.length >= 1 && playerNickname.length <= 4) {
            console.log("플레이어 닉네임:", playerNickname);
            
            displayedNickname.textContent = `${playerNickname}`; 
            
            showScreen(descriptionScreen); // 닉네임 화면 -> 설명 화면
        } else {
            alert('닉네임은 1글자 이상 4글자 이하로 입력해주세요.');
            nicknameInput.focus();
        }
    });

    startGameButton.addEventListener('click', () => {
        showScreen(gamePlayScreen); // 설명 화면 -> 게임 플레이 화면
        console.log("게임 시작 버튼 클릭! 게임 플레이 화면으로 전환.");
        
        resetGame(); // 새로운 게임 시작 전에 게임 상태 초기화
        initializeGameBoard(); // 첫 맵 로드 및 아이템 배치
        startTimer(); // 게임 시작과 함께 타이머 시작!
        updateFoundItemsDisplay(); // 게임 시작 시 찾은 아이템 개수 초기화 및 표시
    });

    // 추가: 닉네임 입력 필드에서 Enter 키 눌렀을 때도 다음 화면으로 이동
    nicknameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            startButton.click();
        }
    });

    // 새로 추가: 재시작 버튼 클릭 시 게임 초기화 및 닉네임 화면으로 이동
    restartButton.addEventListener('click', () => {
        console.log("다시 시작하기 버튼 클릭!");
        resetGameAndReturnToNickname();
    });

    // 초기 로드 시 화면 설정
    showScreen(nicknameScreen); // 초기 화면은 닉네임 입력 화면
    updateFoundItemsDisplay(); // 페이지 로드 시 초기값 표시 (0)
});