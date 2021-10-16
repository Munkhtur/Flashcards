<script>
  import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
  } from 'firebase/auth';
  import { collection, doc, setDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { createEventDispatcher } from 'svelte';
  import Button from '../shared/Button.svelte';
  import { fade } from 'svelte/transition';

  export let showSignup = false;
  let email = '';
  let password = '';
  let confirmpassword = '';
  let errorMessage = '';
  $: error = errorMessage;

  const dispatch = createEventDispatcher();

  const onSubmit = () => {
    const auth = getAuth();
    if (password === confirmpassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (cred) => {
          const ref = doc(db, 'users', cred.user.uid);
          await setDoc(ref, { currentCards: 0, mastered: 0 });
          clearForm();
          dispatch('closesignup');
        })
        .catch((error) => {
          const errorCode = error.code;
          // const errorMessage = error.message;
          console.log(error.message, error.code);
          if (error.message.includes('email-already')) {
            errorMessage = 'Email is already in use.';
          } else if (error.message.includes('Password should')) {
            errorMessage = 'Password should at least be 6 characters.';
          } else {
            errorMessage = 'Something went wrong';
          }
        });
    } else {
      errorMessage = 'Passwords do not match';
    }
  };

  const clearForm = () => {
    email = '';
    password = '';
    confirmpassword = '';
    errorMessage = '';
  };
</script>

{#if showSignup}
  <div
    transition:fade
    class="backdrop"
    on:click|self={() => {
      dispatch('closesignup'), clearForm();
    }}
  >
    <div class="modal">
      <div class="error">{error}</div>
      <h1>Sign Up</h1>
      <form on:submit|preventDefault={onSubmit}>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <input
          type="password"
          placeholder="Confirm"
          bind:value={confirmpassword}
        />
        <Button full={true}>Sign up</Button>
      </form>
    </div>
  </div>
{/if}

<style>
  .error {
    color: red;
  }
</style>
