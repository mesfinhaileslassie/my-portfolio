// ====== PROFESSIONAL CONTACT FORM ======

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('messageForm');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const previewBtn = document.getElementById('previewBtn');
    const openEmailBtn = document.getElementById('openEmailBtn');
    const previewModal = document.getElementById('previewModal');
    const closeModal = document.querySelector('.close-modal');
    const editPreviewBtn = document.getElementById('editPreview');
    const sendFromPreviewBtn = document.getElementById('sendFromPreview');
    const successToast = document.getElementById('successToast');
    const toastClose = document.querySelector('.toast-close');
    
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
    
    // Generate email content
    function generateEmailContent() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        // Create a professional email body
        const emailBody = `
Hello Mesfin,

I'm ${name} (${email}).

${message}

---

This message was sent from your portfolio contact form.
Subject: ${subject}

Best regards,
${name}
${email}`;
        
        return {
            to: 'mesfinhaileslassie17@gmail.com',
            subject: subject,
            body: encodeURIComponent(emailBody)
        };
    }
    
    // Open email client
    function openEmailClient() {
        if (!validateForm()) {
            return;
        }
        
        const emailData = generateEmailContent();
        const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${emailData.body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessToast();
        
        // Optional: Clear form after successful submission
        setTimeout(() => {
            form.reset();
            charCount.textContent = '0';
        }, 1000);
    }
    
    // Show preview modal
    function showPreview() {
        if (!validateForm()) {
            return;
        }
        
        const emailData = generateEmailContent();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Update preview content
        document.getElementById('previewSubject').textContent = emailData.subject;
        document.getElementById('previewSender').textContent = name;
        document.getElementById('previewEmail').textContent = email;
        document.getElementById('previewMessage').textContent = decodeURIComponent(emailData.body);
        
        // Show modal
        previewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Send from preview
    function sendFromPreview() {
        const emailData = generateEmailContent();
        const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${emailData.body}`;
        
        window.location.href = mailtoLink;
        previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showSuccessToast();
    }
    
    // Show success toast
    function showSuccessToast() {
        successToast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 5000);
    }
    
    // Close toast
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            successToast.classList.remove('show');
        });
    }
    
    // Event Listeners
    openEmailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openEmailClient();
    });
    
    previewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPreview();
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Edit preview
    editPreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Send from preview
    sendFromPreviewBtn.addEventListener('click', sendFromPreview);
    
    // Copy email button functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });
    });
    
    // Form submission via Enter key
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
    
    // Initialize character count
    charCount.textContent = messageInput.value.length;
});