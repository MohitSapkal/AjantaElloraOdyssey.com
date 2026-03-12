const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/mohit/OneDrive/Desktop/AjantaElloraOdyssey.com/public';
const files = fs.readdirSync(dir).filter(f => f.startsWith('tour-') && f.endsWith('.html'));

const regex = /<a href="https:\/\/wa\.me\/[0-9]+"[^>]*>\s*<i class="fab fa-whatsapp"><\/i>\s*Whatsapp call\s*<\/a>/g;
const newBtn = `<a href="javascript:void(0)" onclick="event.preventDefault(); var e='kanishkaholidays@gmail.com', u=navigator.userAgent.toLowerCase(); if(/android/i.test(u)){ window.location.href='intent://compose?to='+e+'#Intent;scheme=mailto;package=com.google.android.gm;end'; } else if(/iphone|ipad|ipod/i.test(u)){ window.location.href='googlegmail:///co?to='+e; setTimeout(function(){window.location.href='mailto:'+e;},500); } else { window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+e, '_blank'); }" class="btn btn-outline" style="width: 100%; padding: 1rem; border-color: var(--primary); color: var(--primary); border-width: 2px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.1rem; background-color: transparent; text-decoration: none;">
                                <i class="fas fa-envelope"></i> Send Email
                            </a>`;

let replaced = 0;
files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (regex.test(content)) {
        content = content.replace(regex, newBtn);
        fs.writeFileSync(filePath, content);
        console.log('Replaced in ' + f);
        replaced++;
    }
});

console.log('Total replaced: ' + replaced);
