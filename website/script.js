document.addEventListener('DOMContentLoaded', function () {
    // Pie Chart (Accuracy)
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const colors = {
        pastelBlue: '#A2D5F2', // Pastel blue
        navy: '#1E3A8A', // Navy
        lightNavy: '#3B82F6', // Light navy
        softBlue: '#BFDBFE', // Soft blue
        navy: '#1E3A8A',       // Navy blue
        pastelBlue: '#A2D5F2', // Coral
        mint: '#B8E986',       // Mint green
        lavender: '#CABBE9',   
        peach: '#FFC3A0',     // Peach
        softBlue: '#BFDBFE',
    };
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Youtube', 'Tik-Tok', 'Instagram', 'Facebook', 'Messenger', 'Twitter'],
            datasets: [{
                data: [23.4, 15.6, 31.3, 7.8, 15.6, 6.3], // Example data (20% correct, 80% incorrect)
                backgroundColor: [
                    colors.softBlue, // Correct form
                    colors.navy,      // Incorrect form
                    colors.pastelBlue,      // Segment 3
                    colors.mint,       // Segment 4
                    colors.lavender,   // Segment 5
                    colors.peach       // Segment 6
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow chart to resize
            plugins: {
                legend: {
                    position: 'bottom', // Legend at the bottom
                    labels: {
                        font: {
                            size: 10 // Smaller legend font
                        }
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Bar Chart (Screen Time-like Graph)
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Youtube', 'Tik-Tok', 'Instagram', 'Facebook', 'Messenger', 'Twitter'], // Exercise types
            datasets: [{
                label: 'Reps Completed',
                data: [15, 10, 20, 5, 10, 4, 8], // Example data
                backgroundColor: [
                    colors.softBlue, // Correct form
                    colors.navy,      // Incorrect form
                    colors.pastelBlue,      // Segment 3
                    colors.mint,       // Segment 4
                    colors.lavender,   // Segment 5
                    colors.peach       // Segment 6
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow chart to resize
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)' // Lighter grid lines
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller axis font
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Remove x-axis grid lines
                    },
                    ticks: {
                        font: {
                            size: 8 // Smaller axis font
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend for bar chart
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
});