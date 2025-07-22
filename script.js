document.addEventListener('DOMContentLoaded', () => {
    const nicknameScreen = document.getElementById('nicknameScreen');
    const descriptionScreen = document.getElementById('descriptionScreen');
    const nicknameInput = document.getElementById('nicknameInput');
    const startButton = document.getElementById('startButton');
    const startGameButton = document.getElementById('startGameButton'); // 게임 설명 화면의 게임 시작 버튼

    let playerNickname = ''; // 플레이어 닉네임을 저장할 변수

    // 닉네임 입력 화면 -> 게임 설명 화면
    startButton.addEventListener('click', () => {
        playerNickname = nicknameInput.value.trim(); // 닉네임 앞뒤 공백 제거

        if (playerNickname.length >= 1 && playerNickname.length <= 4) {
            console.log("플레이어 닉네임:", playerNickname);
            
            nicknameScreen.classList.remove('active');
            descriptionScreen.classList.add('active');

        } else {
            alert('닉네임은 1글자 이상 4글자 이하로 입력해주세요.');
            nicknameInput.focus(); // 다시 입력 필드로 포커스 이동
        }
    });

    // 게임 설명 화면 -> 게임 플레이 화면 (나중에 구현)
    startGameButton.addEventListener('click', () => {
        descriptionScreen.classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        console.log("게임 시작 버튼 클릭! 게임 플레이 화면으로 전환 (현재는 임시)");
        // 여기에 게임 시작 로직 추가 (타이머 시작, 숨은 그림 배치 등)
    });

    // 추가: 닉네임 입력 필드에서 Enter 키 눌렀을 때도 다음 화면으로 이동
    nicknameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            startButton.click(); // 버튼 클릭 이벤트 트리거
        }
    });
});