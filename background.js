function copyTextToClipboard(tabId, text) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (text) => {
      navigator.clipboard.writeText(text).then(() => {
        // console.log('Texte copié avec succès dans le presse-papier');
      }).catch(error => {
        console.error('Erreur lors de la copie dans le presse-papier:', error);
        alert('Erreur lors de la copie dans le presse-papier.');
      });
    },
    args: [text]
  });
}

// Initialisation du menu contextuel
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "chatGPT",
    title: "Répondre",
    contexts: ["selection"]
  });
});

// Gestion de la commande (raccourci clavier)
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "send_to_chatgpt") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    }, (selection) => {
      const selectedText = selection[0].result.trim();
      if (selectedText) {
        handleSelectedText(selectedText, tab);
      } else {
        detectStriQuiz(tab);  // Détecter automatiquement le quiz sur STRI si rien n'est sélectionné
      }
    });
  } else if (command === "toggle_notifications") {
    toggleNotifications();
  }
});

// Activer/désactiver les notifications
function toggleNotifications() {
  chrome.storage.local.get(['notifications'], function (items) {
    const currentState = items.notifications || false;
    chrome.storage.local.set({ notifications: !currentState }, function () {
      console.log('Notifications ' + (!currentState ? 'activées' : 'désactivées') + '.');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Notifications',
        message: 'Notifications ' + (!currentState ? 'activées' : 'désactivées') + '.'
      });
    });
  });
}

// Écouteur pour le menu contextuel
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  handleSelectedText(info.selectionText, tab);
});

// Fonction pour traiter le texte sélectionné (exécutée par le menu ou le raccourci)
function handleSelectedText(selectedText, tab) {
  chrome.storage.local.get(['model', 'prefix', 'apiKey', 'notifications', 'modeStri'], function (items) {
    const model = items.model || 'gpt-4-turbo';
    const prefix = items.prefix || 'Votre préfixe par défaut';
    const apiKey = items.apiKey || '';
    const notificationsEnabled = items.notifications || false;
    const modeStriEnabled = items.modeStri || false;

    if (!apiKey.trim()) {
      console.log("Clé API manquante !");
      if (notificationsEnabled) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Erreur',
          message: 'Clé API manquante. Veuillez ajouter une clé API dans les options.'
        });
      }
      return;
    }

    const modifiedSelectedText = prefix + " " + selectedText;
    // console.log(`Texte envoyé à l'API OpenAI : "${modifiedSelectedText}"`);

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: modifiedSelectedText }]
      })
    })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Clé API invalide ou requête non autorisée.');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const assistantMessage = data.choices[0].message.content;
        // console.log(`Réponse de l'assistant : "${assistantMessage}"`);

        if (notificationsEnabled) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Réponse de l\'assistant',
            message: assistantMessage
          });
        }

        copyTextToClipboard(tab.id, assistantMessage);

        // Si le mode STRI est activé, cocher la réponse automatiquement
        if (modeStriEnabled) {
          const firstLetterMatch = assistantMessage.trim().match(/^([A-E])\./);
          if (firstLetterMatch) {
            const answerLetter = firstLetterMatch[1];
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (letter) => {
                const options = document.querySelectorAll('input[type="radio"]');
                options.forEach(option => {
                  const label = document.getElementById(option.getAttribute('aria-labelledby'));
                  if (label && label.innerText.trim().startsWith(letter)) {
                    option.checked = true;
                  }
                });
              },
              args: [answerLetter]
            });
          }
        }
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'appel à l\'API:', error.message);
      if (notificationsEnabled) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Erreur API',
          message: error.message || 'Erreur lors de l\'appel à l\'API.'
        });
      }
    });
  });
}

// Détecte automatiquement les quiz sur STRI si rien n'est sélectionné
function detectStriQuiz(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const questionContent = document.querySelector('.que .qtext');
      const answerContent = document.querySelectorAll('.que .answer .d-flex');

      if (questionContent && answerContent.length > 0) {
        let fullText = "Question : " + questionContent.innerText.trim() + "\n\nVeuillez choisir une réponse.\n\n";
        answerContent.forEach(answer => {
          const answerText = answer.innerText.trim().replace(/\n/g, '').replace(/\s+/g, ' ');
          fullText += answerText + "\n";
        });
        return fullText;
      }
      return null;
    }
  }, (results) => {
    if (results && results[0].result) {
      handleSelectedText(results[0].result, tab);
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'STRI Quiz',
        message: 'Aucun quiz STRI détecté sur cette page.'
      });
    }
  });
}
