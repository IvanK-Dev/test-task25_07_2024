/**
 * Fetches a random word from the Random Word API.
 * 
 * @returns {Promise<string | null>} A promise that resolves to a random word or null if an error occurs.
 */
const getRandomWord = async () => {
  try {
    const response = await fetch(
      'https://random-word-api.vercel.app/api?number=1'
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Failed to fetch a word:', error);
    return null;
  }
};

/**
 * Retrieves all <img> elements in the document.
 * 
 * @returns {HTMLCollectionOf<HTMLImageElement>} A collection of <img> elements.
 */
const getAllImageElements = () => {
  return document.getElementsByTagName('img');
};

/**
 * Updates the 'alt' attribute of an image element with a random word.
 * 
 * @param {HTMLImageElement} image - The image element whose 'alt' attribute will be updated.
 * @returns {Promise<void>} A promise that resolves when the 'alt' attribute is updated.
 */
const updateImgAltAttribute = async image => {
  const randomWord = await getRandomWord();
  if (randomWord) {
    image.alt = randomWord;
    image.parentElement.classList.add('updated');
  }
};

/**
 * Updates the 'alt' attributes of all given image elements or all images in the document if no images are provided.
 * 
 * @param {HTMLCollectionOf<HTMLImageElement> | null} [images=null] - Optional collection of image elements to update. If null, all images in the document will be updated.
 * @returns {Promise<void>} A promise that resolves when all 'alt' attributes have been updated.
 */
const updateAllImgAltAttributes = async (images = null) => {
  if (images === null) images = getAllImageElements();

  await Promise.all(Array.from(images).map(updateImgAltAttribute));
};

/**
 * Wraps an image element in a <div> with the class 'image_container'.
 * 
 * @param {HTMLImageElement} img - The image element to wrap.
 * @returns {HTMLImageElement} The cloned image element inside the new <div>.
 */
const wrapImgInDiv = img => {
  const div = document.createElement('div');
  div.classList.add('image_container');

  const imgClone = img.cloneNode(true);
  div.appendChild(imgClone);

  img.replaceWith(div);

  return imgClone;
};

const target = document.body;
const observerConfig = { childList: true, subtree: true };

/**
 * Callback function for the MutationObserver that handles DOM mutations.
 * 
 * @param {MutationRecord[]} mutationsList - List of mutations that occurred.
 * @returns {Promise<void>} A promise that resolves when all updates are complete.
 */
const observerCallback = async mutationsList => {
  observer.disconnect();
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node = wrapImgInDiv(node);
          updateImgAltAttribute(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const images = node.querySelectorAll('img');
          if (images.length !== 0) {
            updateAllImgAltAttributes(images);
          }
        }
      });
    }
  });
  observer.observe(target, observerConfig);
};

const observer = new MutationObserver(observerCallback);

/**
 * Starts the MutationObserver and updates 'alt' attributes of existing images.
 */
const startObserver = () => {
  const startActions = () => {
    updateAllImgAltAttributes();
    observer.observe(target, observerConfig);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startActions();
    });
  } else {
    startActions();
  }
};

/**
 * Creates an input field and a save button to allow editing the 'alt' attribute of an image.
 * 
 * @param {HTMLImageElement} image - The image element to edit.
 * @returns {HTMLDivElement} A container div with an input field and a save button.
 */
const createInputTextElement = image => {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = `Alt = ${image.alt ? image.alt : ' '}`;

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Save';

  saveButton.onclick = () => {
    image.alt = inputField.value;
    inputContainer.remove();
  };

  inputContainer.append(inputField, saveButton);

  return inputContainer;
};

/**
 * Adds a click event listener to images to allow editing their 'alt' attribute.
 */
const addImagClickListener = () => {
  target.addEventListener('click', evt => {
    if (evt.target.tagName !== 'IMG') return;
    const image = evt.target;
    const inputContainer = image.parentNode.querySelector('.input-container');
    if (inputContainer) {
      inputContainer.remove();
    } else {
      image.parentNode.append(createInputTextElement(image));
    }
  });
};

export { startObserver, addImagClickListener };
