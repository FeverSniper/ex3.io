// 获取主题背景
var body = document.getElementById('body');

//列表按钮
var listButton = document.getElementsByClassName('list')[0];
//音乐列表
var musicList = document.getElementsByClassName("music-list")[0];
//关闭列表
var closeList = document.getElementsByClassName("close-list")[0];
//音乐播放器
var audio = document.getElementById("audio");
//播放按钮
var pause = document.getElementsByClassName("icon-play")[0];
//唱片获取
var recordImg = document.getElementsByClassName("rotate-play")[0];
//总进度条
var progressTotal = document.getElementsByClassName("pgs-total")[0];
//播放的进度
var progressPlay = document.getElementsByClassName("pgs-play")[0];
//已播放时长
var playedTime = document.getElementsByClassName("played-time")[0];
//总时长
var totalTime = document.getElementsByClassName("audio-time")[0];

//音量控制
var volumeButton = document.getElementsByClassName("volumn")[0];
var volumeTogger = document.getElementById("volumn-togger");
// 播放模式按钮
var mode = document.getElementsByClassName('mode');
//上一首
var skipForward = document.getElementsByClassName("s-left")[0];
//下一首
var skipBackward = document.getElementsByClassName("s-right")[0];
//倍速
var speed = document.getElementsByClassName("speed")[0];
// 播放模式按钮
var mode = document.getElementsByClassName('mode')[0];
//歌曲名
var musicTitle = document.getElementsByClassName("music-title")[0];
// 歌手名
var author = document.getElementById("author-name");
//MV元素
var MV = document.getElementById('MV');


//存储当前的播放模式
// 0：列表循环 1：单曲循环 2：随机播放
var modeId = 0;

//展开列表功能
listButton.addEventListener("click", function () {
    musicList.classList.remove('list-card-hide');
    // 让列表显示出来的动画
    musicList.classList.add('list-card-show');
    // 让列表展示出来
    musicList.style.display = "block";
    closeList.style.display = "block";
});

closeList.addEventListener("click", function () {
    // 让列表隐藏起来的动画
    musicList.classList.remove('list-card-show');
    musicList.classList.add('list-card-hide');
    closeList.style.display = "none";
});

//存储当前播放的音乐序号
var musicId = 0;

//后台音乐列表
let musicData = [['Love Song', 'Kaash Paige'], ['Jesmine', '蔡徐坤'], ['Alone with you', 'Alina Baraz'], ['装睡的情人', '25216950221 25计科2班陈竞斌']]
var muscics = [['Love Song', 'Kaash Paige'], ['Jesmine', '蔡徐坤'], ['Alone with you', 'Alina Baraz'], ['装睡的情人', '25216950221 25计科2班陈竞斌']]

