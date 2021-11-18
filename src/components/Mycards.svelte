<script>
  import { db } from '../firebase';
  import { onMount, onDestroy } from 'svelte';
  import Cards from './Cards.svelte';
  import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    deleteDoc,
    getDoc,
    updateDoc,
  } from 'firebase/firestore';
  import { onAuthStateChanged, getAuth } from 'firebase/auth';
  import { createEventDispatcher } from 'svelte';
  import Button from '../shared/Button.svelte';
  import { storeUser } from '../store';

  const dispatch = createEventDispatcher();

  let cards = [];
  let unsub;
  let uid = '';
  let currentCard = 0;

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    uid = user ? user.uid : '';
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, 'cards'), where('uid', '==', user.uid));
      unsub = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (querySnapshot) => {
          let arr = [];
          querySnapshot.forEach((doc) => {
            const newObj = doc.data();
            newObj['id'] = doc.id;
            arr = [...arr, newObj];
          });
          cards = arr;
        }
      );
    }
  });

  onDestroy(() => {
    unsub && unsub();
  });

  const onCardChange = (e) => {
    currentCard = e.detail;
  };

  const onDelete = async () => {
    if (confirm('Are you sure you want to delete?')) {
      $storeUser.currentCards -= 1;
      const ref = doc(db, 'cards', cards[currentCard].id);
      await deleteDoc(ref);
      const userRef = doc(db, 'users', $storeUser.uid);
      await updateDoc(userRef, 'currentCards', $storeUser.currentCards);
      if (currentCard - 1 >= 0) {
        currentCard = currentCard - 1;
      }
    }
  };
  const onMastered = async () => {
    if (confirm('Are you sure?')) {
      $storeUser.currentCards -= 1;
      $storeUser.mastered += 1;
      const ref = doc(db, 'cards', cards[currentCard].id);
      await deleteDoc(ref);
      const userRef = doc(db, 'users', $storeUser.uid);
      await updateDoc(
        userRef,
        'currentCards',
        $storeUser.currentCards,
        'mastered',
        $storeUser.mastered
      );
      if (currentCard - 1 >= 0) {
        currentCard = currentCard - 1;
      }
    }
  };
</script>

{#if uid && cards.length > 0}
  <Cards {cards} on:cardchange={onCardChange} currentActiveCard={currentCard} />

  <div class="control-buttons">
    <div>
      <Button flat={true} on:click={onMastered}
        ><i class="far fa-check-square" /> Mastered</Button
      >
      <Button
        flat={true}
        on:click={() => {
          dispatch('onedit', cards[currentCard]);
        }}
        ><i class="far fa-edit" /> Edit
      </Button>

      <Button flat={true} on:click={onDelete}
        ><i class="far fa-trash-alt" /> Delete</Button
      >
    </div>
  </div>
{:else if uid && cards.length === 0}
  <div class="placeholder">No cards added yet.</div>
{:else}
  <div class="placeholder">
    <span
      class="link"
      on:click={() => {
        dispatch('opensignin');
      }}>Sign in</span
    >
    or <span class="link" on:click={() => dispatch('opensignup')}>Sign up</span>
    to view your cards.
  </div>
{/if}

<style>
  .placeholder {
    color: var(--heading-color);
    height: 380px;
  }
  .link {
    color: #ff6150;
    text-decoration: underline;
    cursor: pointer;
  }
  .control-buttons {
    margin-top: auto;
  }
</style>
