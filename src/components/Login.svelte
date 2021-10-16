<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
  } from 'firebase/auth';
  import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import Button from '../shared/Button.svelte';
  import { fade } from 'svelte/transition';
  import { db, app } from '../firebase';

  let email = 'test@gmail.com';
  let password = 'testpassword';
  let errorMessage = '';
  $: error = errorMessage;
  export let showLogin = false;

  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const signInWithG = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        const ref = doc(db, 'users', user.uid);
        const dbUser = await getDoc(ref);

        if (!dbUser.exists()) {
          await setDoc(ref, { currentCards: 0, mastered: 0 });
        }

        dispatch('closelogin');
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(error);
      });
  };
  const dispatch = createEventDispatcher();
  onDestroy(() => {
    clearForm();
  });

  const onSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        email = '';
        password = '';
        dispatch('closelogin');
      })
      .catch(() => {
        errorMessage = 'Wrong credentials!';
      });
  };

  const clearForm = () => {
    email = '';
    password = '';
    errorMessage = '';
  };
</script>

{#if showLogin}
  <div
    transition:fade
    class="backdrop"
    on:click|self={() => {
      dispatch('closelogin'), clearForm();
    }}
  >
    <div class="modal">
      <div class="error">{error}</div>

      <h1>Login</h1>
      <form on:submit|preventDefault={onSubmit}>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <Button full={true}>Login</Button>
      </form>
      <div class="g-sign-in-button" on:click={signInWithG}>
        <div class="content-wrapper">
          <div class="logo-wrapper">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="sign in with google"
            />
          </div>
          <span class="text-container">
            <span>Sign in with Google</span>
          </span>
        </div>
      </div>
      <div>
        <span>Need an account? </span><a
          href="/"
          on:click|preventDefault={() => dispatch('opensignup')}>Signup</a
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .error {
    color: red;
  }
  .g-sign-in-button {
    margin: 10px;
    display: inline-block;
    width: 90%;
    height: 40px;
    background-color: #4285f4;
    color: #fff;
    border-radius: 1px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  }

  .g-sign-in-button:hover {
    cursor: pointer;
    -webkit-box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
    box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  }

  .g-sign-in-button:active {
    background-color: #3367d6;
    transition: background-color 0.2s;
  }

  .g-sign-in-button .content-wrapper {
    height: 100%;
    width: 100%;
    border: 1px solid transparent;
    display: flex;
  }

  .g-sign-in-button img {
    width: 18px;
    height: 18px;
  }

  .g-sign-in-button .logo-wrapper {
    padding: 5px;
    background: #fff;
    width: 48px;
    height: 100%;
    border-radius: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .g-sign-in-button .text-container {
    font-family: Roboto, arial, sans-serif;
    font-weight: 500;
    letter-spacing: 0.21px;
    font-size: 16px;
    line-height: 40px;
    vertical-align: top;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 180px;
  }
</style>
