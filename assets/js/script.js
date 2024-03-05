const apiUrl = "https://mp3quran.net/api/v3";
const language = "ar";
async function getReciters() {
    const chooseReciter = document.querySelector("#chooseReciter");

    const res = await fetch(`${apiUrl}/reciters?language=${language}`)
    const data = await res.json()

    console.log(data);
    // chooseReciter.innerHTML = `<option value="">choose...</option>`
    data.reciters.forEach(element => {
        chooseReciter.innerHTML += `<option value="${element.id}">${element.name}</option>`

    });
    chooseReciter.addEventListener("change", (e) => {
        getMoshaf(e.target.value);
    })
}
getReciters();

async function getMoshaf(reciter) {

    const chooseriwaya = document.querySelector("#chooseriwaya");

    const res = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`)
    const data = await res.json();
    // console.log(data)
    const moshafs = data.reciters[0].moshaf


    chooseriwaya.innerHTML = `<option value="" data-server="" data-surahList="">choos...</option>`

    moshafs.forEach(moshaf => {
        chooseriwaya.innerHTML += `<option value="${moshaf.id}" data-server=${moshaf.server} data-surahList="${moshaf.surah_list}">${moshaf.name}</option>`
    });

    chooseriwaya.addEventListener("change", () => {
        const selectriwaya = chooseriwaya.options[chooseriwaya.selectedIndex]

        const surahServer = selectriwaya.dataset.server;
        const surahList = selectriwaya.dataset.surahlist;

        getSurah(surahServer, surahList);
    })
}
getMoshaf();
//https://mp3quran.net/api/v3/suwar
async function getSurah(surahServer, surahList) {

    const choosesurah = document.querySelector("#choosesurah");

    const res = await fetch("https://mp3quran.net/api/v3/suwar")
    const data = await res.json();
    const surahNames = data.suwar;
    surahList = surahList.split(",");
    choosesurah.innerHTML = `<option value ="">choose...</option>`
    surahList.forEach(surah => {
        const padSurah = surah.padStart(3, '0'); // 001 
        surahNames.forEach(surahName => {
            if (surahName.id == surah) {
                choosesurah.innerHTML += `<option value ="${surahServer}${padSurah}.mp3">${surahName.name}</option>`
            }
        })
    })

    choosesurah.addEventListener("change", e => {
        audioPlayer(e.target.value);
    })
}


function audioPlayer(surahMp3) {
    const audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.src = surahMp3;
    audioPlayer.play();
}

function playLive(channel) {
    if (Hls.isSupported()) {
        var video = document.querySelector('#video');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    }
}