<script>
    import { COLORS } from "../utils/constants.js"

    import { GithubIcon } from "svelte-feather-icons"

</script>

<footer>
    <div class="dataSources">
      <h5>Data</h5>
      <p><strong>2012 - 2021 data:</strong> <br>             
        <a 
        href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
        target="_blank" rel="noreferrer">Spartacus International Gay Guide
        </a> 
        via 
        <a 
        href="https://www.makeovermonday.co.uk/"
        target="_blank" rel="noreferrer">Makeover Monday
        </a>. <br>
        The Makeover Monday data contained some missing values, which were filled in manually using information from the original reports.
    </p>
    <p><strong>2023 data:</strong><br>  
        <a 
        href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
        target="_blank" rel="noreferrer">Spartacus International Gay Guide</a>,
        scraped from the report.
    </p>
    <p><strong>Geographical Data:</strong><br>  
        <a 
        href="https://www.naturalearthdata.com/"
        target="_blank" rel="noreferrer">Natural Earth
        </a>
    </p>
    </div>
    <div class="codeInfo">
      <h5>Code</h5>
      <p> 
        <span 
        class="githubIconWrapper" 
        style="
        --githubColor: {COLORS.primary["600"]};
        --githubHoverColor: {COLORS.primary["800"]};
        ">
        <a href="https://github.com/AitanaGS/gaytravelindex" target="_blank" rel="noreferrer">
          <GithubIcon size="24"/>
          <span>github.com/AitanaGS/gaytravelindex</span>
        </a>
      </span>
      </p>
    </div>

  </footer>

<style>
    
  footer {
    margin-top: 30px;
    font-size: 1rem;
    overflow-wrap: word-wrap; /* IE */
    overflow-wrap: break-word;
    hyphens: auto; 
    -webkit-hyphens: auto; /* Prefix for Safari */
    max-width: 500px;
    margin-bottom: 30px;
  }

  footer h5 {
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .codeInfo {
    margin-top: 40px;
  }

  .githubIconWrapper {
    color: var(--githubColor);
    display: inline-block;
    cursor: pointer;
    margin-left: 2px;
    transition: color 200ms ease;
  }

  .githubIconWrapper a {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    word-break: break-all;
  }

  .githubIconWrapper:hover {
    color: var(--githubHoverColor);
  }

  .githubIconWrapper:focus,
  .githubIconWrapper:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
    outline-color: var(--githubHoverColor);
  }

</style>
