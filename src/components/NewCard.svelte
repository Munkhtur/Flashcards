<script>
  import { db, app } from '../firebase';
  import { storeUser } from '../store';
  import {
    collection,
    addDoc,
    updateDoc,
    doc,
    setDoc,
  } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { createEventDispatcher } from 'svelte';
  import Button from '../shared/Button.svelte';
  import { fade, slide, blur, scale, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let entry = { word: '', definition: '', usage: '', uid: '' };
  let message = '';
  let isMessage = false;

  const showMessage = (status, m) => {
    message = `<span class="${status}">${m}</span>`;
    isMessage = true;
    console.log(message);
    setTimeout(() => {
      isMessage = false;
      message = '';
    }, 3000);
  };

  const onSubmit = async () => {
    const data = entry;
    entry = { ...entry, word: '', definition: '', usage: '' };

    showMessage('success', 'New card added.');
    $storeUser.currentCards += 1;
    await addDoc(collection(db, 'cards'), data);

    const userRef = doc(db, 'users', $storeUser.uid);

    await updateDoc(userRef, 'currentCards', $storeUser.currentCards);
  };
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    entry.uid = user ? user.uid : '';
  });
</script>

{#if entry.uid}
  <div class="new-card" transition:fly|local={{ duration: 1000 }}>
    <form on:submit|preventDefault={onSubmit}>
      <div class="form-group">
        <label for="word">Word:</label>
        <input type="text" id="word" bind:value={entry.word} required />
      </div>
      <div class="form-group">
        <label for="definition">Definition:</label>
        <input
          type="text"
          id="definition"
          bind:value={entry.definition}
          required
        />
      </div>
      <div class="form-group">
        <label for="usage">Usage:</label>
        <textarea id="usage" bind:value={entry.usage} />
      </div>

      <div class="form-group">
        <Button full={true}>Add</Button>
      </div>
    </form>
    {#if isMessage}
      <div class="message">{@html message}</div>
    {/if}
  </div>
{:else}
  <div class="no-login">
    <span
      class="link"
      on:click={() => {
        dispatch('opensignin');
      }}>Sign in</span
    >
    or <span class="link" on:click={() => dispatch('opensignup')}>Sign up</span>
    to add new cards.
  </div>
{/if}

<style>
  .new-card {
    width: 40%;
    margin: 0 auto;
    position: relative;
  }
  @media (max-width: 600px) {
    .new-card {
      width: 60%;
    }
  }

  input,
  textarea {
    width: 100%;
  }
  .form-group {
    text-align: left;
  }
  label {
    margin: 10px;
    color: var(--heading-color);
  }

  .message {
    position: absolute;
    top: 0;
    left: 50%;
    font-size: 15px;
    width: 80%;
    transform: translateX(-50%);
    border-radius: 10px;
    font-weight: 200;
  }
  .link {
    color: #ff6150;
    text-decoration: underline;
    cursor: pointer;
  }
  .no-login {
    color: var(--heading-color);
    height: 380px;
  }
</style>
