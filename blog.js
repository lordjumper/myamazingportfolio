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
          // Special handling for "liked" posts
          if (searchTag.toLowerCase() === 'liked') {
            // Get all liked posts from localStorage
            const userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
            // Make sure we only include posts that have an active 'like' reaction
            const likedPostIds = Object.keys(userReactions).filter(
              postId => userReactions[postId] === 'like'
            );
            
            filteredPosts = allPostsData.posts.filter(post => 
              likedPostIds.includes(post.id)
            );
            filterType = 'liked';
          } else {
            filteredPosts = allPostsData.posts.filter(post => 
              post.tags.some(tag => tag.toLowerCase() === searchTag.toLowerCase())
            );
            filterType = 'tag';
          }
        }
        
        // Filter posts by search query (title or tags)
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
          
          if (searchInput) {
              const searchValue = searchInput.value.trim();
              
              if (searchValue) {
                  // Search query is not empty, update URL and process search
                  const searchQuery = encodeURIComponent(searchValue);
                  updateURLWithoutReload(`blog.html?q=${searchQuery}`);
                  processView(null, null, searchValue);
              } else {
                  // Search query is empty, show all posts
                  updateURLWithoutReload('blog.html');
                  processView(null, null, null);
              }
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
  
  // Check if there are any liked posts
  const userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
  const hasLikedPosts = Object.values(userReactions).includes('like');
  
  // Determine if "liked" filter is active
  const isLikedActive = activeTag && activeTag.toLowerCase() === 'liked';
  
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
          <div style="flex-grow: 1;"></div>
          <a href="blog.html?tag=liked" 
             class="tag-link ${isLikedActive ? 'active' : ''}" 
             style="${hasLikedPosts ? '' : 'color: #555; border: 1px solid #333;'}">
            <i class="fas fa-heart" style="margin-right: 4px;"></i>Liked
          </a>
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
    } else if (filterType === 'liked') {
      message = 'You haven\'t liked any posts yet.';
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
  } else if (filterType === 'liked') {
    resultsHeader = `<div class="search-results-header"><h2>Posts you've liked</h2></div>`;
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


// Function to handle likes and dislikes
function setupLikeDislikeSystem() {
  // Handle clicks on like/dislike buttons
  document.body.addEventListener('click', async function(e) {
    const likeButton = e.target.closest('.post-reaction-like');
    const dislikeButton = e.target.closest('.post-reaction-dislike');
    
    if (likeButton || dislikeButton) {
      e.preventDefault();
      
      const button = likeButton || dislikeButton;
      const postId = button.getAttribute('data-post-id');
      const isLike = !!likeButton;
      
      // Check if user already reacted to this post
      const reactionKey = `post-reaction-${postId}`;
      const currentReaction = localStorage.getItem(reactionKey);
      
      // Reset previous reaction if exists
      if (currentReaction) {
        if (currentReaction === 'like' && isLike) {
          // Unlike - user clicked like again
          localStorage.removeItem(reactionKey);
          likeButton.classList.remove('active');
          
          // Also remove from userReactions
          removeUserReaction(postId);
          
          // Update UI
          await updateReactionCount(postId, 0, 0);
          
          // If we're in the "liked" filter view, refresh to remove this post
          refreshLikedFilterIfActive();
          
          return;
        } 
        else if (currentReaction === 'dislike' && !isLike) {
          // Un-dislike - user clicked dislike again
          localStorage.removeItem(reactionKey);
          dislikeButton.classList.remove('active');
          
          // Also remove from userReactions
          removeUserReaction(postId);
          
          // Update UI
          await updateReactionCount(postId, 0, 0);
          return;
        }
        else if (currentReaction === 'like' && !isLike) {
          // Change from like to dislike
          document.querySelector(`.post-reaction-like[data-post-id="${postId}"]`).classList.remove('active');
          dislikeButton.classList.add('active');
          localStorage.setItem(reactionKey, 'dislike');
          
          // Update userReactions
          saveUserReactions(postId, 'dislike');
          
          // If we're in the "liked" filter view, refresh to remove this post
          refreshLikedFilterIfActive();
        } 
        else if (currentReaction === 'dislike' && isLike) {
          // Change from dislike to like
          document.querySelector(`.post-reaction-dislike[data-post-id="${postId}"]`).classList.remove('active');
          likeButton.classList.add('active');
          localStorage.setItem(reactionKey, 'like');
          
          // Update userReactions
          saveUserReactions(postId, 'like');
        }
      } else {
        // New reaction
        if (isLike) {
          likeButton.classList.add('active');
          localStorage.setItem(reactionKey, 'like');
          saveUserReactions(postId, 'like');
        } else {
          dislikeButton.classList.add('active');
          localStorage.setItem(reactionKey, 'dislike');
          saveUserReactions(postId, 'dislike');
        }
      }
      
      // Update JSON file and localStorage
      await updateReactionCount(postId, isLike ? 1 : 0, isLike ? 0 : 1);
    }
  });
  
  // Initialize buttons state based on localStorage
  function initializeReactionButtons() {
    const reactionButtons = document.querySelectorAll('.post-reaction-like, .post-reaction-dislike');
    
    reactionButtons.forEach(button => {
      const postId = button.getAttribute('data-post-id');
      const reactionKey = `post-reaction-${postId}`;
      const currentReaction = localStorage.getItem(reactionKey);
      
      if (currentReaction) {
        const isLikeButton = button.classList.contains('post-reaction-like');
        
        if ((isLikeButton && currentReaction === 'like') || 
            (!isLikeButton && currentReaction === 'dislike')) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    });
  }
  
  // Call initialization when DOM updates
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        initializeReactionButtons();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initialize on page load
  initializeReactionButtons();
}

// Function to remove a user reaction
function removeUserReaction(postId) {
  // Get existing user reactions
  let userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
  
  // Remove the reaction for this post
  if (userReactions[postId]) {
    delete userReactions[postId];
    
    // Save back to localStorage
    localStorage.setItem('userReactions', JSON.stringify(userReactions));
  }
}

// Function to refresh the view if we're currently in the "liked" filter
function refreshLikedFilterIfActive() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentTag = urlParams.get('tag');
  
  if (currentTag && currentTag.toLowerCase() === 'liked') {
    // We're in the liked view, so refresh it
    processView(null, 'liked', null);
  }
}

// Function to save user's personal reactions
function saveUserReactions(postId, reaction) {
  // Get existing user reactions or initialize empty object
  let userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
  
  // Update with new reaction
  userReactions[postId] = reaction;
  
  // Save back to localStorage
  localStorage.setItem('userReactions', JSON.stringify(userReactions));
}

// Function to update reaction count in local JSON file
async function updateReactionCount(postId, likes, dislikes) {
  try {
    // Make sure postId is valid
    if (!postId) {
      console.error('Invalid postId');
      return;
    }
    
    // Save the reaction counts to a specific localStorage key
    localStorage.setItem(`post-reactions-${postId}`, JSON.stringify({ likes, dislikes }));
    
    // Update the local data
    if (window.allPostsData) {
      const postIndex = window.allPostsData.posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        window.allPostsData.posts[postIndex].likes = likes;
        window.allPostsData.posts[postIndex].dislikes = dislikes;
        
        // Save to local storage as a backup
        localStorage.setItem('blogPostsData', JSON.stringify(window.allPostsData));
        
        // Try to write to the JSON file (this will only work in certain environments)
        try {
          // In a real environment, you would need server-side code to write to the file
          // As a workaround, we'll provide a download option for the updated JSON
          if (typeof window.saveJsonToFile === 'function') {
            window.saveJsonToFile(window.allPostsData);
          }
        } catch (writeError) {
          console.warn('Unable to write to JSON file directly:', writeError);
          console.info('Data is preserved in localStorage and memory.');
        }
        
        // Update any visible card views
        updateCardViewReactions(postId, likes, dislikes);
      }
    }
    
    return { success: true, post: { id: postId, likes, dislikes } };
  } catch (error) {
    console.error('Error updating reaction count:', error);
    // Fallback: Store in localStorage
    localStorage.setItem(`post-reactions-${postId}`, JSON.stringify({ likes, dislikes }));
    
    // Even on error, update the local data to maintain UI consistency
    if (window.allPostsData) {
      const postIndex = window.allPostsData.posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        window.allPostsData.posts[postIndex].likes = likes;
        window.allPostsData.posts[postIndex].dislikes = dislikes;
        
        // Update any visible card views
        updateCardViewReactions(postId, likes, dislikes);
      }
    }
  }
}

