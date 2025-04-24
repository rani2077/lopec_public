/**
 * lopec-ocr.js
 * 이미지 OCR을 통한 로스트아크 캐릭터 닉네임 추출 모듈
 * 
 * 기능:
 * - 클립보드 이미지를 OCR 처리하여 캐릭터 닉네임만을 추출
 * - 신청자 목록과 참가자 목록 두 가지 형식 지원
 * - OpenCV 템플릿 매칭을 통한 이미지 유효성 검사
 * 
 * 주의: 이 모듈은 닉네임 추출만 담당하며 DB 연동 기능은 제공하지 않습니다.
 */

// lostark-ocr.js
// ESM 스타일 import 구문 제거

// IIFE 대신 변수에 할당
const LopecOCR = (function () {
    // ===========================================================================================
    // 설정 및 상수 정의
    // ===========================================================================================

    // 마지막 처리된 크롭 이미지 해시 저장 변수
    let lastProcessedCroppedImageHash = null;

    // OCR 버전 상수 정의
    const OCR_VERSIONS = {
        APPLICANT: 'applicant',    // 신청자 목록 (기존 version1)
        PARTICIPANT: 'participant' // 참가자 목록 (새로운 version2)
    };

    // OpenCV 관련 설정
    const OPENCV_URL = 'https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js'; // OpenCV.js CDN 주소 변경
    let isOpenCVLoaded = false; // OpenCV 로드 상태
    let templateMatchingThreshold = 0.7; // 템플릿 매칭 임계값 (0.0 ~ 1.0)
    let templateImages = []; // 템플릿 이미지 배열

    // ===========================================================================================
    // 크롭 오프셋 상수 정의 (해상도 및 역할별 세분화)
    // ===========================================================================================

    // --- FHD (1920x1080, WFHD 2560x1080 등 높이 1080 기준) ---
    const FHD_LEADER_CROP_OFFSETS = { // 기존 UNIFIED_CROP_OFFSETS 역할
        top: -565,
        right: 400,
        bottom: -250,
        left: 0
    };

    const FHD_MEMBER_CROP_OFFSETS = { // 기존 PARTY_MEMBER_CROP_OFFSETS 역할 (현재 값 유지)
        top: FHD_LEADER_CROP_OFFSETS.top ,    
        right: FHD_LEADER_CROP_OFFSETS.right - 150,  
        bottom: FHD_LEADER_CROP_OFFSETS.bottom, 
        left: FHD_LEADER_CROP_OFFSETS.left - 184  
    };


    // --- QHD (2560x1440, WQHD 3440x1440 등 높이 1440 기준) ---
    const QHD_LEADER_CROP_OFFSETS = {
        top: FHD_LEADER_CROP_OFFSETS.top - 190,    // -755
        right: FHD_LEADER_CROP_OFFSETS.right + 120,   // 345
        bottom: FHD_LEADER_CROP_OFFSETS.bottom - 90, // -345
        left: FHD_LEADER_CROP_OFFSETS.left -12.5// -250
    };

    const QHD_MEMBER_CROP_OFFSETS = {
        top: FHD_LEADER_CROP_OFFSETS.top - 190,      // 임시
        right: FHD_MEMBER_CROP_OFFSETS.right + 90,    // 임시
        bottom: FHD_LEADER_CROP_OFFSETS.bottom - 90,  // 임시
        left: FHD_MEMBER_CROP_OFFSETS.left - 75       // 임시
    };


    // --- UHD (3840x2160 등 높이 2160 기준) ---
    const UHD_LEADER_CROP_OFFSETS = {
        top: FHD_LEADER_CROP_OFFSETS.top * 2,        // 임시: 높이 비율(2160/1080) 곱하기
        right: FHD_LEADER_CROP_OFFSETS.right + 400,      // 임시
        bottom: FHD_LEADER_CROP_OFFSETS.bottom * 2,    // 임시
        left: FHD_LEADER_CROP_OFFSETS.left - 20         // 임시
    };

    const UHD_MEMBER_CROP_OFFSETS = {
        top: FHD_MEMBER_CROP_OFFSETS.top * 2,         // 임시
        right: FHD_MEMBER_CROP_OFFSETS.right + 200,       // 임시
        bottom: FHD_MEMBER_CROP_OFFSETS.bottom * 2,     // 임시
        left: FHD_MEMBER_CROP_OFFSETS.left - 205      // 임시
    };

    // ===========================================================================================

    // 기본 템플릿 이미지 경로 및 정보 (HTML 파일 기준 상대 경로)
    const DEFAULT_TEMPLATES = [
        { path: '/asset/templates/Img_65.bmp', name: '공통_기준템플릿', threshold: 0.7 }, // FHD 기준
        { path: '/asset/templates/effective_qhd.png', name: 'QHD_기준템플릿', threshold: 0.7 }, // QHD 기준 추가
        { path: '/asset/templates/effective_uhd.png', name: 'UHD_기준템플릿', threshold: 0.7 }, // UHD 기준 추가
        // 첫 번째 템플릿은 유효성 검사 및 크롭 기준점으로 사용
        { path: '/asset/templates/invite.png', name: '파티장_초대템플릿', threshold: 0.7 }, // 파티장 식별용 템플릿 추가
        { path: '/asset/templates/invite_qhd.png', name: 'QHD_파티장_초대템플릿', threshold: 0.7 }, // QHD 파티장 식별용
        { path: '/asset/templates/invite_uhd.png', name: 'UHD_파티장_초대템플릿', threshold: 0.7 } // UHD 파티장 식별용
    ];

    // ===========================================================================================
    // 유틸리티 함수 (해시 계산 등)
    // ===========================================================================================
    /**
     * ArrayBuffer 데이터로부터 SHA-256 해시 값을 계산하는 비동기 함수
     * @param {ArrayBuffer} buffer - 해시할 데이터 버퍼
     * @returns {Promise<string>} 계산된 해시의 16진수 문자열
     */
    async function calculateImageHash(buffer) {
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            // ArrayBuffer를 16진수 문자열로 변환
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error("이미지 해시 계산 중 오류:", error);
            // 해시 계산 실패 시 고유성을 보장하기 위해 현재 시간을 사용 (중복 방지 목적)
            return `hash_error_${Date.now()}`;
        }
    }

    // ===========================================================================================
    // OpenCV 관련 함수
    // ===========================================================================================

    /**
     * OpenCV.js 라이브러리를 동적으로 로드하는 함수
     * @returns {Promise} OpenCV 로드 완료 Promise
     */
    function loadOpenCV() {
        return new Promise((resolve, reject) => {
            // 이미 로드된 경우 바로 완료
            if (isOpenCVLoaded && window.cv) {
                console.log("OpenCV.js 이미 로드됨");
                resolve();
                return;
            }

            // 이미 스크립트가 추가된 경우 대기
            const existingScript = document.getElementById('opencvjs');
            if (existingScript) {
                console.log("OpenCV.js 로드 중...");
                const checkInterval = setInterval(() => {
                    if (isOpenCVLoaded && window.cv) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                return;
            }

            // 스크립트 태그 생성 및 추가
            const script = document.createElement('script');
            script.id = 'opencvjs';
            script.setAttribute('async', '');
            script.setAttribute('type', 'text/javascript');
            script.addEventListener('load', () => {
                console.log("OpenCV.js 스크립트 로드됨, 초기화 대기 중...");
            });
            script.addEventListener('error', (e) => {
                console.error("OpenCV.js 로드 실패", e);
                reject(new Error("OpenCV.js 로드 실패"));
            });
            script.src = OPENCV_URL;
            document.body.appendChild(script);

            // OpenCV 초기화 완료 콜백 설정
            // OpenCV.js는 window.onOpenCVReady가 아닌 cv.onRuntimeInitialized를 사용함
            window.Module = {
                onRuntimeInitialized: function () {
                    console.log("OpenCV.js 초기화 완료");
                    isOpenCVLoaded = true;
                    resolve();
                }
            };

            // 5초 타임아웃 설정
            setTimeout(() => {
                if (!isOpenCVLoaded) {
                    console.error("OpenCV.js 로드 타임아웃");
                    reject(new Error("OpenCV.js 로드 타임아웃 (5초)"));
                }
            }, 5000);
        });
    }

    /**
     * 템플릿 이미지를 추가하는 함수
     * @param {string|File|Blob} templateSource - 템플릿 이미지 소스 (URL 또는 File/Blob 객체)
     * @param {string} name - 템플릿 이름
     * @param {number} threshold - 이 템플릿의 매칭 임계값 (기본값 사용시 null)
     * @returns {Promise} 템플릿 추가 완료 Promise
     */
    async function addTemplateImage(templateSource, name, threshold = null) {
        // OpenCV 로드 확인
        if (!isOpenCVLoaded) {
            await loadOpenCV();
        }

        return new Promise((resolve, reject) => {
            try {
                // 이미지 소스 처리
                let imgUrl;
                if (typeof templateSource === 'string') {
                    // URL 문자열인 경우
                    imgUrl = templateSource;
                } else if (templateSource instanceof Blob || templateSource instanceof File) {
                    // Blob/File 객체인 경우 URL 생성
                    imgUrl = URL.createObjectURL(templateSource);
                } else {
                    reject(new Error("지원되지 않는 템플릿 소스 형식"));
                    return;
                }

                // 이미지 로드 및 템플릿 배열에 추가
                const img = new Image();
                img.onload = () => {
                    // Canvas에 이미지 그리기
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // OpenCV Mat 객체 생성
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const templateMat = cv.matFromImageData(imageData);

                    // 템플릿 정보 저장
                    templateImages.push({
                        name: name,
                        mat: templateMat,
                        width: img.width,
                        height: img.height,
                        threshold: threshold || templateMatchingThreshold
                    });

                    //console.log(`템플릿 이미지 추가됨: ${name} (${img.width}x${img.height})`);

                    // Blob URL 정리
                    if (templateSource instanceof Blob || templateSource instanceof File) {
                        URL.revokeObjectURL(imgUrl);
                    }

                    resolve();
                };

                img.onerror = (e) => {
                    console.error(`템플릿 이미지 로드 실패: ${name}`, e);
                    reject(new Error(`템플릿 이미지 로드 실패: ${name}`));

                    // Blob URL 정리
                    if (templateSource instanceof Blob || templateSource instanceof File) {
                        URL.revokeObjectURL(imgUrl);
                    }
                };

                img.src = imgUrl;
            } catch (error) {
                console.error("템플릿 이미지 추가 중 오류:", error);
                reject(error);
            }
        });
    }

    /**
     * 주어진 이미지에서 템플릿 매칭을 수행하는 함수
     * @param {ImageData|HTMLImageElement|HTMLCanvasElement} sourceImage - 검색할 소스 이미지
     * @param {boolean} [earlyReturn=false] - 유효한 매치가 발견되면 즉시 반환할지 여부 (유효성 검사에만 사용, 버전 감지에는 사용하지 않음)
     * @returns {Promise<Object>} 매칭 결과 (성공 여부, 매칭된 템플릿 정보)
     */
    async function matchTemplate(sourceImage, earlyReturn = false) {
        console.warn(sourceImage)
        // OpenCV 로드 확인
        if (!isOpenCVLoaded) {
            await loadOpenCV();
        }

        // 템플릿 이미지가 없는 경우
        if (templateImages.length === 0) {
            console.warn("등록된 템플릿 이미지가 없습니다");
            return { isValid: false, matches: [] };
        }

        try {
            console.time('🔍 matchTemplate - 전체');

            // 소스 이미지를 OpenCV Mat으로 변환
            console.time('🔍 matchTemplate - 이미지 변환');
            let sourceMat;
            if (sourceImage instanceof HTMLImageElement) {
                // HTML 이미지 요소인 경우
                const canvas = document.createElement('canvas');
                canvas.width = sourceImage.width;
                canvas.height = sourceImage.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(sourceImage, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                sourceMat = cv.matFromImageData(imageData);
            } else if (sourceImage instanceof HTMLCanvasElement) {
                // Canvas 요소인 경우
                const ctx = sourceImage.getContext('2d');
                const imageData = ctx.getImageData(0, 0, sourceImage.width, sourceImage.height);
                sourceMat = cv.matFromImageData(imageData);
            } else if (sourceImage instanceof ImageData) {
                // ImageData 객체인 경우
                sourceMat = cv.matFromImageData(sourceImage);
            } else {
                throw new Error("지원되지 않는 이미지 형식");
            }
            console.timeEnd('🔍 matchTemplate - 이미지 변환');

            // 그레이스케일 변환
            console.time('🔍 matchTemplate - 그레이스케일 변환');
            const sourceGray = new cv.Mat();
            cv.cvtColor(sourceMat, sourceGray, cv.COLOR_RGBA2GRAY);
            console.timeEnd('🔍 matchTemplate - 그레이스케일 변환');

            const matches = [];
            let isAnyTemplateMatched = false;

            // 각 템플릿 이미지에 대해 매칭 시도
            console.time('🔍 matchTemplate - 매칭 연산');
            for (const template of templateImages) {
                // 템플릿 이미지를 그레이스케일로 변환
                const templateGray = new cv.Mat();
                cv.cvtColor(template.mat, templateGray, cv.COLOR_RGBA2GRAY);

                // 결과 행렬 생성
                const result = new cv.Mat();
                const mask = new cv.Mat(); // 마스크 없음

                // 템플릿 매칭 수행 (정규화된 상관계수 방법) - 그레이스케일 이미지 사용
                cv.matchTemplate(sourceGray, templateGray, result, cv.TM_CCOEFF_NORMED, mask);

                // 최대 매칭 위치 찾기
                const minMax = cv.minMaxLoc(result);
                const maxVal = minMax.maxVal; // 최대 매칭 값 (0.0 ~ 1.0)
                const maxLoc = minMax.maxLoc; // 최대 매칭 위치

                // 매칭 결과 저장
                const isMatched = maxVal >= template.threshold;
                if (isMatched) {
                    isAnyTemplateMatched = true;

                    // 결과 저장
                    matches.push({
                        name: template.name,
                        score: maxVal,
                        location: maxLoc,
                        width: template.width,
                        height: template.height,
                        isMatched: true
                    });

                    // 조기 종료 옵션이 활성화되고 매치가 확인된 경우 즉시 반환
                    if (earlyReturn) {
                        // 먼저 메모리 정리
                        templateGray.delete();
                        result.delete();
                        mask.delete();
                        sourceMat.delete();
                        sourceGray.delete();

                        console.timeEnd('🔍 matchTemplate - 매칭 연산');
                        console.log(`🔍 조기 종료: 유효한 템플릿 매치 발견 (${template.name})`);
                        console.timeEnd('🔍 matchTemplate - 전체');

                        return {
                            isValid: true,
                            matches: matches
                        };
                    }
                } else {
                    // 매치되지 않은 경우에도 결과 저장
                    matches.push({
                        name: template.name,
                        score: maxVal,
                        location: maxLoc,
                        width: template.width,
                        height: template.height,
                        isMatched: false
                    });
                }

                // 메모리 정리
                templateGray.delete();
                result.delete();
                mask.delete();
            }
            console.timeEnd('🔍 matchTemplate - 매칭 연산');

            // 메모리 정리
            console.time('🔍 matchTemplate - 메모리 정리');
            sourceMat.delete();
            sourceGray.delete();
            console.timeEnd('🔍 matchTemplate - 메모리 정리');

            console.timeEnd('🔍 matchTemplate - 전체');
            return {
                isValid: isAnyTemplateMatched,
                matches: matches
            };
        } catch (error) {
            console.error("템플릿 매칭 중 오류:", error);
            throw error;
        }
    }

    /**
     * 이미지가 유효한 로스트아크 스크린샷인지 확인하는 함수
     * @param {Blob|ImageData|HTMLImageElement} imageSource - 검사할 이미지
     * @param {Function} debugCallback - 디버그 콜백 (선택사항)
     * @returns {Promise<boolean>} 이미지 유효성 여부
     */
    async function isValidLostarkImage(imageSource, debugCallback = null) {
        try {
            console.time('✅ isValidLostarkImage - 전체');

            // OpenCV 로드 확인
            if (!isOpenCVLoaded) {
                console.time('✅ isValidLostarkImage - OpenCV 로드');
                await loadOpenCV().catch(e => {
                    if (debugCallback) debugCallback("OpenCV 로드 실패: " + e.message);
                    throw e;
                });
                console.timeEnd('✅ isValidLostarkImage - OpenCV 로드');
            }

            // 디버그 로그 함수
            const logDebug = (message) => {
                console.log(message);
                if (debugCallback && typeof debugCallback === 'function') {
                    debugCallback(message);
                }
            };

            // 이미지 소스 처리 - HTMLImageElement로 변환
            console.time('✅ isValidLostarkImage - 이미지 변환');
            let imgElement;
            if (imageSource instanceof Blob) {
                // Blob인 경우 이미지로 변환
                imgElement = await createImageFromBlob(imageSource);
                logDebug(`Blob 이미지 변환 완료: ${imgElement.width}x${imgElement.height}`);
            } else if (imageSource instanceof ImageData) {
                // ImageData인 경우 캔버스에 그린 후 이미지로 변환
                const canvas = document.createElement('canvas');
                canvas.width = imageSource.width;
                canvas.height = imageSource.height;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(imageSource, 0, 0);

                imgElement = new Image();
                await new Promise(resolve => {
                    imgElement.onload = resolve;
                    imgElement.src = canvas.toDataURL();
                });
                logDebug(`ImageData 변환 완료: ${imgElement.width}x${imgElement.height}`);
            } else if (imageSource instanceof HTMLImageElement) {
                // 이미 이미지 요소인 경우 그대로 사용
                imgElement = imageSource;
                logDebug(`이미지 요소 사용: ${imgElement.width}x${imgElement.height}`);
            } else {
                throw new Error("지원되지 않는 이미지 소스 형식");
            }
            console.timeEnd('✅ isValidLostarkImage - 이미지 변환');

            // 템플릿 매칭 수행 (조기 종료 옵션 활성화)
            console.time('✅ isValidLostarkImage - 템플릿 매칭');
            const matchResult = await matchTemplate(imgElement, true);
            console.timeEnd('✅ isValidLostarkImage - 템플릿 매칭');

            // 매칭 결과 로깅
            if (matchResult.isValid) {
                const matchedTemplates = matchResult.matches
                    .filter(m => m.isMatched)
                    .map(m => `${m.name}(${m.score.toFixed(2)})`);
                logDebug(`유효한 로스트아크 이미지 확인: ${matchedTemplates.join(', ')}`);
            } else {
                const bestMatch = matchResult.matches.reduce((best, current) =>
                    (best.score > current.score) ? best : current, { score: 0 });
                logDebug(`유효하지 않은 이미지: 최고 매칭 ${bestMatch.name}(${bestMatch.score.toFixed(2)})`);
            }

            console.timeEnd('✅ isValidLostarkImage - 전체');
            return matchResult.isValid;
        } catch (error) {
            console.error("이미지 유효성 검사 중 오류:", error);
            if (debugCallback) debugCallback("이미지 유효성 검사 오류: " + error.message);
            return false; // 오류 발생 시 유효하지 않은 것으로 처리
        }
    }

    // ===========================================================================================
    // 이미지 처리 관련 함수
    // ===========================================================================================

    /**
     * 클립보드에서 이미지를 가져오는 함수
     * @returns {Promise<Blob>} 클립보드의 이미지 Blob
     * @throws {Error} 클립보드 접근 관련 오류
     */
    async function getImageFromClipboard() {
        try {
            console.log("클립보드 접근 시도 중...");

            // 클립보드 API 지원 여부 확인
            if (!navigator.clipboard) {
                console.error("navigator.clipboard 객체가 없음 - 브라우저 미지원");
                throw new Error('현재 브라우저에서 클립보드 이미지 접근을 지원하지 않습니다. 크롬이나 엣지 브라우저를 사용해보세요.');
            }

            if (!navigator.clipboard.read) {
                console.error("navigator.clipboard.read 메소드가 없음 - 브라우저 미지원");
                throw new Error('현재 브라우저에서 클립보드 읽기 기능을 지원하지 않습니다. 크롬이나 엣지 브라우저를 사용해보세요.');
            }

            console.log("클립보드 API 지원 확인됨, 읽기 시도...");

            // 클립보드 읽기 시도
            console.time('clipboardRead');
            const items = await navigator.clipboard.read().catch(e => {
                console.error("클립보드 읽기 실패:", e);
                throw e;
            });
            console.timeEnd('clipboardRead');
            console.log("클립보드 항목 수:", items.length);

            for (const item of items) {
                console.log("클립보드 항목 타입:", item.types);
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const imageType = item.types.find(type => type.startsWith('image/'));
                    console.log("이미지 타입 발견:", imageType);

                    try {
                        const blob = await item.getType(imageType);
                        console.log("이미지 블롭 가져옴:", blob.size, "바이트");
                        return blob;
                    } catch (e) {
                        console.error("이미지 블롭 가져오기 실패:", e);
                        throw e;
                    }
                }
            }
            console.error("클립보드에 이미지 없음");
            throw new Error('클립보드에 이미지가 없습니다. Alt+PrtSc로 캡처 후 다시 시도해주세요.');
        } catch (error) {
            console.error("클립보드 접근 오류:", error);

            if (error.name === 'NotAllowedError') {
                throw new Error('클립보드 접근 권한이 없습니다. 사이트 권한 설정을 확인해주세요.');
            } else if (error.name === 'SecurityError') {
                throw new Error('보안 설정으로 인해 클립보드에 접근할 수 없습니다.');
            }
            throw new Error(`클립보드 접근 오류: ${error.message}`);
        }
    }

    /**
     * 템플릿 매칭 결과를 기반으로 관심 영역을 크롭하는 함수
     * @param {HTMLImageElement} sourceImage - 원본 이미지
     * @param {string} templateName - 템플릿 이름 (없으면 가장 높은 매칭 점수의 템플릿 사용)
     * @param {Object} cropOffsets - 템플릿 기준 크롭 오프셋 (템플릿 기준점에서의 상대 위치)
     * @param {number} cropOffsets.top - 상단 오프셋 (음수=위로, 양수=아래로)
     * @param {number} cropOffsets.right - 우측 오프셋 (음수=좌측으로, 양수=우측으로)
     * @param {number} cropOffsets.bottom - 하단 오프셋 (음수=위로, 양수=아래로)
     * @param {number} cropOffsets.left - 좌측 오프셋 (음수=좌측으로, 양수=우측으로)
     * @param {Function} debugCallback - 디버그 콜백
     * @returns {Promise<ImageData>} 크롭된 이미지 데이터
     */
    async function cropRegionAroundTemplate(sourceImage, templateName = null, cropOffsets = { top: 0, right: 0, bottom: 0, left: 0 }, debugCallback = null) {
        try {
            // OpenCV 로드 확인
            if (!isOpenCVLoaded) {
                await loadOpenCV();
            }

            // 디버그 로그 함수
            const logDebug = (message) => {
                console.log(message);
                if (debugCallback && typeof debugCallback === 'function') {
                    debugCallback(message);
                }
            };

            // 템플릿 이미지가 없는 경우
            if (templateImages.length === 0) {
                throw new Error("등록된 템플릿 이미지가 없습니다. 기본 템플릿을 로드하세요.");
            }

            // 템플릿 매칭 실행
            const matchResult = await matchTemplate(sourceImage);
            if (!matchResult.isValid) {
                throw new Error("유효한 템플릿 매치를 찾을 수 없습니다.");
            }

            // 사용할 템플릿 매치 결정
            let bestMatch;
            if (templateName) {
                // 지정된 템플릿 이름으로 찾기
                bestMatch = matchResult.matches.find(match => match.name === templateName && match.isMatched);

                // 지정된 템플릿이 없거나 매치되지 않았을 경우 대체 템플릿 찾기
                if (!bestMatch) {
                    logDebug(`지정된 템플릿 '${templateName}'를 찾을 수 없거나 매치되지 않았습니다. 최고 점수 템플릿을 사용합니다.`);
                    bestMatch = matchResult.matches
                        .filter(match => match.isMatched)
                        .reduce((best, current) => (best.score > current.score ? best : current), { score: 0 });
                }
            } else {
                // 템플릿 이름이 지정되지 않은 경우, 매치된 템플릿 중 가장 높은 점수
                bestMatch = matchResult.matches
                    .filter(match => match.isMatched)
                    .reduce((best, current) => (best.score > current.score ? best : current), { score: 0 });
            }

            if (!bestMatch || bestMatch.score === 0) {
                throw new Error("유효한 템플릿 매치가 없습니다.");
            }

            // 크롭 영역 계산
            const templateX = bestMatch.location.x;
            const templateY = bestMatch.location.y;
            const templateWidth = bestMatch.width;
            const templateHeight = bestMatch.height;

            // 이미지 크기 가져오기
            const imageWidth = sourceImage.width;
            const imageHeight = sourceImage.height;

            // 크롭 영역 계산 (템플릿 위치 + 오프셋)
            const cropX = Math.max(0, templateX + cropOffsets.left);
            const cropY = Math.max(0, templateY + cropOffsets.top);

            // 크롭 영역 오른쪽/아래 경계 계산
            const cropRight = Math.min(imageWidth, templateX + templateWidth + cropOffsets.right);
            const cropBottom = Math.min(imageHeight, templateY + templateHeight + cropOffsets.bottom);

            // 최종 크롭 영역 크기 (안전 장치 추가 - 항상 최소 1픽셀 이상)
            const cropWidth = Math.max(1, cropRight - cropX);
            const cropHeight = Math.max(1, cropBottom - cropY);

            // 영역이 유효한지 확인 (이제 항상 유효하지만 디버깅을 위해 유지)
            if (cropWidth <= 0 || cropHeight <= 0) {
                throw new Error(`유효하지 않은 크롭 영역: 가로=${cropWidth}, 세로=${cropHeight}`);
            }

            // Canvas 생성 및 이미지 크롭
            const canvas = document.createElement('canvas');
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                sourceImage,
                cropX, cropY, cropWidth, cropHeight,  // 소스 이미지 영역
                0, 0, cropWidth, cropHeight           // 캔버스 영역
            );

            // 디버그 정보 로깅
            logDebug(`템플릿 '${bestMatch.name}' 매치 점수: ${bestMatch.score.toFixed(2)}`);
            logDebug(`템플릿 위치: x=${templateX}, y=${templateY}, 크기: ${templateWidth}x${templateHeight}`);
            logDebug(`크롭 오프셋: top=${cropOffsets.top}, right=${cropOffsets.right}, bottom=${cropOffsets.bottom}, left=${cropOffsets.left}`);
            logDebug(`최종 크롭 영역: x=${cropX}, y=${cropY}, 크기: ${cropWidth}x${cropHeight}`);
            logDebug(`원본 이미지 크기: ${imageWidth}x${imageHeight}`);

            // 이미지 데이터 반환
            return ctx.getImageData(0, 0, cropWidth, cropHeight);

        } catch (error) {
            console.error("템플릿 기반 크롭 오류:", error);
            throw new Error(`템플릿 기반 크롭 실패: ${error.message}`);
        }
    }

    /**
     * 이미지를 로스트아크 관심 영역으로 크롭하는 함수 (템플릿 매칭 기반)
     * @param {HTMLImageElement} img - 크롭할 이미지 객체
     * @param {string} version - OCR 처리 버전 (현재는 크롭 오프셋 계산에만 사용될 수 있음)
     * @param {Function} debugCallback - 디버그 콜백
     * @returns {Promise<ImageData>} 크롭된 이미지 데이터
     * @throws {Error} 템플릿 매칭 실패 시 오류 발생
     */
    async function cropLostarkRegionOfInterest(img, version = OCR_VERSIONS.APPLICANT, debugCallback = null) {
        const logDebug = (message) => {
            console.log(message);
            if (debugCallback && typeof debugCallback === 'function') {
                debugCallback(message);
            }
        };

        try {
            // 템플릿 매칭을 위한 템플릿 이미지 확인
            if (templateImages.length === 0) {
                throw new Error("템플릿 매칭을 위한 템플릿 이미지가 없습니다.");
            }

            logDebug("템플릿 매칭을 통한 관심 영역 추출 시도...");

            // 사용할 단일 템플릿 이름
            const templateName = '공통_기준템플릿';

            // 통합 크롭 오프셋 사용
            const cropOffsets = FHD_LEADER_CROP_OFFSETS;

            // 템플릿 기반 크롭 실행 (지정된 단일 템플릿 이름 사용)
            const croppedData = await cropRegionAroundTemplate(img, templateName, cropOffsets, logDebug);
            logDebug(`템플릿 '${templateName}' 기반 크롭 완료`);
            return croppedData;

        } catch (error) {
            console.error("이미지 크롭 중 오류:", error);
            // 오류를 다시 던져 상위에서 처리하도록 함
            throw new Error(`이미지 크롭 실패: ${error.message}`);
        }
    }

    /**
     * Blob를 Base64 문자열로 변환하는 함수
     * @param {Blob} blob - 변환할 이미지 Blob
     * @returns {Promise<string>} Base64 인코딩된 문자열
     */
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * ImageData를 Blob으로 변환하는 함수
     * @param {ImageData} imageData - 변환할 이미지 데이터
     * @returns {Promise<Blob>} 변환된 이미지 Blob
     */
    function imageDataToBlob(imageData) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;

            const ctx = canvas.getContext('2d');
            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('ImageData에서 Blob 변환 실패'));
                }
            }, 'image/png');
        });
    }

    /**
     * Blob에서 이미지 객체를 생성하는 함수
     * @param {Blob} blob - 이미지 Blob
     * @returns {Promise<Image>} 생성된 이미지 객체
     */
    function createImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    /**
     * OCR 결과에서 캐릭터 정보를 추출하는 함수
     * 
     * @param {Object} ocrData - OCR API 결과 데이터
     * @param {string} version - OCR 처리 버전 (APPLICANT 또는 PARTICIPANT)
     * @param {Function|null} debug - 디버그 로그 콜백 함수
     * @returns {Array} 추출된 캐릭터 정보 배열
     */
    function extractCharacterInfo(ocrData, version = OCR_VERSIONS.APPLICANT, resolution = 'FHD_like', debug = null) {
        // 반환할 캐릭터 정보 배열
        const characterResults = [];

        try {
            // OCR 결과 유효성 검사
            if (!ocrData || !ocrData.text) {
                console.error('OCR 결과가 비어있거나 텍스트가 없습니다', ocrData);
                if (debug && typeof debug === 'function') {
                    debug(`OCR 결과가 비어있거나 텍스트가 없습니다`);
                }
                return characterResults;
            }

            // 디버그 로그 함수
            const logDebug = (message) => {
                if (debug && typeof debug === 'function') {
                    debug(message);
                }
            };

            // 참가자 목록 버전일 경우 좌표 기반 닉네임 추출
            if (version === OCR_VERSIONS.PARTICIPANT) {
                logDebug(`==== 해상도(${resolution}) 기반 좌표 설정 ====`);

                // API 응답 전체 로깅 (개발용)
                logDebug(`==== 참가자 목록 OCR API 응답 (개발용) ====`);

                // 좌표 기반 닉네임 추출 시도
                logDebug(`==== 좌표 기반 닉네임 추출 시작 ====`);

                // --- 해상도별 닉네임 좌표 정의 ---
                const FHD_NICKNAME_POSITIONS = [
                    // 왼쪽 열
                    { x: 5, y: 38 },    // 첫번째 닉네임
                    { x: 5, y: 66 },    // 두번째 닉네임
                    { x: 5, y: 99 },    // 세번째 닉네임
                    { x: 5, y: 128 },   // 네번째 닉네임
                    
                    // 오른쪽 열
                    { x: 304, y: 38 },  // 다섯번째 닉네임
                    { x: 304, y: 66 },  // 여섯번째 닉네임
                    { x: 304, y: 99 },  // 일곱번째 닉네임
                    { x: 304, y: 128 }  // 여덟번째 닉네임
                ];

                // !!! QHD 좌표 필요 !!!
                const QHD_NICKNAME_POSITIONS = [
                    // 왼쪽 열
                    { x: 11, y: 54 },    // 첫번째 닉네임
                    { x: 11, y: 94 },    // 두번째 닉네임
                    { x: 11, y: 134 },    // 세번째 닉네임
                    { x: 11, y: 174 },   // 네번째 닉네임
                    
                    // 오른쪽 열
                    { x: 411, y: 54 },  // 다섯번째 닉네임
                    { x: 411, y: 94 },  // 여섯번째 닉네임
                    { x: 411, y: 134 },  // 일곱번째 닉네임
                    { x: 411, y: 174 }  // 여덟번째 닉네임
                ];

                // !!! UHD 좌표 필요 !!!
                const UHD_NICKNAME_POSITIONS = [
                    // 왼쪽 열
                    { x: 20, y: 84 },    // 첫번째 닉네임
                    { x: 20, y: 144 },    // 두번째 닉네임
                    { x: 20, y: 204 },    // 세번째 닉네임
                    { x: 20, y: 264 },   // 네번째 닉네임
                    
                    // 오른쪽 열
                    { x: 621, y: 84 },  // 다섯번째 닉네임
                    { x: 621, y: 144 },  // 여섯번째 닉네임
                    { x: 621, y: 204 },  // 일곱번째 닉네임
                    { x: 621, y: 264 }  // 여덟번째 닉네임
                ];

                // --- 해상도에 따라 사용할 좌표 배열 선택 ---
                let selectedNicknamePositions;
                if (resolution === 'FHD_like' || resolution === 'Unknown') {
                    selectedNicknamePositions = FHD_NICKNAME_POSITIONS;
                    logDebug('FHD 해상도 닉네임 좌표 사용');
                } else if (resolution === 'QHD') {
                    if (QHD_NICKNAME_POSITIONS.length === 0) {
                        logDebug('경고: QHD 닉네임 좌표가 정의되지 않았습니다. 추출을 건너뜁니다.');
                        return []; // 좌표 없으면 빈 배열 반환
                    }
                    selectedNicknamePositions = QHD_NICKNAME_POSITIONS;
                    logDebug('QHD 해상도 닉네임 좌표 사용');
                } else if (resolution === 'UHD') {
                    if (UHD_NICKNAME_POSITIONS.length === 0) {
                        logDebug('경고: UHD 닉네임 좌표가 정의되지 않았습니다. 추출을 건너뜁니다.');
                        return []; // 좌표 없으면 빈 배열 반환
                    }
                    selectedNicknamePositions = UHD_NICKNAME_POSITIONS;
                    logDebug('UHD 해상도 닉네임 좌표 사용');
                } else {
                    logDebug(`처리되지 않은 해상도: ${resolution}. 기본 FHD 좌표 사용.`);
                    selectedNicknamePositions = FHD_NICKNAME_POSITIONS;
                }

                // 미리 계산된 허용 오차 범위로 좌표 맵 생성 (속도 최적화)
                const positionMap = new Map();
                const tolerance = 3;

                // 선택된 좌표 배열 사용
                selectedNicknamePositions.forEach((pos, index) => {
                    for (let x = pos.x - tolerance; x <= pos.x + tolerance; x++) {
                        for (let y = pos.y - tolerance; y <= pos.y + tolerance; y++) {
                            positionMap.set(`${x},${y}`, index);
                        }
                    }
                });

                // 좌상단 좌표가 일치하는지 확인 (맵 사용)
                function isMatchingPosition(x, y) {
                    return positionMap.has(`${x},${y}`);
                }

                // 페이지와 단어 정보가 있는지 확인
                if (ocrData.pages && ocrData.pages.length > 0 && ocrData.pages[0].words) {
                    const words = ocrData.pages[0].words;
                    logDebug(`단어 수: ${words.length}`);

                    // 좌표 기반으로 닉네임 추출
                    const matchedNicknames = words.filter(word => {
                        if (!word.boundingBox || !word.boundingBox.vertices || word.boundingBox.vertices.length < 1) {
                            return false;
                        }

                        // 좌상단 좌표 추출
                        const x = word.boundingBox.vertices[0].x;
                        const y = word.boundingBox.vertices[0].y;

                        // 좌표가 닉네임 위치와 일치하는지 확인
                        const isMatched = isMatchingPosition(x, y);

                        if (isMatched) {
                            logDebug(`닉네임 찾음: '${word.text}', 좌표: (${x}, ${y}), 신뢰도: ${word.confidence || '알 수 없음'}`);
                        }

                        return isMatched;
                    }).map(word => ({
                        nickname: word.text,
                        confidence: word.confidence || 1.0,
                        x: word.boundingBox.vertices[0].x,
                        y: word.boundingBox.vertices[0].y
                    }));

                    // 결과 저장
                    characterResults.push(...matchedNicknames);

                    logDebug(`좌표 기반 추출 결과: ${matchedNicknames.length}개 닉네임 추출됨`);
                } else {
                    logDebug(`페이지 또는 단어 정보가 없습니다. 좌표 기반 추출 불가.`);
                }

                // 결과 요약
                logDebug(`==== 닉네임 추출 완료 ====`);
                if (characterResults.length > 0) {
                    logDebug(`${characterResults.length}개 닉네임 추출 완료`);
                    characterResults.forEach((char, index) => {
                        logDebug(`${index + 1}. ${char.nickname} (좌표: ${char.x}, ${char.y})`);
                    });
                } else {
                    logDebug(`닉네임이 추출되지 않았습니다. OCR 결과나 좌표 설정을 확인하세요.`);
                }

                return characterResults;
            }

            // 로스트아크 서버 목록 (정확한 문자열 매칭용)
            const serverNames = [
                "루페온", "카제로스", "아브렐슈드", "카단", "니나브", "실리안", "카마인", "아만"
            ];

            // OCR 텍스트 가져오기
            const allText = ocrData.text;

            // 추출 시작
            logDebug(`==== 캐릭터 닉네임 추출 시작 ====`);
            logDebug(`텍스트 길이: ${allText.length}자`);

            // 줄바꿈으로 텍스트 분할
            const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            logDebug(`줄 수: ${lines.length}`);

            // 각 줄에 대해 처리
            for (let i = 0; i < lines.length; i++) {
                const currentLine = lines[i];

                // 아이템 레벨 형식 검사 (예: 1585,00)
                const itemLevelPattern = /^\d{4},\d{2}$/;
                const isItemLevel = itemLevelPattern.test(currentLine);
                let itemLevel = "";

                if (isItemLevel) {
                    // 아이템 레벨 형식 변환 (1585,00 → 1585.00)
                    itemLevel = currentLine.replace(',', '.');
                    logDebug(`아이템 레벨 발견: ${itemLevel}`);
                }

                // 서버명과 정확히 일치하는지 확인
                if (serverNames.includes(currentLine)) {
                    // 다음 줄이 존재하는지 확인
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1];

                        // 다음 줄이 서버명이 아닌지 확인 (서버명만 단독으로는 닉네임 불가)
                        if (!serverNames.includes(nextLine) && !itemLevelPattern.test(nextLine)) {
                            // 닉네임으로 추가
                            const newCharacter = {
                                nickname: nextLine,
                                server: currentLine
                            };

                            // 이전 줄이 아이템 레벨인지 확인
                            if (i > 0 && itemLevelPattern.test(lines[i - 1])) {
                                newCharacter.itemLevel = lines[i - 1].replace(',', '.');
                            }

                            characterResults.push(newCharacter);
                            logDebug(`서버: ${currentLine}, 닉네임: ${nextLine}${newCharacter.itemLevel ? ', 아이템 레벨: ' + newCharacter.itemLevel : ''} 추출됨`);
                        }
                    }
                }
            }

            // 추출 결과 요약
            logDebug(`==== 캐릭터 닉네임 추출 완료 ====`);
            logDebug(`추출된 캐릭터 수: ${characterResults.length}`);

            return characterResults;
        } catch (error) {
            console.error('캐릭터 정보 추출 중 오류:', error);
            if (debug && typeof debug === 'function') {
                debug(`캐릭터 정보 추출 중 오류: ${error.message}`);
                debug(`오류 상세: ${error.stack}`);
            }
            return [];
        }
    }

    /**
     * 기본 템플릿 이미지를 로드하는 함수
     * @returns {Promise<number>} 로드된 템플릿 수
     */
    async function loadDefaultTemplates() {
        try {
            // OpenCV 먼저 로드
            if (!isOpenCVLoaded) {
                await loadOpenCV();
            }

            //console.log(`기본 템플릿 이미지 로드 시작...`);
            let loadedCount = 0;

            // 모든 기본 템플릿 로드
            for (const template of DEFAULT_TEMPLATES) {
                try {
                    await addTemplateImage(template.path, template.name, template.threshold);
                    loadedCount++;
                    //console.log(`템플릿 로드됨: ${template.name} (${template.path})`);
                } catch (error) {
                    console.warn(`템플릿 로드 실패: ${template.name} (${template.path})`, error);
                }
            }

            //console.log(`기본 템플릿 이미지 ${loadedCount}개 로드 완료`);
            return loadedCount;
        } catch (error) {
            console.error("기본 템플릿 로드 중 오류:", error);
            throw error;
        }
    }

    /**
     * 모든 템플릿 이미지를 제거하는 함수
     */
    function clearAllTemplates() {
        // OpenCV Mat 객체 메모리 해제
        for (const template of templateImages) {
            if (template.mat && typeof template.mat.delete === 'function') {
                template.mat.delete();
            }
        }
        // 배열 비우기
        templateImages = [];
        console.log("모든 템플릿 이미지가 제거되었습니다");
    }

    /**
     * 현재 등록된 템플릿 정보를 조회하는 함수
     * @returns {Array<Object>} 템플릿 정보 배열 (이름, 크기, 임계값)
     */
    function getRegisteredTemplates() {
        return templateImages.map(template => ({
            name: template.name,
            width: template.width,
            height: template.height,
            threshold: template.threshold
        }));
    }

    /**
     * 메인 OCR 처리 함수 - 클립보드 이미지를 OCR 처리하고 캐릭터 정보 추출
     * 
     * @param {string} version - OCR 처리 버전 ('auto'인 경우 자동 감지)
     * @param {Object} callbacks - 콜백 함수 모음
     * @param {Function} callbacks.onStatusUpdate - 상태 업데이트 콜백
     * @param {Function} callbacks.onDebugInfo - 디버그 정보 콜백
     * @param {Function} callbacks.onImageCropped - 이미지 크롭 완료 콜백
     * @param {Function} callbacks.onError - 에러 콜백
     * @param {boolean} skipValidation - 이미지 유효성 검사 건너뛰기 (기본값: false)
     * @returns {Promise<Array<string>>} 추출된 닉네임 문자열 배열
     */
    async function processClipboardImage(version = 'auto', callbacks = {}, skipValidation = false) {
        const { onStatusUpdate, onDebugInfo, onImageCropped, onError, onRawResponse } = callbacks; // onRawResponse 추가

        // 상태 업데이트 및 디버그 함수 초기화
        const updateStatus = (message) => { if (onStatusUpdate && typeof onStatusUpdate === 'function') { onStatusUpdate(message); } };
        const addDebug = (message) => { if (onDebugInfo && typeof onDebugInfo === 'function') { onDebugInfo(message); } };
        const handleError = (error) => { if (onError && typeof onError === 'function') { onError(error); } };

        // 성능 측정 타이머
        const timers = {};
        const startTimer = (name) => {
            timers[name] = performance.now();
            console.time(`⏱️ ${name}`);
            addDebug(`⏱️ ${name} 시작`);
        };

        const endTimer = (name) => {
            const duration = performance.now() - timers[name];
            console.timeEnd(`⏱️ ${name}`);
            addDebug(`⏱️ ${name} 완료: ${duration.toFixed(2)}ms`);
            return duration;
        };

        // 전체 프로세스 시간 측정 시작
        startTimer('전체 프로세스');

        try {
            // 2. 클립보드 이미지 가져오기
            startTimer('클립보드 이미지 가져오기');
            updateStatus('클립보드 이미지 가져오는 중...');
            addDebug('클립보드 이미지 요청 시작');
            const imageBlob = await getImageFromClipboard().catch(error => {
                addDebug(`클립보드 접근 실패: ${error.message}`);
                handleError(error);
                throw error;
            });
            addDebug(`클립보드 이미지 가져옴: ${Math.round(imageBlob.size / 1024)}KB`);
            endTimer('클립보드 이미지 가져오기');

            // 3. 이미지 준비
            startTimer('이미지 변환 (Blob → HTMLImage)');
            updateStatus('이미지 처리 중...');
            const img = await createImageFromBlob(imageBlob);
            addDebug(`원본 이미지 크기: ${img.width}x${img.height}, 비율: ${(img.width / img.height).toFixed(2)}`);
            endTimer('이미지 변환 (Blob → HTMLImage)');

            // ===========================================================================
            // 4. 최적화: 검색 영역을 오른쪽 절반으로 제한
            // ===========================================================================
            startTimer('오른쪽 절반 이미지 생성');
            // === ROI 좌표 계산 수정: 우측 60%, 하단 50% ===
            const roiX = Math.floor(img.width * 0.4); // X 시작점 (40% 지점)
            const roiY = Math.floor(img.height * 0.5); // Y 시작점 (50% 지점)
            const roiWidth = img.width - roiX;         // 너비 (60%)
            const roiHeight = img.height - roiY;        // 높이 (50%)

            // ROI 캔버스 생성 및 이미지 영역 복사
            const roiCanvas = document.createElement('canvas');
            roiCanvas.width = roiWidth;
            roiCanvas.height = roiHeight;
            const roiCtx = roiCanvas.getContext('2d');
            roiCtx.drawImage(img, roiX, roiY, roiWidth, roiHeight, 0, 0, roiWidth, roiHeight);
            addDebug(`템플릿 검색 영역: 우측 60%(X:${roiX}~), 하단 50%(Y:${roiY}~), 크기:${roiWidth}x${roiHeight}`);
            endTimer('오른쪽 절반 이미지 생성');

            // ===========================================================================
            // 4. 해상도 감지 및 기준 템플릿 결정 (수정된 로직)
            // ===========================================================================
            let resolution = 'FHD'; // 기본값
            let baseTemplateName = '공통_기준템플릿';
            const imageWidth = img.width; // 여기서 한 번만 선언
            const imageHeight = img.height; // 여기서 한 번만 선언

            // 높이 기준으로 해상도 판별
            let inviteTemplateName = '파티장_초대템플릿'; // 기본 FHD용 초대 템플릿
            if (imageHeight > 1050 && imageHeight < 1110) { // FHD 높이 범위 (1080p)
                resolution = 'FHD_like'; // FHD, WFHD 등
                baseTemplateName = '공통_기준템플릿';
                // inviteTemplateName = '파티장_초대템플릿'; // 이미 기본값
            } else if (imageHeight > 1400 && imageHeight < 1500) { // QHD 높이 범위 (1440p)
                resolution = 'QHD';
                baseTemplateName = 'QHD_기준템플릿';
                inviteTemplateName = 'QHD_파티장_초대템플릿'; // QHD용 초대 템플릿 사용
            } else if (imageHeight > 2100 && imageHeight < 2200) { // UHD 높이 범위 (2160p)
                resolution = 'UHD';
                // UHD 기준 템플릿 사용
                baseTemplateName = 'UHD_기준템플릿';
                inviteTemplateName = 'UHD_파티장_초대템플릿';
            } else {
                addDebug(`알 수 없는 이미지 높이: ${imageHeight}. 기본 FHD 기준으로 처리합니다.`);
                resolution = 'Unknown';
                baseTemplateName = '공통_기준템플릿'; // 기본값 FHD 템플릿 사용
            }
            addDebug(`감지된 해상도 (높이 기준 ${imageHeight}px): ${resolution}, 사용할 기준 템플릿: ${baseTemplateName}`);

            // 5. 템플릿 매칭 수행
            startTimer('템플릿 매칭 (통합)');
            updateStatus('템플릿 매칭 수행 중...');
            // 오른쪽 절반 이미지에서만 매칭 수행
            // === ROI 캔버스에서 매칭 수행 ===
            const matchResult = await matchTemplate(roiCanvas);
            endTimer('템플릿 매칭 (통합)');

            // 6. 유효성 검사 (해상도에 맞는 기준 템플릿 확인)
            const baseTemplateMatch = matchResult.matches.find(m => m.name === baseTemplateName && m.isMatched);

            if (!skipValidation && templateImages.length > 0) {
                if (!baseTemplateMatch) {
                    // 오류 메시지에 해상도와 템플릿 이름 표시
                    addDebug(`이미지 유효성 검사 실패: ${resolution} 기준 템플릿(${baseTemplateName})을 찾을 수 없음`);
                    const error = new Error('유효한 로스트아크 이미지가 아닙니다. 올바른 게임 화면을 캡처해주세요.');
                    handleError(error);
                    throw error;
                }
                // 성공 메시지에 해상도와 템플릿 이름 표시
                addDebug(`이미지 유효성 검사 통과: ${resolution} 기준 템플릿(${baseTemplateName}) 확인됨`);
            } else if (!skipValidation && templateImages.length === 0) {
                addDebug('경고: 등록된 템플릿 이미지가 없어 유효성 검사를 건너뜁니다');
            }

            // 7. 파티장 여부 확인 및 크롭 오프셋 결정
            // 기준 템플릿 위치를 기반으로 초대 버튼 예상 X 좌표 범위 계산
            // !! 중요: matchResult 좌표는 오른쪽 절반 기준이므로 원본 기준으로 변환 필요 !!
            // === 기준 템플릿 좌표 변환 (ROI -> 원본) ===
            const baseX_relative = baseTemplateMatch ? baseTemplateMatch.location.x : -1; // ROI 기준 X
            const baseY_relative = baseTemplateMatch ? baseTemplateMatch.location.y : -1; // ROI 기준 Y
            const originalBaseX = baseTemplateMatch ? baseX_relative + roiX : -1; // 원본 기준 X
            const originalBaseY = baseTemplateMatch ? baseY_relative + roiY : -1; // 원본 기준 Y

            // 원본 이미지 기준 X 좌표로 초대 버튼 예상 범위 계산
            // --- 해상도별 스케일링된 X 오프셋 적용 --- 
            let inviteOffsetX_start = 300; // FHD 기준 시작 오프셋
            let inviteOffsetX_end = 600;   // FHD 기준 끝 오프셋
            if (resolution === 'QHD') {
                inviteOffsetX_start *= 1.33; // 임시 스케일링 (1440/1080)
                inviteOffsetX_end *= 1.33;
            } else if (resolution === 'UHD') {
                inviteOffsetX_start *= 2;    // 임시 스케일링 (2160/1080)
                inviteOffsetX_end *= 2;
            }
            const minInviteX_original = originalBaseX + Math.round(inviteOffsetX_start);
            const maxInviteX_original = originalBaseX + Math.round(inviteOffsetX_end);
            addDebug(`초대 버튼 예상 X 좌표 범위 (원본 기준): ${minInviteX_original} ~ ${maxInviteX_original}`);

            // 해상도에 맞는 초대 템플릿 이름과 계산된 X 좌표 범위를 사용하여 파티장 여부 판단
            const partyLeaderMatch = matchResult.matches.find(m => {
                if (!(m.name === inviteTemplateName && m.isMatched)) return false;

                // 초대 템플릿의 원본 X 좌표 계산
                // === 초대 템플릿 좌표 변환 (ROI -> 원본) ===
                const inviteX_relative = m.location.x; // ROI 기준 X
                const inviteY_relative = m.location.y; // ROI 기준 Y
                const originalInviteX = inviteX_relative + roiX; // 원본 기준 X
                // const originalInviteY = inviteY_relative + roiY; // Y 좌표는 필터링에 사용 안 함

                // 원본 X 좌표 기준으로 범위 필터링
                return originalInviteX >= minInviteX_original && originalInviteX <= maxInviteX_original;
            });
            const isPartyLeader = !!partyLeaderMatch; // 매칭 결과(객체 또는 undefined)를 boolean으로 변환

            // 해상도와 파티 상태에 따라 최종 크롭 오프셋 선택
            let cropOffsets;
            let selectedOffsetName = 'Unknown'; // 디버깅용 이름
            if (resolution === 'FHD_like') {
                if (isPartyLeader) {
                    cropOffsets = FHD_LEADER_CROP_OFFSETS;
                    selectedOffsetName = 'FHD_LEADER_CROP_OFFSETS';
                } else {
                    cropOffsets = FHD_MEMBER_CROP_OFFSETS;
                    selectedOffsetName = 'FHD_MEMBER_CROP_OFFSETS';
                }
            } else if (resolution === 'QHD') {
                if (isPartyLeader) {
                    cropOffsets = QHD_LEADER_CROP_OFFSETS;
                    selectedOffsetName = 'QHD_LEADER_CROP_OFFSETS';
                } else {
                    cropOffsets = QHD_MEMBER_CROP_OFFSETS;
                    selectedOffsetName = 'QHD_MEMBER_CROP_OFFSETS';
                }
            } else if (resolution === 'UHD') {
                if (isPartyLeader) {
                    cropOffsets = UHD_LEADER_CROP_OFFSETS;
                    selectedOffsetName = 'UHD_LEADER_CROP_OFFSETS';
                } else {
                    cropOffsets = UHD_MEMBER_CROP_OFFSETS;
                    selectedOffsetName = 'UHD_MEMBER_CROP_OFFSETS';
                }
            } else { // Unknown 해상도 또는 예외 상황
                addDebug('경고: 해상도 판별 불가 또는 예외 상황. FHD 기본 오프셋 사용.');
                if (isPartyLeader) {
                    cropOffsets = FHD_LEADER_CROP_OFFSETS;
                    selectedOffsetName = 'FHD_LEADER_CROP_OFFSETS (Fallback)';
                } else {
                    cropOffsets = FHD_MEMBER_CROP_OFFSETS;
                    selectedOffsetName = 'FHD_MEMBER_CROP_OFFSETS (Fallback)';
                }
            }
            addDebug(`최종 선택된 크롭 오프셋: ${selectedOffsetName}`);

            // QHD/UHD 해상도일 경우 오프셋 값 확인 필요 경고
            if (resolution === 'QHD' || resolution === 'UHD') {
                addDebug(`경고: ${resolution} 해상도 감지됨. 현재 크롭 오프셋 값은 FHD 기준일 수 있습니다. 크롭 결과를 확인하세요.`);
            }

            // 8. 크롭 영역 계산 및 크롭 실행
            startTimer('이미지 크롭');
            updateStatus('관심 영역 크롭 중...');

            // 기준 템플릿 위치 (원본 이미지 기준 좌표 사용)
            if (!baseTemplateMatch || originalBaseX === -1 || originalBaseY === -1) { // 안전장치 (Y 좌표 변환 실패 포함)
                 addDebug("템플릿 기반 크롭 실패: 기준 템플릿 매치 정보를 찾을 수 없습니다.");
                 throw new Error("이미지 크롭 실패: 기준점을 찾을 수 없습니다.");
             }

            const templateX = originalBaseX;
            const templateY = originalBaseY;
            const templateWidth = baseTemplateMatch.width;
            const templateHeight = baseTemplateMatch.height;

            // 크롭 영역 계산 (템플릿 위치 + 선택된 오프셋)
            const cropX = Math.max(0, templateX + cropOffsets.left);
            const cropY = Math.max(0, templateY + cropOffsets.top);
            const cropRight = Math.min(imageWidth, templateX + templateWidth + cropOffsets.right);
            const cropBottom = Math.min(imageHeight, templateY + templateHeight + cropOffsets.bottom);
            const cropWidth = Math.max(1, cropRight - cropX);
            const cropHeight = Math.max(1, cropBottom - cropY);

            // Canvas 생성 및 이미지 크롭
            const canvas = document.createElement('canvas');
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                cropX, cropY, cropWidth, cropHeight,  // 소스 이미지 영역
                0, 0, cropWidth, cropHeight           // 캔버스 영역
            );

            // 이미지 데이터 획득
            const croppedImageData = ctx.getImageData(0, 0, cropWidth, cropHeight);
            endTimer('이미지 크롭');

            // 디버그 정보 로깅
            addDebug(`기준 템플릿 위치: x=${templateX}, y=${templateY}, 크기: ${templateWidth}x${templateHeight}`);
            addDebug(`크롭 오프셋: top=${cropOffsets.top}, right=${cropOffsets.right}, bottom=${cropOffsets.bottom}, left=${cropOffsets.left}`);
            addDebug(`최종 크롭 영역: x=${cropX}, y=${cropY}, 크기: ${cropWidth}x${cropHeight}`);
            addDebug(`크롭된 이미지 크기: ${croppedImageData.width}x${croppedImageData.height}`);

            // 크롭된 이미지 콜백 호출
            if (onImageCropped && typeof onImageCropped === 'function') {
                onImageCropped(croppedImageData);
            }

            // 9. 크롭된 이미지 해시 계산 및 중복 검사
            startTimer('이미지 해시 계산');
            const currentCroppedImageHash = await calculateImageHash(croppedImageData.data.buffer);
            endTimer('이미지 해시 계산');
            addDebug(`계산된 이미지 해시: ${currentCroppedImageHash.substring(0, 10)}...`);

            if (currentCroppedImageHash === lastProcessedCroppedImageHash) {
                updateStatus('중복된 이미지 요청입니다. 이전 결과를 사용하세요.');
                addDebug('이전 이미지와 동일한 해시값 감지. OCR API 호출 건너뜁니다.');
                throw new Error('DUPLICATE_IMAGE');
            } else {
                 addDebug('새로운 이미지 해시값 확인. OCR API 호출 진행.');
                 lastProcessedCroppedImageHash = currentCroppedImageHash;
            }

            // 10. OCR API 호출
            startTimer('OCR API 호출 준비');
            updateStatus('OCR API 호출 준비 중...');
            startTimer('이미지 변환 (ImageData → Blob)');
            const croppedBlob = await imageDataToBlob(croppedImageData);
            endTimer('이미지 변환 (ImageData → Blob)');

            startTimer('Base64 변환');
            const base64Image = await blobToBase64(croppedBlob);
            endTimer('Base64 변환');
            endTimer('OCR API 호출 준비');

            addDebug(`이미지를 Base64로 변환 완료: ${Math.round(base64Image.length / 1024)}KB`);
            const formData = new FormData();
            formData.append('file', croppedBlob, 'filename.png');
            const requestOptions = {
                method: 'POST',
                body: formData
            };

            startTimer('OCR API 호출');
            updateStatus('OCR API 호출 중...');
            addDebug(`서버 OCR API 호출 시작 (https://lopec.o-r.kr/api/images)`);

            const response = await fetch('https://lopec.o-r.kr/api/images', requestOptions);
            if (!response.ok) {
                alert("현재 요청이 폭주하여 지연되고 있습니다. 잠시 후에 다시 시도해주세요.")
                const errorResponse = await response.text();
                addDebug(`서버 OCR API 오류: ${response.status} ${response.statusText}`);
                addDebug(`오류 응답: ${errorResponse}`);
                throw new Error(`서버 OCR API 호출 실패: ${response.status} ${response.statusText}. 응답: ${errorResponse}`);
            }

            const ocrResult = await response.json();
            endTimer('OCR API 호출');
            addDebug('OCR API 응답 수신 완료');

            // 원본 OCR 응답 콜백 호출
            if (onRawResponse && typeof onRawResponse === 'function') {
                onRawResponse(ocrResult);
            }

            // 11. OCR 결과 기반 버전 감지 (auto 모드일 경우)
            let finalVersion = version;
            if (version === 'auto') {
                const hasDetailButton = ocrResult.text && ocrResult.text.includes("상세보기");
                finalVersion = hasDetailButton ? OCR_VERSIONS.APPLICANT : OCR_VERSIONS.PARTICIPANT;
                addDebug(`OCR 텍스트 기반 버전 감지: "${hasDetailButton ? '상세보기 텍스트 발견' : '상세보기 텍스트 없음'}"`);
                addDebug(`자동 감지된 이미지 유형: ${finalVersion}`);
                updateStatus(`이미지 유형 감지됨: ${finalVersion === OCR_VERSIONS.APPLICANT ? '신청자 목록' : '참가자 목록'}`);
            } else if (![OCR_VERSIONS.APPLICANT, OCR_VERSIONS.PARTICIPANT].includes(version)) {
                addDebug(`알 수 없는 버전 값: ${version}. 기본값(참가자 목록)으로 진행합니다.`);
                finalVersion = OCR_VERSIONS.PARTICIPANT; // 기본값을 PARTICIPANT로 변경 또는 오류 처리 필요
            }

            // 12. 캐릭터 정보 추출
            startTimer('캐릭터 정보 추출');
            updateStatus('OCR 결과에서 캐릭터 정보 추출 중...');

            // 해상도 정보(resolution)를 extractCharacterInfo에 전달
            const extractedCharacters = extractCharacterInfo(ocrResult, finalVersion, resolution, addDebug);
            endTimer('캐릭터 정보 추출');

            // 13. 결과 반환
            const uniqueNicknames = [...new Set(extractedCharacters.map(char => char.nickname))];
            updateStatus(`${uniqueNicknames.length}개 고유 닉네임 추출 완료`);
            addDebug(`OCR 처리 완료: ${extractedCharacters.length}개 캐릭터 추출 -> ${uniqueNicknames.length}개 고유 닉네임 반환`);

            // 전체 프로세스 측정 종료
            const totalTime = endTimer('전체 프로세스');
            addDebug(`총 소요 시간: ${totalTime.toFixed(2)}ms`);

            return uniqueNicknames;

        } catch (error) {
            const errorMessage = `OCR 처리 오류: ${error.message}`;
            updateStatus(errorMessage);
            addDebug(errorMessage);
            if (error.stack) {
                addDebug(`오류 스택: ${error.stack}`);
            }
            throw error; // 오류를 다시 던져서 상위에서 처리하도록 함
        }
    }

    // ===========================================================================================
    // 모듈 인터페이스 - 외부에 노출할 API 정의
    // ===========================================================================================
    return {
        /**
         * 클립보드에서 이미지를 가져와 OCR 처리 후 캐릭터 닉네임을 추출하는 함수
         * @param {string} version - OCR 처리 버전 ('auto'인 경우 자동 감지)
         * @param {Object} callbacks - 콜백 함수들
         * @param {boolean} skipValidation - 이미지 유효성 검사 건너뛰기 (기본값: false)
         * @returns {Promise<Array<string>>} 추출된 닉네임 문자열 배열
         */
        extractCharactersFromClipboard: processClipboardImage,

        /**
         * 템플릿 이미지를 추가하는 함수
         * @param {string|File|Blob} templateSource - 템플릿 이미지 소스 (URL 또는 File/Blob 객체)
         * @param {string} name - 템플릿 이름
         * @param {number} threshold - 이 템플릿의 매칭 임계값 (기본값 사용시 null)
         * @returns {Promise} 템플릿 추가 완료 Promise
         */
        addTemplateImage: addTemplateImage,

        /**
         * 이미지가 유효한 로스트아크 스크린샷인지 확인하는 함수
         * @param {Blob|ImageData|HTMLImageElement} imageSource - 검사할 이미지
         * @param {Function} debugCallback - 디버그 콜백 (선택사항)
         * @returns {Promise<boolean>} 이미지 유효성 여부
         */
        isValidLostarkImage: isValidLostarkImage,

        /**
         * 템플릿 매칭 결과를 기반으로 이미지에서 관심 영역을 크롭하는 함수
     * @param {HTMLImageElement} sourceImage - 원본 이미지
     * @param {string} templateName - 템플릿 이름 (없으면 가장 높은 매칭 점수의 템플릿 사용)
     * @param {Object} cropOffsets - 템플릿 기준 크롭 오프셋 (템플릿 기준점에서의 상대 위치)
     * @param {number} cropOffsets.top - 상단 오프셋 (음수=위로, 양수=아래로)
     * @param {number} cropOffsets.right - 우측 오프셋 (음수=좌측으로, 양수=우측으로)
     * @param {number} cropOffsets.bottom - 하단 오프셋 (음수=위로, 양수=아래로)
     * @param {number} cropOffsets.left - 좌측 오프셋 (음수=좌측으로, 양수=우측으로)
         * @param {Function} debugCallback - 디버그 콜백 (선택사항)
     * @returns {Promise<ImageData>} 크롭된 이미지 데이터
     */
        cropRegionAroundTemplate: cropRegionAroundTemplate,

        /**
         * 이미지를 로스트아크 관심 영역으로 크롭하는 함수 (템플릿 매칭 기반)
         * @param {HTMLImageElement} img - 크롭할 이미지 객체
         * @param {string} version - OCR 처리 버전 (현재는 크롭 오프셋 계산에만 사용될 수 있음)
         * @param {Function} debugCallback - 디버그 콜백
         * @returns {Promise<ImageData>} 크롭된 이미지 데이터
         * @throws {Error} 템플릿 매칭 실패 시 오류 발생
         */
        cropLostarkRegionOfInterest: cropLostarkRegionOfInterest,

        /**
         * 기본 템플릿 이미지 로드
         * @returns {Promise<number>} 로드된 템플릿 수
         */
        loadDefaultTemplates: loadDefaultTemplates,

        /**
         * 모든 템플릿 이미지 제거
         */
        clearAllTemplates: clearAllTemplates,

        /**
         * 현재 등록된 템플릿 정보 조회
         * @returns {Array<Object>} 템플릿 정보 배열
         */
        getRegisteredTemplates: getRegisteredTemplates,

        /**
         * 기본 템플릿 매칭 임계값 설정 (0.0 ~ 1.0)
         * @param {number} threshold - 설정할 임계값
         */
        setTemplateMatchingThreshold: function (threshold) {
            if (typeof threshold === 'number' && threshold >= 0 && threshold <= 1) {
                templateMatchingThreshold = threshold;
                return true;
            }
            return false;
        },

        /**
         * OpenCV 라이브러리를 수동으로 로드
         * @returns {Promise} 로드 완료 Promise
         */
        loadOpenCV: loadOpenCV,

        /**
         * OCR 처리 버전 상수
         * - APPLICANT: 신청자 목록 처리
         * - PARTICIPANT: 참가자 목록 처리
         */
        VERSIONS: OCR_VERSIONS
    };
})();

// 브라우저 환경에서 전역으로 노출
window.LopecOCR = LopecOCR;

// ESM 내보내기 추가
export { LopecOCR };