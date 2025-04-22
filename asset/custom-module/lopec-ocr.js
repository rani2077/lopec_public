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

    // OCR API 엔드포인트
    const API_URL = 'https://api.upstage.ai/v1/document-digitization';

    // 프록시 서버 API 키 엔드포인트
    const API_KEY_PROXY_URL = 'https://restless-art-6037.tassardar6-c0f.workers.dev'; // 프록시 서버의 API 키 제공 엔드포인트 주소

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

    // 통합 크롭 영역 설정 (신청자/참가자 모두 포함)
    const UNIFIED_CROP_OFFSETS = {
        top: -565,     // 더 위쪽으로 (신청자 기준)
        right: 400,    // 더 오른쪽으로 (참가자 기준)
        bottom: -250,  // 동일
        left: 0        // 동일
    };

    // 기본 템플릿 이미지 경로 및 정보 (HTML 파일 기준 상대 경로)
    const DEFAULT_TEMPLATES = [
        { path: '/asset/templates/Img_65.bmp', name: '공통_기준템플릿', threshold: 0.7 }
        // 첫 번째 템플릿은 유효성 검사 및 크롭 기준점으로 사용
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

                    console.log(`템플릿 이미지 추가됨: ${name} (${img.width}x${img.height})`);

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
            const cropOffsets = UNIFIED_CROP_OFFSETS;

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
    function extractCharacterInfo(ocrData, version = OCR_VERSIONS.APPLICANT, debug = null) {
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
                // API 응답 전체 로깅 (개발용)
                logDebug(`==== 참가자 목록 OCR API 응답 (개발용) ====`);

                // JSON 문자열로 변환하여 로깅
                const jsonStr = JSON.stringify(ocrData, null, 2);
                logDebug(`API 응답 JSON: ${jsonStr}`);

                // 텍스트 내용 출력
                logDebug(`==== OCR 추출 텍스트 ====`);
                logDebug(ocrData.text);
                logDebug(`==== 텍스트 길이: ${ocrData.text.length}자 ====`);

                // 좌표 기반 닉네임 추출 시도
                logDebug(`==== 좌표 기반 닉네임 추출 시작 ====`);

                // 닉네임 좌상단 좌표 목록 (정확한 위치)
                const nicknamePositions = [
                    // 왼쪽 열
                    { x: 5, y: 38 },    // 첫번째 닉네임
                    { x: 5, y: 66 },    // 두번째 닉네임
                    { x: 5, y: 99 },    // 세번째 닉네임
                    { x: 5, y: 128 },   // 네번째 닉네임
                    
                    // 오른쪽 열
                    { x: 304, y: 38 },  // 다섯번째 닉네임
                    { x: 304, y: 69 },  // 여섯번째 닉네임
                    { x: 304, y: 99 },  // 일곱번째 닉네임
                    { x: 304, y: 128 }  // 여덟번째 닉네임
                ];

                // 미리 계산된 허용 오차 범위로 좌표 맵 생성 (속도 최적화)
                const positionMap = new Map();
                const tolerance = 2;

                nicknamePositions.forEach((pos, index) => {
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

            console.log(`기본 템플릿 이미지 로드 시작...`);
            let loadedCount = 0;

            // 모든 기본 템플릿 로드
            for (const template of DEFAULT_TEMPLATES) {
                try {
                    await addTemplateImage(template.path, template.name, template.threshold);
                    loadedCount++;
                    console.log(`템플릿 로드됨: ${template.name} (${template.path})`);
                } catch (error) {
                    console.warn(`템플릿 로드 실패: ${template.name} (${template.path})`, error);
                }
            }

            console.log(`기본 템플릿 이미지 ${loadedCount}개 로드 완료`);
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
        const { onStatusUpdate, onDebugInfo, onImageCropped, onError } = callbacks;

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

            // 4. 템플릿 매칭으로 이미지 유효성 검사
            startTimer('템플릿 매칭 (통합)');
            updateStatus('템플릿 매칭 수행 중...');

            // 유효성 검사만 수행 (버전 감지는 OCR 결과로 수행)
            const matchResult = await matchTemplate(img, true); // 조기 종료 옵션 활성화

            // 4.1 유효성 검사
            if (!skipValidation && templateImages.length > 0) {
                const isValid = matchResult.isValid;

                if (!isValid) {
                    addDebug('이미지 유효성 검사 실패: 로스트아크 UI 요소를 찾을 수 없음');
                    const error = new Error('유효한 로스트아크 이미지가 아닙니다. 올바른 게임 화면을 캡처해주세요.');
                    handleError(error);
                    throw error;
                }

                addDebug('이미지 유효성 검사 통과: 로스트아크 UI 요소 확인됨');
            } else if (!skipValidation && templateImages.length === 0) {
                addDebug('경고: 등록된 템플릿 이미지가 없어 유효성 검사를 건너뜁니다');
            }

            endTimer('템플릿 매칭 (통합)');

            // 버전은 OCR 결과를 받은 후에 결정할 것임 (임시값 설정)
            let finalVersion = version;

            // 버전 결정 전에 크롭 영역 계산을 위한 기준 템플릿 위치 확인
            const baseTemplate = matchResult.matches.find(m => m.name === '공통_기준템플릿');
            console.log(baseTemplate)

            if (!baseTemplate || !baseTemplate.isMatched) {
                addDebug("템플릿 기반 크롭 실패: 기준 템플릿을 찾을 수 없습니다.");
                throw new Error("이미지 크롭 실패: 기준점을 찾을 수 없습니다.");
            }

            // OCR API 호출 준비 (OCR 결과에 따라 버전 결정)
            startTimer('OCR API 호출');
            updateStatus('OCR API 호출 중...');

            // 4.2 크롭 작업 준비
            let croppedImageData;

            // 크롭 영역 계산
            const templateX = baseTemplate.location.x;
            const templateY = baseTemplate.location.y;
            const templateWidth = baseTemplate.width;
            const templateHeight = baseTemplate.height;

            // 이미지 크기 가져오기
            const imageWidth = img.width;
            const imageHeight = img.height;

            // 통합 크롭 오프셋 사용
            const cropOffsets = UNIFIED_CROP_OFFSETS;

            // 크롭 영역 계산 (템플릿 위치 + 오프셋)
            const cropX = Math.max(0, templateX + cropOffsets.left);
            const cropY = Math.max(0, templateY + cropOffsets.top);

            // 크롭 영역 오른쪽/아래 경계 계산
            const cropRight = Math.min(imageWidth, templateX + templateWidth + cropOffsets.right);
            const cropBottom = Math.min(imageHeight, templateY + templateHeight + cropOffsets.bottom);

            // 최종 크롭 영역 크기
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
            croppedImageData = ctx.getImageData(0, 0, cropWidth, cropHeight);

            // 디버그 정보 로깅
            addDebug(`기준 템플릿 위치: x=${templateX}, y=${templateY}, 크기: ${templateWidth}x${templateHeight}`);
            addDebug(`크롭 오프셋: top=${cropOffsets.top}, right=${cropOffsets.right}, bottom=${cropOffsets.bottom}, left=${cropOffsets.left}`);
            addDebug(`최종 크롭 영역: x=${cropX}, y=${cropY}, 크기: ${cropWidth}x${cropHeight}`);
            addDebug(`크롭된 이미지 크기: ${croppedImageData.width}x${croppedImageData.height}`);

            if (onImageCropped && typeof onImageCropped === 'function') {
                onImageCropped(croppedImageData);
            }

            // 5. 이미지 데이터를 Blob으로 변환
            startTimer('이미지 변환 (ImageData → Blob)');
            const croppedBlob = await imageDataToBlob(croppedImageData);
            endTimer('이미지 변환 (ImageData → Blob)');

            // 새로 추가: 크롭된 이미지 해시 계산
            startTimer('이미지 해시 계산');
            const currentCroppedImageHash = await calculateImageHash(croppedImageData.data.buffer);
            endTimer('이미지 해시 계산');
            addDebug(`계산된 이미지 해시: ${currentCroppedImageHash.substring(0, 10)}...`);

            // 새로 추가: 해시 비교 및 중복 검사
            if (currentCroppedImageHash === lastProcessedCroppedImageHash) {
                // 해시값이 같으면 중복 이미지!
                updateStatus('중복된 이미지 요청입니다. 이전 결과를 사용하세요.');
                addDebug('이전 이미지와 동일한 해시값 감지. OCR API 호출 건너뜁니다.');

                // 중복 시 처리: 에러를 발생시켜 호출 측에서 알 수 있도록 함
                throw new Error('DUPLICATE_IMAGE'); // 이 에러를 메인 JS에서 catch하여 처리 필요
            } else {
                 // 해시값이 다르면 새로운 이미지!
                 addDebug('새로운 이미지 해시값 확인. OCR API 호출 진행.');

                 // 중요: OCR API를 호출하기 직전에 마지막 해시값을 현재 값으로 업데이트
                 lastProcessedCroppedImageHash = currentCroppedImageHash;

                 // 기존 OCR API 호출 로직 계속 진행
                 // updateStatus('OCR API 호출 중...'); // 이전에 상태 업데이트 위치 조정 제안했지만, 여기서는 유지
            }

            // 6. OCR API 호출
            // Base64 변환 시간 측정
            startTimer('Base64 변환');
            const base64Image = await blobToBase64(croppedBlob);
            endTimer('Base64 변환');

            addDebug(`이미지를 Base64로 변환 완료: ${Math.round(base64Image.length / 1024)}KB`);
            const formData = new FormData();
            formData.append('file', croppedBlob, 'filename.png');
            const requestOptions = {
                method: 'POST',
                body: formData
            };
            addDebug(`서버 OCR API 호출 시작 (https://lopec.o-r.kr/api/images)`);

            // 서버 OCR API 호출 (실제 엔드포인트 URL로 변경)
            const response = await fetch('https://lopec.o-r.kr/api/images', requestOptions);
            if (!response.ok) {
                const errorResponse = await response.text();
                addDebug(`서버 OCR API 오류: ${response.status} ${response.statusText}`);
                addDebug(`오류 응답: ${errorResponse}`);
                // 오류 메시지에 서버 응답 포함 고려
                throw new Error(`서버 OCR API 호출 실패: ${response.status} ${response.statusText}. 응답: ${errorResponse}`);
            }

            // OCR 결과 처리 (서버로부터 받은 JSON 사용)
            const ocrResult = await response.json();
            endTimer('OCR API 호출');
            addDebug('OCR API 응답 수신 완료');

            // OCR 결과에서 버전 감지
            if (version === 'auto') {
                // OCR 결과에서 버전 감지 (상세보기 텍스트 존재 확인)
                const hasDetailButton = ocrResult.text && ocrResult.text.includes("상세보기");
                finalVersion = hasDetailButton ? OCR_VERSIONS.APPLICANT : OCR_VERSIONS.PARTICIPANT;

                addDebug(`OCR 텍스트 기반 버전 감지: "${hasDetailButton ? '상세보기 텍스트 발견' : '상세보기 텍스트 없음'}"`);
                addDebug(`자동 감지된 이미지 유형: ${finalVersion}`);
                updateStatus(`이미지 유형 감지됨: ${finalVersion === OCR_VERSIONS.APPLICANT ? '신청자 목록' : '참가자 목록'}`);
            } else if (![OCR_VERSIONS.APPLICANT, OCR_VERSIONS.PARTICIPANT].includes(version)) {
                addDebug(`알 수 없는 버전 값: ${version}. 기본값(참가자 목록)으로 진행합니다.`);
                finalVersion = OCR_VERSIONS.PARTICIPANT;
            }

            // 7. 캐릭터 정보 추출 (OCR 결과 텍스트에서)
            startTimer('캐릭터 정보 추출');
            updateStatus('OCR 결과에서 캐릭터 정보 추출 중...');

            // 디버그 모드에서만 전체 API 응답 로깅
            if (onDebugInfo && typeof onDebugInfo === 'function' &&
                onDebugInfo.toString().includes('debug')) { // 간단한 디버그 모드 확인
                addDebug(`==== OCR API 응답 요약 ====`);
                try {
                    const textLength = ocrResult.text ? ocrResult.text.length : 0;
                    const wordCount = ocrResult.pages && ocrResult.pages[0] ?
                        ocrResult.pages[0].words.length : 0;

                    addDebug(`텍스트 길이: ${textLength}자, 단어 수: ${wordCount}`);
                } catch (e) {
                    addDebug(`응답 요약 중 오류: ${e.message}`);
                }
            }

            const extractedCharacters = extractCharacterInfo(ocrResult, finalVersion, addDebug);
            endTimer('캐릭터 정보 추출');

            // 8. 결과 요약 및 닉네임만 추출
            if (extractedCharacters.length > 0) {
                if (extractedCharacters[0].nickname) {
                    addDebug(`첫 번째 캐릭터: ${extractedCharacters[0].nickname}${extractedCharacters[0].itemLevel ? ', 아이템 레벨: ' + extractedCharacters[0].itemLevel : ''}`);
                }
            } else {
                addDebug(`추출된 캐릭터 없음`);
            }

            // 닉네임만 추출하여 반환
            const uniqueNicknames = [...new Set(extractedCharacters.map(char => char.nickname))];

            updateStatus(`${uniqueNicknames.length}개 고유 닉네임 추출 완료`);
            addDebug(`OCR 처리 완료: ${extractedCharacters.length}개 캐릭터 추출 -> ${uniqueNicknames.length}개 고유 닉네임 반환`);

            // 전체 프로세스 측정 종료
            const totalTime = endTimer('전체 프로세스');
            addDebug(`총 소요 시간: ${totalTime.toFixed(2)}ms`);

            return uniqueNicknames; // 닉네임 문자열 배열만 반환

        } catch (error) {
            const errorMessage = `OCR 처리 오류: ${error.message}`;
            updateStatus(errorMessage);
            addDebug(errorMessage);
            if (error.stack) {
                addDebug(`오류 스택: ${error.stack}`);
            }
            throw error;
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