// Helper function to update card view reactions
function updateCardViewReactions(postId, likes, dislikes) {
  // Find any card views that need updating
  const cardLikes = document.querySelectorAll(`.card-reaction-indicator[data-post-id="${postId}"] .card-likes`);
  const cardDislikes = document.querySelectorAll(`.card-reaction-indicator[data-post-id="${postId}"] .card-dislikes`);
  
  cardLikes.forEach(element => {
    // Remove the span with the count
    const span = element.querySelector('span');
    if (span) span.remove();
    
    // Add or remove active class based on likes value
    if (likes > 0) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
  
  cardDislikes.forEach(element => {
    // Remove the span with the count
    const span = element.querySelector('span');
    if (span) span.remove();
    
    // Add or remove active class based on dislikes value
    if (dislikes > 0) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

// Function to enhance the displaySinglePost function
function enhanceDisplaySinglePost(originalFunction) {
  return function(post, allPosts) {
    // Call the original function first
    originalFunction(post, allPosts);
    
    // Now add our reaction system to the post
    const articleElement = document.querySelector('.blog-post-container article');
    if (!articleElement) return;
    
    // Get user's current reaction from localStorage
    const reactionKey = `post-reaction-${post.id}`;
    const currentReaction = localStorage.getItem(reactionKey);
    
    // Create reaction section
    const reactionSection = document.createElement('div');
    reactionSection.className = 'post-reactions';
    reactionSection.innerHTML = `
      <div class="reaction-title">Did you like this post?</div>
      <div class="reaction-buttons">
        <button class="post-reaction-like ${currentReaction === 'like' ? 'active' : ''}" data-post-id="${post.id}">
          <i class="fas fa-thumbs-up"></i>
        </button>
        <button class="post-reaction-dislike ${currentReaction === 'dislike' ? 'active' : ''}" data-post-id="${post.id}">
          <i class="fas fa-thumbs-down"></i>
        </button>
      </div>
    `;
    
    // Insert reaction section before post navigation
    const postNavigation = articleElement.querySelector('.post-navigation');
    if (postNavigation) {
      articleElement.insertBefore(reactionSection, postNavigation);
    } else {
      articleElement.appendChild(reactionSection);
    }
  };
}

// Function to enhance displayBlogIndex to add reaction indicators to cards
function enhanceDisplayBlogIndex(originalFunction) {
  return function(posts, allPosts, activeTag, searchQuery, filterType) {
    // Call the original function first
    originalFunction(posts, allPosts, activeTag, searchQuery, filterType);
    
    // Now add reaction indicators to all cards
    const featuredPost = document.querySelector('.featured-post');
    const postCards = document.querySelectorAll('.post-card');
    
    // Add to featured post if it exists
    if (featuredPost && posts.length > 0) {
      addReactionIndicatorToCard(featuredPost, posts[0]);
    }
    
    // Add to all other post cards
    postCards.forEach((card, index) => {
      if (posts.length > index + 1) { // +1 because first post is featured
        addReactionIndicatorToCard(card, posts[index + 1]);
      }
    });
  };
}

// Helper function to add reaction indicators to a card
function addReactionIndicatorToCard(cardElement, post) {
  // Get user's current reaction from localStorage
  const reactionKey = `post-reaction-${post.id}`;
  const currentReaction = localStorage.getItem(reactionKey);
  
  // Create reaction indicator element
  const reactionIndicator = document.createElement('div');
  reactionIndicator.className = 'card-reaction-indicator';
  reactionIndicator.setAttribute('data-post-id', post.id);
  reactionIndicator.innerHTML = `
    <span class="card-likes ${currentReaction === 'like' ? 'active' : ''}" title="You liked this post">
      <i class="fas fa-thumbs-up"></i>
    </span>
    <span class="card-dislikes ${currentReaction === 'dislike' ? 'active' : ''}" title="You disliked this post">
      <i class="fas fa-thumbs-down"></i>
    </span>
  `;
  
  // Append to card
  cardElement.appendChild(reactionIndicator);
}

// Function to load blog data with proper reaction information
function loadBlogData() {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  const searchTag = urlParams.get('tag');
  const searchQuery = urlParams.get('q');
  
  // Try to get data from localStorage first
  const storedData = localStorage.getItem('blogPostsData');
  if (storedData) {
    try {
      window.allPostsData = JSON.parse(storedData);
      processView(postId, searchTag, searchQuery);
      return;
    } catch (e) {
      console.error('Error parsing stored blog data:', e);
      // Continue to fetch from file if parsing fails
    }
  }
  
  // Fetch blog posts from the JSON file
  fetch('./blog-posts.json')
    .then(response => response.json())
    .then(data => {
      // Store posts data globally
      window.allPostsData = data;
      
      // Save the data to localStorage
      localStorage.setItem('blogPostsData', JSON.stringify(window.allPostsData));
      
      // Process the view
      processView(postId, searchTag, searchQuery);
    })
    .catch(error => {
      console.error('Error fetching blog posts:', error);
      
      // If we have data in localStorage, use it as a fallback
      const fallbackData = localStorage.getItem('blogPostsData');
      if (fallbackData) {
        try {
          window.allPostsData = JSON.parse(fallbackData);
          processView(postId, searchTag, searchQuery);
        } catch (e) {
          console.error('Error using fallback data:', e);
        }
      }
    });
}

// Add CSS styles for the active state (white thumbs)
function addReactionStyles() {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    /* Style for active thumbs in post view */
    .post-reaction-like.active i,
    .post-reaction-dislike.active i {
      color: white;
    }
    
    /* Style for active thumbs in card view */
    .card-likes.active i,
    .card-dislikes.active i {
      color: white;
    }
    
    /* Optional: add background color for active buttons */
    .post-reaction-like.active {
      background-color: #28a745;
    }
    
    .post-reaction-dislike.active {
      background-color: #dc3545;
    }
    
    /* Make card reaction indicators more visible */
    .card-reaction-indicator {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      gap: 10px;
    }
    
    .card-likes, .card-dislikes {
      padding: 5px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-likes.active {
      background-color: none;
    }
    
    .card-dislikes.active {
      background-color: none;
    }
  `;
  document.head.appendChild(styleSheet);
}

// Replace original functions with enhanced versions
document.addEventListener('DOMContentLoaded', function() {
  // Add custom styles
  addReactionStyles();
  
  // Store original functions
  const originalDisplaySinglePost = window.displaySinglePost;
  const originalDisplayBlogIndex = window.displayBlogIndex;
  
  // Replace with enhanced versions
  if (typeof originalDisplaySinglePost === 'function') {
    window.displaySinglePost = enhanceDisplaySinglePost(originalDisplaySinglePost);
  }
  
  if (typeof originalDisplayBlogIndex === 'function') {
    window.displayBlogIndex = enhanceDisplayBlogIndex(originalDisplayBlogIndex);
  }
  
  // Replace loadBlogData globally
  window.loadBlogData = loadBlogData;
  
  // Setup like/dislike system
  setupLikeDislikeSystem();
});

// Resets scroll to top of page when navigation buttons are pressed
document.addEventListener('DOMContentLoaded', function() {
  // Add click listener for next/prev navigation
  document.body.addEventListener('click', function(e) {
    // clicked elements that trigger scroll reset
    const isNavLink = e.target.closest('.post-navigation .prev, .post-navigation .next, .post-navigation .back, .read-more');
    if (isNavLink) {
      // After the browser processes the click but before the new content loads
      // Add a small timeout to ensure this runs after the default link handling
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 10);
    }
  });
});

