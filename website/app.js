let detector;
let pushUpCount = 0;
let isGoingDown = false;
let lastPushUpTime = 0;

const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const counterElement = document.getElementById('counter');
const statusElement = document.getElementById('status');
const errorElement = document.getElementById('error');

// Initialize the webcam
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });
        videoElement.srcObject = stream;

        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                resolve(videoElement);
            };
        });
    } catch (error) {
        errorElement.textContent = 'Error accessing webcam. Please ensure you have granted permission.';
        errorElement.style.display = 'block';
        throw error;
    }
}

// Load the MoveNet model
async function loadModel() {
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
    };
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    statusElement.textContent = 'Model loaded! Start doing push-ups!';
}

// Calculate angle between three points
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
}

// Draw keypoints and connections on canvas
function drawPose(pose) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
        if (keypoint.score > 0.3) {
            canvasCtx.beginPath();
            canvasCtx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = '#00ff00';
            canvasCtx.fill();
        }
    });
}

// Detect poses and count push-ups
async function detectPose() {
    if (!detector) return;

    // Match canvas size to video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    try {
        const poses = await detector.estimatePoses(videoElement);
        if (poses.length > 0) {
            const pose = poses[0];
            drawPose(pose);

            // Get relevant keypoints for push-up detection
            const leftShoulder = pose.keypoints[5];
            const leftElbow = pose.keypoints[7];
            const leftWrist = pose.keypoints[9];
            const rightShoulder = pose.keypoints[6];
            const rightElbow = pose.keypoints[8];
            const rightWrist = pose.keypoints[10];

            if (leftShoulder.score > 0.3 && leftElbow.score > 0.3 && leftWrist.score > 0.3 &&
                rightShoulder.score > 0.3 && rightElbow.score > 0.3 && rightWrist.score > 0.3) {

                // Calculate angles for both arms
                const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
                const avgAngle = (leftAngle + rightAngle) / 2;

                const now = Date.now();
                // Detect push-up motion
                if (avgAngle < 90 && !isGoingDown && (now - lastPushUpTime) > 1000) {
                    isGoingDown = true;
                    statusElement.textContent = 'Going down...';
                } else if (avgAngle > 160 && isGoingDown) {
                    pushUpCount++;
                    isGoingDown = false;
                    lastPushUpTime = now;
                    counterElement.textContent = `Push-ups: ${pushUpCount}`;
                    statusElement.textContent = 'Push-up counted! Keep going!';
                }
            }
        }
    } catch (error) {
        console.error('Error during pose detection:', error);
    }

    requestAnimationFrame(detectPose);
}

// Initialize the application
async function init() {
    try {
        await setupCamera();
        await loadModel();
        detectPose();
    } catch (error) {
        console.error('Error initializing:', error);
        statusElement.textContent = 'Error initializing the application. Please refresh and try again.';
    }
}

// Start the application when the page loads
window.onload = init;
