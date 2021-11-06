<script>
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { doc, onSnapshot } from 'firebase/firestore';
  import { onDestroy } from 'svelte';
  import { db } from './firebase';
  import { storeUser } from './store';
  import Navbar from './components/Navbar.svelte';
  import Login from './components/Login.svelte';
  import Signup from './components/Signup.svelte';
  import Tabs from './shared/Tabs.svelte';
  import NewCard from './components/NewCard.svelte';
  import Home from './components/Home.svelte';
  import Mycards from './components/Mycards.svelte';
  import Editcard from './components/Editcard.svelte';

  const auth = getAuth();

  let menuItems = ['All Cards', 'My Cards', 'Add Card'];
  let item = 'All Cards';

  let showLogin = false;
  let showSignup = false;
  let showEdit = false;
  let cardToEdit = {};
  let message = '';
  let isMessage = false;
  let unsub;

  console.log($storeUser);
  const showMessage = (e) => {
    message = `<span class="${e.detail.status}">${e.detail.m}</span>`;
    isMessage = true;

    setTimeout(() => {
      isMessage = false;
      message = '';
    }, 3000);
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      item = 'My Cards';
      unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        const dbUser = user
          ? { email: user.email, uid: user.uid, ...doc.data() }
          : {};
        storeUser.set(dbUser);
      });
    } else storeUser.set({});
  });

  onDestroy(() => {
    unsub && unsub();
  });

  const tabChange = (e) => {
    item = e.detail;
  };

  const loginToggle = () => {
    showLogin = !showLogin;
  };
  const signUpToggle = () => {
    showSignup = !showSignup;
    showLogin = false;
  };

  const editToggle = () => {
    showEdit = !showEdit;
  };

  const onEdit = (e) => {
    showEdit = !showEdit;
    cardToEdit = e.detail;
  };
</script>

<Navbar on:openlogin={loginToggle} />
<Login {showLogin} on:closelogin={loginToggle} on:opensignup={signUpToggle} />
<Signup {showSignup} on:closesignup={signUpToggle} />
{#if showEdit}
  <Editcard
    {showEdit}
    {cardToEdit}
    on:closeedit={editToggle}
    on:showmessage={showMessage}
  />
{/if}
<main>
  <Tabs {menuItems} {item} on:tabchange={tabChange} />
  <div class="main-content">
    {#if item === 'All Cards'}
      <Home />
    {:else if item === 'My Cards'}
      <Mycards
        on:opensignin={loginToggle}
        on:opensignup={signUpToggle}
        on:onedit={onEdit}
      />
    {:else}
      <NewCard on:opensignin={loginToggle} on:opensignup={signUpToggle} />
    {/if}
    {#if isMessage}
      <div class="message">{@html message}</div>
    {/if}
  </div>
</main>
<div class="tip">
  <ul>
    <li><span class="key">j</span> - left</li>
    <li><span class="key">k</span> - flip</li>
    <li><span class="key">l</span> - right</li>
  </ul>
</div>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    position: relative;
    /* height: 90%; */
  }
  .main-content {
    width: 100%;
  }

  .message {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 10px;
    font-weight: 200;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  /* @media (max-width: 1050px) {
    main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90%;
    }
  } */

  .key {
    font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
    line-height: 1.57142857;
    text-transform: capitalize;
    border-width: 1px 1px 3px 1px;
    border-style: solid;
    border-color: var(--heading-color);
    /* border-bottom-color: var(--heading-color); */
    border-radius: 5px;
    /* color: white; */
    padding: 1px 5px;
  }
  .tip {
    position: absolute;
    left: 0;
    bottom: 5%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px;
    color: var(--heading-color);
  }
  ul {
    display: flex;
    list-style: none;
    margin: 5px 0;
    text-align: right;
  }
  li {
    margin-right: 10px;
    /* color: white; */
  }
  @media (max-width: 1050px) {
    .tip {
      display: none;
    }
  }
</style>
