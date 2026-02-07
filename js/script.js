// 1. Year Update
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('copyright-year');
    const footerYearSpan = document.getElementById('copyright-year-footer');
    const currentYear = new Date().getFullYear();
    if (yearSpan) yearSpan.innerText = currentYear;
    if (footerYearSpan) footerYearSpan.innerText = currentYear;

    // 2. Clickly Link
    const clicklyLink = document.getElementById('clickly-link');
    if (clicklyLink) {
        const currentPath = window.location.pathname === '/' ? 'homepage' : window.location.pathname.replace('/', '');
        clicklyLink.href = `?source=customers&medium=trc&campaign=${currentPath}`;
    }

    // Persistent Tracking Population
    const referrerField = document.getElementById('referrer');
    if (referrerField) {
        let originalReferrer = sessionStorage.getItem('trc_original_referrer');
        if (!originalReferrer) {
            // First time this session - record the entry point
            originalReferrer = document.referrer || 'direct';
            sessionStorage.setItem('trc_original_referrer', originalReferrer);
        }
        referrerField.value = originalReferrer;
    }

    const utmField = document.getElementById('utm_source');
    if (utmField) {
        const urlParams = new URLSearchParams(window.location.search);
        utmField.value = urlParams.get('utm_source') || '';
    }

    // 2. Numeric Only Validation
    const numericFields = ['phone', 'zip'];
    numericFields.forEach(fieldName => {
        const inputs = document.querySelectorAll(`input[name="${fieldName}"]`);
        inputs.forEach(input => {
            // Set attributes for better mobile experience
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');

            input.addEventListener('input', (e) => {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const originalValue = e.target.value;
                const numericValue = originalValue.replace(/[^0-9]/g, '');

                if (originalValue !== numericValue) {
                    e.target.value = numericValue;
                    // Maintain cursor position
                    const diff = originalValue.length - numericValue.length;
                    e.target.setSelectionRange(start - diff, end - diff);
                }
            });
        });
    });
});

// 3. Global Click Tracking (GTM)
document.addEventListener('click', function (e) {
    const element = e.target;
    // Walk up to find anchor/button if clicked on icon inside
    const clickable = element.closest('a') || element.closest('button');

    if (clickable) {
        const text = clickable.innerText || clickable.value || 'Link/Button';
        const id = clickable.id || '';
        const classes = clickable.className;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'generic_click',
            'element_text': text,
            'element_id': id,
            'element_class': classes,
            'page_location': window.location.href
        });
    }
});

// 4. Form Submit
const form = document.getElementById('leadForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const msgDiv = document.getElementById('form-status');
        const submitBtn = form.querySelector('button');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate submission (Replace with actual backend call)
        setTimeout(() => {
            msgDiv.style.display = 'block';
            msgDiv.innerText = 'Thank you! Your quote request has been sent.';
            msgDiv.style.backgroundColor = '#dcfce7';
            msgDiv.style.color = '#166534';
            form.reset();
            submitBtn.innerText = 'Sent!';

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'conversion_form_submit',
                'form_id': 'homepage_hero_form',
                'conversion_value': 1
            });

            // Reset button after success
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                msgDiv.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}
