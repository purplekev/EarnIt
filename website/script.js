document.addEventListener('DOMContentLoaded', function () {
    const colors = {
        primary: '#2563eb',    // Primary blue
        secondary: '#1e40af',  // Darker blue
        success: '#3b82f6',    // Light blue
        error: '#ef4444',      // Red
        warning: '#f59e0b',    // Orange
        purple: '#8b5cf6',     // Purple
        pink: '#ec4899',       // Pink
        teal: '#14b8a6',       // Teal
        background: '#f8fafc', // Very light grey
        textPrimary: '#1e293b' // Dark grey blue
    };

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Youtube', 'Tik-Tok', 'Instagram', 'Facebook', 'Messenger', 'Twitter'],
            datasets: [{
                data: [23.4, 15.6, 31.3, 7.8, 15.6, 6.3],
                backgroundColor: [
                    colors.primary,      // Youtube - Blue
                    colors.error,        // TikTok - Red
                    colors.purple,       // Instagram - Purple
                    colors.warning,      // Facebook - Orange
                    colors.teal,         // Messenger - Teal
                    colors.pink          // Twitter - Pink
                ],
                borderWidth: 0,
                cutout: '75%',
                borderRadius: 0          // Remove rounded edges between segments
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 11,
                            family: "'Inter', sans-serif",
                            weight: '500'
                        },
                        color: colors.textPrimary
                    }
                }
            }
        }
    });

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Time Saved',
                data: [30, 45, 25, 60, 35, 40, 50],
                backgroundColor: [
                    colors.primary,
                    colors.purple,
                    colors.teal,
                    colors.warning,
                    colors.error,
                    colors.pink,
                    colors.secondary
                ],
                borderRadius: 8,
                barThickness: 12,
                maxBarThickness: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Weekly Progress',
                    padding: {
                        bottom: 16
                    },
                    font: {
                        size: 13,
                        family: "'Inter', sans-serif",
                        weight: '500'
                    },
                    color: colors.textPrimary
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.background,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.textPrimary,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        padding: 8
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.textPrimary,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        padding: 8
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
});