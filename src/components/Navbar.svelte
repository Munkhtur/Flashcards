<script>
  import { storeUser } from '../store';
  import { clickOutside } from '../clickOutside';
  import { createEventDispatcher } from 'svelte';
  import { signOut, getAuth } from 'firebase/auth';

  let toggleChecked = false;
  let showInfo = false;
  const auth = getAuth();
  const dispatch = createEventDispatcher();
  const logOut = () => {
    signOut(auth);
  };
  const currentTheme = localStorage.getItem('theme')
    ? localStorage.getItem('theme')
    : null;

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
      toggleChecked = true;
    }
  }
  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); //add this
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light'); //add this
    }
  }
</script>

<nav>
  <div><img src="/img/az.png" alt="Flash cards" width="50px" /> Test 2</div>

  <div class="right">
    <ul>
      {#if Object.keys($storeUser).length}
        <li class="account-menu" on:click={() => (showInfo = !showInfo)}>
          <i class="fas fa-user-circle" />
          <span class="nav-hide">Account </span>
        </li>
        <li on:click={logOut}>
          <i class="fas fa-sign-out-alt" /><span class="nav-hide">Logout</span>
        </li>
      {:else}
        <li on:click={() => dispatch('openlogin')}>Login</li>
      {/if}
    </ul>
    <div class="theme-switch-wrapper">
      <input
        type="checkbox"
        id="checkbox"
        on:change={switchTheme}
        checked={toggleChecked}
      />
      <label class="theme-switch" for="checkbox">
        <div class="box">
          <div class="ball" />
          <div class="scenary">
            <i class="fas fa-sun" />
            <i class="fas fa-moon" />
          </div>
        </div>
      </label>
    </div>
  </div>
</nav>
{#if showInfo}
  <div
    class="account-info"
    use:clickOutside
    on:click_outside={() => {
      showInfo = false;
    }}
  >
    <div class="info-item">
      {$storeUser.email}
    </div>
    <div class="info-item">Current cards: {$storeUser.currentCards}</div>
    <div class="info-item">Mastered: {$storeUser.mastered}</div>
  </div>
{/if}

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--main-color);
    margin: 0;
    padding: 20px 20px;
    color: var(--font-color);
    height: 10%;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style: none;
    display: flex;
  }
  li {
    display: flex;
    margin: 0 10px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }
  .nav-hide {
    padding-bottom: 3px;
  }
  li:hover {
    color: #ff3e00;
  }
  .account-info {
    /* display: none; */
    /* height: 100px; */
    width: 200px;
    background-color: var(--main-color);
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 59px;
    right: 10px;
    border: 1px solid rgb(109, 107, 107);
    color: white;
    pointer-events: all;
    z-index: 20;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    padding: 10px;
  }
  .info-item {
    text-align: left;
    margin: 5px 30px;
  }
  .info-item:first-child {
    /* text-align: center; */
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    padding-bottom: 10px;
  }

  /*Simple css to style it like a toggle switch*/
  .theme-switch {
    height: 20px;
    position: relative;
    width: 60px;
  }
  input[type='checkbox'] {
    display: none;
  }
  /* .ball {
    transform: translateX(0);
  } */

  input:checked + label .ball {
    transform: translateX(140%);
  }

  .box {
    display: flex;
    align-items: center;
    height: 25px;
    width: 60px;
    background-color: white;
    border-radius: 20px;
    position: relative;
    /* transition: 1s ease; */
  }
  .ball {
    position: absolute;
    height: 25px;
    width: 25px;
    background-color: var(--main-color);
    border-radius: 50%;
    transition: 0.5s ease;
    border: 2px solid white;
  }
  .scenary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    color: grey;
  }
  li i {
    font-size: 20px;
    margin-right: 5px;
  }
  @media (max-width: 650px) {
    .nav-hide {
      display: none;
    }
  }
</style>
