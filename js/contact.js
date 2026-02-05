// ====== 100% WORKING EMAIL CONTACT FORM ======

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('messageForm');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const generateEmailBtn = document.getElementById('generateEmailBtn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailModal = document.getElementById('emailOptionsModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtn2 = document.getElementById('closeModalBtn');
    const editMessageBtn = document.getElementById('editMessageBtn');
    const openMailtoBtn = document.getElementById('openMailtoBtn');
    const openGmailBtn = document.getElementById('openGmailBtn');
    const copyAllDetailsBtn = document.getElementById('copyAllDetailsBtn');
    const successToast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    
    // Preview elements
    const previewSubject = document.getElementById('previewSubject');
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewMessage = document.getElementById('previewMessage');
    
    // Store email data
    let currentEmailData = null;
    
    // Character counter
    messageInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
        
        if (this.value.length > 900) {
            charCount.style.color = 'var(--secondary-color)';
        } else if (this.value.length > 800) {
            charCount.style.color = 'var(--accent-color)';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    });
    
    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Name validation
        if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Message validation
        if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
    
    // Generate email content with timestamp
    function generateEmailContent() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const timestamp = new Date().toLocaleDateString();
        
        // Create professional email body
        const emailBody = `Hello Mesfin,

I'm ${name} (${email}).

${message}

---
Sent from your portfolio contact form on ${timestamp}
Subject: ${subject}

Best regards,
${name}
${email}`;
        
        return {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: timestamp,
            to: 'mesfinhaileslassie17@gmail.com',
            body: emailBody,
            encodedBody: encodeURIComponent(emailBody),
            encodedSubject: encodeURIComponent(subject)
        };
    }
    
    // Update preview in modal
    function updatePreview() {
        currentEmailData = generateEmailContent();
        
        previewSubject.textContent = currentEmailData.subject;
        previewName.textContent = currentEmailData.name;
        previewEmail.textContent = currentEmailData.email;
        previewMessage.textContent = currentEmailData.body;
        
        // Update mailto link
        openMailtoBtn.href = `mailto:${currentEmailData.to}?subject=${currentEmailData.encodedSubject}&body=${currentEmailData.encodedBody}`;
        
        // Update Gmail link
        openGmailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${currentEmailData.to}&su=${currentEmailData.encodedSubject}&body=${currentEmailData.encodedBody}`;
    }
    
    // Generate email button click
    generateEmailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        updatePreview();
        emailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Copy email details button
    copyEmailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const emailData = generateEmailContent();
        const details = `
To: ${emailData.to}
Subject: ${emailData.subject}
From: ${emailData.name} <${emailData.email}>

Message:
${emailData.message}
        `.trim();
        
        navigator.clipboard.writeText(details).then(() => {
            showToast('Email details copied to clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
            showToast('Failed to copy. Please copy manually.');
        });
    });
    
    // Open mailto link
    openMailtoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Try to open mailto
        const mailtoOpened = window.open(this.href, '_blank');
        
        // Check if mailto was blocked
        setTimeout(() => {
            if (!mailtoOpened || mailtoOpened.closed || typeof mailtoOpened.closed == 'undefined') {
                showToast('Email client blocked. Try Gmail Web option.');
            } else {
                showToast('Opening email client...');
                emailModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 100);
    });
    
    // Open Gmail Web
    openGmailBtn.addEventListener('click', function() {
        showToast('Opening Gmail in new tab...');
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Copy all details button in modal
    copyAllDetailsBtn.addEventListener('click', function() {
        if (!currentEmailData) return;
        
        const fullDetails = `
TO: ${currentEmailData.to}
SUBJECT: ${currentEmailData.subject}
FROM: ${currentEmailData.name} <${currentEmailData.email}>
DATE: ${currentEmailData.timestamp}

MESSAGE:
${currentEmailData.message}

---
This email was generated from Mesfin's portfolio contact form.
Please reply to ${currentEmailData.email} for response.
        `.trim();
        
        navigator.clipboard.writeText(fullDetails).then(() => {
            showToast('All email details copied! Paste into any email app.');
        }).catch(err => {
            console.error('Copy failed:', err);
            showToast('Failed to copy. Please copy manually from preview.');
        });
    });
    
    // Show toast notification
    function showToast(message) {
        toastMessage.textContent = message;
        successToast.classList.add('show');
        
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    }
    
    // Close toast
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            successToast.classList.remove('show');
        });
    }
    
    // Modal functionality
    closeModalBtn.addEventListener('click', () => {
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    closeModalBtn2.addEventListener('click', () => {
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    editMessageBtn.addEventListener('click', () => {
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Scroll to form
        document.querySelector('.contact-form').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            emailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailModal.style.display === 'block') {
            emailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Test fallback: Detect if mailto works
    function testMailtoSupport() {
        const testLink = document.createElement('a');
        testLink.href = 'mailto:test@example.com';
        return testLink.protocol === 'mailto:';
    }
    
    // Initialize character count
    charCount.textContent = messageInput.value.length;
    
    // Add date to footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});