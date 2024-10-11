// Charger les options
function loadOptions() {
  chrome.storage.local.get(['theme', 'model', 'prefix', 'apiKey', 'notifications', 'modeStri'], function(items) {
    document.getElementById('theme').value = items.theme || 'light';
    document.getElementById('model').value = items.model || 'gpt-4o';
    document.getElementById('prefix').value = items.prefix || 'Exemple : Vous êtes un expert en informatique, spécialisé dans les systèmes et réseaux, avec une expertise approfondie en ITIL et une solide maîtrise des environnements IT.  Répondez-moi avec seulement la ou les réponses à la question : ';
    document.getElementById('apiKey').value = items.apiKey || '';
    document.getElementById('notifications').checked = items.notifications || false;
    document.getElementById('mode-stri').checked = items.modeStri || false;

    // Ajoute les nouveaux modèles dans le menu déroulant
    document.getElementById('model').innerHTML = `
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4-turbo">GPT-4 Turbo</option>
      <option value="gpt-4">GPT-4</option>
    `;

    // Appliquer le thème initial
    applyTheme(items.theme || 'light');
  });
}

// Sauvegarder les options
function saveOptions() {
  const theme = document.getElementById('theme').value;
  const model = document.getElementById('model').value;
  const prefix = document.getElementById('prefix').value;
  const apiKey = document.getElementById('apiKey').value;
  const notifications = document.getElementById('notifications').checked;
  const modeStri = document.getElementById('mode-stri').checked;

  // Vérifie que les champs de stockage existent et ont des valeurs avant de sauvegarder
  chrome.storage.local.set({
    theme: theme,
    model: model,
    prefix: prefix,
    apiKey: apiKey,
    notifications: notifications,
    modeStri: modeStri
  }, function() {
    console.log("Valeurs sauvegardées : ", { theme, model, prefix, apiKey, notifications, modeStri });
    const status = document.getElementById('status');
    status.textContent = 'Options sauvegardées.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });

  applyTheme(theme);
}

// Applique le thème sélectionné
function applyTheme(theme) {
  const bodyElement = document.getElementById('mainBody');
  if (theme === 'dark') {
    bodyElement.classList.add('dark-theme');
  } else {
    bodyElement.classList.remove('dark-theme');
  }
}

// Ajouter des écouteurs d'événements
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);

// Toggle Notifications Keyboard Shortcut (Ajout d'un raccourci clavier pour les notifications)
chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle_notifications") {
    chrome.storage.local.get('notifications', function(data) {
      const newState = !data.notifications;
      chrome.storage.local.set({ notifications: newState }, function() {
        const message = newState ? 'Notifications activées.' : 'Notifications désactivées.';
        console.log(message);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Changement d\'état des notifications',
          message: message
        });
      });
    });
  }
});
