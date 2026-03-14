document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    const postLoading = document.getElementById('post-loading');
    const postArticle = document.getElementById('post-article');
    const postTitleHeader = document.getElementById('post-title-header');
    const postAuthor = document.getElementById('post-author');
    const postDate = document.getElementById('post-date');
    const postImage = document.getElementById('post-image');
    const postContent = document.getElementById('post-content');

    if (!slug) {
        window.location.href = 'blog.html';
        return;
    }

    try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        const blog = await response.json();

        // Update Title
        document.title = `${blog.title} | AjantaElloraOdyssey.com`;
        postTitleHeader.textContent = blog.title;

        // Update Meta
        const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        postAuthor.innerHTML = `<i class="fas fa-user-circle"></i> By ${blog.author || 'Admin'}`;
        postDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;

        // Update Image
        if (blog.image) {
            postImage.src = blog.image;
            postImage.alt = blog.title;
        } else {
            postImage.style.display = 'none';
        }

        // Update Content (Assuming content might contain HTML from a rich text editor or just plain text)
        // If content is plain text with newlines, we can wrap in paragraphs
        if (blog.content.includes('<p>') || blog.content.includes('<div>')) {
            postContent.innerHTML = blog.content;
        } else {
            postContent.innerHTML = blog.content.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
        }

        // Show Article
        postLoading.style.display = 'none';
        postArticle.style.display = 'block';

        // Trigger reveal animations
        if (window.observer) {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => window.observer.observe(el));
        }

    } catch (error) {
        console.error('Error fetching blog post:', error);
        postLoading.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1.5rem;"></i>
                <h2>Oops! Post Not Found</h2>
                <p>The blog post you're looking for might have been moved or deleted.</p>
                <a href="blog.html" class="btn btn-primary" style="margin-top: 1.5rem;">Back to Blog</a>
            </div>
        `;
    }
});
