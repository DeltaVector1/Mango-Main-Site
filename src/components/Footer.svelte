<script>
  const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="footer-content">
    <p>© {currentYear} when trees fall... All rights reserved.</p>
    <div class="footer-links">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    padding: 20px;
    border-top: 1px solid var(--border-color);
    margin-top: 40px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-links {
    display: flex;
    gap: 20px;
  }
  
  .footer-links a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .footer-links a:hover {
    color: var(--accent-color);
  }
  
  @media (max-width: 600px) {
    .footer-content {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
  }
</style>