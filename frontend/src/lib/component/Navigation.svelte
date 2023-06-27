<nav>
  <div class="wrapper">
    <h1><a href="/">ASL Caption</a></h1>

    <div class="links">
      <a href="#upload">Upload</a>
      <a href="#about">About</a>
    </div>
  </div>
</nav>

<style>
  nav {
    border-bottom: 2px solid var(--primary);
  }

  .wrapper {
    display: flex;
    /* narrow screen layout */
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    max-width: 60rem;
    margin: 0 auto;
  }

  h1 {
    font-weight: 900;
    font-size: 2rem;
    color: var(--text-bold);
    margin: 1rem 1rem 0;
  }

  a {
    text-decoration: none;
  }

  .links {
    display: flex;
  }

  .links a {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--background-text);
    padding: 0.2rem 0.5rem;
    margin: 1rem 0.5rem;
    transition: all 0.2s ease-in-out;
  }

  .links a:hover {
    color: var(--primary);
  }

  /* wide screen layout */
  @media (min-width: 700px) {
    .wrapper {
      flex-direction: row;
    }

    h1 {
      margin: 1rem;
    }
  }
</style>
