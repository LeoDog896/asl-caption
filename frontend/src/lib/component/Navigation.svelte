<nav>
  <div class="title">
    <h1><a href="/">ASL Caption</a></h1>
  </div>
  <div class="links">
    <a href="#upload">Upload</a>
    <a href="#about">About</a>
  </div>
</nav>

<style>
  nav {
    display: flex;
    /* narrow screen layout */
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    border-bottom: 2px solid var(--primary);
  }

  h1 {
    font-weight: 900;
    font-size: 2rem;
    color: var(--text-bold);
    margin: 1rem 1rem 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .links {
    display: flex;
  }

  .links a {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--text);
    padding: 0.2rem 0.5rem;
    margin: 1rem 0.5rem;
    transition: all 0.2s ease-in-out;
  }

  .links a:hover {
    color: var(--primary);
  }

  /* wide screen layout */
  @media (min-width: 700px) {
    nav {
      flex-direction: row;
    }

    h1 {
      margin: 1rem;
    }
  }
</style>
