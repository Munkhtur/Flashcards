<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let menuItems;
  export let item;
</script>

<div class="tabs">
  <ul>
    {#each menuItems as menuItem}
      <li on:click={dispatch('tabchange', menuItem)}>
        <div class:active={item === menuItem}>{menuItem}</div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .tabs {
    margin: 40px 0;
  }
  ul {
    display: flex;
    list-style-type: none;
    justify-content: center;
    padding: 0;
  }

  li {
    margin: 0 16px;
    font-size: 18px;
    color: var(--heading-color);
    cursor: pointer;
  }

  .active {
    color: #ff6150;
    border-bottom: 2px solid #ff6150;
    padding-bottom: 8px;
  }
</style>
