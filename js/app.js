function addToCart(itemName) {
    console.log(`Próba przemytu: ${itemName}`);
    alert(`📢 TOWAR PRZEJĘTY!\n\nProdukt "${itemName}" zamówiony.\n\nNasz gołąb wywęszył już twoją lokalizację i leci z twoim kartonem.`);
}

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (nav) {
        if (window.scrollY > 10) {
            nav.style.borderBottom = "5px solid #FFD700";
        } else {
            nav.style.borderBottom = "5px solid #C19A6B";
        }
    }
});

function safeBtoa(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function generateDeadDrop() {
    const nameInput = document.getElementById('agent-name');
    const msgInput = document.getElementById('agent-msg');
    const btn = document.getElementById('submit-btn');

    if (!nameInput || !msgInput || !btn) return;

    const nameRaw = nameInput.value.trim();
    const msgRaw = msgInput.value.trim();

    if (!nameRaw || !msgRaw) {
        alert('BŁĄD: Puste dane. Nie będziemy marnować czasu i energii naszego gołębia na pustą wiadomość.');
        return;
    }

    let encryptedName, encryptedMsg;
    try {
        encryptedName = safeBtoa(nameRaw);
        encryptedMsg = safeBtoa(msgRaw);
    } catch (e) {
        alert("Błąd kodowania znaków.");
        return;
    }

    let iterations = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,./<>?";

    btn.innerText = "SZYFROWANIE...";
    btn.style.backgroundColor = "#D32F2F";
    btn.style.color = "#FFFFFF";
    btn.disabled = true;

    const interval = setInterval(() => {
        nameInput.value = encryptedName
            .split("")
            .map((letter, index) => {
                if (index < iterations) return letter;
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        msgInput.value = encryptedMsg
            .split("")
            .map((letter, index) => {
                if (index < iterations) return letter;
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= Math.max(encryptedName.length, encryptedMsg.length)) {
            clearInterval(interval);

            nameInput.value = encryptedName;
            msgInput.value = encryptedMsg;

            finalizeDrop(encryptedName, encryptedMsg);

            btn.innerText = "SZYFR GOTOWY";
            btn.style.backgroundColor = "#FFD700";
            btn.style.color = "#2C2C2C";
            btn.style.borderColor = "#2C2C2C";
            btn.disabled = false;

            setTimeout(() => {
                btn.innerText = "SZYFRUJ I POBIERZ";
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
            }, 3000);
        }

        iterations += 1 / 2;
    }, 30);
}

function finalizeDrop(encName, encMsg) {
    const date = new Date().toISOString();

    const content = `
--- ŚCIŚLE TAJNE // TOP SECRET ---
DATA ZASZYFROWANIA: ${date}
KLIENT (SZYFR): ${encName}
KOD OPERACJI: SZARY-KARTON-121
----------------------------------
TREŚĆ WIADOMOŚCI (SZYFR):
${encMsg}
----------------------------------
INSTRUKCJA WYSYŁKI:
1. Przenieś ten plik na pendrive.
2. Poczekaj na naszego gołębia pocztowego. Jak dowie się o tym że coś chcesz nam przekazać? Wywącha.
3. Poczekaj aż zagryzie dziobem na pendrive. Nie stawiaj oporu.
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `GRYPS_${Date.now()}_TAJNE.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Gryps przejęty.");
}