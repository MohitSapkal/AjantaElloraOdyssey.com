document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const limit = 6;
    const blogContainer = document.getElementById('blog-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreBtnContainer = document.getElementById('load-more-btn-container');
    const emptyState = document.getElementById('empty-state');

    async function fetchBlogs(page = 1) {
        try {
            // Try relative fetch first
            let response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);

            const data = await response.json();

            if (data.blogs && data.blogs.length > 0) {
                renderBlogs(data.blogs);
                
                if (data.currentPage < data.totalPages) {
                    loadMoreBtnContainer.style.display = 'block';
                } else {
                    loadMoreBtnContainer.style.display = 'none';
                }
                
                emptyState.style.display = 'none';
            } else if (page === 1) {
                blogContainer.innerHTML = '';
                emptyState.style.display = 'block';
                loadMoreBtnContainer.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            


            if (page === 1) {
                blogContainer.innerHTML = '<p class="text-center" style="padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">Failed to load blogs. Please try again later.</p>';
            }
        }
    }

    function renderBlogs(blogs) {
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card reveal';
            
            const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            blogCard.innerHTML = `
                <button class="delete-btn" data-id="${blog._id}" title="Delete Post">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <img src="${blog.image || 'images/tour-placeholder.png'}" alt="${blog.title}" class="blog-card-img" onerror="this.src='images/tour-placeholder.png'">
                <div class="blog-card-content">
                    <span class="blog-tag">Heritage</span>
                    <h2 class="blog-title">${blog.title}</h2>
                    <p class="blog-excerpt">${blog.excerpt || ''}</p>
                    <div class="blog-meta">
                        <span class="blog-author"><i class="fas fa-user-circle"></i> ${blog.author || 'Admin'}</span>
                        <span class="blog-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    </div>
                    <a href="blog-post.html?slug=${blog.slug}" class="btn btn-primary" style="margin-top: 1.5rem; text-align: center;">Read More</a>
                </div>
            `;
            
            // Add delete event listener
            const deleteBtn = blogCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                if (confirm('Are you sure you want to delete this blog post?')) {
                    try {
                        let response = await fetch(`/api/blogs/${blog._id}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            alert('Blog post deleted successfully!');
                            blogCard.remove();
                            // If container is empty after removal, show empty state
                            if (blogContainer.children.length === 0 && currentPage === 1) {
                                emptyState.style.display = 'block';
                            }
                        } else {
                            const error = await response.json();
                            alert('Error: ' + (error.error || 'Failed to delete blog post'));
                        }
                    } catch (err) {
                        console.error('Error deleting blog:', err);
                        alert('An error occurred while deleting the blog post.');
                    }
                }
            });

            blogContainer.appendChild(blogCard);
        });
        
        // Trigger reveal animations if script.js has the reveal observer
        if (window.observer) {
            const newCards = blogContainer.querySelectorAll('.blog-card.reveal:not(.active)');
            newCards.forEach(el => window.observer.observe(el));
        } else {
            // Safety: if observer is somehow missing, just show them
            const cards = blogContainer.querySelectorAll('.blog-card.reveal');
            cards.forEach(el => el.classList.add('active'));
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            fetchBlogs(currentPage);
        });
    }

    // Initial fetch
    fetchBlogs();
});
