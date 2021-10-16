<script>
  import { db } from '../firebase';
  import { onMount, onDestroy } from 'svelte';
  import Cards from './Cards.svelte';
  import { collection, onSnapshot, query } from 'firebase/firestore';

  let cards = [];
  let unsub;

  onMount(async () => {
    const q = query(collection(db, 'cards'));
    unsub = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        const newObj = doc.data();
        newObj['id'] = doc.id;
        arr = [...arr, newObj];
      });
      cards = arr;
    });
  });
  onDestroy(() => {
    unsub && unsub();
  });
</script>

{#if cards.length > 0}
  <Cards {cards} />
{:else}
  <div class="placeholder">No card to display</div>
{/if}

<style>
  .placeholder {
    color: var(--heading-color);
    height: 380px;
  }
</style>
