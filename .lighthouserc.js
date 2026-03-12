module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start", // 서버 실행 명령어
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/products"
      ], // 측정할 주소
      startServerReadyPattern: "ready on", // 메시지가 뜰 때까지 기다림
      numberOfRuns: 1,                     // 테스트니까 일단 1번만
    },
    upload: {
      target: "temporary-public-storage", // 측정 결과를 임시 공개 URL에 업로드 (리포트 확인용)
    },
    assert: {
      assertions: {
        // 성능 지표가 기준 미달이면 CI 실패 처리
        "categories:performance": ["warn", { minScore: 0.8 }], // 80점 미만이면 경고
        "categories:accessibility": ["error", { minScore: 0.9 }], // 웹 접근성 90점 미만이면 에러
      },
    },
  },
};