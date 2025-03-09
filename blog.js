document.addEventListener('DOMContentLoaded', function() {
    // Get query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    const searchTag = urlParams.get('tag');
    const searchQuery = urlParams.get('q');
    
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
          // Blog index view - with or without filtering
          let filteredPosts = data.posts;
          let filterType = null;
          
          // Filter posts by tag if a tag parameter is provided
          if (searchTag) {
            filteredPosts = data.posts.filter(post => 
              post.tags.some(tag => tag.toLowerCase() === searchTag.toLowerCase())
            );
            filterType = 'tag';
          }
          
          // Filter posts by search query (title or tags)
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = data.posts.filter(post => 
              post.title.toLowerCase().includes(query) || 
              post.tags.some(tag => tag.toLowerCase().includes(query))
            );
            filterType = 'search';
          }
          
          displayBlogIndex(filteredPosts, data.posts, searchTag, searchQuery, filterType);
        }
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
      
    // Add event listener for search form submission
    const searchForm = document.getElementById('blog-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput.value.trim()) {
          window.location.href = `blog.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
});

function displayBlogIndex(posts, allPosts, activeTag, searchQuery, filterType) {
    const container = document.querySelector('.blog-container');
    
    // Create search bar and filter section
    const allTags = [...new Set(allPosts.flatMap(post => post.tags))].sort();
    
    let searchHTML = `
      <div class="blog-search-wrapper">
        <div class="search-container">
          <form id="blog-search-form">
            <input type="text" id="blog-search-input" placeholder="Search by title or tag..." 
                value="${searchQuery || ''}" aria-label="Search posts">
            <button type="submit" class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div class="tag-filter">
          <h3>Filter by Tag</h3>
          <div class="tag-list">
            <a href="blog.html" class="tag-link ${!activeTag ? 'active' : ''}">All</a>
            ${allTags.map(tag => 
              `<a href="blog.html?tag=${encodeURIComponent(tag)}" 
                  class="tag-link ${activeTag && tag.toLowerCase() === activeTag.toLowerCase() ? 'active' : ''}">${tag}</a>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
    
    if (posts.length === 0) {
      // No posts found
      let message = '';
      if (filterType === 'tag') {
        message = `No posts found with the tag "${activeTag}".`;
      } else if (filterType === 'search') {
        message = `No posts found matching "${searchQuery}".`;
      }
      
      container.innerHTML = searchHTML + `
        <div class="no-results">
          <p>${message} <a href="blog.html">View all posts</a>.</p>
        </div>
      `;
      return;
    }
    
    // Display search results header if needed
    let resultsHeader = '';
    if (filterType === 'tag') {
      resultsHeader = `<div class="search-results-header"><h2>Posts tagged with "${activeTag}"</h2></div>`;
    } else if (filterType === 'search') {
      resultsHeader = `<div class="search-results-header"><h2>Search results for "${searchQuery}"</h2></div>`;
    }
    
    const featuredPost = posts[0]; // Most recent post is featured
    
    // Create featured post HTML
    const featuredPostHTML = `
      <div class="featured-post">
        <div class="post-date">${featuredPost.date}</div>
        <h2 class="post-title">${featuredPost.title}</h2>
        <p class="post-excerpt">${featuredPost.excerpt}</p>
        <a href="blog.html?post=${featuredPost.id}" class="read-more">Read more <i class="fas fa-arrow-right"></i></a>
        <div class="post-tags">
          ${featuredPost.tags.map(tag => 
            `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag-pill">${tag}</a>`
          ).join('')}
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
            ${post.tags.map(tag => 
              `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag-pill">${tag}</a>`
            ).join('')}
          </div>
        </div>
      `).join('');
    }
    
    postsGridHTML += '</div>';
    
    container.innerHTML = searchHTML + resultsHeader + featuredPostHTML + postsGridHTML;
    
    // Re-attach the event listener to the search form
    const searchForm = document.getElementById('blog-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput.value.trim()) {
          window.location.href = `blog.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
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
    
    // Add search bar to the post view for easy navigation back to search
    const searchBar = `
      <div class="search-container single-post-search">
        <form id="blog-search-form" action="blog.html">
          <input type="text" id="blog-search-input" placeholder="Search by title or tag..." aria-label="Search posts">
          <button type="submit" class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </form>
      </div>
    `;
    
    // Fill the blog post container with content
    blogPostContainer.innerHTML = `
      ${searchBar}
      <article>
        <header class="post-header">
          <div class="post-date">${post.date}</div>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-tags">
            ${post.tags.map(tag => 
              `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag-pill">${tag}</a>`
            ).join('')}
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
    
    // Re-attach the event listener to the search form
    const searchForm = document.getElementById('blog-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('blog-search-input');
        if (searchInput.value.trim()) {
          window.location.href = `blog.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle the footer visibility
    function handleFooter() {
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      // Check if we're on a single blog post page
      const isSinglePost = document.querySelector('.blog-post-container');
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      
      // If we're viewing a single post or the URL has a post parameter, hide the footer
      if (isSinglePost || postId) {
        footer.style.display = 'none';
      } else {
        // We're on the main blog index, position the footer after content
        const blogContainer = document.querySelector('.blog-container');
        
        if (blogContainer) {
          // Wait for blog content to fully load
          let checkContent = setInterval(function() {
            if (blogContainer.offsetHeight > 0) {
              clearInterval(checkContent);
              
              // Show footer and position it after blog content
              footer.style.display = 'block';
              document.body.appendChild(footer);
              footer.style.marginTop = '2rem';
            }
          }, 100);
        }
      }
    }
    
    // Run the function when page loads
    handleFooter();
    
    // Also handle footer when URL changes (for single-page applications)
    window.addEventListener('popstate', function() {
      handleFooter();
    });
  });