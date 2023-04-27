import './style.css';

const counters = document.querySelectorAll<HTMLDivElement>('[data-counter]');

console.clear();

/******************************
 * Compteurs gérés tout seul
 *****************************/
// On setup les counters à partir du dataset counter
counters.forEach((el) => setupCounter(el));

/*******************************************
 * Compteur avec callback et initialValue
 *******************************************/
const customCounter = document.getElementById('counter') as HTMLDivElement;
// On ajoute un callback qui va loguer la valeur du compteur et on initialie celui à 10
setupCounter(customCounter, console.log, { initialValue: 10 });

/*******************************************
 * Compteur lié au localStorage
 *******************************************/
const storageCounter = document.getElementById(
  'storage-counter'
) as HTMLDivElement;
// On ajoute un callback qui va loguer la valeur du compteur et on initialie celui à 10
setupCounter(
  storageCounter,
  (n) => localStorage.setItem('Counter', n.toString()),
  {
    initialValue: JSON.parse(localStorage.getItem('Counter') ?? '0'),
  }
);

function setupCounter(
  el: HTMLDivElement,
  callback?: (counter: number) => unknown,
  options?: Options
) {
  // Récupère les méthodes qui gèrent le compteur
  const [, { increment, decrement, updateCounter }] = createCounter(
    el.querySelector('[data-input]'),
    callback,
    options
  );

  // Création des events qui manipuleront le compteur
  el.querySelector('[data-input]').addEventListener('change', updateCounter);
  el.querySelector('[data-minus]').addEventListener('click', decrement);
  el.querySelector('[data-plus]').addEventListener('click', increment);
}

type Options = {
  initialValue: number;
};

function createCounter(
  el: HTMLInputElement,
  callback?: (counter: number) => unknown,
  options?: Options
) {
  let counter = options?.initialValue ?? 0;

  function updateValue() {
    el.value = counter.toString();
  }

  function updateCounter() {
    counter = el.valueAsNumber;
    callback && callback(counter);
  }

  function increment() {
    counter += 1;
    updateValue();
    callback && callback(counter);
  }

  function decrement() {
    counter -= 1;
    updateValue();
    callback && callback(counter);
  }

  // Appelé à la création pour mettre la valeur par défaut dans l'input
  updateValue();

  return [
    counter,
    {
      increment,
      decrement,
      updateCounter,
    },
  ] as const;
}
