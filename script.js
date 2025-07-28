document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const problemForm = document.getElementById('problem-form');
    const problemsTable = document.getElementById('problems-tbody');
    const totalProblemsEl = document.getElementById('total-problems');
    const easyCountEl = document.getElementById('easy-count');
    const mediumCountEl = document.getElementById('medium-count');
    const hardCountEl = document.getElementById('hard-count');
    const filterPlatform = document.getElementById('filter-platform');
    const filterDifficulty = document.getElementById('filter-difficulty');
    const filterTopic = document.getElementById('filter-topic');
    const clearFiltersBtn = document.getElementById('clear-filters');

    // Problem data
    let problems = JSON.parse(localStorage.getItem('dsaProblems')) || [];

    // Initialize the app
    function init() {
        renderProblems();
        updateStats();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        problemForm.addEventListener('submit', handleFormSubmit);
        filterPlatform.addEventListener('change', filterProblems);
        filterDifficulty.addEventListener('change', filterProblems);
        filterTopic.addEventListener('change', filterProblems);
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const problemName = document.getElementById('problem-name').value;
        const problemLink = document.getElementById('problem-link').value;
        const platform = document.getElementById('platform').value;
        const difficulty = document.getElementById('difficulty').value;
        const topic = document.getElementById('topic').value;
        const solution = document.getElementById('solution').value;
        
        const newProblem = {
            id: Date.now(),
            name: problemName,
            link: problemLink,
            platform: platform,
            difficulty: difficulty,
            topic: topic,
            solution: solution,
            date: new Date().toISOString()
        };
        
        problems.push(newProblem);
        saveProblems();
        renderProblems();
        updateStats();
        problemForm.reset();
    }

    // Save problems to localStorage
    function saveProblems() {
        localStorage.setItem('dsaProblems', JSON.stringify(problems));
    }

    // Render problems to the table
    function renderProblems(filteredProblems = null) {
        const problemsToRender = filteredProblems || problems;
        problemsTable.innerHTML = '';
        
        if (problemsToRender.length === 0) {
            problemsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">No problems found. Add some problems to get started!</td></tr>';
            return;
        }
        
        problemsToRender.forEach(problem => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><a href="${problem.link}" target="_blank">${problem.name}</a></td>
                <td><span class="platform-badge platform-${problem.platform}">${getPlatformName(problem.platform)}</span></td>
                <td class="difficulty-${problem.difficulty}">${capitalizeFirstLetter(problem.difficulty)}</td>
                <td>${capitalizeFirstLetter(problem.topic)}</td>
                <td class="action-buttons">
                    <button class="view-btn" onclick="window.open('${problem.link}', '_blank')"><i class="fas fa-eye"></i></button>
                    ${problem.solution ? `<button class="solution-btn" onclick="window.open('${problem.solution}', '_blank')"><i class="fas fa-code"></i></button>` : '<button class="solution-btn" disabled><i class="fas fa-code"></i></button>'}
                    <button class="delete-btn" data-id="${problem.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            problemsTable.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteProblem(id);
            });
        });
    }

    // Delete a problem
    function deleteProblem(id) {
        if (confirm('Are you sure you want to delete this problem?')) {
            problems = problems.filter(problem => problem.id !== id);
            saveProblems();
            renderProblems();
            updateStats();
        }
    }

    // Update statistics
    function updateStats() {
        totalProblemsEl.textContent = problems.length;
        easyCountEl.textContent = problems.filter(p => p.difficulty === 'easy').length;
        mediumCountEl.textContent = problems.filter(p => p.difficulty === 'medium').length;
        hardCountEl.textContent = problems.filter(p => p.difficulty === 'hard').length;
    }

    // Filter problems based on selected filters
    function filterProblems() {
        const platform = filterPlatform.value;
        const difficulty = filterDifficulty.value;
        const topic = filterTopic.value;
        
        let filtered = problems;
        
        if (platform !== 'all') {
            filtered = filtered.filter(p => p.platform === platform);
        }
        
        if (difficulty !== 'all') {
            filtered = filtered.filter(p => p.difficulty === difficulty);
        }
        
        if (topic !== 'all') {
            filtered = filtered.filter(p => p.topic === topic);
        }
        
        renderProblems(filtered);
    }

    // Clear all filters
    function clearFilters() {
        filterPlatform.value = 'all';
        filterDifficulty.value = 'all';
        filterTopic.value = 'all';
        renderProblems();
    }
    // Auth System Implementation
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('dsaUsers')) || [];
    this.currentUser = null;
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(username, email, password) {
    if (this.users.some(u => u.email === email)) {
      return false;
    }
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    localStorage.setItem('dsaUsers', JSON.stringify(this.users));
    return true;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}

// Analysis Dashboard Implementation
class ProblemAnalyzer {
  constructor() {
    this.streak = 0;
    this.weeklyGoal = 7;
    this.updateDashboard();
  }

  calculateStreak() {
    let currentStreak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const problemsToday = problems.filter(p => p.date.startsWith(dateStr)).length;
      
      if (problemsToday > 0) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    this.streak = currentStreak;
    document.getElementById('streak-counter').querySelector('p').textContent = `${this.streak} days`;
  }

