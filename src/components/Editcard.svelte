<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { db } from '../firebase';
  import { updateDoc, doc } from 'firebase/firestore';
  import Button from '../shared/Button.svelte';

  export let showEdit = false;
  export let cardToEdit = {};
  let entry = { word: '', definition: '', usage: '', uid: '' };
  onMount(() => {
    entry = Object.keys(cardToEdit).length > 0 && cardToEdit;
  });

  let errorMessage = '';
  $: error = errorMessage;

  const dispatch = createEventDispatcher();

  const onSubmit = async () => {
    try {
      const ref = doc(db, 'cards', entry.id);
      await updateDoc(ref, entry);
      dispatch('closeedit');
      dispatch('showmessage', { status: 'success', m: 'Card updated' });
    } catch (error) {
      console.log(error);
    }
  };
</script>

{#if showEdit}
  <div
    transition:fade
    class="backdrop"
    on:click|self={() => {
      dispatch('closeedit');
    }}
  >
    <div class="modal">
      <div class="error">{error}</div>
      <div class="new-card">
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
            <Button full={true}>Update</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .new-card {
    width: 100%;
    margin: 0 auto;
    position: relative;
  }

  input,
  textarea {
    width: 100%;
  }
  .form-group {
    text-align: left;
  }
  label {
    margin: 10px 0;
    font-weight: bold;
  }
  textarea {
    height: 150px;
  }
</style>
