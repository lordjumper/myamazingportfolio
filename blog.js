document.addEventListener('DOMContentLoaded', function() {
    // Get query parameter to determine if we're viewing a single post
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    fetch('./blog-posts.json')
      .then(response => response.json())
      .then(data => {
        if (postId) {
          // Single post view
          const post = data.posts.find(post => post.id === postId);
          if (post) {
            displaySinglePost(post, data.posts);
          } else {
            // Post not found, redirect to blog index
            window.location.href = 'blog.html';
          }
        } else {
          // Blog index view
          displayBlogIndex(data.posts);
        }
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  });
  
  function displayBlogIndex(posts) {
    const featuredPost = posts[0]; // Most recent post is featured
    const container = document.querySelector('.blog-container');
    
    // Create featured post HTML
    const featuredPostHTML = `
      <div class="featured-post">
        <div class="post-date">${featuredPost.date}</div>
        <h2 class="post-title">${featuredPost.title}</h2>
        <p class="post-excerpt">${featuredPost.excerpt}</p>
        <a href="blog.html?post=${featuredPost.id}" class="read-more">Read more <i class="fas fa-arrow-right"></i></a>
        <div class="post-tags">
          ${featuredPost.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
      </div>
    `;
    
    // Create posts grid HTML for remaining posts
    let postsGridHTML = '<div class="posts-grid">';
    
    if (posts.length > 1) {
      // Add remaining posts to the grid
      postsGridHTML += posts.slice(1).map(post => `
        <div class="post-card">
          <div class="post-date">${post.date}</div>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-excerpt">${post.excerpt}</p>
          <a href="blog.html?post=${post.id}" class="read-more">Read more <i class="fas fa-arrow-right"></i></a>
          <div class="post-tags">
            ${post.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
    
    postsGridHTML += '</div>';
    
    container.innerHTML = featuredPostHTML + postsGridHTML;
  }
  
  function displaySinglePost(post, allPosts) {
    // Hide the blog container and svg background
    const blogContainer = document.querySelector('.blog-container');
    if (blogContainer) {
      blogContainer.style.display = 'none';
    }
    
    const blogHeader = document.querySelector('.blog-header');
    if (blogHeader) {
      blogHeader.style.display = 'none';
    }
    
    const svgContainer = document.querySelector('.svg-container');
    if (svgContainer) {
      svgContainer.style.display = 'none';
    }
    
    // Create the blog post container if it doesn't exist
    let blogPostContainer = document.querySelector('.blog-post-container');
    if (!blogPostContainer) {
      blogPostContainer = document.createElement('div');
      blogPostContainer.className = 'blog-post-container';
      document.body.appendChild(blogPostContainer);
    }
    
    // Find the current post index
    const currentIndex = allPosts.findIndex(p => p.id === post.id);
    
    // Calculate previous and next post indexes
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
    const nextIndex = currentIndex < allPosts.length - 1 ? currentIndex + 1 : null;
    
    // Generate previous and next links based on available posts
    let prevLink = '<a style="visibility: hidden" class="prev"><i class="fas fa-arrow-left"></i> Previous Post</a>';
    let nextLink = '<a style="visibility: hidden" class="next">Next Post <i class="fas fa-arrow-right"></i></a>';
    
    if (prevIndex !== null) {
      const prevPost = allPosts[prevIndex];
      prevLink = `<a href="blog.html?post=${prevPost.id}" class="prev" title="${prevPost.title}"><i class="fas fa-arrow-left"></i> Previous Post</a>`;
    }
    
    if (nextIndex !== null) {
      const nextPost = allPosts[nextIndex];
      nextLink = `<a href="blog.html?post=${nextPost.id}" class="next" title="${nextPost.title}">Next Post <i class="fas fa-arrow-right"></i></a>`;
    }
    
    const prevNextLinks = `
      <div class="post-navigation">
        ${prevLink}
        <a href="blog.html" class="back">All Posts</a>
        ${nextLink}
      </div>
    `;
    
    // Fill the blog post container with content
    blogPostContainer.innerHTML = `
      <article>
        <header class="post-header">
          <div class="post-date">${post.date}</div>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-tags">
            ${post.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
        </header>
        
        <div class="post-content">
          ${post.content}
        </div>
        
        ${prevNextLinks}
      </article>
    `;
    
    // Update the page title
    document.title = `${post.title} | Mina's Blog`;
  }