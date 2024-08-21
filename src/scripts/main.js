document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const characterOptions = document.getElementById('characterOptions');
    const characterDetails = document.getElementById('characterDetails');
    const successMessage = document.getElementById('successMessage');
    const selectElement = document.getElementById('searchInput');
    let dailyPickCharacter = null;
    searchInput.addEventListener('focus', function() {
        const options = characterOptions.getElementsByTagName('div');
        for (let i = 0; i < options.length; i++) {
            options[i].style.display = ''; // Afficher tous les éléments
        }
        characterOptions.classList.add('show'); // Afficher la liste des options
    });
    // Charger le personnage du jour depuis DailyPick.json
    fetch('src/data/DailyPick.json')
        .then(response => response.json())
        .then(data => {
            dailyPickCharacter = data.title;
        })
        .catch(error => {
            console.error('Erreur lors du chargement du personnage du jour :', error);
        });

    // Charger les personnages depuis Characters.json
    fetch('src/data/Characters.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const name = item.title.name;
                const element = item.title.element;
                const id = item.title.id;
                const series = item.title.series;
                const release_date = item.title['release date']     
                const fullName = series ? `${name} ${element} (${series})` : `${name} ${element}`;

                const option = document.createElement('div');
                option.dataset.details = JSON.stringify(item.title);
                option.innerHTML = `${fullName}`;
                characterOptions.appendChild(option);

                option.addEventListener('click', function() {
                    searchInput.value = fullName;
                    characterOptions.classList.remove('show');
                    displayCharacterDetails(JSON.parse(option.dataset.details));
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des personnages :', error);
        });

    // Afficher/masquer les options en fonction de la recherche
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const options = characterOptions.getElementsByTagName('div');

        for (let i = 0; i < options.length; i++) {
            const text = options[i].textContent.toLowerCase();
            if (text.includes(filter)) {
                options[i].style.display = ''; // Afficher l'option
            } else {
                options[i].style.display = 'none'; // Masquer l'option
            }
        }
        characterOptions.classList.add('show');
    });

    // Fermer le dropdown lorsque l'utilisateur clique en dehors
    document.addEventListener('click', function(event) {
        if (!event.target.matches('#searchInput')) {
            characterOptions.classList.remove('show');
        }
        searchInput.value = ''; // Vider le champ de recherche
    });

    function comparerCaracteristiques(details, dailyPickCharacter) {
        const resultat = {};
      
        // Comparer les armes
        const dailyPickWeapons = dailyPickCharacter.weapon.split(',').map(w => w.trim());
        const selectedWeapons = details.weapon.split(',').map(w => w.trim());
        const allWeaponsMatch = selectedWeapons.every(w => dailyPickWeapons.includes(w));
        const anyWeaponMatch = selectedWeapons.some(w => dailyPickWeapons.includes(w));
        if (allWeaponsMatch) {
            resultat.weapon = '#069C56'; // Tout est bon
        } else if (anyWeaponMatch) {
            resultat.weapon = '#FF980E'; // Pas totalement correct
        } else {
            resultat.weapon = '#D3212C'; // Incorrect
        }
    
        // Comparer les autres éléments
        ['element', 'rarity', 'name', 'series', 'race'].forEach(key => {
            if (details[key] === dailyPickCharacter[key]) {
                resultat[key] = '#069C56'; // Tout est bon
            } else {
                resultat[key] = '#D3212C'; // Incorrect
            }
        });
        
        if (details['gender'] === dailyPickCharacter['gender']) {
            resultat['gender'] = '#069C56'; // Tout est bon
        } 
        else if(details['gender'].search(dailyPickCharacter['gender']) != -1) {
            resultat['gender'] = '#FF980E'; // Pas totalement correct
        }
        else{
            resultat['gender'] = '#D3212C'; // Incorrect
        }
      
        // Comparer les dates de sortie

        if (new Date(details['release date']) > new Date(dailyPickCharacter['release_date'])) {
            resultat.release_date = '#D3212C';
            release_date_result = '⬇️';
        } else if (new Date(details['release date']) < new Date(dailyPickCharacter['release_date'])) {
            resultat.release_date = '#D3212C';
            release_date_result = '⬆️';
        }
        else {
            resultat.release_date = '#069C56'; // Correct
            release_date_result = '';
        }
    
        return resultat;
    }

    function displayCharacterDetails(details) {
        const resultat = comparerCaracteristiques(details, dailyPickCharacter);
      
        // Replace NULL by None
        if(details.series == null ){
            details.series = 'None';
        }
        // Uppercase Series
        // else {
        //     details.series = details.series.charAt(0).toUpperCase() + details.series.slice(1);
        // }
      
        // Split Weapons images
        const WeaponsSplit = details.weapon.split(',').map(w => w.trim());
        let WeaponImage = '';
        if(WeaponsSplit.length == 2){
            WeaponImage = `<img src="src/img/weapon/${WeaponsSplit[0]}.png" class="title-icon"><img src="src/img/weapon/${WeaponsSplit[1]}.png" class="title-icon"></img>`;
        }
        else {
            WeaponImage = `<img src="src/img/weapon/${WeaponsSplit[0]}.png" class="title-icon">`;
        }
        // Split Weapons images
        const RaceSplit = details.race.split(',').map(w => w.trim());
        let RaceImage = '';
        if(RaceSplit.length == 2){
            RaceImage = `<img src="src/img/race/${RaceSplit[0]}.png" class="title-icon"><img src="src/img/race/${RaceSplit[1]}.png" class="title-icon"></img>`;
        }
        else {
            RaceImage = `<img src="src/img/race/${RaceSplit[0]}.png" class="title-icon">`;
        }
        // Split Series images
        const SeriesSplit = details.series.split(';').map(w => w.trim());
        let SeriesImage = 'None';
        if(SeriesSplit.length == 2){
            SeriesImage = `<img src="src/img/series/${SeriesSplit[0]}.png" class="title-icon" title="${SeriesSplit[0]}" width="35" height="35"><img src="src/img/series/${SeriesSplit[1]}.png" class="title-icon" title="${SeriesSplit[1]}" width="35" height="35"></img>`;
        }
        else if(SeriesSplit.length == 1 && SeriesSplit[0] != "None") {
            SeriesImage = `<img src="src/img/series/${SeriesSplit[0]}.png" class="title-icon" title="${SeriesSplit[0]}" width="35" height="35">`;
        }

        // Rename gender
        let FullGender = details.gender.replace("m", 'Male ');
        FullGender = FullGender.replace("f", 'Female ');
        FullGender = FullGender.replace("o", 'Other ');

        // Create HTML section 
        const characterSection = document.createElement('div');
        characterSection.style.marginBottom = '20px';

        // Create and display character image
        const characterImage = document.createElement('img');
        const imagePath = `src/img/characters/${details.id}.png`;
        characterImage.src = imagePath;
        characterImage.alt = `Image de ${details.name}`;
        characterImage.style.width = '500px';
        characterSection.appendChild(characterImage);

        const characterInfo = document.createElement('p');
        characterInfo.innerHTML = `
            <div class="result">
                <h2><strong style="color: ${resultat.name};">Name :</strong> <span style="color: ${resultat.name};">${details.name}</span><br></h2>
                <h2><strong style="color: ${resultat.gender};">Gender :</strong> <span style="color: ${resultat.gender};">${FullGender}</span><br></h2>
                <h2><strong style="color: ${resultat.series};">Series :</strong> <span style="color: ${resultat.series};">${SeriesImage}</span><br></h2>
                <h2><strong style="color: ${resultat.element};">Element :</strong> <span style="color: ${resultat.element};"><img src="src/img/element/${details.element}.png" class="title-icon"></span><br></h2>
                <h2><strong style="color: ${resultat.race};">Race :</strong> <span style="color: ${resultat.race};">${RaceImage}</span><br></h2>
                <h2><strong style="color: ${resultat.weapon};">Weapon(s) :</strong> <span style="color: ${resultat.weapon};">${WeaponImage}</span><br></h2>
                <h2><strong style="color: ${resultat.release_date};">Release Date :</strong> <span style="color: ${resultat.release_date};">${details['release date']} ${release_date_result}</span><br></h2>
            </div class="result">
            `;
        characterSection.appendChild(characterInfo);

        // Ajouter le personnage sélectionné à la section d'affichage
        characterDetails.prepend(characterSection);

        // Vérifier si tous les critères sont corrects
        const allGreen = Object.values(resultat).every(color => color === '#069C56');

        if (allGreen) {
            successMessage.style.display = 'block'; // Afficher le message "Bravo !"
            selectElement.style.display = 'none'; // Masquer la liste déroulante
        }
    }
});
