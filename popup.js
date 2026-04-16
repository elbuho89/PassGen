const slider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const btn = document.getElementById('generate');
const display = document.getElementById('pass-display');

const checkboxes = {
    upper: document.getElementById('inc-upper'),
    lower: document.getElementById('inc-lower'),
    numbers: document.getElementById('inc-numbers'),
    symbols: document.getElementById('inc-symbols'),
    cyrillic: document.getElementById('inc-cyrillic'),
    chinese: document.getElementById('inc-chinese'),
    japanese: document.getElementById('inc-japanese')
};

slider.addEventListener('input', () => { lengthVal.innerText = slider.value; });

btn.addEventListener('click', () => {
    const length = parseInt(slider.value);
    const charSets = {
        upper: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnñopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '@#$%^&*()_+~`|}{[]:;><,./-=¬\^"°¿?¡!',
        cyrillic: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя',
        chinese: '的一是在不了有和人这中大来上国我到说们为子和地道出也得里后自以会',
        japanese: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    };

    let allChars = "";
    let password = "";

    // Asegurar un carácter de cada tipo seleccionado
    Object.keys(checkboxes).forEach(key => {
        if (checkboxes[key].checked) {
            const set = charSets[key];
            allChars += set;
            const b = new Uint32Array(1);
            window.crypto.getRandomValues(b);
            password += set[b[0] % set.length];
        }
    });

    if (!allChars) { display.innerText = "Error: Select option"; return; }

    const remaining = length - password.length;
    if (remaining > 0) {
        const bytes = new Uint32Array(remaining);
        window.crypto.getRandomValues(bytes);
        for (let i = 0; i < bytes.length; i++) {
            password += allChars[bytes[i] % allChars.length];
        }
    }

    // Mezcla segura compatible con Unicode
    let passArray = Array.from(password);
    for (let i = passArray.length - 1; i > 0; i--) {
        const j = window.crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
        [passArray[i], passArray[j]] = [passArray[j], passArray[i]];
    }

    const final = passArray.join('');
    display.innerText = final;
    navigator.clipboard.writeText(final);
    btn.innerText = "¡Copiada! / Copied!";
    setTimeout(() => { btn.innerText = "Generar / Generate"; }, 1000);
});