  updateWeeklyGoal() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    let problemsThisWeek = 0;
    let currentDate = new Date(startOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      problemsThisWeek += problems.filter(p => p.date.startsWith(dateStr)).length;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const progress = Math.min(problemsThisWeek, this.weeklyGoal);
    const progressElement = document.querySelector('#weekly-goal progress');
    progressElement.value = progress;
    progressElement.max = this.weeklyGoal;
    document.querySelector('#weekly-goal .goal-progress span').textContent = `${progress}/${this.weeklyGoal}`;
  }

  renderTopicDistribution() {
    const topics = {};
    problems.forEach(problem => {
      topics[problem.topic] = (topics[problem.topic] || 0) + 1;
    });
    
    const ctx = document.getElementById('topicChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(topics),
        datasets: [{
          data: Object.values(topics),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC249', '#EA5F89', '#00BFFF', '#FFD700'
          ]
        }]
      }
    });
  }

  updateDashboard() {
    this.calculateStreak();
    this.updateWeeklyGoal();
    this.renderTopicDistribution();
    // Add more dashboard updates as needed
  }
}
// Recommendation System
class ProblemRecommender {
  constructor() {
    this.recommendations = [];
    this.updateRecommendations();
  }

  updateRecommendations() {
    // Analyze weak areas
    const topicCounts = {};
    problems.forEach(p => {
      topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
    });
    
    // Find least practiced topics
    const sortedTopics = Object.entries(topicCounts).sort((a, b) => a[1] - b[1]);
    const weakTopics = sortedTopics.slice(0, 2).map(t => t[0]);
    
    // Generate recommendations
    this.recommendations = [
      {
        type: 'weak-topic',
        topic: weakTopics[0],
        difficulty: this.getRecommendedDifficulty(),
        message: `Practice more ${weakTopics[0]} problems`
      },
      {
        type: 'daily-challenge',
        difficulty: 'medium',
        message: 'Try today\'s challenge problem'
      },
      {
        type: 'review',
        days: 7,
        message: 'Review problems solved last week'
      }
    ];
    
    this.renderRecommendations();
  }

  getRecommendedDifficulty() {
    const counts = {
      easy: problems.filter(p => p.difficulty === 'easy').length,
      medium: problems.filter(p => p.difficulty === 'medium').length,
      hard: problems.filter(p => p.difficulty === 'hard').length
    };
    
    if (counts.hard < counts.medium / 3) return 'hard';
    if (counts.medium < counts.easy / 2) return 'medium';
    return 'easy';
  }

  renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '<h3>Recommended Problems</h3>';
    
    this.recommendations.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
      card.innerHTML = `
        <p>${rec.message}</p>
        <button class="find-problems" data-type="${rec.type}" data-topic="${rec.topic || ''}">
          Find Problems
        </button>
      `;
      container.appendChild(card);
    });
  }
}
// Social Features Implementation
class SocialFeatures {
  constructor() {
    this.badges = [
      { id: 'first-problem', name: 'First Problem', earned: false },
      { id: 'streak-7', name: '7-Day Streak', earned: false },
      { id: 'solve-50', name: '50 Problems', earned: false },
      { id: 'all-easy', name: 'Easy Master', earned: false },
      { id: 'all-medium', name: 'Medium Master', earned: false },
      { id: 'all-hard', name: 'Hard Master', earned: false }
    ];
    
    this.checkAchievements();
    this.setupShareButtons();
  }

  checkAchievements() {
    // Check streak
    const streak = new ProblemAnalyzer().streak;
    if (streak >= 7) {
      this.updateBadge('streak-7', true);
    }
    
    // Check problem counts
    if (problems.length >= 1) {
      this.updateBadge('first-problem', true);
    }
    if (problems.length >= 50) {
      this.updateBadge('solve-50', true);
    }
    
    // Check difficulty mastery
    const difficulties = ['easy', 'medium', 'hard'];
    difficulties.forEach(diff => {
      if (problems.filter(p => p.difficulty === diff).length >= 20) {
        this.updateBadge(`all-${diff}`, true);
      }
    });
    
    this.renderBadges();
  }

  updateBadge(id, earned) {
    const badge = this.badges.find(b => b.id === id);
    if (badge) badge.earned = earned;
  }

  renderBadges() {
    const container = document.getElementById('badges-container');
    container.innerHTML = '';
    
    this.badges.forEach(badge => {
      const badgeElement = document.createElement('div');
      badgeElement.className = `badge ${badge.earned ? 'earned' : 'locked'}`;
      badgeElement.innerHTML = `
        <i class="fas ${badge.earned ? 'fa-medal' : 'fa-lock'}"></i>
        <span>${badge.name}</span>
      `;
      container.appendChild(badgeElement);
    });
  }

  setupShareButtons() {
    document.getElementById('share-twitter').addEventListener('click', () => {
      const text = `I've solved ${problems.length} DSA problems on @DSATracker! My current streak is ${new ProblemAnalyzer().streak} days. #DSATracker #Programming`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
    
    document.getElementById('share-linkedin').addEventListener('click', () => {
      // LinkedIn sharing implementation
    });
    
    document.getElementById('export-image').addEventListener('click', () => {
      // Export dashboard as image
    });
  }
}

    // Helper functions
    function getPlatformName(platform) {
        const platformNames = {
            'leetcode': 'LeetCode',
            'codeforces': 'Codeforces',
            'hackerrank': 'HackerRank',
            'other': 'Other'
        };
        return platformNames[platform] || platform;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize the app
    init();
});