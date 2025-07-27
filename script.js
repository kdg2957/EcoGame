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
    const rankingList = document.getElementById('rankingList'); // 랭킹 목록을 표시할 DOM 요소 추가
    const returnToNicknameButton = document.getElementById('returnToNicknameButton'); // 처음으로 버튼 추가
    
    const timerDisplay = document.getElementById('timerDisplay'); // 타이머 DOM 요소
    // --- 새로 추가된 DOM 요소 변수 ---
    const foundItemsDisplay = document.getElementById('foundItemsDisplay'); // 찾은 아이템 개수 DOM 요소 추가
    const viewRankingButton = document.getElementById('viewRankingButton'); // 랭킹 보기 버튼 변수 추가

    


    let currentMapIndex = 0; // 현재 맵 인덱스 (0: 정글, 1: 바다, 2: 도시)
    let foundItemsCount = 0; // 현재 맵에서 찾은 아이템 개수 (맵 전환 시 초기화)
    let totalFoundItems = 0; // 전체 게임에서 찾은 총 아이템 개수 (게임 전체에서 유지)
    const itemsPerMap = 10; // 맵 당 숨은 아이템 개수

    const totalGameTime = 20; // 전체 게임 시간 (초)
    let timeLeft = totalGameTime; // 남은 시간
    let gamePlayTime = 0; // 새로 추가: 게임 플레이 시간 (초 단위)
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
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timeLeft = totalGameTime; // 타이머 초기화 (게임 시작 시)
        gamePlayTime = 0; // 플레이 시간 초기화 (게임 시작 시)
        timerDisplay.textContent = timeLeft; // 초기 시간 표시

        timerInterval = setInterval(() => {
            timeLeft--;
            gamePlayTime++; // 매 초 플레이 시간 증가
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "0";
                gamePlayTime = totalGameTime; // 시간 초과 시 플레이 시간은 총 게임 시간과 같음
                endGameProcess();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // 게임 종료 후 닉네임 화면으로 돌아가는 함수 (더 이상 restartButton과 직접 연결되지 않음)
    // 이 함수는 '랭킹 화면' 등에서 게임 재시작 버튼에 연결될 수 있습니다.
    function resetGameAndReturnToNickname() {
        stopTimer(); // 타이머 중지
        resetGame(); // 게임 상태 초기화
        showScreen(nicknameScreen); // 닉네임 화면으로 전환
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
        // 플레이어가 모든 아이템을 다 찾아서 게임이 종료된 경우
        if (totalFoundItems === mapItems.length * itemsPerMap) {
             // gamePlayTime은 이미 startTimer에서 매초 증가하고 있으므로, 이 시점에서 최종 play time이 됩니다.
             // 만약 모든 아이템을 시간 만료 전에 찾았다면 timeLeft는 0보다 클 것이고, gamePlayTime은 totalGameTime - timeLeft가 되어야 함.
             gamePlayTime = totalGameTime - timeLeft; // 남은 시간을 제외한 실제 플레이 시간
        } else {
             // 시간 만료로 게임 종료된 경우, gamePlayTime은 이미 totalGameTime (20초)와 같거나 그 근접한 값.
             // gamePlayTime은 이미 startTimer에서 매초 증가하고 있으므로, 이 시점에서 최종 play time이 됩니다.
             // 이 로직은 조금 더 단순화할 수 있습니다. startTimer에서 gamePlayTime++을 하고, timeLeft가 0이 되면 gamePlayTime을 totalGameTime으로 고정하는 방식이 더 정확합니다.
             // 현재 로직에서는 timeLeft가 0 이하로 내려갈 때 gamePlayTime = totalGameTime; 이 이미 포함되어 있습니다.
        }
       
        displayRandomCardAtGameEnd(); // 랜덤 카드 표시 함수 호출
        showScreen(resultScreen); // 결과 화면으로 전환
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

    // --- 랭킹 표시 함수 (임시 데이터로 구현) ---
    function displayRankings() {
        console.log("랭킹 표시 기능이 여기에 구현될 예정입니다.");
        rankingList.innerHTML = ''; // 기존 랭킹 목록 초기화

        // 현재 플레이어의 점수를 포함한 임시 랭킹 데이터 (나중에 서버에서 가져올 것)
        // 실제 점수 계산: 찾은 아이템이 많을수록 좋고, 플레이 시간이 짧을수록 좋습니다.
        // 예를 들어, 점수 = (totalFoundItems * 1000) + (totalGameTime - gamePlayTime)
        // 또는 단순히 찾은 개수와 시간으로 보여줍니다.
        const currentPlayerScore = {
            nickname: playerNickname,
            score: totalFoundItems,
            time: gamePlayTime // 총 플레이 시간
        };

        // 임시 랭킹 데이터 (이 부분은 나중에 서버에서 받아온 데이터로 대체됩니다)
        let rankings = [
            { nickname: '강한친구', score: 28, time: 18 },
            { nickname: '빠른별', score: 25, time: 15 },
            { nickname: '코딩마스터', score: 29, time: 19 },
            { nickname: '초보게이머', score: 10, time: 20 }
        ];

        // 현재 플레이어의 점수 추가 (랭킹 계산을 위해)
        if (currentPlayerScore.nickname) { // 닉네임이 있는 경우만 추가
            rankings.push(currentPlayerScore);
        }

        // 랭킹 정렬: 찾은 아이템 개수가 많을수록 우선, 개수가 같으면 플레이 시간이 짧을수록 우선
        rankings.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score; // 점수(찾은 개수) 내림차순
            }
            return a.time - b.time; // 점수 같으면 시간 오름차순 (짧을수록 좋음)
        });

        // 랭킹 목록 생성 (상위 10개만 표시)
        for (let i = 0; i < Math.min(rankings.length, 10); i++) {
            const ranking = rankings[i];
            const rankingItem = document.createElement('div');
            rankingItem.classList.add('ranking-item');

            let rankDisplay = `${i + 1}`;
            // 고객님의 이미지에 1, 2, 3위는 메달 아이콘이 있으므로, 실제 텍스트 등수는 4위부터 시작할 수 있도록 조정
            // HTML/CSS에서 메달 이미지를 고정하고, 4위부터 텍스트를 채워넣는 식으로 구현할 수 있습니다.
            // 여기서는 단순화하여 1위부터 텍스트 등수를 표시합니다. (이미지 위에 텍스트를 배치)

            rankingItem.innerHTML = `
                <span class="rank">${rankDisplay}</span>
                <span class="nickname">${ranking.nickname}</span>
                <span class="score">${ranking.score}개 (${ranking.time}초)</span>
            `;
            rankingList.appendChild(rankingItem);
        }

        console.log(`최종 점수: ${totalFoundItems}개, 플레이 시간: ${gamePlayTime}초`);
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

    viewRankingButton.addEventListener('click', () => {
        console.log("랭킹 보기 버튼 클릭!");
        showScreen(rankingScreen); // 랭킹 화면으로 전환
        displayRankings(); // 랭킹을 표시하는 함수 호출 (이때 현재 플레이어의 점수도 포함)
    });

    // 새로 추가: '처음으로' 버튼 클릭 시 닉네임 화면으로 돌아가기
    returnToNicknameButton.addEventListener('click', () => {
        console.log("처음으로 버튼 클릭!");
        resetGameAndReturnToNickname(); // 게임 초기화 및 닉네임 화면으로 이동
    });


    // 초기 로드 시 화면 설정
    showScreen(nicknameScreen); // 초기 화면은 닉네임 입력 화면
    updateFoundItemsDisplay(); // 페이지 로드 시 초기값 표시 (0)
});

