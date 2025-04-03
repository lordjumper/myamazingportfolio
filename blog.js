document.addEventListener('DOMContentLoaded', function() {
  let allPostsData = null;
  
  const originalBlogContainer = document.querySelector('.blog-container').cloneNode(true);
  
  loadBlogData();
  
  function loadBlogData() {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      const searchTag = urlParams.get('tag');
      const searchQuery = urlParams.get('q');
      
      fetch('./blog-posts.json')
        .then(response => response.json())
        .then(data => {
          allPostsData = data;
          
          processView(postId, searchTag, searchQuery);
        })
        .catch(error => {
          console.error('Error fetching blog posts:', error);
        });
  }
  
  function processView(postId, searchTag, searchQuery) {
      if (!allPostsData) return;
      
      resetPageState();
      
      if (postId) {
        const post = allPostsData.posts.find(post => post.id === postId);
        if (post) {
          displaySinglePost(post, allPostsData.posts);
        } else {
          updateURLWithoutReload('blog.html');
          displayBlogIndex(allPostsData.posts, allPostsData.posts);
        }
      } else {
        let filteredPosts = allPostsData.posts;
        let filterType = null;
        
        if (searchTag) {
          filteredPosts = allPostsData.posts.filter(post => 
            post.tags.some(tag => tag.toLowerCase() === searchTag.toLowerCase())
          );
          filterType = 'tag';
        }
        
        if (searchQuery && searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          filteredPosts = allPostsData.posts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.tags.some(tag => tag.toLowerCase().includes(query))
          );
          filterType = 'search';
        }
        
        displayBlogIndex(filteredPosts, allPostsData.posts, searchTag, searchQuery, filterType);
      }
  }
  
  function resetPageState() {
      const blogHeader = document.querySelector('.blog-header');
      if (blogHeader) {
          blogHeader.style.display = '';
      }
      
      const svgContainer = document.querySelector('.svg-container');
      if (svgContainer) {
          svgContainer.style.display = '';
      }
      
      const blogContainer = document.querySelector('.blog-container');
      if (blogContainer) {
          blogContainer.style.display = '';
      }
      
      const existingPostContainer = document.querySelector('.blog-post-container');
      if (existingPostContainer) {
          existingPostContainer.remove();
      }
  }
  
  // Event listener for tag and navigation links
  document.body.addEventListener('click', function(e) {
      const targetElement = e.target.closest('a');
      
      if (targetElement) {
          const href = targetElement.getAttribute('href');
          
          if (href && href.startsWith('blog.html')) {
              e.preventDefault();
              
              updateURLWithoutReload(href);
              
              const newURL = new URL(href, window.location.origin);
              const urlParams = new URLSearchParams(newURL.search);
              const postId = urlParams.get('post');
              const searchTag = urlParams.get('tag');
              const searchQuery = urlParams.get('q');
              
              processView(postId, searchTag, searchQuery);
              
              return false;
          }
      }
  });
  
  function updateURLWithoutReload(url) {
      const newUrl = url.replace('blog.html', window.location.pathname);
      window.history.pushState({}, '', newUrl);
  }
  
  // Search form submission handler
  document.body.addEventListener('submit', function(e) {
      const form = e.target.closest('#blog-search-form');
      if (form) {
          e.preventDefault();
          const searchInput = form.querySelector('#blog-search-input');
          
          if (searchInput) {
              const searchValue = searchInput.value.trim();
              
              if (searchValue) {
                  const searchQuery = encodeURIComponent(searchValue);
                  updateURLWithoutReload(`blog.html?q=${searchQuery}`);
                  processView(null, null, searchValue);
              } else {
                  updateURLWithoutReload('blog.html');
                  processView(null, null, null);
              }
          }
          return false;
      }
  });
  
  // Browser history navigation handler
  window.addEventListener('popstate', function() {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      const searchTag = urlParams.get('tag');
      const searchQuery = urlParams.get('q');
      
      processView(postId, searchTag, searchQuery);
  });
});

// Blog index page display
function displayBlogIndex(posts, allPosts, activeTag, searchQuery, filterType) {
  const container = document.querySelector('.blog-container');
  if (!container) return;
  
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
  
  let resultsHeader = '';
  if (filterType === 'tag') {
    resultsHeader = `<div class="search-results-header"><h2>Posts tagged with "${activeTag}"</h2></div>`;
  } else if (filterType === 'search') {
    resultsHeader = `<div class="search-results-header"><h2>Search results for "${searchQuery}"</h2></div>`;
  }
  
  const featuredPost = posts[0];
  
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
  
  let postsGridHTML = '<div class="posts-grid">';
  
  if (posts.length > 1) {
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
  
  document.title = "Mina's Blog";
  
  handleFooter(false);
}

// Single post page display
function displaySinglePost(post, allPosts) {
  const blogContainer = document.querySelector('.blog-container');
  if (blogContainer) {
    blogContainer.style.display = 'none';
  }
  
  const blogHeader = document.querySelector('.blog-header');
  if (blogHeader) {
    blogHeader.style.display = 'none';
  }
  
  let blogPostContainer = document.querySelector('.blog-post-container');
  if (!blogPostContainer) {
    blogPostContainer = document.createElement('div');
    blogPostContainer.className = 'blog-post-container';
    
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && navContainer.nextSibling) {
      document.body.insertBefore(blogPostContainer, navContainer.nextSibling);
    } else {
      document.body.appendChild(blogPostContainer);
    }
  }
  
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextIndex = currentIndex < allPosts.length - 1 ? currentIndex + 1 : null;
  
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
  
  document.title = `${post.title} | Mina's Blog`;
  
  handleFooter(true);
}

// Footer visibility management
function handleFooter(isSinglePost) {
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  if (isSinglePost) {
      footer.style.display = 'none';
  } else {
      const blogContainer = document.querySelector('.blog-container');
      
      if (blogContainer) {
          footer.style.display = 'block';
          document.body.appendChild(footer);
          footer.style.marginTop = '2rem';
      }
  }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  
  mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-open');
      mobileMenuToggle.classList.toggle('active');
  });
  
  if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      });
  }
  
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      });
  });
  
  mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      }
  });
  
  window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          mobileMenuToggle.classList.remove('active');
      }
  });
});

// Scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
    const isNavLink = e.target.closest('.post-navigation .prev, .post-navigation .next, .post-navigation .back, .read-more');
    if (isNavLink) {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 10);
    }
  });
});

