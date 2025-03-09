document.addEventListener('DOMContentLoaded', function() {
  // Store posts data globally so we can access it without refetching
  let allPostsData = null;
  
  // Original DOM structure references
  const originalBlogContainer = document.querySelector('.blog-container').cloneNode(true);
  
  // Initial load of blog data
  loadBlogData();
  
  // Function to load blog data once and process based on URL parameters
  function loadBlogData() {
      // Get query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      const searchTag = urlParams.get('tag');
      const searchQuery = urlParams.get('q');
      
      fetch('./blog-posts.json')
        .then(response => response.json())
        .then(data => {
          // Store posts data globally
          allPostsData = data;
          
          processView(postId, searchTag, searchQuery);
        })
        .catch(error => {
          console.error('Error fetching blog posts:', error);
        });
  }
  
  // Function to process the current view based on parameters
  function processView(postId, searchTag, searchQuery) {
      if (!allPostsData) return;
      
      // Reset page state - show all elements by default
      resetPageState();
      
      if (postId) {
        // Single post view
        const post = allPostsData.posts.find(post => post.id === postId);
        if (post) {
          displaySinglePost(post, allPostsData.posts);
        } else {
          // Post not found, show blog index
          updateURLWithoutReload('blog.html');
          displayBlogIndex(allPostsData.posts, allPostsData.posts);
        }
      } else {
        // Blog index view - with or without filtering
        let filteredPosts = allPostsData.posts;
        let filterType = null;
        
        // Filter posts by tag if a tag parameter is provided
        if (searchTag) {
          filteredPosts = allPostsData.posts.filter(post => 
            post.tags.some(tag => tag.toLowerCase() === searchTag.toLowerCase())
          );
          filterType = 'tag';
        }
        
        // Filter posts by search query (title or tags)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredPosts = allPostsData.posts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.tags.some(tag => tag.toLowerCase().includes(query))
          );
          filterType = 'search';
        }
        
        displayBlogIndex(filteredPosts, allPostsData.posts, searchTag, searchQuery, filterType);
      }
  }
  
  // Function to reset the page state to its initial configuration
  function resetPageState() {
      // Restore all original elements and their visibility
      const blogHeader = document.querySelector('.blog-header');
      if (blogHeader) {
          blogHeader.style.display = ''; // Reset to default display style
      }
      
      const svgContainer = document.querySelector('.svg-container');
      if (svgContainer) {
          svgContainer.style.display = '';
      }
      
      const blogContainer = document.querySelector('.blog-container');
      if (blogContainer) {
          blogContainer.style.display = '';
      }
      
      // Remove any single post container that might exist
      const existingPostContainer = document.querySelector('.blog-post-container');
      if (existingPostContainer) {
          existingPostContainer.remove();
      }
  }
  
  // Add event listener for the global click event to handle all tag and navigation links
  document.body.addEventListener('click', function(e) {
      // Check if the clicked element is a tag link or navigation link
      const targetElement = e.target.closest('a');
      
      if (targetElement) {
          const href = targetElement.getAttribute('href');
          
          // Only intercept blog.html links
          if (href && href.startsWith('blog.html')) {
              e.preventDefault();
              
              // Update URL without reloading
              updateURLWithoutReload(href);
              
              // Parse the new URL params
              const newURL = new URL(href, window.location.origin);
              const urlParams = new URLSearchParams(newURL.search);
              const postId = urlParams.get('post');
              const searchTag = urlParams.get('tag');
              const searchQuery = urlParams.get('q');
              
              // Process view based on new params
              processView(postId, searchTag, searchQuery);
              
              return false;
          }
      }
  });
  
  // Function to update URL without page reload
  function updateURLWithoutReload(url) {
      const newUrl = url.replace('blog.html', window.location.pathname);
      window.history.pushState({}, '', newUrl);
  }
  
  // Add event listener for search form submission
  document.body.addEventListener('submit', function(e) {
      const form = e.target.closest('#blog-search-form');
      if (form) {
          e.preventDefault();
          const searchInput = form.querySelector('#blog-search-input');
          if (searchInput && searchInput.value.trim()) {
              const searchQuery = encodeURIComponent(searchInput.value.trim());
              
              // Update URL without reloading
              updateURLWithoutReload(`blog.html?q=${searchQuery}`);
              
              // Process search
              processView(null, null, searchInput.value.trim());
          }
          return false;
      }
  });
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      const searchTag = urlParams.get('tag');
      const searchQuery = urlParams.get('q');
      
      processView(postId, searchTag, searchQuery);
  });
});

function displayBlogIndex(posts, allPosts, activeTag, searchQuery, filterType) {
  // Get the blog container (which contains the post list)
  const container = document.querySelector('.blog-container');
  if (!container) return;
  
  // Create search bar and filter section
  const allTags = [...new Set(allPosts.flatMap(post => post.tags))].sort();
  
  let searchHTML = `
    <div class="blog-search-wrapper">
      <div class="search-container">
        <form autocomplete="off" id="blog-search-form">
          <input type="text" id="blog-search-input" placeholder="Search by title or tag" 
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
  const featuredPostHTML = featuredPost ? `
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
  ` : '';
  
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
  
  // Update the page title
  document.title = "Mina's Blog";
  
  // Handle footer visibility
  handleFooter(false);
}

function displaySinglePost(post, allPosts) {
  // Hide the blog container
  const blogContainer = document.querySelector('.blog-container');
  if (blogContainer) {
    blogContainer.style.display = 'none';
  }
  
  // Hide the blog header when displaying a single post
  const blogHeader = document.querySelector('.blog-header');
  if (blogHeader) {
    blogHeader.style.display = 'none';
  }
  
  // Create the blog post container if it doesn't exist
  let blogPostContainer = document.querySelector('.blog-post-container');
  if (!blogPostContainer) {
    blogPostContainer = document.createElement('div');
    blogPostContainer.className = 'blog-post-container';
    
    // Important: Insert after the navigation, not after the header (since header is now hidden)
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && navContainer.nextSibling) {
      document.body.insertBefore(blogPostContainer, navContainer.nextSibling);
    } else {
      document.body.appendChild(blogPostContainer);
    }
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
  
  // Handle footer visibility
  handleFooter(true);
}

function handleFooter(isSinglePost) {
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  if (isSinglePost) {
      footer.style.display = 'none';
  } else {
      // We're on the main blog index, position the footer after content
      const blogContainer = document.querySelector('.blog-container');
      
      if (blogContainer) {
          // Show footer and position it after blog content
          footer.style.display = 'block';
          document.body.appendChild(footer);
          footer.style.marginTop = '2rem';
      }
  }
}

// Add this separate event listener to your blog.js file
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu immediately without waiting for project data
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  
  // Toggle menu on hamburger click
  mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-open');
      mobileMenuToggle.classList.toggle('active');
  });
  
  // Close menu on X click
  if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      });
  }
  
  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      });
  });
  
  // Close menu when clicking outside the menu content
  mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      }
  });
  
  // Add resize listener to handle window size changes
  window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      }
  });
});