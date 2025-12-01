
document.addEventListener('DOMContentLoaded', function () {
    // Populate programme dropdown from backend
    var programmeSelect = document.getElementById('programme_code');
    if (programmeSelect) {
        fetch('/api/')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (Array.isArray(data) && data.length) {
                    programmeSelect.innerHTML = '<option value="">Select programme</option>';
                    data.forEach(function (p) {
                        var opt = document.createElement('option');
                        opt.value = p.programmeCode || p.programme_code || '';
                        opt.textContent = (p.programmeName || p.programme_name || 'Unnamed') + (p.faculty ? ' — ' + p.faculty : '');
                        programmeSelect.appendChild(opt);
                    });
                }
            })
            .catch(function (err) {
                console.warn('Failed to load programmes for dropdown', err);
            });
    }
    const form = document.getElementById('add-comment-form');
    if (!form) return;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const data = {
            programme_code: form.programme_code.value,
            aspect: form.aspect.value,
            rating: parseInt(form.rating.value, 10),
            comment_title: form.comment_title.value,
            comment_text: form.comment_text.value,
            user_id: 'anonymous' // Replace with real user ID if available
        };
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to submit review');
            // Redirect to blog page to see new comment
            window.location.href = 'blog.html';
        } catch (err) {
            alert('Error submitting review: ' + err.message);
        }
    });
});
