let detector;
let exerciseCount = 0;
let isGoingDown = false;
let lastExerciseTime = 0;
let currentExercise = 'pushup';

let videoElement;
let canvasElement;
let canvasCtx;
let counterElement;
let statusElement;
let errorElement;
let exerciseSelector;

document.getElementById("finishWorkout").addEventListener("click", function() {
    window.postMessage({ type: "FROM_EXTENSION", data: `${exerciseCount}` }, "*");
});

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
    statusElement.textContent = `Ready to count ${currentExercise === 'pushup' ? 'push-ups' : 'pull-ups'}!`;
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

// Detect poses and count exercises
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

            // Get relevant keypoints
            const leftShoulder = pose.keypoints[5];
            const leftElbow = pose.keypoints[7];
            const leftWrist = pose.keypoints[9];
            const rightShoulder = pose.keypoints[6];
            const rightElbow = pose.keypoints[8];
            const rightWrist = pose.keypoints[10];
            const nose = pose.keypoints[0];

            if (leftShoulder.score > 0.3 && leftElbow.score > 0.3 && leftWrist.score > 0.3 &&
                rightShoulder.score > 0.3 && rightElbow.score > 0.3 && rightWrist.score > 0.3) {

                const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
                const avgAngle = (leftAngle + rightAngle) / 2;
                const now = Date.now();

                if (currentExercise === 'pushup') {
                    // Push-up detection logic
                    if (avgAngle < 90 && !isGoingDown && (now - lastExerciseTime) > 1000) {
                        isGoingDown = true;
                        statusElement.textContent = 'Going down...';
                    } else if (avgAngle > 160 && isGoingDown) {
                        exerciseCount++;
                        isGoingDown = false;
                        lastExerciseTime = now;
                        counterElement.textContent = `Push-ups: ${exerciseCount}`;
                        statusElement.textContent = 'Push-up counted! Keep going!';
                    }

                    // if (Number(exerciseCount) === Number(targetValue)) {
                        // chrome.storage.local.set({ redirectEnabled: false });
                        // chrome.tabs.update(details.tabId, { url: redirectUrl });
                    // }
                } else {
                    // Pull-up detection logic
                    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
                    const chinAboveShoulder = nose.y < shoulderY - 20; // Threshold for chin over bar

                    if (!isGoingDown && chinAboveShoulder && (now - lastExerciseTime) > 1000) {
                        isGoingDown = true;
                        statusElement.textContent = 'Chin above bar...';
                    } else if (isGoingDown && !chinAboveShoulder) {
                        exerciseCount++;
                        isGoingDown = false;
                        lastExerciseTime = now;
                        counterElement.textContent = `Pull-ups: ${exerciseCount}`;
                        statusElement.textContent = 'Pull-up counted! Keep going!';
                    }
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
    // Initialize DOM elements
    videoElement = document.getElementById('webcam');
    canvasElement = document.getElementById('output-canvas');
    canvasCtx = canvasElement.getContext('2d');
    counterElement = document.getElementById('counter');
    statusElement = document.getElementById('status');
    errorElement = document.getElementById('error');
    exerciseSelector = document.getElementById('exercise-type');

    // Add event listener for exercise type change
    exerciseSelector.addEventListener('change', (e) => {
        currentExercise = e.target.value;
        exerciseCount = 0;
        isGoingDown = false;
        counterElement.textContent = `${currentExercise === 'pushup' ? 'Push-ups' : 'Pull-ups'}: 0`;
        statusElement.textContent = `Ready to count ${currentExercise === 'pushup' ? 'push-ups' : 'pull-ups'}!`;
    });

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