// 初始化音乐功能
function initMusic() {
    audio.src = `mp3/music${musicId}.mp3`;
    audio.load();
    //当歌曲信息被加载完成时,或者用onloadedmetadata事件也可以
    audio.ondurationchange = function () {
        musicTitle.innerText = muscics[musicId][0];
        author.innerText = muscics[musicId][1];
        recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('img/bg${musicId}.png')`;
        totalTime.innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
        bindMusicListClickEvents(); // 确保在音乐加载完成后绑定点击事件
    };
}

// 绑定音乐列表点击事件
function bindMusicListClickEvents() {
    document.querySelectorAll('.all-list div').forEach((element, index) => {
        element.addEventListener('click', function (event) {
            musicId = index;
            initAndPlay();
            pause.classList.remove("icon-play");
            pause.classList.add("icon-pause");
        });
    });
}



initMusic();
// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}

//暂停/播放功能
pause.addEventListener("click", function (e) {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove("icon-play");
        pause.classList.add("icon-pause");
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove("icon-pause");
        pause.classList.add("icon-play");
    }
});

//唱片旋转控制
function rotateRecord() {
    recordImg.style.animationPlayState = "running";
}
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused";
}

// 更新进度条
function updateProgress() {
    // audio.currentTime是已播放时长，duration是总时长
    var value = (audio.currentTime / audio.duration) * 100;
    progressPlay.style.width = value + "%";
    playedTime.innerText = transTime(audio.currentTime);
}


// 监听播放时间
audio.ontimeupdate = function () {
    updateProgress();
}

//点击进度条
progressTotal.addEventListener('mousedown', function (event) {
    if (!audio.paused || audio.currentTime != 0) {
        var pgsWidth = progressTotal.getBoundingClientRect().width;
        var rate = (event.offsetX / pgsWidth);
        audio.currentTime = rate * audio.duration;
        updateProgress();
    }
});

//音频播放时间换算
function transTime(value) {
    var time = '';
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ':' + m + ':' + s);
    } else {
        time = formatTime(m + ':' + s);
    }

    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = '';
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? '0' + s[i] : s[i];
        time += ':';
    }
    time += s[i].length == 1 ? '0' + s[i] : s[i];

    return time;
}

//控制音量
var lastVolume = 70;
//audio.volume规定的值是0-1
audio.volume = lastVolume / 100;

audio.addEventListener('timeupdate', updateVolume);

//滑动音量
function updateVolume() {
    audio.volume = (volumeTogger.value) / 100;
}

//点击静音
volumeButton.addEventListener('click', function () {
    audio.muted = !audio.muted;
    if (audio.muted) {
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
        volumeButton.style.backgroundImage = "url('img/静音.png')";
    } else {
        volumeTogger.value = lastVolume;
        volumeButton.style.backgroundImage = "url('img/音量.png')";
    }
});

// 音频播放结束时
audio.onended = function () {
    switch (modeId) {
        case 0: // 列表循环
            musicId = (musicId + 1) % musicData.length;
            break;
        case 1: // 单曲循环
            audio.currentTime = 0; // 从头开始播放当前歌曲
            audio.play();
            rotateRecord();
            return; // 阻止进一步的初始化和播放
        case 2: // 随机播放
            var oldId = musicId;
            while (true) {
                musicId = Math.floor(Math.random() * musicData.length);
                if (musicId != oldId) {
                    break;
                }
            }
            break;
        default:
            console.error('未知的播放模式:', modeId);
            break;
    }
    initAndPlay();
};


//上一首
skipForward.addEventListener('click', function () {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = muscics.length - 1;
    }
    initAndPlay();
    pause.classList.remove("icon-play");
    pause.classList.add("icon-pause");
});

//下一首
skipBackward.addEventListener('click', function () {
    musicId = musicId + 1;
    if (musicId == muscics.length) {
        musicId = 0;
    }
    initAndPlay();
    pause.classList.remove("icon-play");
    pause.classList.add("icon-pause");
});


// 倍速功能 (这里直接暴力解决)
speed.addEventListener('click', function () {
    var speedText = speed.innerText;
    if (speedText == '1.0x') {
        speed.innerText = '1.5x';
        audio.playbackRate = 1.5;
    } else if (speedText == '1.5x') {
        speed.innerText = '2.0x';
        audio.playbackRate = 2.0;
    } else if (speedText == '2.0x') {
        speed.innerText = '0.5x';
        audio.playbackRate = 0.5;
    } else {
        speed.innerText = '1.0x';
        audio.playbackRate = 1.0;
    }
});

// MV功能
if (MV) {
    MV.addEventListener('click', function (event) {
        try {
            // 向sessionStorage中存储当前的音乐ID
            window.sessionStorage.setItem('musicId', musicId);
            // 打开新的MV播放页面
            window.open('mv-player.html', '_blank');
        } catch (error) {
            console.error('无法将musicId存储到sessionStorage中或打开MV播放页面：', error);
        }
    });
} else {
    console.error('MV元素未找到。请检查HTML中是否存在该元素。');
}

// 切换播放模式
if (mode) {
    mode.addEventListener('click', function (event) {
        try {
            modeId = (modeId + 1) % 3; // 循环切换播放模式 0 -> 1 -> 2 -> 0
            switch (modeId) {
                case 0:
                    mode.style.backgroundImage = "url('img/mode1.png')"; // 列表循环图标
                    break;
                case 1:
                    mode.style.backgroundImage = "url('img/mode2.png')"; // 单曲循环图标
                    break;
                case 2:
                    mode.style.backgroundImage = "url('img/mode3.png')"; // 随机播放图标
                    break;
                default:
                    console.error('未知的播放模式:', modeId);
                    break;
            }
        } catch (error) {
            console.error('无法切换播放模式：', error);
        }
    });
} else {
    console.error('播放模式元素未找到。请检查HTML中是否存在该元素。');
}

// 暴力捆绑列表音乐
document.getElementById('music0').addEventListener('click', function (event) {
    musicId = 0;
    initAndPlay();
});

document.getElementById('music1').addEventListener('click', function (event) {
    musicId = 1;
    initAndPlay();
});

document.getElementById('music2').addEventListener('click', function (event) {
    musicId = 2;
    initAndPlay();
});

document.getElementById('music3').addEventListener('click', function (event) {
    musicId = 3;
    initAndPlay();
});