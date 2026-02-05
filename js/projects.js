// ====== PROJECTS PAGE ENHANCEMENTS ======

// Project details data
const projectDetails = {
    clearance: {
        title: "Clearance Management System",
        description: "A comprehensive desktop application developed to streamline the student clearance process at universities. This system automates the entire workflow, reducing manual paperwork and processing time.",
        features: [
            "User authentication for students, staff, and admin",
            "Automated clearance workflow across departments",
            "Real-time status tracking",
            "Report generation in PDF format",
            "Email notifications for clearance updates",
            "Admin dashboard with analytics"
        ],
        technologies: [
            "Java (Core Java, Swing for GUI)",
            "MySQL Database",
            "JDBC for database connectivity",
            "iTextPDF for report generation",
            "JavaMail API for email notifications"
        ],
        challenges: [
            "Designing an intuitive GUI for non-technical users",
            "Managing concurrent database transactions",
            "Implementing secure authentication",
            "Optimizing database queries for performance"
        ],
        solutions: [
            "Used Swing's CardLayout for smooth navigation",
            "Implemented connection pooling for database",
            "Used prepared statements to prevent SQL injection",
            "Added indexes to frequently queried columns"
        ],
        github: "https://github.com/Mesfinchacha/clearance-management-system",
        liveDemo: null,
        screenshots: []
    }
};

// Modal functionality
function setupProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalContent = document.getElementById('modalContent');
    
    // View details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            showProjectDetails(projectId);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function showProjectDetails(projectId) {
    const project = projectDetails[projectId];
    const modalContent = document.getElementById('modalContent');
    
    if (!project) return;
    
    modalContent.innerHTML = `
        <div class="modal-project">
            <h2>${project.title}</h2>
            <p class="project-description">${project.description}</p>
            
            <div class="modal-sections">
                <div class="modal-section">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-code"></i> Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-trophy"></i> Challenges & Solutions</h3>
                    <div class="challenge-solution">
                        <div class="challenges">
                            <h4>Challenges:</h4>
                            <ul>
                                ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="solutions">
                            <h4>Solutions:</h4>
                            <ul>
                                ${project.solutions.map(solution => `<li>${solution}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-links">
                ${project.github ? `
                    <a href="${project.github}" target="_blank" class="btn">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                ` : ''}
                ${project.liveDemo ? `
                    <a href="${project.liveDemo}" target="_blank" class="btn btn-outline">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// GitHub stats fetch (if you want to show dynamic stats)
async function fetchGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/Mesfinchacha');
        if (!response.ok) throw new Error('GitHub API error');
        
        const data = await response.json();
        
        // Update GitHub card with real data
        const githubCard = document.querySelector('.github-card');
        if (githubCard) {
            githubCard.innerHTML += `
                <div class="stats">
                    <div class="stat">
                        <span class="stat-number">${data.public_repos}</span>
                        <span class="stat-label">Repositories</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${data.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.log('GitHub stats not available:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupProjectModal();
    fetchGitHubStats();
    
    // Add project count badge
    const projectCount = document.querySelectorAll('.project-card').length;
    const heroSubtitle = document.querySelector('.projects-hero p');
    if (heroSubtitle) {
        heroSubtitle.innerHTML += ` <span class="badge">${projectCount} Projects</span>`;
    }
});