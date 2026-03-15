document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-blog-form');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            image: document.getElementById('image').value || 'images/tour-placeholder.png',
            excerpt: document.getElementById('excerpt').value,
            content: document.getElementById('content').value
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Publishing...';
        message.textContent = '';

        const apiUrl = window.location.port && window.location.port !== '5000' ? 'http://localhost:5000/api/blogs' : '/api/blogs';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            message.style.padding = '12px';
            message.style.borderRadius = '6px';
            message.style.fontWeight = '600';

            if (response.ok) {
                message.style.color = '#155724';
                message.style.backgroundColor = '#d4edda';
                message.style.border = '1px solid #c3e6cb';
                message.textContent = 'Success! Redirecting to blog page...';
                form.reset();
                setTimeout(() => {
                    window.location.href = 'blog.html';
                }, 2000);
            } else {
                message.style.color = '#721c24';
                message.style.backgroundColor = '#f8d7da';
                message.style.border = '1px solid #f5c6cb';
                message.textContent = data.error || 'Failed to create blog post.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publish Blog Post';
            }
        } catch (error) {
            console.error('Error:', error);
            message.style.padding = '12px';
            message.style.borderRadius = '6px';
            message.style.fontWeight = '600';
            message.style.color = '#721c24';
            message.style.backgroundColor = '#f8d7da';
            message.style.border = '1px solid #f5c6cb';
            message.textContent = 'An error occurred connecting to the server. Please try again.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publish Blog Post';
        }
    });
});
