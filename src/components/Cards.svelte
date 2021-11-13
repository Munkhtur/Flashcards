<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  export let cards = [];

  export let currentActiveCard = 0;

  const dispatch = createEventDispatcher();
  let showAnswer = false;
  const toggleShow = () => {
    showAnswer = !showAnswer;
  };

  const prevSlide = () => {
    currentActiveCard = currentActiveCard - 1;
    if (currentActiveCard < 0) currentActiveCard = 0;
    showAnswer = false;
    dispatch('cardchange', currentActiveCard);
  };
  const nextSlide = () => {
    currentActiveCard = currentActiveCard + 1;
    if (currentActiveCard > cards.length - 1) {
      currentActiveCard = cards.length - 1;
    }
    showAnswer = false;
    dispatch('cardchange', currentActiveCard);
  };
  const keyPress = (e) => {
    if (e.keyCode === 106) {
      prevSlide();
    } else if (e.keyCode === 108) {
      nextSlide();
    } else if (e.keyCode === 107) {
      toggleShow();
    }
  };
</script>

<svelte:window on:keypress={keyPress} />

<div
  id="cards-container"
  class="cards"
  transition:fly|local={{ duration: 1000 }}
>
  {#each cards as card, i}
    <div
      id={i}
      class="card"
      class:active={i === currentActiveCard}
      class:show-answer={showAnswer}
      class:left={i === currentActiveCard - 1}
      on:click={toggleShow}
    >
      <div class="inner-card">
        <div class="inner-card-front">
          <div class="card-content">
            <p>{card.word}</p>
          </div>
        </div>
        <div class="inner-card-back">
          <div class="card-content">
            <p class="definition">- {card.definition}</p>
            <p class="usage">Example: {card.usage}</p>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<div class="navigation">
  <button
    id="prev"
    class="nav-button"
    on:click={prevSlide}
    on:keypress={keyPress}
  >
    <i class="fas fa-arrow-left" />
  </button>
  <p id="current">{currentActiveCard + 1}/{cards.length}</p>
  <button id="next" class="nav-button" on:click={nextSlide}>
    <i class="fas fa-arrow-right" />
  </button>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap');
  .cards {
    perspective: 1000px;
    position: relative;
    height: 300px;
    width: 40%;
    max-width: 100%;
    margin: 50px auto 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 900px) {
    .cards {
      width: 60%;
    }
    /* .navigation {
      order: 1;
    } */
  }
  .card {
    position: absolute;
    opacity: 0;
    font-size: 1.5em;

    height: 100%;
    width: 100%;
    transform: translateX(50%) rotateY(-10deg);
    transition: transform 0.4s ease, opacity 0.4s ease;
    /* display: none; */
  }
  .card.active {
    opacity: 1;
    z-index: 10;
    transform: translateX(0) rotateY(0deg);
    /* display: block; */
  }
  .card.left {
    transform: translateX(-50%) rotateY(10deg);
  }

  .inner-card {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    height: 100%;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
  }

  .card.show-answer .inner-card {
    transform: rotateX(180deg);
  }

  .inner-card-front,
  .inner-card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--second-color);
  }

  .inner-card-back {
    font-size: 0.9em;
    text-align: left;
    transform: rotateX(180deg);
  }
  /* .inner-card-back p {
    margin: 10px 20px;
    width: 100%;
  } */
  .inner-card-back p:first-child {
    text-align: center;
  }
  .inner-card-back p:last-child {
    font-style: italic;
    font-size: 0.9em;
  }

  .inner-card-front {
    transform: rotateX(0deg);
    z-index: 2;
    font-size: 3em;
    font-family: 'Playfair Display', serif;
  }
  .card-content {
    width: 100%;
    padding: 10px 20px;
    /* overflow: scroll; */
    word-wrap: break-word;
  }

  .usage {
    font-size: 0.6em;
  }

  .navigation {
    display: flex;
    margin: 20px auto;
    align-items: center;
    justify-content: center;
    color: var(--heading-color);
  }
  .navigation .nav-button {
    border: none;
    background-color: transparent;
    color: var(--heading-color);
    cursor: pointer;
    font-size: 16px;
  }

  .navigation p {
    margin: 0 25px;
  }

  @media (max-width: 650px) {
    .inner-card-back p:last-child {
      font-size: 0.5em;
    }
    .inner-card-front {
      font-size: 1.5em;
    }
    .cards {
      height: 200px;
      /* margin-bottom: 100px; */
    }
  }
  @media (max-width: 400px) {
    .cards {
      width: 80%;
    }
  }
</style>
