// app.js
const select = document.getElementById('recipeSelect');
const recipename = document.getElementById('recipename');
const picture = document.getElementById('picture');
const ing = document.getElementById('ing');

let recipes = []; // will hold fetched data

// Load recipes.json (adjust path if necessary)
fetch('recipes.json')
  .then(res => {

    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    recipes = data;
    populateSelect(recipes);
  })
  .catch(err => {
    console.error('Failed to load recipes:', err);
    recipename.textContent = 'Failed to load recipes';
  });

function populateSelect(list) {
  // Use a document fragment for performance
  const frag = document.createDocumentFragment();
  for (const r of list) {
    const opt = document.createElement('option');
    opt.value = r.id;      // value used to lookup recipe
    opt.textContent = r.name;
    frag.appendChild(opt);
  }
  select.appendChild(frag);
}

// When user chooses a recipe, display details
select.addEventListener('change', () => {
  const id = select.value;                 // selected recipe id (string)
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  // Name
  recipename.textContent = recipe.name;

  // Image (replace contents)
  picture.innerHTML = '';
  if (recipe.image) {
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.name;
    img.style.maxWidth = '300px';
    picture.appendChild(img);
  }

  // Ingredients (render list)
  ing.innerHTML = '';
  if (Array.isArray(recipe.ingredients)) {
    const ul = document.createElement('ul');
    for (const it of recipe.ingredients) {
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    }
    ing.appendChild(ul);
  }
});