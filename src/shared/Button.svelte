<script>
  export let type = 'primary';
  export let flat = false;
  export let inverse = false;
  export let full = false;
</script>

<button class={type} class:flat class:inverse class:full on:click>
  <slot />
</button>

<style>
  button {
    --primary-color: var(--main-color);
    --secondary-color: var(--main-color);
    --primary-border: 2px solid var(--primary-color);
    --secondary-border: 2px solid var(--secondary-color);
  }
  button {
    border: 0;
    cursor: pointer;
    border-radius: 6px;
    padding: 8px 12px;
    font-weight: bold;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
  }

  .primary {
    background-color: var(--primary-color);
    color: white;
  }

  .secondary {
    background-color: var(--secondary-color);
    color: white;
  }
  .flat {
    box-shadow: none;
  }

  .primary:hover {
    color: var(--primary-color);
    background-color: white;
    /* border: var(--primary-border); */
  }
  .primary:focus {
    color: var(--primary-color);
    background-color: white;
    /* border: var(--primary-border); */
  }
  .secondary:focus {
    color: var(--secondary-color);
    background-color: white;
    border: var(--secondary-border);
  }

  .primary.inverse {
    color: var(--primary-color);
    background-color: white;
    border: var(--primary-border);
  }

  .secondary.inverse {
    color: var(--secondary-color);
    background-color: white;
    border: var(--secondary-border);
  }

  .primary.inverse:focus {
    background-color: var(--primary-color);
    color: white;
  }
  .secondary.inverse:focus {
    background-color: var(--secondary-color);
    color: white;
  }

  .full {
    width: 100%;
  }
</style>
